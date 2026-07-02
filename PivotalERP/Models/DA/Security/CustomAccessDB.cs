using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Security
{

	internal class CustomAccessDB
	{

		DataAccessLayer1 dal = null;

		public CustomAccessDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		public ResponeValues SaveUpdate(int UserId, List<BE.Security.CustomAccess> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			try
			{
				foreach (var beData in dataColl)
				{
					cmd.Parameters.Clear();
					cmd.CommandText = "usp_AddCustomAccess";
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@ModuleId", beData.ModuleId);
					cmd.Parameters.AddWithValue("@EntityIds", beData.EntityIds);
					cmd.Parameters.AddWithValue("@AccessName", beData.AccessName);
					cmd.Parameters.AddWithValue("@UserIds", beData.UserId);
					cmd.Parameters.AddWithValue("@GroupId", beData.GroupId);
					cmd.Parameters.AddWithValue("@AutoNumber", beData.AutoNumber);
					cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
					cmd.Parameters.AddWithValue("@TranId", beData.TranId);

					cmd.Parameters.AddWithValue("@UserId", UserId);
					// Output parameters
					cmd.Parameters.Add("@ResponseMSG", SqlDbType.NVarChar, 254).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@IsSuccess", SqlDbType.Bit).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@ErrorNumber", SqlDbType.Int).Direction = ParameterDirection.Output;
					cmd.ExecuteNonQuery();
					// Read output for each record
					resVal.ResponseMSG = cmd.Parameters["@ResponseMSG"].Value?.ToString() ?? "";
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value ?? false);
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters["@ErrorNumber"].Value ?? 0);

					if (!resVal.IsSuccess)
					{
						dal.RollbackTransaction();
						return resVal;
					}
				}

				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = resVal.ResponseMSG;
			}
			catch (SqlException ex)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			catch (Exception ex)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;
		}




		public ResponeValues DeleteById(int UserId, int EntityId, int ModuleId, int EntityIds)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_DelCustomAccessById";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@ModuleId", ModuleId);
			cmd.Parameters.AddWithValue("@EntityIds", EntityIds);
			try
			{
				cmd.ExecuteNonQuery();

				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[4].Value);

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
		public BE.Security.CustomAccessCollections getAllCustomAccess(int UserId, int EntityId)
		{
			BE.Security.CustomAccessCollections dataColl = new BE.Security.CustomAccessCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllCustomAccess";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Security.CustomAccess beData = new BE.Security.CustomAccess();
					if (!(reader[0] is DBNull)) beData.ModuleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EntityIds = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.ModuleName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EntityName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.NoOfaAllowedUsers = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.NoOfAllowedGroup = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.TotalAccessName = reader.GetInt32(6);
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
		public BE.Security.CustomAccess getCustomAccessById(int UserId, int EntityId, int ModuleId, int EntityIds)
		{
			BE.Security.CustomAccess beData = new BE.Security.CustomAccess();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ModuleId", ModuleId);
			cmd.Parameters.AddWithValue("@EntityIds", EntityIds);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetCustomAccessById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Security.CustomAccess();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ModuleId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.EntityIds = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.AccessName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.UserId = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.GroupId = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.AutoNumber = reader.GetInt32(6);

				}
				reader.NextResult();
				while (reader.Read())
				{
					BE.Security.CustomAccess det1 = new BE.Security.CustomAccess();
					if (!(reader[0] is DBNull)) det1.AccessName = reader.GetString(0);
					if (!(reader[1] is DBNull)) det1.UserId = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.GroupId = reader.GetString(2);
					beData.CustomAccessColl.Add(det1);
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


		public BE.Security.CustomAccessCollections GetEntityForProperties(int UserId, int ModuleId, int? EntityType)
		{
			BE.Security.CustomAccessCollections dataColl = new BE.Security.CustomAccessCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@ModuleId", ModuleId);
			cmd.Parameters.AddWithValue("@EntityType", EntityType);
			cmd.CommandText = "usp_GetEntityForProperties";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Security.CustomAccess beData = new BE.Security.CustomAccess();
					if (!(reader[0] is DBNull)) beData.EntityId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ModuleId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.ModuleName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EntityName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EntityType = reader.GetInt32(4);
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

