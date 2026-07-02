using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetInwardDB
	{
		DataAccessLayer1 dal = null;
		public AssetInwardDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.AssetInward beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@InwardNo", beData.InwardNo);
			cmd.Parameters.AddWithValue("@InVoiceNo", beData.InVoiceNo);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@VendorId", beData.VendorId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@DocUrl", beData.DocUrl);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@FYearId", beData.FYearId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetInward";
			}
			else
			{
				cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetInward";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;

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
				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[13].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetInwardDetailsDetails(beData.CUserId, resVal.RId, beData.AssetInwardDetailsColl);
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
			cmd.CommandText = "usp_DelAssetInwardById";
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
		public BE.AssetManagement.AssetInwardCollections getAllAssetInward(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetInwardCollections dataColl = new BE.AssetManagement.AssetInwardCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetInward";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetInward beData = new BE.AssetManagement.AssetInward();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoManualNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.InVoiceNo = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.VendorId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.BranchId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.FiscalYear = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Remarks = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.InWardDateNepali = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.BranchName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Vendor = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.VoucherId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.CostClassId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.CUserName = reader.GetString(13);

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
					cmd.CommandText = "usp_AssetInwardDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}
		private void SaveAssetInwardDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetInwardDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetInwardDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@WarrantyDate", beData.WarrantyDate);
				cmd.Parameters.AddWithValue("@Qty", beData.Qty);
				cmd.Parameters.AddWithValue("@QtyRate", beData.QtyRate);
				cmd.Parameters.AddWithValue("@QtyDisAmt", beData.QtyDisAmt);
				cmd.Parameters.AddWithValue("@PRate", beData.PRate);
				cmd.Parameters.AddWithValue("@DisAmt", beData.DisAmt);
				cmd.Parameters.AddWithValue("@Amt", beData.Amt);
				cmd.Parameters.AddWithValue("@Status", beData.Status);
				cmd.Parameters.AddWithValue("@USno", beData.USno);

				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetInwardDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.AssetManagement.AssetInward getAssetInwardById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetInward beData = new BE.AssetManagement.AssetInward();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetInwardById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetInward();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.InwardNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.InVoiceNo = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.VendorId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.BranchId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.DocUrl = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Remarks = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.FYearId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.ManualVoucherNO = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.AutoManualNo = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.VoucherId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.CostClassId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.Attributes = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.UDFKeyVal = reader.GetString(15);
				}
				reader.NextResult();
				beData.AssetInwardDetailsColl = new BE.AssetManagement.AssetInwardDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetInwardDetails det1 = new BE.AssetManagement.AssetInwardDetails();
					if (!(reader[0] is DBNull)) det1.InwardId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.WarrantyDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) det1.Qty = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.QtyRate = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det1.QtyDisAmt = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det1.PRate = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) det1.DisAmt = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) det1.Amt = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) det1.Status = reader.GetInt32(9);
					beData.AssetInwardDetailsColl.Add(det1);
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

		public ResponeValues GetAutoInWardNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@InwardNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoAssetsInwardNo";
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

		public BE.AssetManagement.AssetInward getAssetClosingStock(int UserId, int? EntityId, int? TranId, int? BranchId,DateTime? VoucherDate)
		{
			BE.AssetManagement.AssetInward beData = new BE.AssetManagement.AssetInward();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@VoucherDate", VoucherDate);
			cmd.CommandText = "usp_GetAssetClosingStock";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetInward();
					if (!(reader[0] is DBNull)) beData.ClosingStock = Convert.ToDouble(reader[0]);
					//if (!(reader[1] is DBNull)) beData.InwardQty = Convert.ToDouble(reader[1]);
					//if (!(reader[2] is DBNull)) beData.OutwardQty = Convert.ToDouble(reader[2]);
					//if (!(reader[3] is DBNull)) beData.ClosingStock = Convert.ToDouble(reader[3]);
				
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

