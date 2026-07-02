using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{
	internal class AssetRequestDB
	{
		DataAccessLayer1 dal = null;
		public AssetRequestDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.AssetRequest beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AssetReqNo", beData.AssetReqNo);
			cmd.Parameters.AddWithValue("@RequestById", beData.RequestById);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@HODId", beData.HODId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@EUserId", beData.UserId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@BarCode", beData.BarCode);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@FYearId", beData.FYearId);


			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetRequest";
			}
			else
			{
				cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetRequest";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[13].Value);

				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[14].Value);

				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[15].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetsReqDetailsDetails(beData.CUserId, resVal.RId, beData.AssetsReqDetailsColl);
					SaveDocumentDet(beData.DocumentColl, resVal.RId, beData.CUserId);
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
			cmd.CommandText = "usp_DelAssetRequestById";
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
		public BE.AssetManagement.AssetRequestCollections getAllAssetRequest(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetRequestCollections dataColl = new BE.AssetManagement.AssetRequestCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetRequest";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetRequest beData = new BE.AssetManagement.AssetRequest();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoManualNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.RequestById = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.HODId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BranchId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.BarCode = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.RequestByName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.RequestMitti = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.StaffName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.BranchName = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.VoucherId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.CostClassId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.CUserName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.FiscalYear = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.EmployeeCode = reader.GetString(17);
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
		private void SaveAssetsReqDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetsReqDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetsReqDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
				cmd.Parameters.AddWithValue("@PurposeId", beData.PurposeId);
				cmd.Parameters.AddWithValue("@QTY", beData.QTY);
				cmd.Parameters.AddWithValue("@ReqFrom", beData.ReqFrom);
				cmd.Parameters.AddWithValue("@ReqTO", beData.ReqTO);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetsReqDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveDocumentDet(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int TranId, int UserId)
		{
			foreach (var beData in dataColl)
			{
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@docDescription", beData.Description);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@Document", beData.Data);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@TranId", TranId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_AssetRequestDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}
		public BE.AssetManagement.AssetRequest getAssetRequestById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetRequest beData = new BE.AssetManagement.AssetRequest();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetRequestById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetRequest();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AssetReqNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.RequestById = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.HODId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BranchId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.BarCode = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Remarks = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.FYearId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.ManualVoucherNO = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.AutoManualNo = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.VoucherId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.CostClassId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.Attributes = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.UDFKeyVal = reader.GetString(17);

				}
				reader.NextResult();
				beData.AssetsReqDetailsColl = new BE.AssetManagement.AssetsReqDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetsReqDetails det1 = new BE.AssetManagement.AssetsReqDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.CategoryId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.PurposeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.QTY = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) det1.ReqFrom = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) det1.ReqTO = Convert.ToDateTime(reader[6]);
					beData.AssetsReqDetailsColl.Add(det1);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det2 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det2.DocumentTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) det2.Description = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.Extension = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.DocPath = reader.GetString(4);
					beData.DocumentColl.Add(det2);
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

		public BE.AssetManagement.HODByDepartmentCollections GetHodListDepartmentWise(int UserId, int EntityId, int? DepartmentId)
		{
			BE.AssetManagement.HODByDepartmentCollections dataColl = new BE.AssetManagement.HODByDepartmentCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.CommandText = "usp_GetHodListDepartmentWise";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.HODByDepartment beData = new BE.AssetManagement.HODByDepartment();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.HODId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.UserId = reader.GetInt32(4);

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

		public ResponeValues GetAutoNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@AssetReqNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoAssetsReqNo";
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);
				resVal.IsSuccess = true;
				resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

		public RE.AssetManagement.AssetsRequestCollections GetPendingAssetsRequest(int UserId, string RequestNo, int? RequestBy, int? BranchId, int? DepartmentId, int? RequestUserId)
		{
			RE.AssetManagement.AssetsRequestCollections dataColl = new RE.AssetManagement.AssetsRequestCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@RequestNo", RequestNo);
			cmd.Parameters.AddWithValue("@RequestBy", RequestBy);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@RequestUserId", RequestUserId);
			cmd.CommandText = "usp_GetPendingAssetsRequest";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.AssetManagement.AssetsRequest beData = new RE.AssetManagement.AssetsRequest();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Particular = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.CategoryId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Category = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.PurposeId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Purpose = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.QTY = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.ReqFrom = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.ReqFromBS = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ReqTo = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.ReqToBS = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.EntryDate = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.EntryDateBS = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.ReqDays = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.VoucherNo = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.RequestBy = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.AssetReqNo = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.RequestById = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.UserId = reader.GetInt32(19);
					if (!(reader[20] is DBNull)) beData.DepartmentId = reader.GetInt32(20);
					if (!(reader[21] is DBNull)) beData.HODId = reader.GetInt32(21);
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

