using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.Reporting.HR
{
    public class Attendance
    {
        Dynamic.DataAccess.Global.DataAccessLayer1 dal = null;
        public Attendance(string hostName, string dbName)
        {
            dal = new Dynamic.DataAccess.Global.DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.ReportEntity.HR.DailyAppAttendanCollections getDailyAppAttendance(int UserId, DateTime? ForDate,int? CompanyId,int? BranchId)
        {
            Dynamic.ReportEntity.HR.DailyAppAttendanCollections dataColl = new ReportEntity.HR.DailyAppAttendanCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ForDate", ForDate);
                cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
                cmd.Parameters.AddWithValue("@BranchId", BranchId);
                cmd.CommandText = "usp_GetDailyAppAttendance";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.HR.DailyAppAttendance beData = new ReportEntity.HR.DailyAppAttendance();                    
                    if (!(reader[0] is System.DBNull)) beData.AgentId = Convert.ToInt32(reader[0]);
                    if (!(reader[1] is System.DBNull)) beData.UserId = Convert.ToInt32(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.Name = Convert.ToString(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.Mobile = Convert.ToString(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.Level = Convert.ToString(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.ParentName = Convert.ToString(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.RouteName = Convert.ToString(reader[6]);
                    if (!(reader[7] is System.DBNull)) beData.StartDateTime = Convert.ToDateTime(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.EndDateTime = Convert.ToDateTime(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.StartTime = Convert.ToString(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.EndTime = Convert.ToString(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.VisitHour = Convert.ToString(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.InDateTime = Convert.ToDateTime(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.InTime = Convert.ToString(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.InLocation = Convert.ToString(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.InImage = Convert.ToString(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.InRemark = Convert.ToString(reader[16]);
                    if (!(reader[17] is System.DBNull)) beData.OutDateTime = Convert.ToDateTime(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.OutTime = Convert.ToString(reader[18]);
                    if (!(reader[19] is System.DBNull)) beData.OutLocation = Convert.ToString(reader[19]);
                    if (!(reader[20] is System.DBNull)) beData.OutImage = Convert.ToString(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.OutRemark = Convert.ToString(reader[21]);
                    if (!(reader[22] is System.DBNull)) beData.WorkingHour = Convert.ToString(reader[22]);
                    if (!(reader[23] is System.DBNull)) beData.In_Lat = Convert.ToDouble(reader[23]);
                    if (!(reader[24] is System.DBNull)) beData.In_Lng = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.Out_Lat = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.Out_Lng = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.DealerName = Convert.ToString(reader[27]);
                    if (!(reader[28] is System.DBNull)) beData.ForMiti = Convert.ToString(reader[28]);
                    if (!(reader[29] is System.DBNull)) beData.ForDate = Convert.ToDateTime(reader[29]);

                    if (!(reader["IsLeave"] is System.DBNull)) beData.IsLeave = Convert.ToBoolean(reader["IsLeave"]);
                    if (!(reader["LeaveType"] is System.DBNull)) beData.LeaveType = Convert.ToString(reader["LeaveType"]);
                    if (!(reader["Remarks"] is System.DBNull)) beData.Remarks = Convert.ToString(reader["Remarks"]);
                    if (!(reader["IsActive"] is System.DBNull)) beData.IsActive = Convert.ToBoolean(reader["IsActive"]);
                    if (!(reader["IsAbsent"] is System.DBNull)) beData.IsAbsent = Convert.ToBoolean(reader["IsAbsent"]);
                    try
                    {
                        if (!(reader["CompanyName"] is System.DBNull)) beData.Company = Convert.ToString(reader["CompanyName"]);
                    }
                    catch { }
                    

                    dataColl.Add(beData);
                }
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

        public Dynamic.ReportEntity.HR.SalesmanMonthlyAttendanceCollections getMonthlyAppAttendance(int UserId, int YearId,int MonthId,bool ShowInOutTime= true,DateTime? startDate = null,DateTime? endDate=null,int? DateStyle=1, string BranchIdColl="", string DepartmentIdColl = "", string CompanyRelationshipColl = "")
        {
            Dynamic.ReportEntity.HR.SalesmanMonthlyAttendanceCollections dataColl = new ReportEntity.HR.SalesmanMonthlyAttendanceCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;                
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@YearId", YearId);
                cmd.Parameters.AddWithValue("@MonthId", MonthId);
                cmd.Parameters.AddWithValue("@ShowInOutTime", ShowInOutTime);                
                cmd.Parameters.Add("@DateFrom", System.Data.SqlDbType.DateTime);
                cmd.Parameters.Add("@DateTo", System.Data.SqlDbType.DateTime);
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;                
                cmd.CommandText = "usp_GetMonthlyAppAttendance";
                cmd.Parameters.AddWithValue("@StartDate", startDate);
                cmd.Parameters.AddWithValue("@EndDate", endDate);
                cmd.Parameters.AddWithValue("@DateStyle", DateStyle);                
                cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);                
                cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);                
                cmd.Parameters.AddWithValue("@CompanyRelationshipColl", CompanyRelationshipColl);                
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();                 
                while (reader.Read())
                {
                    Dynamic.ReportEntity.HR.SalesmanMonthlyAttendance beData = new ReportEntity.HR.SalesmanMonthlyAttendance();
                    if (!(reader[0] is System.DBNull)) beData.AgentId = Convert.ToInt32(reader[0]);
                    if (!(reader[1] is System.DBNull)) beData.UserId = Convert.ToInt32(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.Name = Convert.ToString(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.MobileNo = Convert.ToString(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.Designation = Convert.ToString(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.ParentName = Convert.ToString(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.IsActive = Convert.ToBoolean(reader[6]);
                    if (!(reader[7] is System.DBNull)) beData.TotalDays = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.TotalPresent = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.TotalWeekEnd = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.TotalLeave = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.TotalHoliday = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.Day1 = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Day2 = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Day3 = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.Day4 = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.Day5 = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.Day6 = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.Day7 = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) beData.Day8 = reader.GetString(19);
                    if (!(reader[20] is System.DBNull)) beData.Day9 = reader.GetString(20);
                    if (!(reader[21] is System.DBNull)) beData.Day10 = reader.GetString(21);
                    if (!(reader[22] is System.DBNull)) beData.Day11 = reader.GetString(22);
                    if (!(reader[23] is System.DBNull)) beData.Day12 = reader.GetString(23);
                    if (!(reader[24] is System.DBNull)) beData.Day13 = reader.GetString(24);
                    if (!(reader[25] is System.DBNull)) beData.Day14 = reader.GetString(25);
                    if (!(reader[26] is System.DBNull)) beData.Day15 = reader.GetString(26);
                    if (!(reader[27] is System.DBNull)) beData.Day16 = reader.GetString(27);
                    if (!(reader[28] is System.DBNull)) beData.Day17 = reader.GetString(28);
                    if (!(reader[29] is System.DBNull)) beData.Day18 = reader.GetString(29);
                    if (!(reader[30] is System.DBNull)) beData.Day19 = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.Day20 = reader.GetString(31);
                    if (!(reader[32] is System.DBNull)) beData.Day21 = reader.GetString(32);
                    if (!(reader[33] is System.DBNull)) beData.Day22 = reader.GetString(33);
                    if (!(reader[34] is System.DBNull)) beData.Day23 = reader.GetString(34);
                    if (!(reader[35] is System.DBNull)) beData.Day24 = reader.GetString(35);
                    if (!(reader[36] is System.DBNull)) beData.Day25 = reader.GetString(36);
                    if (!(reader[37] is System.DBNull)) beData.Day26 = reader.GetString(37);
                    if (!(reader[38] is System.DBNull)) beData.Day27 = reader.GetString(38);
                    if (!(reader[39] is System.DBNull)) beData.Day28 = reader.GetString(39);
                    if (!(reader[40] is System.DBNull)) beData.Day29 = reader.GetString(40);
                    if (!(reader[41] is System.DBNull)) beData.Day30 = reader.GetString(41);
                    if (!(reader[42] is System.DBNull)) beData.Day31 = reader.GetString(42);
                    if (!(reader[43] is System.DBNull)) beData.Day32 = reader.GetString(43);
                    if (!(reader[44] is System.DBNull)) beData.Code = reader.GetString(44);
                    if (!(reader[45] is System.DBNull)) beData.TotalWorkingHour = reader.GetString(45);
                    dataColl.Add(beData);
                }
                reader.Close();

                DateTime? dateFrom = null, dateTo = null;
                if (!(cmd.Parameters[4].Value is DBNull))
                    dateFrom = Convert.ToDateTime(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    dateTo = Convert.ToDateTime(cmd.Parameters[5].Value);

                if (dateFrom.HasValue && dateTo.HasValue)
                {
                    foreach (var v in dataColl)
                    {
                        v.DateFrom = dateFrom.Value;
                        v.DateTo = dateTo.Value;
                    }
                }
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


        public Dynamic.ReportEntity.HR.DailyAppAttendanCollections getAppAttendance(int UserId,int? AgentId, DateTime? DateFrom,DateTime? DateTo)
        {
            Dynamic.ReportEntity.HR.DailyAppAttendanCollections dataColl = new ReportEntity.HR.DailyAppAttendanCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@AgentId", AgentId);
                cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
                cmd.Parameters.AddWithValue("@DateTo", DateTo);
                cmd.CommandText = "usp_GetSalesmanAttendanceLog";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.HR.DailyAppAttendance beData = new ReportEntity.HR.DailyAppAttendance();
                    if (!(reader[0] is System.DBNull)) beData.AgentId = Convert.ToInt32(reader[0]);
                    if (!(reader[1] is System.DBNull)) beData.UserId = Convert.ToInt32(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.Name = Convert.ToString(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.Mobile = Convert.ToString(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.Level = Convert.ToString(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.ParentName = Convert.ToString(reader[5]);
                    if (!(reader["IsActive"] is System.DBNull)) beData.IsActive = Convert.ToBoolean(reader["IsActive"]);
                    if (!(reader["TotalDays"] is System.DBNull)) beData.TotalDays = Convert.ToInt32(reader["TotalDays"]);
                    if (!(reader[8] is System.DBNull)) beData.ForDate = Convert.ToDateTime(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.ForMiti = Convert.ToString(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.WeekdayName = Convert.ToString(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.InTime = Convert.ToString(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.OutTime = Convert.ToString(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.InLocation = Convert.ToString(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.OutLocation = Convert.ToString(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.WorkingHour = Convert.ToString(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.WS = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is System.DBNull)) beData.Attendance = Convert.ToString(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IsPresent = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is System.DBNull)) beData.IsWeekEnd = Convert.ToBoolean(reader[19]);
                    if (!(reader[20] is System.DBNull)) beData.IsHoliday = Convert.ToBoolean(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.IsLeave = Convert.ToBoolean(reader[21]);
                    if (!(reader[22] is System.DBNull)) beData.IsAbsent = Convert.ToBoolean(reader[22]);

                    try
                    {
                        if (!(reader["InRemark"] is System.DBNull)) beData.InRemark = Convert.ToString(reader["InRemark"]);
                        if (!(reader["OutRemark"] is System.DBNull)) beData.OutRemark = Convert.ToString(reader["OutRemark"]);
                        if (!(reader["InApprove"] is System.DBNull)) beData.InApprove = Convert.ToString(reader["InApprove"]);
                        if (!(reader["OutApprove"] is System.DBNull)) beData.OutApprove = Convert.ToString(reader["OutApprove"]);
                    }
                    catch { }
                   

                    dataColl.Add(beData);
                }
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
