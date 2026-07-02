using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.Expense
{
    internal class TranExpenseClaimDB
    {
        DataAccessLayer1 dal = null;

        public TranExpenseClaimDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(BE.Expense.TranExpenseClaim beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@ExpenseClaimForId", beData.ExpenseClaimForId);
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);
            cmd.Parameters.AddWithValue("@ExpenseTitle", beData.ExpenseTitle);
            cmd.Parameters.AddWithValue("@ExpenseTypeId", beData.ExpenseTypeId);
            cmd.Parameters.AddWithValue("@DestinationFrom", beData.DestinationFrom);
            cmd.Parameters.AddWithValue("@DestinationTo", beData.DestinationTo);
            cmd.Parameters.AddWithValue("@DistanceTravelled", beData.DistanceTravelled);
            cmd.Parameters.AddWithValue("@PurposeOfVisit", beData.PurposeOfVisit);
            cmd.Parameters.AddWithValue("@Reason", beData.Reason);
            cmd.Parameters.AddWithValue("@ExpAttachment", beData.ExpAttachment);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateTranExpenseClaim";
            }
            else
            {
                cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddTranExpenseClaim";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@TravelMode", beData.TravelMode);

            cmd.Parameters.AddWithValue("@ExpensesFor", beData.ExpensesFor);
            cmd.Parameters.AddWithValue("@DestFromDateTime", beData.DestFromDateTime);
            cmd.Parameters.AddWithValue("@DestToDateTime", beData.DestToDateTime);
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[13].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[13].Value);

                if (!(cmd.Parameters[14].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[14].Value);

                if (!(cmd.Parameters[15].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[15].Value);

                if (!(cmd.Parameters[16].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[16].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.IsSuccess)
                {
                    SaveTranExpenseClaimDetailsDetails(beData.CUserId, resVal.RId, beData.DetailsColl);
                    SaveDocumentDetails(beData.DocumentColl, resVal.RId, beData.CUserId);
                }
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }
        private void SaveTranExpenseClaimDetailsDetails(int UserId, int TranId, BE.Expense.ExpenseDetailsCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
                return;

            foreach (BE.Expense.ExpenseDetails beData in beDataColl)
            {
                if (!beData.ExpenseCategoryId.HasValue || beData.ExpenseCategoryId==0)
                    continue;

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@ExpenseDate", beData.ExpenseDate);
                cmd.Parameters.AddWithValue("@ExpenseCategoryId", beData.ExpenseCategoryId);
                cmd.Parameters.AddWithValue("@Quantity", beData.Quantity);
                cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                cmd.Parameters.AddWithValue("@Description", beData.Description);
                cmd.Parameters.AddWithValue("@ReciptImage", beData.ReciptImage);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_AddTranExpenseClaimDetailsDetails";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveDocumentDetails(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int TranId, int UserId)
        {

            foreach (var beData in dataColl)
                if (!string.IsNullOrEmpty(beData.DocPath))
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
                    cmd.Parameters.AddWithValue("@Name", beData.Name);
                    cmd.Parameters.AddWithValue("@Description", beData.Description);
                    cmd.Parameters.AddWithValue("@Extension", beData.Extension);
                    cmd.Parameters.AddWithValue("@Document", beData.Data);
                    cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@TranId", TranId);
                    cmd.CommandText = "usp_AddTranExpenseClaimDocument";
                    cmd.ExecuteNonQuery();
                }
        }

        public BE.Expense.TranExpenseClaimCollections getAllTranExpenseClaim(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo, int? EmployeeId, int? StatusId)
        {
            BE.Expense.TranExpenseClaimCollections dataColl = new BE.Expense.TranExpenseClaimCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom ", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.Parameters.AddWithValue("@StatusId", StatusId);
            cmd.CommandText = "usp_GetAllTranExpenseClaim";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Expense.TranExpenseClaim beData = new BE.Expense.TranExpenseClaim();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.ExpenseClaimForId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.DateFrom = Convert.ToDateTime(reader[3]);
                    if (!(reader[4] is DBNull)) beData.DateTo = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is DBNull)) beData.ExpenseTitle = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ExpenseTypeId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.DestinationFrom = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.DestinationTo = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.DistanceTravelled = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.PurposeOfVisit = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Reason = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ExpAttachment = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.StatusId = reader.GetInt32(13);
                    if (!(reader[14] is DBNull)) beData.StatusBy = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.StatusLogDateTime = Convert.ToDateTime(reader[15]);
                    if (!(reader[16] is DBNull)) beData.StatusRemark = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.AcClearanceBy = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.AcClearanceDateTime = Convert.ToDateTime(reader[18]);
                    if (!(reader[19] is DBNull)) beData.AcClearanceRemark = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.Status = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.EmployeeName = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.TravelModeName = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.SubmitStatus = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.SubmitDateTime = reader.GetDateTime(24);
                    if (!(reader[25] is DBNull)) beData.SubmitMiti = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.DateFromMiti = reader.GetString(26);
                    if (!(reader[27] is DBNull)) beData.DateToMiti = reader.GetString(27);
                    if (!(reader[28] is DBNull)) beData.StatusLogMiti = reader.GetString(28);
                    if (!(reader[29] is DBNull)) beData.ExpensesType = reader.GetString(29);                    
                    if (!(reader[30] is DBNull)) beData.TotalAmt = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is DBNull)) beData.PendingAmt = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is DBNull)) beData.VerifyAmt = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is DBNull)) beData.RejectedAmt = Convert.ToDouble(reader[33]);
                    if (!(reader[34] is DBNull)) beData.CancelAmt = Convert.ToDouble(reader[34]);
                    if (!(reader[35] is DBNull)) beData.PartialAmt = Convert.ToDouble(reader[35]);
                    if (!(reader[36] is DBNull)) beData.ClearAmt = Convert.ToDouble(reader[36]);
                    if (!(reader[37] is DBNull)) beData.Address = reader.GetString(37);
                    if (!(reader[38] is DBNull)) beData.ExpensesFor = (Dynamic.BE.Expense.EXPENSESFOR)reader.GetInt32(38);
                    if (!(reader[39] is DBNull)) beData.DestFromDateTime = reader.GetDateTime(39);
                    if (!(reader[40] is DBNull)) beData.DestToDateTime = reader.GetDateTime(40);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }


        public BE.Expense.TranExpenseClaim getTranExpenseClaimById(int UserId, int EntityId, int TranId)
        {
            BE.Expense.TranExpenseClaim beData = new BE.Expense.TranExpenseClaim();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetTranExpenseClaimById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.Expense.TranExpenseClaim();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.ExpenseClaimForId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.DateFrom = Convert.ToDateTime(reader[3]);
                    if (!(reader[4] is DBNull)) beData.DateTo = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is DBNull)) beData.ExpenseTitle = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ExpenseTypeId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.DestinationFrom = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.DestinationTo = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.DistanceTravelled = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.PurposeOfVisit = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Reason = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ExpAttachment = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.StatusId = reader.GetInt32(13);
                    if (!(reader[14] is DBNull)) beData.StatusBy = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.StatusLogDateTime = Convert.ToDateTime(reader[15]);
                    if (!(reader[16] is DBNull)) beData.StatusRemark = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.AcClearanceBy = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.AcClearanceDateTime = Convert.ToDateTime(reader[18]);
                    if (!(reader[19] is DBNull)) beData.AcClearanceRemark = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.Status = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.DateFromMiti = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.DateToMiti = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.EmployeeName = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.TravelMode = reader.GetInt32(24);
                    if (!(reader[25] is DBNull)) beData.TotalAmt = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is DBNull)) beData.PendingAmt = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is DBNull)) beData.VerifyAmt = Convert.ToDouble(reader[27]);
                    if (!(reader[28] is DBNull)) beData.RejectedAmt = Convert.ToDouble(reader[28]);
                    if (!(reader[29] is DBNull)) beData.CancelAmt = Convert.ToDouble(reader[29]);
                    if (!(reader[30] is DBNull)) beData.PartialAmt = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is DBNull)) beData.ClearAmt = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is DBNull)) beData.ExpensesType = Convert.ToString(reader[32]);
                    if (!(reader[33] is DBNull)) beData.TravelModeName = Convert.ToString(reader[33]);
                    if (!(reader[34] is DBNull)) beData.ExpensesFor =(Dynamic.BE.Expense.EXPENSESFOR)Convert.ToInt32(reader[34]);
                    if (!(reader[35] is DBNull)) beData.DestFromDateTime = Convert.ToDateTime(reader[35]);
                    if (!(reader[36] is DBNull)) beData.DestToDateTime = Convert.ToDateTime(reader[36]);
                }
                reader.NextResult();
                beData.DetailsColl = new BE.Expense.ExpenseDetailsCollections();
                while (reader.Read())
                {
                    BE.Expense.ExpenseDetails  det1 = new BE.Expense.ExpenseDetails();
                    if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.ExpenseDate = Convert.ToDateTime(reader[1]);
                    if (!(reader[2] is DBNull)) det1.ExpenseCategoryId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det1.Quantity = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) det1.Rate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) det1.Amount = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) det1.Description = reader.GetString(6);
                    if (!(reader[7] is DBNull)) det1.ReciptImage = reader.GetString(7);
                    if (!(reader[8] is DBNull)) det1.StatusId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) det1.StatusBy = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) det1.StatusLogDateTime = Convert.ToDateTime(reader[10]);
                    if (!(reader[11] is DBNull)) det1.StatusRemark = reader.GetString(11);
                    if (!(reader[12] is DBNull)) det1.AcClearanceBy = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) det1.AcClearanceDateTime = Convert.ToDateTime(reader[13]);
                    if (!(reader[14] is DBNull)) det1.AcClearanceRemark = reader.GetString(14);
                    if (!(reader[15] is DBNull)) det1.Status = reader.GetString(15);
                    if (!(reader[16] is DBNull)) det1.ExpenseCategory = reader.GetString(16);
                    if (!(reader[17] is DBNull)) det1.ExpenseDateMiti = reader.GetString(17);
                    
                    beData.DetailsColl.Add(det1);
        
        }
                reader.Close();
                beData.IsSuccess = true;
                beData.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return beData;

        }

        public ResponeValues UpdateStatus(BE.Expense.TranExpenseClaim beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
            cmd.Parameters.AddWithValue("@StatusBy", beData.StatusBy);
            cmd.Parameters.AddWithValue("@StatusRemark", beData.StatusRemark);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateTranExpenseClaimStatus";
            }
            else
            {
                cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                //cmd.CommandText = "usp_AddTranExpenseClaim";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.IsSuccess)
                {
                    updateTranExpenseClaimDetailsStatus(beData.CUserId, resVal.RId, beData.DetailsColl);
                }
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        private void updateTranExpenseClaimDetailsStatus(int UserId, int TranId, BE.Expense.ExpenseDetailsCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
                return;

            foreach (BE.Expense.ExpenseDetails beData in beDataColl)
            {
                if (beData.StatusId == 1)
                    continue;
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
                cmd.Parameters.AddWithValue("@StatusBy", UserId);
                cmd.Parameters.AddWithValue("@StatusRemark", beData.StatusRemark);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_updateTranExpenseClaimDetStatus";
                cmd.ExecuteNonQuery();
            }
        }

        public ResponeValues UpdateAcClearance(BE.Expense.TranExpenseClaim beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
            cmd.Parameters.AddWithValue("@AcClearanceBy", beData.AcClearanceBy);
            cmd.Parameters.AddWithValue("@AcClearanceRemark", beData.AcClearanceRemark);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateTranExpenseClaimAcClearance";
            }
            else
            {
                cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                //cmd.CommandText = "usp_AddTranExpenseClaim";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.IsSuccess)
                {
                    updateTranExpenseClaimDetailsAcClearance(beData.CUserId, resVal.RId, beData.DetailsColl);
                }
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        private void updateTranExpenseClaimDetailsAcClearance(int UserId, int TranId, BE.Expense.ExpenseDetailsCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
                return;

            foreach (BE.Expense.ExpenseDetails beData in beDataColl)
            {
                if (beData.StatusId == 1)
                    continue;
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
                cmd.Parameters.AddWithValue("@AcClearanceBy", UserId);
                cmd.Parameters.AddWithValue("@AcClearanceRemark", beData.AcClearanceRemark);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_updateTranExpenseClaimDetAcClearance";
                cmd.ExecuteNonQuery();
            }
        }

        public ResponeValue UpdateSubmitStatus(int UserId ,int TranId)
        {
            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;           
            cmd.Parameters.AddWithValue("@UserId", UserId); 
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_TranExpesnsesClaimUpdateSubmit";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);           
            cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
             
            try
            {
                cmd.ExecuteNonQuery();
              
                if (!(cmd.Parameters[2].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[2].Value);

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[3].Value);
                  
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }
    }
}