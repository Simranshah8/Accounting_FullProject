using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{

	internal class JobTypeMappingDB
	{
		DataAccessLayer1 dal = null;
		public JobTypeMappingDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.JobTypeMapping beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VehicleTypeId", beData.VehicleTypeId);
			cmd.Parameters.AddWithValue("@VehicleModelId", beData.VehicleModelId);
			cmd.Parameters.AddWithValue("@Description", beData.Description);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@JobTypeMappingId", beData.JobTypeMappingId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateJobTypeMapping";
			}
			else
			{
				cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddJobTypeMapping";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveJobTypeMappingDetDetails(beData.CUserId, resVal.RId, beData.JobTypeMappingDetColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int JobTypeMappingId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@JobTypeMappingId", JobTypeMappingId);
			cmd.CommandText = "usp_DelJobTypeMappingById";
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
		public BE.JobTypeMappingCollections getAllJobTypeMapping(int UserId, int EntityId)
		{
			BE.JobTypeMappingCollections dataColl = new BE.JobTypeMappingCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllJobTypeMapping";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.JobTypeMapping beData = new BE.JobTypeMapping();
					if (!(reader[0] is DBNull)) beData.JobTypeMappingId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VehicleTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VehicleModelId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);

					if (!(reader[4] is DBNull)) beData.VehicleTypeName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.VehicleModelName = reader.GetString(5);
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
		private void SaveJobTypeMappingDetDetails(int UserId, int JobTypeMappingId, BE.JobTypeMappingDetCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || JobTypeMappingId == 0)
				return;

			foreach (BE.JobTypeMappingDet beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;				
				cmd.Parameters.AddWithValue("@JobTypeId", beData.JobTypeId);
				cmd.Parameters.AddWithValue("@KmUpto", beData.KmUpto);
				cmd.Parameters.AddWithValue("@HourUpto", beData.HourUpto);
				cmd.Parameters.AddWithValue("@DayUpto", beData.DayUpto);

				cmd.Parameters.AddWithValue("@JobTypeMappingId", JobTypeMappingId);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandText = "usp_AddJobTypeMappingDetDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.JobTypeMapping getJobTypeMappingById(int UserId, int EntityId, int JobTypeMappingId)
		{
			BE.JobTypeMapping beData = new BE.JobTypeMapping();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@JobTypeMappingId", JobTypeMappingId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetJobTypeMappingById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.JobTypeMapping();
					if (!(reader[0] is DBNull)) beData.JobTypeMappingId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VehicleTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VehicleModelId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
				}
				reader.NextResult();
				beData.JobTypeMappingDetColl = new BE.JobTypeMappingDetCollections();
				while (reader.Read())
				{
					BE.JobTypeMappingDet det1 = new BE.JobTypeMappingDet();
					if (!(reader[0] is DBNull)) det1.JobTypeMappingId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.JobTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.KmUpto = Convert.ToDouble(reader[2]);
					if (!(reader[3] is DBNull)) det1.HourUpto = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.DayUpto = Convert.ToDouble(reader[4]);
					beData.JobTypeMappingDetColl.Add(det1);
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

