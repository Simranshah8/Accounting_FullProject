using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
    internal class PayHeadingDB
    {
        DataAccessLayer1 dal = null;
        public PayHeadingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.PayHeading beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@DisplayName", beData.DisplayName);
            cmd.Parameters.AddWithValue("@Code", beData.Code);
            cmd.Parameters.AddWithValue("@SNo", beData.SNo);
            cmd.Parameters.AddWithValue("@PayheadType", beData.PayheadType);
            cmd.Parameters.AddWithValue("@Natures", beData.Natures);
            cmd.Parameters.AddWithValue("@MonthId", beData.MonthId);
            cmd.Parameters.AddWithValue("@CalculationType", beData.CalculationType);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@PayHeadGroupId", beData.PayHeadGroupId);
            cmd.Parameters.AddWithValue("@PayHeadCategoryId", beData.PayHeadCategoryId);
            cmd.Parameters.AddWithValue("@CalculationOnHeading", beData.CalculationOnHeading);
            cmd.Parameters.AddWithValue("@Formula", beData.Formula);
            cmd.Parameters.AddWithValue("@IsTaxable", beData.IsTaxable);
            cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdatePayHeading";
            }
            else
            {
                cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddPayHeading";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@TaxRuleAs", beData.TaxRuleAs);
            cmd.Parameters.AddWithValue("@AttendanceTypeId", beData.AttendanceTypeId);
            cmd.Parameters.AddWithValue("@SNoSD", beData.SNoSD);
            cmd.Parameters.AddWithValue("@IsSalaryDetail", beData.IsSalaryDetail);
            cmd.Parameters.AddWithValue("@IsSalarySheet", beData.IsSalarySheet);
            cmd.Parameters.AddWithValue("@LedgerOnId", beData.LedgerOnId);
            cmd.Parameters.AddWithValue("@IsPaySlip", beData.IsPaySlip);
            cmd.Parameters.AddWithValue("@IsIncentive", beData.IsIncentive);
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[18].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[18].Value);

                if (!(cmd.Parameters[19].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[19].Value);

                if (!(cmd.Parameters[20].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[20].Value);

                if (!(cmd.Parameters[21].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[21].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.IsSuccess && resVal.RId > 0)
                {
                    SavePayHeadingDet(beData.PayHeadingDetailsColl, resVal.RId, beData.CUserId);
                    SavePayHeadingTaxExemption(beData.PayHeadingTaxExemptionColl, resVal.RId, beData.CUserId);

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


        private void SavePayHeadingDet(List<Dynamic.BE.NPayroll.PayHeadingDetails> dataColl, int PayHeadingId, int UserId)
        {
            foreach (var beData in dataColl)
            {
                if (!string.IsNullOrEmpty(beData.Formula) || beData.Rate != 0 || beData.FixedAmount != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
                    cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
                    cmd.Parameters.AddWithValue("@MinAmount", beData.MinAmount);
                    cmd.Parameters.AddWithValue("@MaxAmount", beData.MaxAmount);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@FixedAmount", beData.FixedAmount);
                    cmd.Parameters.AddWithValue("@Formula", beData.Formula);
                    cmd.Parameters.AddWithValue("@LevelId", beData.LevelId);
                    cmd.Parameters.AddWithValue("@PayHeadingId", PayHeadingId);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.CommandText = "usp_AddPayHeadingDet";
                    cmd.ExecuteNonQuery();
                }
            }
        }


        private void SavePayHeadingTaxExemption(List<Dynamic.BE.NPayroll.PayHeadingTaxExemption> dataColl, int PayHeadingId, int UserId)
        {
            foreach (var beData in dataColl)
            {
                if (!string.IsNullOrEmpty(beData.Formula) || beData.Rate != 0 || beData.Amount != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@GenderId", beData.GenderId);
                    cmd.Parameters.AddWithValue("@MaritalStatusId", beData.MaritalStatusId);
                    cmd.Parameters.AddWithValue("@ResidentId", beData.ResidentId);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                    cmd.Parameters.AddWithValue("@Formula", beData.Formula);
                    cmd.Parameters.AddWithValue("@LevelId", beData.LevelId);
                    cmd.Parameters.AddWithValue("@PayHeadingId", PayHeadingId);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.CommandText = "usp_AddPayHeadingTaxExemption";
                    cmd.ExecuteNonQuery();
                }
            }
        }




        public Dynamic.BE.NPayroll.PayHeadingCollections getAllPayHeading(int UserId, int EntityId)
        {
            Dynamic.BE.NPayroll.PayHeadingCollections dataColl = new Dynamic.BE.NPayroll.PayHeadingCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllPayHeading";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.PayHeading beData = new Dynamic.BE.NPayroll.PayHeading();
                    beData.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.PayheadType = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.PayHeadGroupId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.PayheadGroupName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.PayHeadType = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.SNo = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[7]);
                    if (!(reader[8] is DBNull)) beData.IsTaxable = Convert.ToBoolean(reader[8]);
                    if (!(reader[9] is DBNull)) beData.IsSalaryDetail = Convert.ToBoolean(reader[9]);
                    if (!(reader[10] is DBNull)) beData.IsSalarySheet = Convert.ToBoolean(reader[10]);
                    if (!(reader[11] is DBNull)) beData.IsPaySlip = Convert.ToBoolean(reader[11]);
                    if (!(reader[12] is DBNull)) beData.LedgerOnId = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.LedgerName = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.LedgerGroup = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.NaturesName = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.CalculationTypeName = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.IsIncentive = Convert.ToBoolean(reader[17]);
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

        public Dynamic.BE.NPayroll.PayHeading getPayHeadingById(int UserId, int EntityId, int PayHeadingId)
        {
            Dynamic.BE.NPayroll.PayHeading beData = new Dynamic.BE.NPayroll.PayHeading();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@PayHeadingId", PayHeadingId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetPayHeadingById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.NPayroll.PayHeading();
                    beData.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.DisplayName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.SNo = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.PayheadType = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.Natures = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.MonthId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.CalculationType = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.LedgerId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.PayHeadGroupId = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.PayHeadCategoryId = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.CalculationOnHeading = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.Formula = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.IsTaxable = Convert.ToBoolean(reader[14]);
                    if (!(reader[15] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[15]);
                    if (!(reader[16] is DBNull)) beData.TaxRuleAs = reader.GetInt32(16);
                    if (!(reader[17] is DBNull)) beData.AttendanceTypeId = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.SNoSD = reader.GetInt32(18);
                    if (!(reader[19] is DBNull)) beData.IsSalaryDetail = Convert.ToBoolean(reader[19]);
                    if (!(reader[20] is DBNull)) beData.IsSalarySheet = Convert.ToBoolean(reader[20]);
                    if (!(reader[21] is DBNull)) beData.LedgerOnId = reader.GetInt32(21);
                    if (!(reader[22] is DBNull)) beData.IsPaySlip = Convert.ToBoolean(reader[22]);
                    if (!(reader[23] is DBNull)) beData.IsIncentive = Convert.ToBoolean(reader[23]);
                }

                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.PayHeadingDetails det = new Dynamic.BE.NPayroll.PayHeadingDetails();
                    det.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.CategoryId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det.MinAmount = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) det.MaxAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) det.Rate = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) det.FixedAmount = reader.GetDouble(6);
                    if (!(reader[7] is DBNull)) det.Formula = reader.GetString(7);
                    if (!(reader[8] is DBNull)) det.LevelId = reader.GetInt32(8);
                    beData.PayHeadingDetailsColl.Add(det);
                }

                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.PayHeadingTaxExemption det = new Dynamic.BE.NPayroll.PayHeadingTaxExemption();
                    det.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.GenderId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.MaritalStatusId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det.ResidentId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) det.Rate = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) det.Amount = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) det.Formula = reader.GetString(6);
                    if (!(reader[7] is DBNull)) det.LevelId = reader.GetInt32(7);
                    beData.PayHeadingTaxExemptionColl.Add(det);
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

        public Dynamic.BE.NPayroll.PayHeadingCollections getAllPayHeadingForTran(int UserId)
        {
            Dynamic.BE.NPayroll.PayHeadingCollections dataColl = new Dynamic.BE.NPayroll.PayHeadingCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;            
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", 0);
            cmd.CommandText = "usp_GetAllPayHeadingForTran";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var beData = new Dynamic.BE.NPayroll.PayHeading();
                    beData.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.DisplayName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.SNo = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.PayheadType = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.Natures = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.MonthId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.CalculationType = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.LedgerId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.PayHeadGroupId = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.PayHeadCategoryId = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.CalculationOnHeading = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.Formula = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.IsTaxable = Convert.ToBoolean(reader[14]);
                    if (!(reader[15] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[15]);
                    if (!(reader[16] is DBNull)) beData.TaxRuleAs = reader.GetInt32(16);
                    if (!(reader[17] is DBNull)) beData.AttendanceTypeId = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.IsSalaryDetail = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is DBNull)) beData.IsSalarySheet = Convert.ToBoolean(reader[19]);
                    if (!(reader[20] is DBNull)) beData.LedgerOnId = reader.GetInt32(20);
                    if (!(reader[21] is DBNull)) beData.IsPaySlip = Convert.ToBoolean(reader[21]);
                    if (!(reader[22] is DBNull)) beData.IsIncentive = Convert.ToBoolean(reader[22]);
                    dataColl.Add(beData);
                }

                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.PayHeadingDetails det = new Dynamic.BE.NPayroll.PayHeadingDetails();
                    det.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.CategoryId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det.MinAmount = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) det.MaxAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) det.Rate = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) det.FixedAmount = reader.GetDouble(6);
                    if (!(reader[7] is DBNull)) det.Formula = reader.GetString(7);
                    if (!(reader[8] is DBNull)) det.LevelId = reader.GetInt32(8);
                    dataColl.Find(p1 => p1.PayHeadingId == det.PayHeadingId).PayHeadingDetailsColl.Add(det);
                }

                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.PayHeadingTaxExemption det = new Dynamic.BE.NPayroll.PayHeadingTaxExemption();
                    det.PayHeadingId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.GenderId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.MaritalStatusId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det.ResidentId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) det.Rate = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) det.Amount = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) det.Formula = reader.GetString(6);
                    dataColl.Find(p1 => p1.PayHeadingId == det.PayHeadingId).PayHeadingTaxExemptionColl.Add(det);
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
        public ResponeValues DeleteById(int UserId, int EntityId, int PayHeadingId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@PayHeadingId", PayHeadingId);
            cmd.CommandText = "usp_DelPayHeadingById";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

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

        public Dynamic.BE.NPayroll.BranchForPayHeadingCollections getBranchForPayHeading(int UserId, int EntityId)
        {
            Dynamic.BE.NPayroll.BranchForPayHeadingCollections dataColl = new Dynamic.BE.NPayroll.BranchForPayHeadingCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_BranchForPayHeading";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.BranchForPayHeading beData = new Dynamic.BE.NPayroll.BranchForPayHeading();
                    beData.BranchId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
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

        public Dynamic.BE.NPayroll.CategoryForPayHeadingCollections getCategoryForPayHeading(int UserId, int EntityId)
        {
            Dynamic.BE.NPayroll.CategoryForPayHeadingCollections dataColl = new Dynamic.BE.NPayroll.CategoryForPayHeadingCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_CategoryForPayHeading";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.CategoryForPayHeading beData = new Dynamic.BE.NPayroll.CategoryForPayHeading();
                    beData.CategoryId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
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
