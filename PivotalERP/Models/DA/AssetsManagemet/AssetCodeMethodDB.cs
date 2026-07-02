using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement
{

	internal class AssetCodeMethodDB
	{
		DataAccessLayer1 dal = null;

		public AssetCodeMethodDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AssetManagement.AssetCodeMethod beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@NumberingMethod", beData.NumberingMethod);
			cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@AssetTypeId", beData.AssetTypeId);
			cmd.Parameters.AddWithValue("@AssetCategoryId", beData.AssetCategoryId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@Prefix", beData.Prefix);
			cmd.Parameters.AddWithValue("@Suffix", beData.Suffix);
			cmd.Parameters.AddWithValue("@StartNo", beData.StartNo);
			cmd.Parameters.AddWithValue("@PadWidth", beData.PadWidth);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssetCodeMethod";
			}
			else
			{
				cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssetCodeMethod";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
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
			cmd.CommandText = "usp_DelAssetCodeMethodById";
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
		public BE.AssetManagement.AssetCodeMethodCollections getAllAssetCodeMethod(int UserId, int EntityId)
		{
			BE.AssetManagement.AssetCodeMethodCollections dataColl = new BE.AssetManagement.AssetCodeMethodCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAssetCodeMethod";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AssetManagement.AssetCodeMethod beData = new BE.AssetManagement.AssetCodeMethod();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.NumberingMethod = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.CompanyId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.AssetTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.AssetCategoryId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.CostClassId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Prefix = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Suffix = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.StartNo = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.PadWidth = reader.GetInt32(10);
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
		public BE.AssetManagement.AssetCodeMethod getAssetCodeMethodById(int UserId, int EntityId, int TranId)
		{
			BE.AssetManagement.AssetCodeMethod beData = new BE.AssetManagement.AssetCodeMethod();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAssetCodeMethodById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AssetManagement.AssetCodeMethod();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.NumberingMethod = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.CompanyId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.AssetTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.AssetCategoryId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.CostClassId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Prefix = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Suffix = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.StartNo = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.PadWidth = reader.GetInt32(10);
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

