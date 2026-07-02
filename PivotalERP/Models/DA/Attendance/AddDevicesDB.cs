using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

	internal class AddDevicesDB
	{
		DataAccessLayer1 dal = null;
		public AddDevicesDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Attendance.AddDevices beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@MachineSerialNo", beData.MachineSerialNo);
			cmd.Parameters.AddWithValue("@Location", beData.Location);
			cmd.Parameters.AddWithValue("@DeviceCompanyId", beData.DeviceCompanyId);
			cmd.Parameters.AddWithValue("@IPAddress", beData.IPAddress);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@DeviceId", beData.DeviceId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAddDevices";
			}
			else
			{
				cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAddDevices";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
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

		public ResponeValues DeleteById(int UserId, int EntityId, int DeviceId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DeviceId", DeviceId);
			cmd.CommandText = "usp_DelAddDevicesById";
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
		public BE.Attendance.AddDevicesCollections getAllAddDevices(int UserId, int EntityId)
		{
			BE.Attendance.AddDevicesCollections dataColl = new BE.Attendance.AddDevicesCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAddDevices";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Attendance.AddDevices beData = new BE.Attendance.AddDevices();
					if (!(reader[0] is DBNull)) beData.DeviceId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.MachineSerialNo = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Location = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.DeviceCompanyId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IPAddress = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BranchId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.DepartmentId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.BranchName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.DepartmentName = reader.GetString(9);
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
		public BE.Attendance.AddDevices getAddDevicesById(int UserId, int EntityId, int DeviceId)
		{
			BE.Attendance.AddDevices beData = new BE.Attendance.AddDevices();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@DeviceId", DeviceId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAddDevicesById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Attendance.AddDevices();
					if (!(reader[0] is DBNull)) beData.DeviceId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.MachineSerialNo = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Location = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.DeviceCompanyId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IPAddress = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BranchId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.DepartmentId = reader.GetInt32(7);
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

		public RE.Attendance.MissingEmployeeAsEnrollNoCollections getMissingEmployeeAsEnrollNo(int UserId)
		{
			RE.Attendance.MissingEmployeeAsEnrollNoCollections dataColl = new RE.Attendance.MissingEmployeeAsEnrollNoCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;			
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.CommandText = "usp_GetMissingEmployeAsEnrollNo";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					var beData = new RE.Attendance.MissingEmployeeAsEnrollNo();
					if (!(reader[0] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[0]);
					if (!(reader[1] is DBNull)) beData.MachineSerialNo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Location = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.IPAddress = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MinDate = reader.GetDateTime(5);
					if (!(reader[6] is DBNull)) beData.MaxDate = reader.GetDateTime(6);
					if (!(reader[7] is DBNull)) beData.MissingFromDays = reader.GetInt32(7);
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

