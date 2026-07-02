using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class RepairedInwardDB
	{
		DataAccessLayer1 dal = null;
		public RepairedInwardDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.RepairedInward beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@RepairedNo", beData.RepairedNo);
			cmd.Parameters.AddWithValue("@RefNo", beData.RefNo);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@OutsideLocation", beData.OutsideLocation);
			cmd.Parameters.AddWithValue("@VendorId", beData.VendorId);
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@Remark", beData.Remark);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateRepairedInward";
			}
			else
			{
				cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddRepairedInward";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[19].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveRepairedInwardDetailsDetails(beData.CUserId, resVal.RId, beData.RepairedInwardDetailsColl);
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
			cmd.CommandText = "usp_DelRepairedInwardById";
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
		public BE.AssetManagement.RepairedInwardCollections getAllRepairedInward(int UserId, int EntityId)
		{
			BE.AssetManagement.RepairedInwardCollections dataColl = new BE.AssetManagement.RepairedInwardCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllRepairedInward";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.RepairedInward beData = new BE.AssetManagement.RepairedInward();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.RepairedNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.RefNo = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.OutsideLocation = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.VendorId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.ManualVoucherNO = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.AutoManualNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.VoucherId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.CostClassId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.Attributes = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.UDFKeyVal = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Remark = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.EmployeeName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.EmployeeCode = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.VoucherMitti = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.BranchName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.CUserName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.FiscalYear = reader.GetString(20);
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
		private void SaveRepairedInwardDetailsDetails(int UserId, int TranId, BE.AssetManagement.RepairedInwardDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.RepairedInwardDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@QTY", beData.QTY);
				cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
				cmd.Parameters.AddWithValue("@RequiredInDate", beData.RequiredInDate);
				cmd.Parameters.AddWithValue("@Amount", beData.Amount);
				cmd.Parameters.AddWithValue("@DamageDetId", beData.DamageDetId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddRepairedInwardDetailsDetails";
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
					cmd.CommandText = "usp_AddRepairedInwardAttDetails";
					cmd.ExecuteNonQuery();

				}

			}
		}

		public BE.AssetManagement.RepairedInward getRepairedInwardById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.RepairedInward beData = new BE.AssetManagement.RepairedInward();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetRepairedInwardById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.RepairedInward();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.RepairedNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.RefNo = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.OutsideLocation = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.VendorId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.ManualVoucherNO = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.AutoManualNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.VoucherId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.CostClassId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.Attributes = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.UDFKeyVal = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Remark = reader.GetString(14);
				}
				reader.NextResult();
				beData.RepairedInwardDetailsColl = new BE.AssetManagement.RepairedInwardDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.RepairedInwardDetails det1 = new BE.AssetManagement.RepairedInwardDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.QTY = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.StatusId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.RequiredInDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) det1.Amount = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det1.DamageDetId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) det1.Particular = reader.GetString(7);
					beData.RepairedInwardDetailsColl.Add(det1);
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

		public ResponeValues GetAutoRepairedNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@RepairedNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoRepairedNo";
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
	}

}

