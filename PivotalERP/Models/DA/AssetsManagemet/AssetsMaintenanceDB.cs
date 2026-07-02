using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.AssetsManagemet
{
    internal class AssetsMaintenanceDB
    {
        DataAccessLayer1 dal = null;
        public AssetsMaintenanceDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public BE.AssetsManagemet.AssetsByEmpCollections GetAssetsByEmp(int UserId, int? UsersId, bool IsEmpNeed, int? BranchId)
        {
            BE.AssetsManagemet.AssetsByEmpCollections dataColl = new BE.AssetsManagemet.AssetsByEmpCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.Parameters.AddWithValue("@IsEmpNeed", IsEmpNeed);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.CommandText = "usp_GetAssetsByEmp";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.AssetsManagemet.AssetsByEmp beData = new BE.AssetsManagemet.AssetsByEmp();
                    if (!(reader[0] is DBNull)) beData.ParticularId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Particular = reader.GetString(1);
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

        public ResponeValues SaveUpdate(BE.AssetsManagemet.AssetsMaintenance beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
            cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
            cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
            cmd.Parameters.AddWithValue("@IsEmployeeNeeded", beData.IsEmployeeNeeded);
            cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
            cmd.Parameters.AddWithValue("@AssetsNameId", beData.AssetsNameId);
            cmd.Parameters.AddWithValue("@IsChildNeeded", beData.IsChildNeeded);
            cmd.Parameters.AddWithValue("@MaintenanceReason", beData.MaintenanceReason);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateAssetsMaintenance";
            }
            else
            {
                cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddAssetsMaintenance";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[11].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[11].Value);

                if (!(cmd.Parameters[12].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[12].Value);

                if (!(cmd.Parameters[13].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[13].Value);

                if (!(cmd.Parameters[14].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[14].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.RId > 0 && resVal.IsSuccess)
                {
                    SaveAssetMaintenanceDetailsDetails(beData.CUserId, resVal.RId, beData.AssetMaintenanceDetailsColl);
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

        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_DelAssetsMaintenanceById";
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
        public BE.AssetsManagemet.AssetsMaintenanceCollections getAllAssetsMaintenance(int UserId, int EntityId)
        {
            BE.AssetsManagemet.AssetsMaintenanceCollections dataColl = new BE.AssetsManagemet.AssetsMaintenanceCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllAssetsMaintenance";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.AssetsManagemet.AssetsMaintenance beData = new BE.AssetsManagemet.AssetsMaintenance();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.VoucherId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.CostClassId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is DBNull)) beData.IsEmployeeNeeded = Convert.ToBoolean(reader[5]);
                    if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.AssetsNameId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.IsChildNeeded = Convert.ToBoolean(reader[8]);
                    if (!(reader[9] is DBNull)) beData.MaintenanceReason = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.EmployeeName = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.EmployeeCode = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.Branch = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.CostClass = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.AssetsName = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.VoucherDateBS = reader.GetString(15);
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
        private void SaveAssetMaintenanceDetailsDetails(int UserId, int TranId, BE.AssetsManagemet.AssetMaintenanceDetailsCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
                return;

            foreach (BE.AssetsManagemet.AssetMaintenanceDetails beData in beDataColl)
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@ParticularsId", beData.ParticularsId);
                cmd.Parameters.AddWithValue("@Qty", beData.Qty);
                cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_AddAssetMaintenanceDetailsDetails";
                cmd.ExecuteNonQuery();
            }
        }

        public BE.AssetsManagemet.AssetsMaintenance getAssetsMaintenanceById(int UserId, int EntityId, int TranId)
        {
            BE.AssetsManagemet.AssetsMaintenance beData = new BE.AssetsManagemet.AssetsMaintenance();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAssetsMaintenanceById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.AssetsManagemet.AssetsMaintenance();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.VoucherId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.CostClassId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is DBNull)) beData.IsEmployeeNeeded = Convert.ToBoolean(reader[5]);
                    if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.AssetsNameId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.IsChildNeeded = Convert.ToBoolean(reader[8]);
                    if (!(reader[9] is DBNull)) beData.MaintenanceReason = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Department = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.BranchName = reader.GetString(11);
                }
                reader.NextResult();
                beData.AssetMaintenanceDetailsColl = new BE.AssetsManagemet.AssetMaintenanceDetailsCollections();
                while (reader.Read())
                {
                    BE.AssetsManagemet.AssetMaintenanceDetails det1 = new BE.AssetsManagemet.AssetMaintenanceDetails();
                    if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.ParticularsId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det1.Qty = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det1.Remarks = reader.GetString(3);
                    beData.AssetMaintenanceDetailsColl.Add(det1);
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