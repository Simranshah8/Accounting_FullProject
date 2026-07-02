using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetTransferDB
	{
		DataAccessLayer1 dal = null;
		public AssetTransferDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.AssetManagement.AssetTransfer beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TransferNo", beData.TransferNo);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@FromBranchId", beData.FromBranchId);
			cmd.Parameters.AddWithValue("@ToBranchId", beData.ToBranchId);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@FYearId", beData.FYearId);
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetTransfer";
			}
			else
			{
				cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetTransfer";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[15].Value);

				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[18].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetTransferDetailsDetails(beData.CUserId, resVal.RId, beData.AssetTransferDetailsColl);
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
			cmd.CommandText = "usp_DelAssetTransferById";
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
		public BE.AssetManagement.AssetTransferCollections getAllAssetTransfer(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetTransferCollections dataColl = new BE.AssetManagement.AssetTransferCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetTransfer";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetTransfer beData = new BE.AssetManagement.AssetTransfer();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoManualNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.FromBranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ToBranchId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Remarks = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.TransferMitti = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.ToBranchName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.FromBranchName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.CUserName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.FiscalYear = reader.GetString(10);


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
		private void SaveAssetTransferDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetTransferDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetTransferDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@Qty", beData.Qty);
				cmd.Parameters.AddWithValue("@Rate", beData.Rate);
				cmd.Parameters.AddWithValue("@Amount", beData.Amount);
				cmd.Parameters.AddWithValue("@UserId", TranId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetTransferDetailsDetails";
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
					cmd.CommandText = "usp_AssetTransferDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}

		public BE.AssetManagement.AssetTransfer getAssetTransferById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetTransfer beData = new BE.AssetManagement.AssetTransfer();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetTransferById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetTransfer();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TransferNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.FromBranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ToBranchId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Remarks = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.FYearId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.ManualVoucherNO = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.AutoManualNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.VoucherId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.CostClassId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.Attributes = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.UDFKeyVal = reader.GetString(13);

				}
				reader.NextResult();
				beData.AssetTransferDetailsColl = new BE.AssetManagement.AssetTransferDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetTransferDetails det1 = new BE.AssetManagement.AssetTransferDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.Qty = Convert.ToDouble(reader[2]);
					if (!(reader[3] is DBNull)) det1.Rate = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.Amount = Convert.ToDouble(reader[4]);
					beData.AssetTransferDetailsColl.Add(det1);
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

		public ResponeValues GetAutoTransferNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@TransferNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoTransferNo";
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






		public BE.AssetManagement.ParticularByBranchCollections getParticularByBranch(int UserId, int EntityId, int FromBranchId)
		{
			BE.AssetManagement.ParticularByBranchCollections dataColl = new BE.AssetManagement.ParticularByBranchCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@FromBranchId", FromBranchId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllParticularByBranch";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.ParticularByBranch beData = new BE.AssetManagement.ParticularByBranch();
					if (!(reader[0] is DBNull)) beData.InwardId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VendorId = reader.GetInt32(2); ;
					if (!(reader[3] is DBNull)) beData.ParticularId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.PRate = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) beData.ParticularName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Code = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.SerialNum = reader.GetString(7);

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

