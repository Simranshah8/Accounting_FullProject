using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.Attendance
{
    public class EmpDetForAttendanceSummaryDB
    {
        DataAccessLayer1 dal = null;
        public EmpDetForAttendanceSummaryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.BE.Attendance.EmpDetForAttendanceSummary GetEmpDetForAttendanceSummary(int UserId, DateTime? FromDate, int EmployeeId)
        {
            Dynamic.BE.Attendance.EmpDetForAttendanceSummary beData = new BE.Attendance.EmpDetForAttendanceSummary();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@FromDate", FromDate);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.CommandText = "usp_GetEmpDetForAttendanceSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    if (!(reader[0] is DBNull))  beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull))  beData.EmployeeCode = reader.GetString(1);
                    if (!(reader[2] is DBNull))  beData.EmployeeName = reader.GetString(2);
                    if (!(reader[3] is DBNull))  beData.EnrollNumber = Convert.ToInt64(reader[3]);
                    if (!(reader[4] is DBNull))  beData.BranchName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Designation = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Category = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.LateIn = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.EarlyOut = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.WorkingHour = reader.GetString(9);
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