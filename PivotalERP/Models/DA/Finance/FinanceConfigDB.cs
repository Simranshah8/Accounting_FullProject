using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Finance
{
    internal class FinanceConfigDB
    {

        DataAccessLayer1 dal = null;
        public FinanceConfigDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(BE.Finance.FinanceConfig beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@FinanceLedgerId", beData.FinanceLedgerId);
            cmd.Parameters.AddWithValue("@PrincipalLedgerId", beData.PrincipalLedgerId);
            cmd.Parameters.AddWithValue("@InterestLedgerId", beData.InterestLedgerId);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.CommandText = "usp_AddFinanceConfig";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@RebateLedgerId", beData.RebateLedgerId);
            cmd.Parameters.AddWithValue("@PenaltyLedgerId", beData.PenaltyLedgerId);
            cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);

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

        public BE.Finance.FinanceConfig getConfiguuration(int UserId, int EntityId)
        {
            BE.Finance.FinanceConfig beData = new BE.Finance.FinanceConfig();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetFinanceConfig";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.Finance.FinanceConfig();
                    if (!(reader[0] is DBNull)) beData.FinanceLedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PrincipalLedgerId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.InterestLedgerId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.RebateLedgerId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.PenaltyLedgerId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.VoucherId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.CostClassId = reader.GetInt32(6);
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
