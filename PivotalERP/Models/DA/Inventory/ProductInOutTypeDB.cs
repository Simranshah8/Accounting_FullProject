using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.DataAccess.Inventory
{
    public class ProductInOutTypeDB : Dynamic.DataAccess.Common.CommonDB
    {
        Global.DataAccessLayer1 dal = null;
        public ProductInOutTypeDB() { dal = new Global.DataAccessLayer1(); }
        public ProductInOutTypeDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Inventory.ProductInOutType beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@InOutTypeId", beData.InOutTypeId);
            cmd.Parameters.AddWithValue("@SNo", getSNo());
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@Code", beData.Code); 

            if (isModify)
            { 
                cmd.CommandText = "update tbl_ProductInOutType set  Name=@Name,Code=@Code,SNo=@SNo where InOutTypeId=@InOutTypeId ";
            }
            else
            {
                cmd.CommandText = "insert into tbl_ProductInOutType(Name,Code,SNo) values(@Name,@Code,@SNo) ";
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
                        beData.InOutTypeId = Convert.ToInt32(lastId);
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
                }
                else
                {
                   // beData.InOutTypeId = dal.GetInsertId(cmd, "tbl_ProductInOutType");               
                    dal.CommitTransaction();
                }
                resVal.RId = beData.InOutTypeId;
                resVal.IsSuccess = true;
                resVal.ResponseMSG = (isModify ? GLOBALMSG.UPDATE_SUCCESS : GLOBALMSG.SAVE_SUCCESS);
            }
            catch (System.Data.SqlClient.SqlException ee)
            {

                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                switch (ee.Number)
                {
                    case 547:
                        resVal.ResponseMSG = GetForeignKeyError(ee.Message, dal.Connection);
                        break;
                    case 2627:
                        resVal.ResponseMSG = GetDuplicateError(ee.Message);
                        break;
                    default:
                        resVal.ResponseMSG = ee.Message;
                        break;
                }
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
      
        public ResponeValues Delete(Int32 InOutTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@InOutTypeId", InOutTypeId);

            cmd.CommandText = "delete from tbl_ProductInOutType where InOutTypeId=@InOutTypeId ";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;
            }
            catch (System.Data.SqlClient.SqlException sqlEX)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                switch (sqlEX.Number)
                {
                    case 547:
                        string tableName = GetTableNameFromError(sqlEX.Message);
                        resVal.ResponseMSG = $"Error: This record is in use and cannot be deleted because it is referenced in the '{tableName}'.";
                        break;
                    default:
                        resVal.ResponseMSG = sqlEX.Message;
                        break;
                }

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
        public ResponeValues Delete(string InOutTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_ProductInOutType where InOutTypeId in (" + InOutTypeId + ")";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

            }
            catch (System.Data.SqlClient.SqlException sqlEX)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                switch (sqlEX.Number)
                {
                    case 547:
                        string tableName = GetTableNameFromError(sqlEX.Message);
                        resVal.ResponseMSG = $"Error: This record is in use and cannot be deleted because it is referenced in the '{tableName}'.";
                        break;
                    default:
                        resVal.ResponseMSG = sqlEX.Message;
                        break;
                }

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
            cmd.CommandText = "select isnull(max(SNo),0)+1 from tbl_ProductInOutType(nolock) ";

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
            cmd.CommandText = "select isnull(max(SNo),0)+1 from tbl_ProductInOutType ";

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

        public Dynamic.BusinessEntity.Inventory.ProductInOutTypeCollections getAllProductInOutType(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductInOutTypeCollections dataColl = new BusinessEntity.Inventory.ProductInOutTypeCollections();

            dal.OpenConnection();

            try
            {
                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select U.InOutTypeId,U.AutoNumber,U.Name,U.Alias,U.IsServiceType from TBL_ProductInOutType U ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllProductInOutType";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductInOutType beData = new BusinessEntity.Inventory.ProductInOutType();
                    if (!(reader[0] is System.DBNull)) beData.InOutTypeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);
                    
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

        public Dynamic.BusinessEntity.Inventory.ProductInOutType getProductInOutTypeByRowNumber(long rowNum)
        {
            dal.OpenConnection();

            try
            {
     
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.AddWithValue("@RowNumber", rowNum);
                cmd.CommandText = "sp_GetProductInOutTypeRowWise";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductInOutType beData = new BusinessEntity.Inventory.ProductInOutType();
                    if (!(reader[0] is System.DBNull)) beData.InOutTypeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);

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
        public Dynamic.BusinessEntity.Inventory.ProductInOutType getLastRowData(ref long count)
        {
            dal.OpenConnection();

            try
            {
                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select top 1 U.InOutTypeId,U.AutoNumber,U.Name,U.Alias,U.IsServiceType from TBL_ProductInOutType U order by U.InOutTypeId desc ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.Add("@RowNumber", System.Data.SqlDbType.Int);
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "sp_GetProductInOutTypeLastRow";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductInOutType beData = new BusinessEntity.Inventory.ProductInOutType();
                    if (!(reader[0] is System.DBNull)) beData.InOutTypeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);
                    reader.Close();
                    //count = dal.GetTotalRows("tbl_ProductInOutType");
                    count = Convert.ToInt32(cmd.Parameters[1].Value);
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
        public Dynamic.BusinessEntity.Inventory.ProductInOutType getProductInOutTypeById(int UserId, int InOutTypeId)
        {
            Dynamic.BusinessEntity.Inventory.ProductInOutType beData = new BusinessEntity.Inventory.ProductInOutType();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@InOutTypeId", InOutTypeId);
                cmd.CommandText = "sp_GetProductInOutTypeById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    beData = new BusinessEntity.Inventory.ProductInOutType();
                    if (!(reader[0] is System.DBNull)) beData.InOutTypeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);
                    beData.IsSuccess = true;
                    beData.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    beData.IsSuccess = false;
                    beData.ResponseMSG = "No Data Found";
                }

                reader.Close();
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
