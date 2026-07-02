using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.DataAccess.Account
{
    public class CostCenterDepartmentDB : Dynamic.DataAccess.Common.CommonDB
    {
        Global.DataAccessLayer1 dal=null;
        public CostCenterDepartmentDB() { dal = new Global.DataAccessLayer1(); }
        public CostCenterDepartmentDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName,dbName);
        }

        /// <summary>
        /// Line no 36 to 37 Delete Child table Before Update
        /// Line no 77 to 81 Implement SaveCCDepartmentWisePayHeadLedger Method 
        /// </summary>
        /// <param name="beData"></param>
        /// <param name="isModify"></param>
        /// <returns></returns>
        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Account.CostCenterDepartment beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@CostCenterDepartmentId", beData.CostCenterDepartmentId);            
            cmd.Parameters.AddWithValue("@Code", beData.Code);
            cmd.Parameters.AddWithValue("@Alias", beData.Alias);
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@LedgerId",IsDBNull(beData.LedgerId));
            if (isModify)
            {
                cmd.CommandText = "delete from tbl_CostCenterDepartmentWisePayHeadLedger where CostCenterDepartmentId=@CostCenterDepartmentId";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "update tbl_CostCenterDepartment set LedgerId=@LedgerId, Code=@Code,Alias=@Alias,Name=@Name where CostCenterDepartmentId=@CostCenterDepartmentId ";
            }
            else
            {
                cmd.CommandText = "insert into tbl_CostCenterDepartment(LedgerId,Code,Alias,Name) values(@LedgerId,@Code,@Alias,@Name) ";
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
                        beData.CostCenterDepartmentId = Convert.ToInt32(lastId);
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
                    //beData.CostCenterDepartmentId = dal.GetInsertId(cmd,"tbl_CostCenterDepartment");                    
                    dal.CommitTransaction();
                }
                resVal.RId = beData.CostCenterDepartmentId;
                resVal.IsSuccess = true;
                if (resVal.IsSuccess)
                {
                    if (beData.CCDepartmentWisePayHeadLedgerColl != null)
                        SaveCCDepartmentWisePayHeadLedger(beData.CUserId,resVal.RId, beData.CCDepartmentWisePayHeadLedgerColl);
                }
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
        /// <summary>
        /// Create SaveCCDepartmentWisePayHeadLedger Method to save ledger according to DepartmentWisePayHeadLedger
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="CostCenterDepartmentId"></param>
        /// <param name="dataColl"></param>
        private void SaveCCDepartmentWisePayHeadLedger(int UserId, int CostCenterDepartmentId, Dynamic.BusinessEntity.Account.CCDepartmentWisePayHeadLedgerCollection dataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            foreach (var beData in dataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@CostCenterDepartmentId", CostCenterDepartmentId);
                cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
                cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_AddCostCenterDepartmentWisePayHeadLedger";
                cmd.ExecuteNonQuery();
            }
        }

        public ResponeValues Delete(Int32 CostCenterDepartmentId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@CostCenterDepartmentId", CostCenterDepartmentId);

            cmd.CommandText = "delete from tbl_CostCenterDepartment where CostCenterDepartmentId=@CostCenterDepartmentId ";

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
        public ResponeValues Delete(string CostCenterDepartmentId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_CostCenterDepartment where CostCenterDepartmentId in (" + CostCenterDepartmentId + ")";

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
      
        public Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections getAllCostCenterDepartment(int UserId)
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new BusinessEntity.Account.CostCenterDepartmentCollections();

            dal.OpenConnection();

            try
            {                
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllCostCenterDepartment";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int sno = 1;
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Account.CostCenterDepartment beData = new BusinessEntity.Account.CostCenterDepartment();
                    beData.SNo = sno;
                    if (!(reader[0] is System.DBNull)) beData.CostCenterDepartmentId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.LedgerId = reader.GetInt32(4);
                    if (!(reader[5] is System.DBNull)) beData.LedgerName = reader.GetString(5);
                    dataColl.Add(beData);
                    sno++;
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

        public Dynamic.BusinessEntity.Account.CostCenterDepartment getCostCenterDepartmentByRowNumber(long rowNum)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.AddWithValue("@RowNumber", rowNum);
                cmd.CommandText = "sp_GetCostCenterDepartmentRowWise";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Account.CostCenterDepartment beData = new BusinessEntity.Account.CostCenterDepartment();

                    if (!(reader[0] is System.DBNull)) beData.CostCenterDepartmentId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
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
        public Dynamic.BusinessEntity.Account.CostCenterDepartment getLastRowData(ref long count)
        {
            dal.OpenConnection();

            try
            {
                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select top 1 C.CostCenterDepartmentId,C.AutoNumber,C.Name,C.Code,C.Alias from tbl_CostCenterDepartment C order by C.CostCenterDepartmentId desc ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.Add("@RowNumber", System.Data.SqlDbType.Int);
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "sp_GetCostCenterDepartmentLastRow";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Account.CostCenterDepartment beData = new BusinessEntity.Account.CostCenterDepartment();

                    if (!(reader[0] is System.DBNull)) beData.CostCenterDepartmentId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    reader.Close();
                    //count = dal.GetTotalRows("tbl_CostCenterDepartment");
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
        /// <summary>
        /// Line no 358 Comment System.Data.CommandBehavior.SingleRow to get more then single row
        /// Line no 368 to 376 get DepartmentWisePayHeadLedger saved value According to CostCenterDepartmentId
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="CostCenterDepartmentId"></param>
        /// <returns></returns>
        public Dynamic.BusinessEntity.Account.CostCenterDepartment getCostCenterDepartmentById(int UserId, int CostCenterDepartmentId)
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartment beData = new BusinessEntity.Account.CostCenterDepartment();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@CostCenterDepartmentId", CostCenterDepartmentId);
                cmd.CommandText = "sp_GetCostCenterDepartmentById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(/*System.Data.CommandBehavior.SingleRow*/);
                if (reader.Read())
                {
                    beData = new BusinessEntity.Account.CostCenterDepartment();
                    if (!(reader[0] is System.DBNull)) beData.CostCenterDepartmentId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.LedgerId = reader.GetInt32(4);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Account.CCDepartmentWisePayHeadLedger det = new Dynamic.BusinessEntity.Account.CCDepartmentWisePayHeadLedger();
                    if (!(reader[0] is DBNull)) det.CostCenterDepartmentId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.PayHeadingId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.LedgerId = reader.GetInt32(2);
                    beData.CCDepartmentWisePayHeadLedgerColl.Add(det);
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
       
        public ResponeValues DeleteById(int CostCenterDepartmentId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_CostCenterDepartment where CostCenterDepartmentId=" + CostCenterDepartmentId.ToString();

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
    }
}
