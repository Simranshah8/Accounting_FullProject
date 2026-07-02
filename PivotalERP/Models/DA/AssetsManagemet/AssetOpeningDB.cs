using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetOpeningDB
	{
		DataAccessLayer1 dal = null;

		public AssetOpeningDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.AssetOpening beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@OpeningNo", beData.OpeningNo);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@FYearId", beData.FYearId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
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
				cmd.CommandText = "usp_UpdateAssetOpening";
			}
			else
			{
				cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetOpening";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[14].Value);

				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[15].Value);

				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[17].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAssetOpeningDetailsDetails(beData.CUserId, resVal.RId, beData.AssetOpeningDetailsColl);
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
			cmd.CommandText = "usp_DelAssetOpeningById";
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
		public BE.AssetManagement.AssetOpeningCollections getAllAssetOpening(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetOpeningCollections dataColl = new BE.AssetManagement.AssetOpeningCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetOpening";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetOpening beData = new BE.AssetManagement.AssetOpening();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.OpeningNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.BranchId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.FYearId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.Remarks = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.OpeningMiti = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.BranchName = reader.GetString(7);
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
		private void SaveAssetOpeningDetailsDetails(int UserId, int TranId, BE.AssetManagement.AssetOpeningDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.AssetManagement.AssetOpeningDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ParticularId", beData.ParticularId);
				cmd.Parameters.AddWithValue("@Qty", beData.Qty);
				cmd.Parameters.AddWithValue("@Rate", beData.Rate);
				cmd.Parameters.AddWithValue("@Amt", beData.Amt);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAssetOpeningDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.AssetManagement.AssetOpening getAssetOpeningById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetOpening beData = new BE.AssetManagement.AssetOpening();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetOpeningById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetOpening();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.OpeningNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.BranchId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.FYearId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.Remarks = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ManualVoucherNO = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.AutoManualNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.VoucherId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.CostClassId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Attributes = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.UDFKeyVal = reader.GetString(12);
				}
				reader.NextResult();
				beData.AssetOpeningDetailsColl = new BE.AssetManagement.AssetOpeningDetailsCollections();
				while (reader.Read())
				{
					BE.AssetManagement.AssetOpeningDetails det1 = new BE.AssetManagement.AssetOpeningDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ParticularId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.Qty = Convert.ToDouble(reader[2]);
					if (!(reader[3] is DBNull)) det1.Rate = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.Amt = Convert.ToDouble(reader[4]);
					beData.AssetOpeningDetailsColl.Add(det1);
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

		
		public BE.AssetManagement.AssetOpening GetAssetOpeningByBranch(int UserId, int EntityId, int TranId, int BranchId)
		{
			BE.AssetManagement.AssetOpening beData = new BE.AssetManagement.AssetOpening();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.CommandText = "usp_GetAssetOpeningByBranch";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetOpening();
					if (!(reader[0] is DBNull)) beData.QTY = Convert.ToDouble(reader[0]);
					if (!(reader[1] is DBNull)) beData.Rate = Convert.ToDouble(reader[1]);
					if (!(reader[2] is DBNull)) beData.Amt = Convert.ToDouble(reader[2]);

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

		public RE.AssetManagement.Report.AssetsOpeningListCollections GetAssetsOpeningList(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo)
		{
			RE.AssetManagement.Report.AssetsOpeningListCollections dataColl = new RE.AssetManagement.Report.AssetsOpeningListCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
			cmd.Parameters.AddWithValue("@DateTo", DateTo);
			cmd.CommandText = "usp_GetAllAssetOpeningList";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.AssetManagement.Report.AssetsOpeningList beData = new RE.AssetManagement.Report.AssetsOpeningList();
					if (!(reader[0] is DBNull)) beData.OpeningMiti = reader.GetString(0);
					if (!(reader[1] is DBNull)) beData.BranchName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.ParticularName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Alias = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.SerialNum = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.GroupName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.TypeName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.ModelName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Qty = Convert.ToDouble(reader[9]);
					if (!(reader[10] is DBNull)) beData.Rate = Convert.ToDouble(reader[10]);
					if (!(reader[11] is DBNull)) beData.Amt = Convert.ToDouble(reader[11]);
					if (!(reader[12] is DBNull)) beData.FiscalYear = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.CreatedBy = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[14]);


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

