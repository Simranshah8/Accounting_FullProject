using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Inventory.Transaction
{
    internal class FixedUnitDB
    {

        DataAccessLayer1 dal = null;
        public FixedUnitDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(int UserId,BusinessEntity.Inventory.Transaction.FixedUnit beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UnitId1", beData.UnitId1);
            cmd.Parameters.AddWithValue("@UnitId2", beData.UnitId2);
            cmd.Parameters.AddWithValue("@UnitId3", beData.UnitId3);
            cmd.Parameters.AddWithValue("@UnitId4", beData.UnitId4);
            cmd.Parameters.AddWithValue("@UnitId5", beData.UnitId5);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_UpdateFixedUnitId";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
           
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            
            try
            {
                cmd.ExecuteNonQuery();
                
                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

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

        public BusinessEntity.Inventory.Transaction.FixedUnit getFixedUnit(int UserId)
        {
            BusinessEntity.Inventory.Transaction.FixedUnit beData = new BusinessEntity.Inventory.Transaction.FixedUnit();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "sp_GetFixedUnitList";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BusinessEntity.Inventory.Transaction.FixedUnit();
                    if (!(reader[0] is DBNull)) beData.UnitId1 = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UnitId2 = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.UnitId3 = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.UnitId4 = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.UnitId5 = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.Unit1 = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Unit2 = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Unit3 = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Unit4 = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Unit5 = reader.GetString(9);
                }
                reader.Close();
                //beData.IsSuccess = true;
                //beData.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                //beData.IsSuccess = false;
                //beData.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beData;
        }

    }
}
