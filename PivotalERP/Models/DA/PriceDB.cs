using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Account
{
    internal class PriceDB
    {
        DataAccessLayer1 dal = null;
        public PriceDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Account.Price beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@Factor", beData.Factor);
            cmd.Parameters.AddWithValue("@DefaultBasePriceList", beData.DefaultBasePriceList);
            cmd.Parameters.AddWithValue("@RoundingMethod", beData.RoundingMethod);
            cmd.Parameters.AddWithValue("@Active", beData.Active);
            cmd.Parameters.AddWithValue("@ValidFrom", beData.ValidFrom);
            cmd.Parameters.AddWithValue("@ValidTo", beData.ValidTo);
            cmd.Parameters.AddWithValue("@ForDebtorTypeIdColl", beData.ForDebtorTypeIdColl);
            cmd.Parameters.AddWithValue("@ForLedgerGroupIdColl", beData.ForLedgerGroupIdColl);
            cmd.Parameters.AddWithValue("@ForAreaIdColl", beData.ForAreaIdColl);
            cmd.Parameters.AddWithValue("@ForProvinceColl", beData.ForProvinceColl);
            cmd.Parameters.AddWithValue("@ForDistrictColl", beData.ForDistrictColl);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@PriceId", beData.PriceId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdatePrice";
            }
            else
            {
                cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddPrice";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[14].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[14].Value);

                if (!(cmd.Parameters[15].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[15].Value);

                if (!(cmd.Parameters[16].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[16].Value);

                if (!(cmd.Parameters[17].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[17].Value);

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

        public ResponeValues DeleteById(int UserId, int EntityId, int PriceId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@PriceId", PriceId);
            cmd.CommandText = "usp_DelPriceById";
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
        public Dynamic.BE.Account.PriceCollections getAllPrice(int UserId, int EntityId)
        {
            Dynamic.BE.Account.PriceCollections dataColl = new Dynamic.BE.Account.PriceCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllPrice";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Account.Price beData = new Dynamic.BE.Account.Price();
                    if (!(reader[0] is DBNull)) beData.PriceId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Factor = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) beData.DefaultBasePriceList = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.RoundingMethod = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.Active = Convert.ToBoolean(reader[5]);
                    if (!(reader[6] is DBNull)) beData.ValidFromMiti = Convert.ToString(reader[6]);
                    if (!(reader[7] is DBNull)) beData.ValidToMiti = Convert.ToString(reader[7]);
                    if (!(reader[8] is DBNull)) beData.ForDebtorTypeIdColl = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.ForLedgerGroupIdColl = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.ForAreaIdColl = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ForProvinceColl = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ForDistrictColl = reader.GetString(12);
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
        public Dynamic.BE.Account.Price getPriceById(int UserId, int EntityId, int PriceId)
        {
            Dynamic.BE.Account.Price beData = new Dynamic.BE.Account.Price();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@PriceId", PriceId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetPriceById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.Account.Price();
                    if (!(reader[0] is DBNull)) beData.PriceId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Factor = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) beData.DefaultBasePriceList = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.RoundingMethod = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.Active = Convert.ToBoolean(reader[5]);
                    if (!(reader[6] is DBNull)) beData.ValidFrom = Convert.ToDateTime(reader[6]);
                    if (!(reader[7] is DBNull)) beData.ValidTo = Convert.ToDateTime(reader[7]);
                    if (!(reader[8] is DBNull)) beData.ForDebtorTypeIdColl = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.ForLedgerGroupIdColl = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.ForAreaIdColl = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ForProvinceColl = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ForDistrictColl = reader.GetString(12);
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

