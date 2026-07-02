using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class ManualAttendanceDB
	{
		DataAccessLayer1 dal = null;
		public ManualAttendanceDB(string hostName, string dbName)
        {
			dal = new DataAccessLayer1(hostName,dbName);
        }


		public ResponeValues SaveUpdateAtt(int UserId, List<Dynamic.BE.HR.ManualAttendance> dataColl)
        {
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			dal.BeginTransaction();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
                    cmd.Parameters.AddWithValue("@DeviceId", beData.DeviceId);
                    cmd.Parameters.AddWithValue("@ForDate", beData.ForDate);
                    cmd.Parameters.AddWithValue("@InOutModeId", beData.InOutModeId);
                    cmd.Parameters.AddWithValue("@InTime", beData.InTime);
                    cmd.Parameters.AddWithValue("@OutTime", beData.OutTime);
                    cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                    cmd.Parameters.AddWithValue("@Lat", beData.Lat);
                    cmd.Parameters.AddWithValue("@Lng", beData.Lng);
                    cmd.Parameters.AddWithValue("@NerestLocation", beData.NerestLocation);
                    cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
                    cmd.Parameters.AddWithValue("@PunchDateTime", beData.PunchDateTime);
                    cmd.Parameters.AddWithValue("@AttendanceType", beData.AttendanceType);
                    cmd.Parameters.AddWithValue("@ApprovedStatus", beData.ApprovedStatus);
                    cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
                    cmd.Parameters.AddWithValue("@ApprovedDateTime", beData.ApprovedDateTime);
                    cmd.Parameters.AddWithValue("@IsUserDefine", beData.IsUserDefine);
                    cmd.Parameters.AddWithValue("@AttendanceUId", beData.AttendanceUId);

                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
                    cmd.Parameters.AddWithValue("@TranId", beData.TranId);

					cmd.CommandText = "usp_AddManualAttendance";
                    cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                    cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                    cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
                    cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Manual Attendance Saved";
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

		public Dynamic.BE.HR.ManualAttendanceCollections getAllManualAttendance(int UserId, int EntityId)
		{
			Dynamic.BE.HR.ManualAttendanceCollections dataColl = new Dynamic.BE.HR.ManualAttendanceCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllManualAttendance";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.ManualAttendance beData = new Dynamic.BE.HR.ManualAttendance();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.ForDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.InOutModeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.InTime = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.OutTime = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.Remarks = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.ForDateBS = reader.GetString(7);
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


		public ResponeValues SaveUpdate(Dynamic.BE.HR.ManualAttendance beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
			cmd.Parameters.AddWithValue("@DeviceId", beData.DeviceId);
			cmd.Parameters.AddWithValue("@ForDate", beData.ForDate);
			cmd.Parameters.AddWithValue("@InOutModeId", beData.InOutModeId);
			cmd.Parameters.AddWithValue("@InTime", beData.InTime);
			cmd.Parameters.AddWithValue("@OutTime", beData.OutTime);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@Lat", beData.Lat);
			cmd.Parameters.AddWithValue("@Lng", beData.Lng);
			cmd.Parameters.AddWithValue("@NerestLocation", beData.NerestLocation);
			cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
			cmd.Parameters.AddWithValue("@PunchDateTime", beData.PunchDateTime);
			cmd.Parameters.AddWithValue("@AttendanceType", beData.AttendanceType);
			cmd.Parameters.AddWithValue("@ApprovedStatus", beData.ApprovedStatus);
			cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
			cmd.Parameters.AddWithValue("@ApprovedDateTime", beData.ApprovedDateTime);
			cmd.Parameters.AddWithValue("@IsUserDefine", beData.IsUserDefine);
			cmd.Parameters.AddWithValue("@AttendanceUId", beData.AttendanceUId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateManualAttendance";
			}
			else
			{
				cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddManualAttendance";
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
			cmd.CommandText = "usp_DelManualAttendanceById";
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
		
		public Dynamic.BE.HR.ManualAttendance getManualAttendanceById(int UserId, int EntityId, int TranId)
		{
			Dynamic.BE.HR.ManualAttendance beData = new Dynamic.BE.HR.ManualAttendance();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetManualAttendanceById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.ManualAttendance();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.DeviceId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.ForDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.InOutModeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.InTime = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) beData.OutTime = Convert.ToDateTime(reader[6]);
					if (!(reader[7] is DBNull)) beData.Remarks = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Lat = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.Lng = Convert.ToDouble(reader[9]);
					if (!(reader[10] is DBNull)) beData.NerestLocation = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.PhotoPath = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.PunchDateTime = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.AttendanceType = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.ApprovedStatus = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.ApprovedBy = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.ApprovedDateTime = Convert.ToDateTime(reader[16]);
					if (!(reader[17] is DBNull)) beData.IsUserDefine = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.AttendanceUId = reader.GetString(18);
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

