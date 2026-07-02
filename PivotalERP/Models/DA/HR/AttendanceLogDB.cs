using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class AttendaceLogDB
	{
		DataAccessLayer1 dal = null;
		public AttendaceLogDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		//public Dynamic.RE.HR.AttendanceLogCollections AttendanceLog(DateTime DateFrom, DateTime DateTo, int? EmployeeId, int UserId)
		//{
		//	Dynamic.RE.HR.AttendanceLogCollections dataColl = new Dynamic.RE.HR.AttendanceLogCollections();
		//	dal.OpenConnection();
		//	System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
		//	cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//	cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
		//	cmd.Parameters.AddWithValue("@DateTo", DateTo);
		//	cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
		//	cmd.Parameters.AddWithValue("@UserId", UserId);
		//	cmd.CommandText = "usp_AttendanceLog";
		//	try
		//	{
		//		System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
		//		while (reader.Read())
		//		{
		//			Dynamic.RE.HR.AttendanceLog beData = new Dynamic.RE.HR.AttendanceLog();
		//			if (!(reader[0] is DBNull)) beData.SNO = reader.GetInt32(0);
		//			if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
		//			if (!(reader[2] is DBNull)) beData.DateAD = Convert.ToDateTime(reader[2]);
		//			if (!(reader[3] is DBNull)) beData.DateBS = reader.GetString(3);
		//			if (!(reader[4] is DBNull)) beData.InTime = reader.GetTimeSpan(4);
		//			if (!(reader[5] is DBNull)) beData.OutTime = reader.GetTimeSpan(5);
		//			if (!(reader[6] is DBNull)) beData.Attendance = reader.GetString(6);
		//			if (!(reader[7] is DBNull)) beData.Remarks = reader.GetString(7);
		//			if (!(reader[8] is DBNull)) beData.TotalDays = reader.GetInt32(8);
		//			if (!(reader[9] is DBNull)) beData.TotalWeekEnd = reader.GetInt32(9);
		//			if (!(reader[10] is DBNull)) beData.TotalPresent = reader.GetInt32(10);
		//			if (!(reader[11] is DBNull)) beData.TotalAbsent = reader.GetInt32(11);
		//			if (!(reader[12] is DBNull)) beData.TotalLeave = reader.GetInt32(12);
		//			if (!(reader[13] is DBNull)) beData.TotalHoliday = reader.GetInt32(13);
		//			if (!(reader[14] is DBNull)) beData.InLocation = reader.GetString(14);
		//			if (!(reader[15] is DBNull)) beData.OutLocation = reader.GetString(15);
		//			if (!(reader[16] is DBNull)) beData.WeekendPresent = reader.GetInt32(16);
		//			if (!(reader[17] is DBNull)) beData.HolidayPresent = reader.GetInt32(17);
		//			if (!(reader[18] is DBNull)) beData.LeavePresent = reader.GetInt32(18);
		//			if (!(reader[19] is DBNull)) beData.WorkingHour = reader.GetString(19);
		//			if (!(reader[20] is DBNull)) beData.TotalWorkingHour = Convert.ToDouble(reader[20]);
		//			if (!(reader[21] is DBNull)) beData.IsWeekEnd = Convert.ToBoolean(reader[21]);
		//			if (!(reader[22] is DBNull)) beData.IsHoliday = Convert.ToBoolean(reader[22]);
		//			if (!(reader[23] is DBNull)) beData.IsLeave = Convert.ToBoolean(reader[23]);
		//			if (!(reader[24] is DBNull)) beData.IsPresent = Convert.ToBoolean(reader[24]);
		//			if (!(reader[25] is DBNull)) beData.Color = reader.GetString(25);
		//			if (!(reader[26] is DBNull)) beData.OnDutyTime = reader.GetString(26);
		//			if (!(reader[27] is DBNull)) beData.OffDutyTime = reader.GetString(27);
		//			if (!(reader[28] is DBNull)) beData.WorkingDuration = Convert.ToDouble(reader[28]);
		//			if (!(reader[29] is DBNull)) beData.OTDuration = Convert.ToDouble(reader[29]);
		//			if (!(reader[30] is DBNull)) beData.SinglePunchDeduction = Convert.ToDouble(reader[30]);
		//			if (!(reader[31] is DBNull)) beData.EarlyInMinutes = Convert.ToDouble(reader[31]);
		//			if (!(reader[32] is DBNull)) beData.LateInMinutes = Convert.ToDouble(reader[32]);
		//			if (!(reader[33] is DBNull)) beData.EarlyOutMinutes = Convert.ToDouble(reader[33]);
		//			if (!(reader[34] is DBNull)) beData.EarlyOutMinutes = Convert.ToDouble(reader[34]);
		//			if (!(reader[35] is DBNull)) beData.NY = reader.GetInt32(35);
		//			if (!(reader[36] is DBNull)) beData.NM = reader.GetInt32(36);
		//			if (!(reader[37] is DBNull)) beData.ND = reader.GetInt32(37);
		//			if (!(reader[38] is DBNull)) beData.MonthName = reader.GetString(38);
		//			if (!(reader[39] is DBNull)) beData.DayId = reader.GetInt32(39);
		//			if (!(reader[40] is DBNull)) beData.TotalDaysInMonth = reader.GetInt32(40);
		//			dataColl.Add(beData);
		//		}
		//		reader.Close();
		//		dataColl.IsSuccess = true;
		//		dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
		//	}
		//	catch (Exception ee)
		//	{
		//		dataColl.IsSuccess = false;
		//		dataColl.ResponseMSG = ee.Message;
		//	}
		//	finally
		//	{
		//		dal.CloseConnection();
		//	}

		//	return dataColl;

		//}
	}
}