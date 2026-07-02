using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetIssueDB
	{
		DataAccessLayer1 dal = null;
		public AssetIssueDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.AssetIssue beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@IssueNo", beData.IssueNo);
			cmd.Parameters.AddWithValue("@IssueById", beData.IssueById);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@HODId", beData.HODId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@EUserId", beData.UserId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@BarCode", beData.BarCode);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@IsReturnable", beData.IsReturnable);
			cmd.Parameters.AddWithValue("@AssetReqNo", beData.AssetReqNo);
			cmd.Parameters.AddWithValue("@FYearId", beData.FYearId);
			cmd.Parameters.AddWithValue("@AutoVoucherNo ", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO  ", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo  ", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@VoucherId  ", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId  ", beData.CostClassId);
			cmd.Parameters.AddWithValue("@Attributes  ", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal  ", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetIssue";
			}
			else
			{
				cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetIssue";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[21].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[21].Value);

				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[23].Value);

				if (!(cmd.Parameters[24].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[24].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetsIssueDetailsDetails(beData.CUserId, resVal.RId, beData.AssetsIssueDetailsColl);
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
			cmd.CommandText = "usp_DelAssetIssueById";
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
		public BE.AssetManagement.AssetIssueCollections getAllAssetIssue(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetIssueCollections dataColl = new BE.AssetManagement.AssetIssueCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetIssue";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetIssue beData = new BE.AssetManagement.AssetIssue();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoManualNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.IssueById = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.HODId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BranchId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.BarCode = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Remarks = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsReturnable = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.IssueByName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IssueMitti = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.StaffName = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.BranchName = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.EmployeeCode = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.CUserName = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.FiscalYear = reader.GetString(17);
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
		private void SaveAssetsIssueDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetsIssueDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetsIssueDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
				cmd.Parameters.AddWithValue("@PurposeId", beData.PurposeId);
				cmd.Parameters.AddWithValue("@QTY", beData.QTY);
				cmd.Parameters.AddWithValue("@ReqFrom", beData.ReqFrom);
				cmd.Parameters.AddWithValue("@ReqTO", beData.ReqTO);
				cmd.Parameters.AddWithValue("@ReqDetailsId", beData.ReqDetailsId);
				cmd.Parameters.AddWithValue("@IssueRemakes", beData.IssueRemakes);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetsIssueDetailsDetails";
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
					cmd.CommandText = "usp_AssetIssueDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}

		public BE.AssetManagement.AssetIssue getAssetIssueById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetIssue beData = new BE.AssetManagement.AssetIssue();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetIssueById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetIssue();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.IssueNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.IssueById = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.HODId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BranchId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.BarCode = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Remarks = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsReturnable = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.AssetReqNo = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.ManualVoucherNO = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.AutoManualNo = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.VoucherId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.CostClassId = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.Attributes = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.UDFKeyVal = reader.GetString(18);
				}
				reader.NextResult();
				beData.AssetsIssueDetailsColl = new BE.AssetManagement.AssetsIssueDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetsIssueDetails det1 = new BE.AssetManagement.AssetsIssueDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.CategoryId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.PurposeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.QTY = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) det1.ReqFrom = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) det1.ReqTO = Convert.ToDateTime(reader[6]);
					if (!(reader[7] is DBNull)) det1.IssueDetId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) det1.ReqDetailsId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) det1.IssueRemakes = reader.GetString(9);
					if (!(reader[10] is DBNull)) det1.Particular = reader.GetString(10);
					if (!(reader[11] is DBNull)) det1.Category = reader.GetString(11);
					if (!(reader[12] is DBNull)) det1.Purpose = reader.GetString(12);
					beData.AssetsIssueDetailsColl.Add(det1);
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

		public ResponeValues GetAutoIssueNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@IssueNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoAssetsIssueNo";
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

		public BE.AssetManagement.AssetIssue GetAssetReqDetails(int UserId, int EntityId, int AssetReqNo)
		{
			BE.AssetManagement.AssetIssue beData = new BE.AssetManagement.AssetIssue();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AssetReqNo", AssetReqNo);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetReqDetInIssue";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetIssue();
					if (!(reader[0] is DBNull)) beData.AssetReqNo = reader.GetString(0);
					if (!(reader[1] is DBNull)) beData.IssueById = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.DepartmentId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.HODId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.UserId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.BranchId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BarCode = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.IssueNo = reader.GetInt32(8);
				}
				reader.NextResult();
				beData.AssetsIssueDetailsColl = new BE.AssetManagement.AssetsIssueDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetsIssueDetails det1 = new BE.AssetManagement.AssetsIssueDetails();
					if (!(reader[0] is DBNull)) det1.ParticularId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.CategoryId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.PurposeId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.QTY = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.ReqFrom = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) det1.ReqTO = Convert.ToDateTime(reader[5]);
					beData.AssetsIssueDetailsColl.Add(det1);
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
		public RE.AssetManagement.AssetIssueCollections GetPendingAssetsIssue(int UserId, string IssueNo, int? IssueBy, int? BranchId, int? DepartmentId, int? IssueUserId)
		{
			RE.AssetManagement.AssetIssueCollections dataColl = new RE.AssetManagement.AssetIssueCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@IssueNo", IssueNo);
			cmd.Parameters.AddWithValue("@IssueBy", IssueBy);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@IssueUserId", IssueUserId);
			cmd.CommandText = "usp_GetPendingAssetsIssue";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.AssetManagement.AssetIssue beData = new RE.AssetManagement.AssetIssue();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Particular = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.CategoryId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Category = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.PurposeId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Purpose = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.QTY = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.EntryDate = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.EntryDateBS = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IssueDays = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.VoucherNo = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IssueBy = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.IssueNo = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.IssueById = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.UserId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.DepartmentId = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.HODId = reader.GetInt32(17);
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

