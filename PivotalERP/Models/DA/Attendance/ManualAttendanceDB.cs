using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

	internal class ManualAttendanceDB
	{
		DataAccessLayer1 dal = null;
		public ManualAttendanceDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(Dynamic.BE.Attendance.ManualAttendance beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
			cmd.Parameters.AddWithValue("@MachineId", beData.MachineId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateManualAtt";
			}
			else
			{
				cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddManualAtt";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveManualAttendanceDetail(beData.CUserId, resVal.RId, beData.ManualAttendanceDetailColl);
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

		private void SaveManualAttendanceDetail(int UserId, int TranId, Dynamic.BE.Attendance.ManualAttendanceDetailCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (Dynamic.BE.Attendance.ManualAttendanceDetail beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@InOutMode", beData.InOutMode);
				cmd.Parameters.AddWithValue("@AttendanceDate", beData.AttendanceDate);
				cmd.Parameters.AddWithValue("@InOutTime", beData.InOutTime);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@OutTime", beData.OutTime);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddManualAttDetails";
				cmd.ExecuteNonQuery();
			}

		}
		
		public ResponeValues DeleteById(int UserId, int EntityId, int MADetailId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@MADetailId", MADetailId);
			cmd.CommandText = "usp_DelManualAttById";
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

        public Dynamic.BE.Attendance.ManualAttendanceCollections getAllManualAttendance(int UserId, int EntityId)
        {
            Dynamic.BE.Attendance.ManualAttendanceCollections dataColl = new Dynamic.BE.Attendance.ManualAttendanceCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllManualAtt";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.ManualAttendance beData = new Dynamic.BE.Attendance.ManualAttendance();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.MachineId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.UserName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.UserFullName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Machine = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.AttMode = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.AttendanceDate = Convert.ToDateTime(reader[7]);
					if (!(reader[8] is DBNull)) beData.InOutTime = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.AttendanceMitti = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.OutTime = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.MADetailId = reader.GetInt32(11);
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
        public Dynamic.BE.Attendance.ManualAttendance getManualAttendanceById(int UserId, int EntityId, int TranId)
        {
			Dynamic.BE.Attendance.ManualAttendance beData = new Dynamic.BE.Attendance.ManualAttendance();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetManualAttById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.Attendance.ManualAttendance();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.MachineId = reader.GetInt32(2);
				}

				reader.NextResult();

				while (reader.Read())
				{
					Dynamic.BE.Attendance.ManualAttendanceDetail det = new Dynamic.BE.Attendance.ManualAttendanceDetail();
					if (!(reader[0] is DBNull)) det.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.InOutMode = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det.AttendanceDate = reader.GetDateTime(2);
					if (!(reader[3] is DBNull)) det.InOutTime = reader.GetDateTime(3);
					if (!(reader[4] is DBNull)) det.Remarks = reader.GetString(4);
					if (!(reader[5] is DBNull)) det.OutTime = reader.GetDateTime(5);
					if (!(reader[6] is DBNull)) beData.MADetailId = reader.GetInt32(6);
					beData.ManualAttendanceDetailColl.Add(det);
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

