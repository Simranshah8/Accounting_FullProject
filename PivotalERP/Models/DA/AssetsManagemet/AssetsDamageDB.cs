using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetdamageDB
	{
		DataAccessLayer1 dal = null;
		public AssetdamageDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.AssetManagement.Assetdamage beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ReturnNo", beData.ReturnNo);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@Remark", beData.Remark);
			cmd.Parameters.AddWithValue("@OutLocation", beData.OutLocation);
			cmd.Parameters.AddWithValue("@IsOutsideRequired", beData.IsOutsideRequired);
			cmd.Parameters.AddWithValue("@VendorId", beData.VendorId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetdamage";
			}
			else
			{
				cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetdamage";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;

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
				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[9].Value);

				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[10].Value);

				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[12].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetdamageDetailsDetails(beData.CUserId, resVal.RId, beData.AssetdamageDetailsColl);
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
			cmd.CommandText = "usp_DelAssetdamageById";
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
		public BE.AssetManagement.AssetdamageCollections getAllAssetdamage(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetdamageCollections dataColl = new BE.AssetManagement.AssetdamageCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetdamage";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.Assetdamage beData = new BE.AssetManagement.Assetdamage();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoManualNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Remark = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.DamageMitti = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BranchName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.PartyName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.PartyCode = reader.GetString(8);
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
		private void SaveAssetdamageDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetdamageDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetdamageDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@Qty", beData.Qty);
				cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetdamageDetailsDetails";
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
					cmd.CommandText = "usp_AssetDamageDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}

		public BE.AssetManagement.Assetdamage getAssetdamageById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.Assetdamage beData = new BE.AssetManagement.Assetdamage();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetdamageById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.Assetdamage();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ReturnNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Remark = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.OutLocation = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.IsOutsideRequired = reader.GetBoolean(6);
					if (!(reader[7] is DBNull)) beData.VendorId = reader.GetInt32(7);

					if (!(reader[8] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.ManualVoucherNO = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.AutoManualNo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.VoucherId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.CostClassId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Attributes = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.UDFKeyVal = reader.GetString(14);
				}
				reader.NextResult();
				beData.AssetdamageDetailsColl = new BE.AssetManagement.AssetdamageDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetdamageDetails det1 = new BE.AssetManagement.AssetdamageDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.Qty = Convert.ToDouble(reader[2]);
					if (!(reader[3] is DBNull)) det1.StatusId = reader.GetInt32(3);
					beData.AssetdamageDetailsColl.Add(det1);
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
		public ResponeValues GetAutoDamageNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@ReturnNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoDamageNo";
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

		public RE.AssetManagement.AssetsDamageCollections GetPendingDamageDetails(int UserId, int? VendorId)
		{
			RE.AssetManagement.AssetsDamageCollections dataColl = new RE.AssetManagement.AssetsDamageCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@VendorId", VendorId);
			cmd.CommandText = "usp_GetPendingDamageDetails";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.AssetManagement.AssetsDamage beData = new RE.AssetManagement.AssetsDamage();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ReturnNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.IsOutsideRequired = Convert.ToBoolean(reader[2]);
					if (!(reader[3] is DBNull)) beData.VendorId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.OutLocation = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.EntryDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.EntryMitti = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.DamageDays = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.DamageDetId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.ParticularId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.Particular = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Qty = Convert.ToDouble(reader[11]);
					if (!(reader[12] is DBNull)) beData.StatusId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Status = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.CreateBy = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.Remark = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.VoucherNo = reader.GetString(16);
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

