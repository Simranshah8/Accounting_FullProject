using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.DA
{
    public class ProductInOutTypeDB
    {
        DataAccessLayer1 dal { get; set; }
        public ProductInOutTypeDB(string hostname, string dbname)
        {
            dal = new DataAccessLayer1(hostname, dbname);
        }

        public BE.ProductInOutTypeCollection GetAllProductInOutType(int EntityId, int UserId)
        {
            BE.ProductInOutTypeCollection beDataColl = new BE.ProductInOutTypeCollection();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_GetAllTransactionType";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.ProductInOutType beData = new BE.ProductInOutType();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.IsActive = reader.GetBoolean(3);
                    if (!(reader[4] is DBNull)) beData.BDId = reader.GetInt32(4);
                    beDataColl.Add(beData);
                }
                reader.Close();
                beDataColl.IsSuccess = true;
                beDataColl.ResponseMSG = "ProductInOutType list Retrieved successfully.";
            }
            catch(System.Data.SqlClient.SqlException ex)
            {
                beDataColl.IsSuccess = false;
                beDataColl.ResponseMSG = ex.Message;
            }
            catch(Exception ex)
            {
                beDataColl.IsSuccess = false;
                beDataColl.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beDataColl;
        }

        public ResponeValues SaveUpdateProductInOutType(BE.ProductInOutType beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@Code", beData.Code);
            cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
            cmd.Parameters.AddWithValue("@BDId", beData.BDId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            if (IsModify)
            {
                cmd.CommandText = "usp_UpdateTransactionType";
            }
            else
            {
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddTransactionType ";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);
                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[7].Value);
                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[8].Value);
                if (!(cmd.Parameters[9].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[9].Value);
                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = "Failed " + "(" + resVal.ErrorNumber.ToString() + ")";
            }
            catch(System.Data.SqlClient.SqlException ex)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            catch(Exception ex)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

        public ResponeValues DeleteProductInOutType(int EntityId, int UserId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_DeleteTransactionType";
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
                    resVal.ResponseMSG = "Failed " + "(" + resVal.ErrorNumber.ToString() + ")";
            }
            catch(System.Data.SqlClient.SqlException ex)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            catch(Exception ex)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

        public BE.ProductInOutType GetProductInOutTypeById(int EntityId, int UserId, int TranId)
        {
            BE.ProductInOutType beData = new BE.ProductInOutType();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetTransactionoTypeById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    if (!(reader[0]is DBNull))
                        beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull))
                        beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull))
                        beData.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull))
                        beData.IsActive = reader.GetBoolean(3);
                    if (!(reader[4] is DBNull))
                        beData.BDId = reader.GetInt32(4);
                }
                reader.Close();
                beData.IsSuccess = true;
                beData.ResponseMSG = "ProductInOutType retrieved successfully.";
            }
            catch(System.Data.SqlClient.SqlException ex)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ex.Message;
            }
            catch(Exception ex)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beData;

        }
    }
}