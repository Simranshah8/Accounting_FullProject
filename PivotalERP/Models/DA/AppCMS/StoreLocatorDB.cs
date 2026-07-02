using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AppCMS
{

	internal class StoreLocatorDB
	{
		DataAccessLayer1 dal = null;
		public StoreLocatorDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AppCMS.StoreLocator beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@StoreName", beData.StoreName);
			cmd.Parameters.AddWithValue("@CountryName", beData.CountryName);
			cmd.Parameters.AddWithValue("@CityName", beData.CityName);
			cmd.Parameters.AddWithValue("@Location", beData.Location);
			cmd.Parameters.AddWithValue("@Address", beData.Address);
			cmd.Parameters.AddWithValue("@PhoneNo", beData.PhoneNo);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);
			cmd.Parameters.AddWithValue("@OpeningTime", beData.OpeningTime);
			cmd.Parameters.AddWithValue("@ClosingTime", beData.ClosingTime);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@StoreId", beData.StoreId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateStoreLocator";
			}
			else
			{
				cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddStoreLocator";
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

		public ResponeValues DeleteById(int UserId, int EntityId, int StoreId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@StoreId", StoreId);
			cmd.CommandText = "usp_DelStoreLocatorById";
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
		public BE.AppCMS.StoreLocatorCollections getAllStoreLocator(int UserId, int EntityId)
		{
			BE.AppCMS.StoreLocatorCollections dataColl = new BE.AppCMS.StoreLocatorCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllStoreLocator";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AppCMS.StoreLocator beData = new BE.AppCMS.StoreLocator();
					if (!(reader[0] is DBNull)) beData.StoreId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.StoreName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.CountryName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.CityName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Location = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Address = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PhoneNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Photo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.OpeningTime = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.ClosingTime = Convert.ToDateTime(reader[9]);
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
		public BE.AppCMS.StoreLocator getStoreLocatorById(int UserId, int EntityId, int StoreId)
		{
			BE.AppCMS.StoreLocator beData = new BE.AppCMS.StoreLocator();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@StoreId", StoreId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetStoreLocatorById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AppCMS.StoreLocator();
					if (!(reader[0] is DBNull)) beData.StoreId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.StoreName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.CountryName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.CityName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Location = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Address = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PhoneNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Photo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.OpeningTime = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.ClosingTime = Convert.ToDateTime(reader[9]);
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

