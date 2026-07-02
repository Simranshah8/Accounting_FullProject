using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.GateMaster
{

	internal class VehicleDB
	{
		DataAccessLayer1 dal = null;
		public VehicleDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.GateMaster.Vehicle beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@VehicleType", beData.VehicleType);
			cmd.Parameters.AddWithValue("@TransporterName", beData.TransporterName);
			cmd.Parameters.AddWithValue("@RFIDTag", beData.RFIDTag);
			cmd.Parameters.AddWithValue("@InsuranceNo", beData.InsuranceNo);
			cmd.Parameters.AddWithValue("@PollutionNo", beData.PollutionNo);
			cmd.Parameters.AddWithValue("@EngineNo", beData.EngineNo);
			cmd.Parameters.AddWithValue("@VinNo", beData.VinNo);
			cmd.Parameters.AddWithValue("@RegNo", beData.RegNo);
			cmd.Parameters.AddWithValue("@IsBlackListed", beData.IsBlackListed);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@VehicleId", beData.VehicleId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateVehicle";
			}
			else
			{
				cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddVehicle";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[13].Value);

				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[14].Value);

				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[15].Value);

				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[16].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int VehicleId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@VehicleId", VehicleId);
			cmd.CommandText = "usp_DelVehicleById";
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
		public BE.GateMaster.VehicleCollections getAllVehicle(int UserId, int EntityId)
		{
			BE.GateMaster.VehicleCollections dataColl = new BE.GateMaster.VehicleCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllVehicle";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.GateMaster.Vehicle beData = new BE.GateMaster.Vehicle();
					if (!(reader[0] is DBNull)) beData.VehicleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VehicleType = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.TransporterName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.RFIDTag = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.InsuranceNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PollutionNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.EngineNo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.VinNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.RegNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsBlackListed = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.BranchName = reader.GetString(12);
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
		public BE.GateMaster.Vehicle getVehicleById(int UserId, int EntityId, int VehicleId)
		{
			BE.GateMaster.Vehicle beData = new BE.GateMaster.Vehicle();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VehicleId", VehicleId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetVehicleById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.GateMaster.Vehicle();
					if (!(reader[0] is DBNull)) beData.VehicleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VehicleType = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.TransporterName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.RFIDTag = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.InsuranceNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PollutionNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.EngineNo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.VinNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.RegNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsBlackListed = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[11]);
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

