using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{

    internal class LetterTemplateDB
    {
        DataAccessLayer1 dal = null;
        public LetterTemplateDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(BE.LetterTemplate beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TemplateTypeId", beData.TemplateTypeId);
            cmd.Parameters.AddWithValue("@Description", beData.Description);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@LetterTemplateId", beData.LetterTemplateId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateLetterTemplate";
            }
            else
            {
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddLetterTemplate";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

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

        public ResponeValues DeleteById(int UserId, int EntityId, int LetterTemplateId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@LetterTemplateId", LetterTemplateId);
            cmd.CommandText = "usp_DelLetterTemplateById";
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
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

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
        public BE.LetterTemplateCollections getAllLetterTemplate(int UserId, int EntityId)
        {
            BE.LetterTemplateCollections dataColl = new BE.LetterTemplateCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllLetterTemplate";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.LetterTemplate beData = new BE.LetterTemplate();
                    if (!(reader[0] is DBNull)) beData.LetterTemplateId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.TemplateTypeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Description = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.TemplateType = reader.GetString(3);
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
        public BE.LetterTemplate getLetterTemplateById(int UserId, int EntityId, int TemplateTypeId)
        {
            BE.LetterTemplate beData = new BE.LetterTemplate();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TemplateTypeId", TemplateTypeId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetLetterTemplateById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.LetterTemplate();
                    if (!(reader[0] is DBNull)) beData.LetterTemplateId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.TemplateTypeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Description = reader.GetString(2);
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

        public BE.UserDetails GetUserDetailsById(int UserId, int EntityId, int UsersId)
        {
            BE.UserDetails beData = new BE.UserDetails();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetUserDetailsById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.UserDetails();
                    if (!(reader[0] is DBNull)) beData.UserId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Address = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.DOB_AD = Convert.ToDateTime(reader[5]);
                    if (!(reader[6] is DBNull)) beData.DOB_BS = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Designation = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Branch = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.ServiceType = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Category = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.CompanyName = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.CompanyAddress = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.DateofJoining = Convert.ToDateTime(reader[14]);
                    if (!(reader[15] is DBNull)) beData.DateofJoiningBS = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.TotalWorkingYear = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.GrossSalary = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.BloodGroup = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.SubBranch = reader.GetString(19);

                    if (!(reader[20] is DBNull)) beData.TransferFromDepartment = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.TransferToDepartment = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.TransferFromBranch = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.TransferToBranch = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.TransferFromCompany = reader.GetString(24);
                    if (!(reader[25] is DBNull)) beData.TransferToCompany = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.TransferFromDesignation = reader.GetString(26);
                    if (!(reader[27] is DBNull)) beData.TransferToDesination = reader.GetString(27);

                    if (!(reader[28] is DBNull)) beData.PromotionFromBranch = reader.GetString(28);
                    if (!(reader[29] is DBNull)) beData.PromotionToBranch = reader.GetString(29);
                    if (!(reader[30] is DBNull)) beData.PromotionFromDesignation = reader.GetString(30);
                    if (!(reader[31] is DBNull)) beData.PromotionToDesination = reader.GetString(31);
                    if (!(reader[32] is DBNull)) beData.PromotionFromDepartment = reader.GetString(32);
                    if (!(reader[33] is DBNull)) beData.PromotionToDepartment = reader.GetString(33);

                    if (!(reader[34] is DBNull)) beData.Feedback = reader.GetString(34);
                    if (!(reader[35] is DBNull)) beData.FinalRating = Convert.ToDouble(reader[35]);
                    if (!(reader[36] is DBNull)) beData.FeedBackRemarks = reader.GetString(36);
                }
                reader.NextResult();
                beData.KeyResponsibilitiesColl = new List<BE.KeyResponsibility>();
                while (reader.Read())
                {
                    BE.KeyResponsibility det = new BE.KeyResponsibility();
                    if (!(reader[0] is DBNull)) det.EmpJDId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.EmployeeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.Responsibility = reader.GetString(2);
                    if (beData.EmployeeId == det.EmployeeId)
                    {
                        beData.KeyResponsibilitiesColl.Add(det);
                    }
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


    }

}

