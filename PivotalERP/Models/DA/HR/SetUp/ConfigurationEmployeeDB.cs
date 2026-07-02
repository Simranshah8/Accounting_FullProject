using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR.Setup
{
    internal class ConfigurationEmployeeDB
    {

        DataAccessLayer1 dal = null;
        public ConfigurationEmployeeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(BE.HR.Setup.ConfigurationEmployee beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@EmpCodeNumberingMethod", beData.EmpCodeNumberingMethod);
            cmd.Parameters.AddWithValue("@CodePrefix", beData.CodePrefix);
            cmd.Parameters.AddWithValue("@CodeSuffix", beData.CodeSuffix);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.CommandText = "usp_AddConfigurationEmployee";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@StartNo", beData.StartNo);
            cmd.Parameters.AddWithValue("@NumericalPartWidth", beData.NumericalPartWidth);
            cmd.Parameters.AddWithValue("@AllowReGenerateUserPwd", beData.AllowReGenerateUserPwd);
            cmd.Parameters.AddWithValue("@LeftEmployeeConfig", beData.LeftEmployeeConfig);
            cmd.Parameters.AddWithValue("@RetirementAge", beData.RetirementAge);

            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

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

        public BE.HR.Setup.ConfigurationEmployee getConfiguuration(int UserId, int EntityId)
        {
            BE.HR.Setup.ConfigurationEmployee beData = new BE.HR.Setup.ConfigurationEmployee();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetConfigurationEmployee";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.HR.Setup.ConfigurationEmployee();
                    if (!(reader[0] is DBNull)) beData.EmpCodeNumberingMethod = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.CodePrefix = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.CodeSuffix = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.StartNo = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.NumericalPartWidth = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.AllowReGenerateUserPwd = reader.GetBoolean(5);
                    if (!(reader[6] is DBNull)) beData.LeftEmployeeConfig = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.RetirementAge = reader.GetInt32(7);
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
