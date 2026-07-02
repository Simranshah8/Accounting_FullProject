using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.DataAccess.Finance
{
    public class LoanCreationDB
    {
        Global.DataAccessLayer1 dal = null;
        public LoanCreationDB() { dal = new Global.DataAccessLayer1(); }
        public LoanCreationDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName, dbName);
        }
        /// <summary>
        /// Save Loan Creation
        /// Also mantaining Log for parent and child table while isModify = true
        /// </summary>
        /// <param name="beData"></param>
        /// <param name="isModify"></param>
        /// <returns></returns>
        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Finance.LoanCreation beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@CreateBy", beData.CreateBy);
            cmd.Parameters.AddWithValue("@AutoNumber", getSNo());
            cmd.Parameters.AddWithValue("@InterestRate", beData.InterestRate);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@LoanAmount", beData.LoanAmount);
            cmd.Parameters.AddWithValue("@LoanType", beData.LoanType);
            cmd.Parameters.AddWithValue("@ModifyBy", beData.ModifyBy);
            cmd.Parameters.AddWithValue("@ND", beData.ND);
            cmd.Parameters.AddWithValue("@NM", beData.NM);
            cmd.Parameters.AddWithValue("@Notes", beData.Notes);
            cmd.Parameters.AddWithValue("@NY", beData.NY);
            cmd.Parameters.AddWithValue("@Period", beData.Period);
            cmd.Parameters.AddWithValue("@PeriodType", beData.PeriodType);
            cmd.Parameters.AddWithValue("@RefBy", beData.RefBy);
            cmd.Parameters.AddWithValue("@StartDate", beData.StartDate);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            //Added by Suresh
            cmd.Parameters.AddWithValue("@VehicleId", beData.VehicleId);
            cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
            cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);

            //CreateBy,AutoNumber,InterestRate,LedgerId,LoanAmount,LoanType,ModifyBy,ND,NM,Notes,NY,Period,PeriodType,RefBy,StartDate,TranId

            if (isModify)
            {

                //cmd.CommandText = "usp_UpdateLoanCreation";
                //cmd.ExecuteNonQuery();
                cmd.CommandText = " insert into dbo.tbl_LoanCreation_log(TranId,VoucherId,CostClassId,VehicleId,CreateBy,AutoNumber,InterestRate,LedgerId,LoanAmount,LoanType,ND,NM,Notes,NY,Period,PeriodType,RefBy,StartDate,VoucherDate)  " +
                    " select TranId, VoucherId, CostClassId, VehicleId, CreateBy, AutoNumber, InterestRate, LedgerId, LoanAmount, LoanType, ND, NM, Notes, NY, Period, PeriodType, RefBy, StartDate,VoucherDate from tbl_LoanCreation where TranId = @TranId; " +
                    "insert into dbo.tbl_UDFLoanCreation_Log(TranId,UDFId,Value,AlterNetValue) select TranId, UDFId, Value, AlterNetValue from tbl_UDFLoanCreation where TranId = @TranId;" +
                    "insert into dbo.tbl_Rebate_Log(TranId, FromDays, ToDays, Rate, Amount, Remarks) select TranId, FromDays, ToDays, Rate, Amount, Remarks from tbl_Rebate where TranId = @TranId;" +
                    " insert into dbo.tbl_Penalty_Log(TranId, FromDays, ToDays, Rate, Amount, Remarks) select TranId, FromDays, ToDays, Rate, Amount, Remarks from tbl_Penalty where TranId = @TranId;" +
                    "insert into dbo.tbl_EMIDetails_Log(EMIId, TranId, PaymentNo, EMIDate, NY, NM, ND, BeginingBalance, SchedulePayment, Principal, Interest, EndingBalance, IsDebit, JournalTranId, RebatePenaltyTranId, DebitBy, ReScheduleTranId)" +
                    "select EMIId, TranId, PaymentNo, EMIDate, NY, NM, ND, BeginingBalance, SchedulePayment, Principal, Interest, EndingBalance, IsDebit, JournalTranId, RebatePenaltyTranId, DebitBy, ReScheduleTranId from tbl_EMIDetails where TranId = @TranId; ";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "delete from tbl_UDFLoanCreation where TranId=@TranId; delete from tbl_LoanCreationDocument where TranId=@TranId; delete from tbl_Rebate where TranId=@TranId; delete from tbl_Penalty where TranId=@TranId; delete from tbl_EMIDetails where TranId=@TranId; ";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "update tbl_LoanCreation set VoucherDate=@VoucherDate,VoucherId=@VoucherId,CostClassId=@CostClassId, VehicleId=@VehicleId, InterestRate=@InterestRate,LedgerId=@LedgerId,LoanAmount=@LoanAmount,LoanType=@LoanType,ModifyBy=@CreateBy,ND=@ND,NM=@NM,Notes=@Notes,NY=@NY,Period=@Period,PeriodType=@PeriodType,RefBy=@RefBy,StartDate=@StartDate where TranId=@TranId ";
            }
            else
            {
                cmd.CommandText = "insert into tbl_LoanCreation(VoucherDate,VoucherId,CostClassId,VehicleId,CreateBy,AutoNumber,InterestRate,LedgerId,LoanAmount,LoanType,ND,NM,Notes,NY,Period,PeriodType,RefBy,StartDate) values(@VoucherDate,@VoucherId,@CostClassId,@VehicleId,@CreateBy,@AutoNumber,@InterestRate,@LedgerId,@LoanAmount,@LoanType,@ND,@NM,@Notes,@NY,@Period,@PeriodType,@RefBy,@StartDate)";
                cmd.CommandText = cmd.CommandText + " ; SELECT Scope_Identity(); ";
                //cmd.CommandText = "usp_AddLoanCreation";
            }


            try
            {
                if (isModify)
                {
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    var lastId = cmd.ExecuteScalar();
                    if (lastId != null && !(lastId is DBNull) && Convert.ToInt32(lastId) > 0)
                    {
                        beData.TranId = Convert.ToInt32(lastId);
                    }
                    else
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Unable To Store Data";
                        return resVal;
                    }
                }


                if (isModify)
                {
                    dal.CommitTransaction();
                    SaveUDF(beData.TranId, beData.UserDefineFieldsColl);
                    SaveDocument(beData.TranId, beData.DocumentColl);
                    SaveEMI(beData.TranId, beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    //return beData.TranId;
                }
                else
                {
                    //beData.TranId = dal.GetInsertId(cmd,"tbl_LoanCreation");
                    SaveUDF(beData.TranId, beData.UserDefineFieldsColl);
                    SaveDocument(beData.TranId, beData.DocumentColl);
                    SaveEMI(beData.TranId, beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    dal.CommitTransaction();
                    // return beData.TranId;
                }
                resVal.RId = beData.TranId;
                resVal.IsSuccess = true;
                resVal.ResponseMSG = (isModify ? GLOBALMSG.UPDATE_SUCCESS : GLOBALMSG.SAVE_SUCCESS);

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public int SaveUpdateReSchedule(Dynamic.BusinessEntity.Finance.LoanCreation beData, bool isModify)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@CreateBy", beData.CreateBy);
            cmd.Parameters.AddWithValue("@LoanTranId", beData.TranId);
            cmd.Parameters.AddWithValue("@InterestRate", beData.InterestRate);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@LoanAmount", beData.LoanAmount);
            cmd.Parameters.AddWithValue("@LoanType", beData.LoanType);
            cmd.Parameters.AddWithValue("@ModifyBy", beData.ModifyBy);
            cmd.Parameters.AddWithValue("@ND", beData.ND);
            cmd.Parameters.AddWithValue("@NM", beData.NM);
            cmd.Parameters.AddWithValue("@Notes", beData.Notes);
            cmd.Parameters.AddWithValue("@NY", beData.NY);
            cmd.Parameters.AddWithValue("@Period", beData.Period);
            cmd.Parameters.AddWithValue("@PeriodType", beData.PeriodType);
            cmd.Parameters.AddWithValue("@RefBy", beData.RefBy);
            cmd.Parameters.AddWithValue("@StartDate", beData.StartDate);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            cmd.Parameters.AddWithValue("@AutoNumber", beData.AutoNumber);
            //TranId,LoanTranId,LedgerId,EntryDate,LoanAmount,StartDate,NY,NM,ND,Period,PeriodType,InterestRate,RefBy,Notes,CreateBy,ModifyBy

            if (isModify)
            {
                cmd.CommandText = "delete from tbl_UDFLoanCreation where TranId=@TranId; delete from tbl_LoanCreationDocument where TranId=@TranId; delete from tbl_Rebate where TranId=@TranId; delete from tbl_Penalty where TranId=@TranId; delete from tbl_EMIDetails where TranId=@TranId; ";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "update tbl_LoanCreation set InterestRate=@InterestRate,LedgerId=@LedgerId,LoanAmount=@LoanAmount,LoanType=@LoanType,ModifyBy=@ModifyBy,ND=@ND,NM=@NM,Notes=@Notes,NY=@NY,Period=@Period,PeriodType=@PeriodType,RefBy=@RefBy,StartDate=@StartDate where TranId=@TranId ";
            }
            else
            {
                cmd.CommandText = "insert into tbl_LoanCreation(CreateBy,AutoNumber,InterestRate,LedgerId,LoanAmount,LoanType,ND,NM,Notes,NY,Period,PeriodType,RefBy,StartDate) values(@CreateBy,@AutoNumber,@InterestRate,@LedgerId,@LoanAmount,@LoanType,@ND,@NM,@Notes,@NY,@Period,@PeriodType,@RefBy,@StartDate)";
                cmd.CommandText = cmd.CommandText + " ; SELECT Scope_Identity(); ";
            }
            try
            {

                if (isModify)
                {
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    var lastId = cmd.ExecuteScalar();
                    if (lastId != null && !(lastId is DBNull) && Convert.ToInt32(lastId) > 0)
                    {
                        beData.TranId = Convert.ToInt32(lastId);
                    }
                    else
                    {
                        return 0;
                    }
                }


                if (isModify)
                {
                    dal.CommitTransaction();
                    SaveUDF(beData.TranId, beData.UserDefineFieldsColl);
                    SaveDocument(beData.TranId, beData.DocumentColl);
                    SaveEMI(beData.TranId, beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    return beData.TranId;
                }
                else
                {
                    beData.TranId = dal.GetInsertId(cmd, "tbl_LoanCreation");
                    SaveUDF(beData.TranId, beData.UserDefineFieldsColl);
                    SaveDocument(beData.TranId, beData.DocumentColl);
                    SaveEMI(beData.TranId, beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    dal.CommitTransaction();
                    return beData.TranId;
                }

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        private void SaveUDF(int TranId, UserDefineFieldCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (UserDefineField beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@UDFId", beData.UDFId);
                cmd.Parameters.AddWithValue("@Value", beData.Value);
                cmd.Parameters.AddWithValue("@AlterNetValue", beData.AlterNetValue);
                //TranId,UDFId,Value,AlterNetValue
                cmd.CommandText = "insert into tbl_UDFLoanCreation(TranId,UDFId,Value,AlterNetValue)  values(@TranId,@UDFId,@Value,@AlterNetValue)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveRebate(int TranId, Dynamic.BusinessEntity.Finance.RebatePenaltyDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.RebatePenaltyDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@FromDays", beData.FromDays);
                cmd.Parameters.AddWithValue("@ToDays", beData.ToDays);
                cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                //TranId,FromDays,ToDays,Rate,Amount
                cmd.CommandText = "insert into tbl_Rebate(TranId,FromDays,ToDays,Rate,Amount,Remarks) values(@TranId,@FromDays,@ToDays,@Rate,@Amount,@Remarks)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SavePenalty(int TranId, Dynamic.BusinessEntity.Finance.RebatePenaltyDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.RebatePenaltyDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@FromDays", beData.FromDays);
                cmd.Parameters.AddWithValue("@ToDays", beData.ToDays);
                cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                //TranId,FromDays,ToDays,Rate,Amount
                cmd.CommandText = "insert into tbl_Penalty(TranId,FromDays,ToDays,Rate,Amount,Remarks) values(@TranId,@FromDays,@ToDays,@Rate,@Amount,@Remarks)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveEMI(int TranId, Dynamic.BusinessEntity.Finance.EMIDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.EMIDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@PaymentNo", beData.PaymentNo);
                cmd.Parameters.AddWithValue("@BegingBalance", beData.BegingBalance);
                cmd.Parameters.AddWithValue("@EMIDate", beData.EMIDate);
                cmd.Parameters.AddWithValue("@ND", beData.END);
                cmd.Parameters.AddWithValue("@EndingBalance", beData.EndingBalance);
                cmd.Parameters.AddWithValue("@NM", beData.ENM);
                cmd.Parameters.AddWithValue("@NY", beData.ENY);
                cmd.Parameters.AddWithValue("@Interest", beData.Interest);
                cmd.Parameters.AddWithValue("@Principal", beData.Principal);
                cmd.Parameters.AddWithValue("@SchedulePayment", beData.SchedulePayment);

                //TranId,PaymentNo,BegingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment
                cmd.CommandText = "insert into tbl_EMIDetails(TranId,PaymentNo,BeginingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment) values(@TranId,@PaymentNo,@BegingBalance,@EMIDate,@ND,@EndingBalance,@NM,@NY,@Interest,@Principal,@SchedulePayment)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveDocument(int TranId, Dynamic.BusinessEntity.GeneralDocumentCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.GeneralDocument beData in beDataColl)
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
                cmd.Parameters.AddWithValue("@Extension", beData.Extension);
                cmd.Parameters.AddWithValue("@Name", beData.Name);


                cmd.CommandText = "insert into tbl_LoanCreationDocument(TranId,DocPath,Extension,Name) values(@TranId,@DocPath,@Extension,@Name) ";
                cmd.ExecuteNonQuery();
            }

        }
        public ResponeValues Delete(Int32 TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@TranId", TranId);

            cmd.CommandText = "delete from tbl_LoanCreation where TranId=@TranId; ";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        public ResponeValues Delete(string CostCenterId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_LoanCreation where TranId in (" + CostCenterId + ")";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        private int getSNo()
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "select isnull(max(AutoNumber),0)+1 from tbl_LoanCreation ";

            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ee)
            {
                throw ee;
            }

        }
        public int getAutoNumber()
        {
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "select isnull(max(AutoNumber),0)+1 from tbl_LoanCreation ";

            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public bool CanModifyOrDeleteLoanCreation(int TranId)
        {
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "select count(*) from tbl_EMIDetails E where E.TranId=@TranId and (E.JournalTranId>0 or RebatePenaltyTranId>0)";

            try
            {
                int count = Convert.ToInt32(cmd.ExecuteScalar());
                if (count == 0)
                    return true;
                else
                    return false;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public void getRebatePenaltyDetails(ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", beData.TranId);

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Rebate where TranId=@TranId";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.RebateColl.Add(reb);
                }
                reader.Close();

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Penalty where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.PenaltyColl.Add(reb);
                }
                reader.Close();

            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public void getLoanDetailsByTranId(BaseDate baseDate, ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", beData.TranId);

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount,Remarks from tbl_Rebate where TranId=@TranId";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    //Added by Suresh
                    if (!(reader[4] is System.DBNull)) reb.Remarks = reader.GetString(4);
                    beData.RebateColl.Add(reb);
                }
                reader.Close();

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount,Remarks from tbl_Penalty where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    //Added by Suresh
                    if (!(reader[4] is System.DBNull)) reb.Remarks = reader.GetString(4);
                    beData.PenaltyColl.Add(reb);
                }
                reader.Close();


                cmd.CommandText = "select TJD.TranId,TJD.Document,TJD.Extension,TJD.Name from tbl_LoanCreationDocument TJD where TJD.TranId=@TranId ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.GeneralDocument ledData = new BusinessEntity.GeneralDocument();
                    if (!(reader[0] is System.DBNull)) ledData.Id = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.Data = (byte[])reader[1];
                    if (!(reader[2] is System.DBNull)) ledData.Extension = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) ledData.Name = reader.GetString(3);
                    beData.DocumentColl.Add(ledData);
                }
                reader.Close();


                cmd.CommandText = "select PaymentNo,BeginingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment from tbl_EMIDetails where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.EMIDetails reb = new BusinessEntity.Finance.EMIDetails();
                    if (!(reader[0] is System.DBNull)) reb.PaymentNo = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.BegingBalance = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) reb.EMIDate = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) reb.END = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) reb.EndingBalance = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) reb.ENM = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) reb.ENY = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) reb.Interest = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) reb.Principal = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) reb.SchedulePayment = Convert.ToDouble(reader[9]);

                    if (baseDate == BaseDate.NepaliDate)
                        reb.EMIDateStr = Dynamic.DataAccess.Global.GlobalDB.GetDateStr(reb.ENY, reb.ENM, reb.END);
                    else
                        reb.EMIDateStr = Dynamic.DataAccess.Global.GlobalDB.GetDateStr(reb.EMIDate);

                    beData.EMIColl.Add(reb);
                }
                reader.Close();

                cmd.CommandText = "select TranId,UDFId,Value,AlterNetValue from tbl_UDFLoanCreation  CD where CD.TranId=@TranId ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    UserDefineField ledData = new UserDefineField();
                    if (!(reader[0] is System.DBNull)) ledData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.UDFId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) ledData.Value = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) ledData.AlterNetValue = reader.GetString(3);
                    beData.UserDefineFieldsColl.Add(ledData);
                }
                reader.Close();

            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Finance.LoanCreationCollections getAllLoanCreation()
        {
            Dynamic.BusinessEntity.Finance.LoanCreationCollections dataColl = new BusinessEntity.Finance.LoanCreationCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(" select LC.TranId,LC.AutoNumber,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify,LC.VehicleId from tbl_LoanCreation LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId ");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.CanModify = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is System.DBNull)) beData.VehicleId = reader.GetInt32(19);

                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getCostCenterByRowNumber(long rowNum)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(@"
                with CostCenter as
                (
                 select LC.TranId,LC.AutoNumber,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,ROW_NUMBER() over (order by LC.TranId) as RowNumber from tbl_LoanCreation LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId 
                )select LC.TranId,LC.AutoNumber,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify from CostCenter LC where LC.RowNumber=" + rowNum.ToString());

                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);
                    reader.Close();
                    return beData;
                }

                return null;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getLastRowData(ref long count)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select top 1 LC.TranId,LC.AutoNumber,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify from tbl_LoanCreation LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId  order by LC.TranId desc ");
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.CanModify = reader.GetBoolean(18);
                    reader.Close();

                    count = dal.GetTotalRows("tbl_LoanCreation");
                    return beData;
                }

                return null;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public Dynamic.BusinessEntity.Finance.LoanCreationCollections getAllLoanCreationForEndLoan()
        {
            Dynamic.BusinessEntity.Finance.LoanCreationCollections dataColl = new BusinessEntity.Finance.LoanCreationCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(@" 
                                                                                        with tbl_T
                                                                                        as
                                                                                        (
                                                                                            select LC.TranId from tbl_LoanCreation LC
                                                                                            except
                                                                                            select E.TranId from tbl_EndLoan E
                                                                                          )
                                                                                         select LC.TranId,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,Led.Name from tbl_T T inner join tbl_LoanCreation LC on T.TranId=LC.TranId inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LedgerId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.StartDate = reader.GetDateTime(3);
                    if (!(reader[4] is System.DBNull)) beData.Period = reader.GetInt32(4);
                    if (!(reader[5] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.LedgerName = reader.GetString(8);

                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public void SaveEndLoan(Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@UserId", beData.CreateBy);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            cmd.Parameters.AddWithValue("@Notes", beData.Notes);

            try
            {
                cmd.CommandText = "sp_EndLoan";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public void SaveMonthEnd(int UserId, DateTime dateFrom, DateTime dateTo)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
            cmd.Parameters.AddWithValue("@DateTo", dateTo);

            try
            {
                cmd.CommandText = "sp_MonthEnd";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public void ClearMonthEnd()
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.CommandText = "sp_ClearMonthEnd";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public void DeleteMonthEnd(DateTime dateFrom, DateTime dateTo)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.CommandText = "sp_DeleteMonthEndProcess";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public void DeleteRebatePenalty(DateTime dateFrom, DateTime dateTo)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.CommandText = "sp_DeleteRebatePenalty";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public void CalculateRebate(int UserId, DateTime dateFrom)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@Date", dateFrom);

            try
            {
                cmd.CommandText = "sp_CalculateRebate";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public void CalculatePenalty(int UserId, DateTime dateFrom)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@Date", dateFrom);

            try
            {
                cmd.CommandText = "sp_CalculatePenalty";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getLoanDetailsForReGenerate(int LedgerId)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
                cmd.CommandText = "select top 1 LC.TranId,ED.BeginingBalance,ED.EMIDate,LC.LoanType,LC.InterestRate,(select count(*) from tbl_EMIDetails E where E.TranId=LC.TranId and E.JournalTranId=0) as Period,LC.PeriodType from tbl_LoanCreation LC inner join tbl_EMIDetails ED on ED.TranId=LC.TranId where LC.LedgerId=@LedgerId and ED.JournalTranId=0 order by ED.EMIId";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                Dynamic.BusinessEntity.Finance.LoanCreation beData = null;
                if (reader.Read())
                {
                    beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.StartDate = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.Period = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(6);
                }
                reader.Close();

                return beData;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public System.Collections.Generic.List<int> GetAllLoanPartyId()
        {
            dal.OpenConnection();

            try
            {
                System.Collections.Generic.List<int> dataCOll = new List<int>();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandText = "select LedgerId from tbl_LoanCreation";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    dataCOll.Add(reader.GetInt32(0));
                }
                reader.Close();

                return dataCOll;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        /// <summary>
        /// Get value 
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="EntityId"></param>
        /// <param name="TranId"></param>
        /// <returns></returns>
        public BusinessEntity.Finance.LoanCreation getLoanCreationById(int UserId, int EntityId, int TranId)
        {
            BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetLoanCreationById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.StartDate = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.FinanaceJournalTranId = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.CreationDate = Convert.ToDateTime(reader[15]);
                    if (!(reader[16] is DBNull)) beData.VehicleId = reader.GetInt32(16);
                    if (!(reader[17] is DBNull)) beData.VoucherId = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.CostClassId = reader.GetInt32(18);
                    if (!(reader[19] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[19]);
                }
                reader.NextResult();
                beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.GeneralDocument det1 = new Dynamic.BusinessEntity.GeneralDocument();
                    if (!(reader[0] is DBNull)) det1.Id = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.DocPath = reader.GetString(1);
                    if (!(reader[2] is DBNull)) det1.Extension = reader.GetString(2);
                    if (!(reader[3] is DBNull)) det1.Name = reader.GetString(3);
                    beData.DocumentColl.Add(det1);

                }
                reader.NextResult();
                beData.RebateColl = new BusinessEntity.Finance.RebatePenaltyDetailsCollections();
                while (reader.Read())
                {
                    BusinessEntity.Finance.RebatePenaltyDetails det2 = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is DBNull)) det2.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det2.FromDays = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det2.ToDays = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det2.Rate = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) det2.Amount = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) det2.Remarks = reader.GetString(5);
                    beData.RebateColl.Add(det2);

                }
                reader.NextResult();
                beData.PenaltyColl = new BusinessEntity.Finance.RebatePenaltyDetailsCollections();
                while (reader.Read())
                {
                    BusinessEntity.Finance.RebatePenaltyDetails det3 = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is DBNull)) det3.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det3.FromDays = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det3.ToDays = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det3.Rate = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) det3.Amount = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) det3.Remarks = reader.GetString(5);
                    beData.PenaltyColl.Add(det3);


                }
                reader.NextResult();
                beData.EMIColl = new BusinessEntity.Finance.EMIDetailsCollections();
                while (reader.Read())
                {
                    BusinessEntity.Finance.EMIDetails det4 = new BusinessEntity.Finance.EMIDetails();
                    if (!(reader[1] is DBNull)) det4.TranId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det4.PaymentNo = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det4.EMIDate = Convert.ToDateTime(reader[3]);
                    if (!(reader[4] is DBNull)) det4.ENY = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) det4.ENM = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) det4.END = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) det4.BegingBalance = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) det4.SchedulePayment = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) det4.Principal = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) det4.Interest = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) det4.EndingBalance = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) det4.IsDebit = Convert.ToBoolean(reader[12]);
                    beData.EMIColl.Add(det4);

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
    
        public BusinessEntity.Finance.LoanCreationCollections GetPartywiseLoanById(int LedgerId,int UserId)
        {
            BusinessEntity.Finance.LoanCreationCollections dataColl = new BusinessEntity.Finance.LoanCreationCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_PartywiseLoanById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.LedgerId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.LoanTypeName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.VehicleId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.VoucherId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.LoanAmount = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.EngineNo = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.ChechisNo = reader.GetString(9);
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
    }
}
