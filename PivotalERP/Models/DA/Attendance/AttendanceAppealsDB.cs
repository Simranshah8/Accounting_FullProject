using Dynamic.DataAccess.Global;
using Dynamic.DataAccess.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.DA.Attendance
{

	internal class AttendanceAppealsDB
	{
		DataAccessLayer1 dal = null;
		public AttendanceAppealsDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.Attendance.AttendanceAppeals beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@Reason", beData.Reason);
			cmd.Parameters.AddWithValue("@AttendanceInOutModeId", beData.AttendanceInOutModeId);
			cmd.Parameters.AddWithValue("@PunchDateTime", beData.PunchDateTime);
			cmd.Parameters.AddWithValue("@ApprovedType", beData.ApprovedType);
			cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
			cmd.Parameters.AddWithValue("@ApprovedByUser", beData.ApprovedByUser);
			cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
			cmd.Parameters.AddWithValue("@ApprovedDateTime", beData.ApprovedDateTime);
			cmd.Parameters.AddWithValue("@Lat", beData.Lat);
			cmd.Parameters.AddWithValue("@Lan", beData.Lan);
			cmd.Parameters.AddWithValue("@Location", beData.Location);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAttendanceAppeals";
			}
			else
			{
				cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAttendanceAppeals";
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
			cmd.CommandText = "usp_DelAttendanceAppealsById";
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
		public BE.Attendance.AttendanceAppealsCollections getAllAttendanceAppeals(int UserId, int EntityId)
		{
			BE.Attendance.AttendanceAppealsCollections dataColl = new BE.Attendance.AttendanceAppealsCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAttendanceAppeals";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Attendance.AttendanceAppeals beData = new BE.Attendance.AttendanceAppeals();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Reason = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AttendanceInOutModeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.PunchDateTime = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.ApprovedType = reader.GetInt32(5).ToString();
					if (!(reader[6] is DBNull)) beData.ApprovedBy = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ApprovedByUser = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.ApprovedRemarks = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ApprovedDateTime = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) beData.Lat = Convert.ToDouble(reader[10]);
					if (!(reader[11] is DBNull)) beData.Lan = Convert.ToDouble(reader[11]);
					if (!(reader[12] is DBNull)) beData.Location = reader.GetString(12);
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
		public BE.Attendance.AttendanceAppeals getAttendanceAppealsById(int UserId, int EntityId, int TranId)
		{
			BE.Attendance.AttendanceAppeals beData = new BE.Attendance.AttendanceAppeals();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAttendanceAppealsById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Attendance.AttendanceAppeals();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Reason = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AttendanceInOutModeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.PunchDateTime = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) beData.ApprovedType = reader.GetInt32(5).ToString();
					if (!(reader[6] is DBNull)) beData.ApprovedBy = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ApprovedByUser = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.ApprovedRemarks = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ApprovedDateTime = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) beData.Lat = Convert.ToDouble(reader[10]);
					if (!(reader[11] is DBNull)) beData.Lan = Convert.ToDouble(reader[11]);
					if (!(reader[12] is DBNull)) beData.Location = reader.GetString(12);
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


        public BE.Attendance.AttendanceAppealsCollections GetAttendanceAppealDetails(int UserId,DateTime? DateFrom,DateTime? DateTo,string ApprovedType,int? EmployeeId,int? BranchId,bool? ShowSelfOnly)
        {
            BE.Attendance.AttendanceAppealsCollections dataColl = new BE.Attendance.AttendanceAppealsCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@ApprovedType", ApprovedType);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@ShowSelfOnly", ShowSelfOnly);
            cmd.CommandText = "sp_GetAttendanceAppealDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.AttendanceAppeals beData = new BE.Attendance.AttendanceAppeals();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Branch = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Department = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Designation = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.EmployeeCode = Convert.ToString(reader[4]);
                    if (!(reader[5] is DBNull)) beData.Name = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.InOutMode = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.PunchDateTimeAD = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.PunchDateTimeBS = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Reason = Convert.ToString(reader[9]);
                    if (!(reader[10] is DBNull)) beData.LogDateTimeAD = Convert.ToString(reader[10]);
                    if (!(reader[11] is DBNull)) beData.LogDateTimeBS = Convert.ToString(reader[11]);
                    if (!(reader[12] is DBNull)) beData.Location = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.ApprovedTypeName = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.ApprovedByUser = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.ApprovedRemarks = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.ApprovedDateTimeAD = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.ApprovedDateTimeBS = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.EmailId = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.ContactNo = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.ApprovedType = reader.GetInt32(20).ToString();
					if (!(reader[21] is DBNull)) beData.PhotoPath = reader.GetString(21);

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
		public ResponeValues UpdateAttendanceAppeals(BE.Attendance.AttendanceAppeals beData)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ApprovedType", beData.ApprovedType);
			cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);
			cmd.CommandText = "usp_UpdateAttendanceAppeals";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

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


	}

}

