using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

	internal class WeeklyShiftMappingDB
	{
		DataAccessLayer1 dal = null;
		public WeeklyShiftMappingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }


        public Dynamic.BE.Attendance.WeeklyShiftMappingCollections GetWeeklyShiftMapping(int UserId, DateTime DateFrom, DateTime DateTo, string BranchIdColl = "", string DepartmentIdColl = "", string DesignationIdColl = "", string CategoryIdColl = "", int? WorkingShiftId=null)
        {
            Dynamic.BE.Attendance.WeeklyShiftMappingCollections dataColl = new Dynamic.BE.Attendance.WeeklyShiftMappingCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
            cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);
            cmd.Parameters.AddWithValue("@DesignationIdColl", DesignationIdColl);
			cmd.Parameters.AddWithValue("@CategoryIdColl", CategoryIdColl);
			cmd.Parameters.AddWithValue("@WorkingShiftId", WorkingShiftId);
			cmd.CommandText = "sp_getWeeklyShiftMapping";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Attendance.WeeklyShiftMapping beData = new Dynamic.BE.Attendance.WeeklyShiftMapping();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
					if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Department = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Date = Convert.ToDateTime(reader[6]);
					if (!(reader[7] is DBNull)) beData.WorkingShiftId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.WorkingShiftName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.DateBS = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Year = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Month = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.Day = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Code = reader.GetString(13);
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
		public ResponeValues SaveWeeklyShiftMappingColl(int UserId, Dynamic.BE.Attendance.WeeklyShiftMappingCollections dataColl)
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
					cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
					cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
					cmd.Parameters.AddWithValue("@EffectiveDate", beData.EffectiveDate);
					cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
					cmd.CommandText = "sp_SaveWeeklyShiftMapping";
					cmd.ExecuteNonQuery();
				}
				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = "Your data has been saved successfully.";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}
 

		public ResponeValues DeleteById(int EmployeeId, DateTime DateFrom, DateTime DateTo)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
			cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
			cmd.Parameters.AddWithValue("@DateTo", DateTo);
			cmd.CommandText = "sp_DeleteWeeklyShiftMapping";
			cmd.ExecuteNonQuery();
			dal.CloseConnection();
			resVal.ResponseMSG = ("Delete Sucessfull");
			return resVal;
		}

	}
}