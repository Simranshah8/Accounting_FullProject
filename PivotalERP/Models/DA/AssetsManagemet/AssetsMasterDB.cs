using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetsmasterDB
	{
		DataAccessLayer1 dal = null;
		public AssetsmasterDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.AssetManagement.Assetsmaster beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Alias", beData.Alias);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);
			cmd.Parameters.AddWithValue("@AssetGroupId", beData.AssetGroupId);
			cmd.Parameters.AddWithValue("@AssetTypeId", beData.AssetTypeId);
			cmd.Parameters.AddWithValue("@ModelId", beData.ModelId);
			cmd.Parameters.AddWithValue("@RackId", beData.RackId);
			cmd.Parameters.AddWithValue("@SerialNum", beData.SerialNum);
			cmd.Parameters.AddWithValue("@RAMId", beData.RAMId);
			cmd.Parameters.AddWithValue("@ROMId", beData.ROMId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@PurchaseRate", beData.PurchaseRate);
			cmd.Parameters.AddWithValue("@DepreciationRate", beData.DepreciationRate);
			cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
			cmd.Parameters.AddWithValue("@Notes", beData.Notes);
			cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
			cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);


			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetsmaster";
			}
			else
			{
				cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetsmaster";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[20].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[20].Value);

				if (!(cmd.Parameters[21].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[21].Value);

				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[23].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelAssetsmasterById";
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

		public BE.AssetManagement.AssetsmasterCollections getAllAssetsmaster(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetsmasterCollections dataColl = new BE.AssetManagement.AssetsmasterCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetsmaster";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.Assetsmaster beData = new BE.AssetManagement.Assetsmaster();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Photo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AssetGroupId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.AssetTypeId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ModelId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.RackId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.SerialNum = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.RAMId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.ROMId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.BranchId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.PurchaseRate = Convert.ToDouble(reader[13]);
					if (!(reader[14] is DBNull)) beData.DepreciationRate = Convert.ToDouble(reader[14]);
					if (!(reader[15] is DBNull)) beData.StatusId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.BranchName = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.RAMName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.RoMName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.StatusName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.RackName = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.AssetGroupName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.AssetTypeName = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.ModelName = reader.GetString(23);
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
		public BE.AssetManagement.Assetsmaster getAssetsmasterById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.Assetsmaster beData = new BE.AssetManagement.Assetsmaster();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetsmasterById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.Assetsmaster();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Photo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AssetGroupId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.AssetTypeId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ModelId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.RackId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.SerialNum = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.RAMId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.ROMId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.BranchId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.PurchaseRate = Convert.ToDouble(reader[13]);
					if (!(reader[14] is DBNull)) beData.DepreciationRate = Convert.ToDouble(reader[14]);
					if (!(reader[15] is DBNull)) beData.StatusId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.Notes = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.ProductId = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.UnitId = reader.GetInt32(18);

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


		public BE.AssetManagement.AssetsmasterCollections GetAllAssetsProduct(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetsmasterCollections dataColl = new BE.AssetManagement.AssetsmasterCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetsProduct";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.Assetsmaster beData = new BE.AssetManagement.Assetsmaster();
					if (!(reader[0] is DBNull)) beData.ProductId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					
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


		public ResponeValues GetAutoAssetsMasterCode(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@TranId", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoAssetsMasterCode";
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

