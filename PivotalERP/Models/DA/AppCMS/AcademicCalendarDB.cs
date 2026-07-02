using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AppCMS.Creation
{
    internal class AcademicCalendarDB
    {
        DataAccessLayer1 dal = null;
        public AcademicCalendarDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections getNepaliCalendar(int UserId, int? YearId, string BranchCode)
        {
            Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections dataColl = new BE.AppCMS.Creation.AcademicCalendarCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetAcademicCalendar";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AcademicCalendar beData = new BE.AppCMS.Creation.AcademicCalendar();
                    beData.AD_Date = reader.GetDateTime(0);
                    beData.BS_Date = reader.GetString(1);
                    beData.NY = reader.GetInt32(2);
                    beData.NM = reader.GetInt32(3);
                    beData.ND = reader.GetInt32(4);
                    beData.DayId = reader.GetInt32(5);
                    beData.StartDayId = reader.GetInt32(6);
                    beData.DaysInMonth = reader.GetInt32(7);
                    beData.MonthName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.IsWeekend = reader.GetBoolean(9);
                    if (!(reader[10] is DBNull)) beData.WeekendColorCode = reader.GetString(10);

                    dataColl.Add(beData);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.EventSummary summary = new BE.AppCMS.Creation.EventSummary();
                    summary.EventHolidayId = reader.GetInt32(0);
                    summary.ForDate = reader.GetDateTime(1);
                    summary.NY = reader.GetInt32(2);
                    summary.NM = reader.GetInt32(3);
                    summary.ND = reader.GetInt32(4);
                    summary.EventType = reader.GetString(5);
                    if (!(reader[6] is DBNull)) summary.Name = reader.GetString(6);
                    if (!(reader[7] is DBNull)) summary.Description = reader.GetString(7);
                    if (!(reader[8] is DBNull)) summary.ColorCode = reader.GetString(8);
                    if (!(reader[9] is DBNull)) summary.FromDate_AD = reader.GetDateTime(9);
                    if (!(reader[10] is DBNull)) summary.ToDate_AD = reader.GetDateTime(10);
                    if (!(reader[11] is DBNull)) summary.FromDate_BS = reader.GetString(11);
                    if (!(reader[12] is DBNull)) summary.ToDate_BS = reader.GetString(12);
                    if (!(reader[13] is DBNull)) summary.ImagePath = reader.GetString(13);
                    if (!(reader[14] is DBNull)) summary.ForBranch = reader.GetString(14);
                    if (!(reader[15] is DBNull)) summary.ForDepartment = reader.GetString(15);
                    if (!(reader[16] is DBNull)) summary.ForDesignation = reader.GetString(16);
                    if (!(reader[17] is DBNull)) summary.ForServiceType = reader.GetString(17);
                    if (!(reader[18] is DBNull)) summary.ForEmployee = reader.GetString(18);
                    if (!(reader[19] is DBNull)) summary.ForGender = reader.GetString(19);
                    if (!(reader[20] is DBNull)) summary.AtTime = reader.GetString(20);
                    if (!(reader[21] is DBNull)) summary.ForReligion = reader.GetString(21);

                    var data = dataColl.Find(p1 => p1.NM == summary.NM && p1.ND == summary.ND);
                    if (data != null)
                        data.EventColl.Add(summary);
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

        public Dynamic.API.AppCMS.EventHolidayCollections  getUpcomingEventHoliday(int UserId,DateTime? fromDate,DateTime? toDate,int eType, string BranchCode)
        {
            Dynamic.API.AppCMS.EventHolidayCollections dataColl = new API.AppCMS.EventHolidayCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", fromDate);
            cmd.Parameters.AddWithValue("@DateTo", toDate);
            cmd.Parameters.AddWithValue("@EType", eType);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetUpComingEventHoliday";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.API.AppCMS.EventHoliday beData = new API.AppCMS.EventHoliday();
                    if (!(reader[0] is DBNull)) beData.HolidayEvent = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.EventType = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.FromDate_AD = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.ToDate_AD = reader.GetDateTime(5);
                    if (!(reader[6] is DBNull)) beData.FromDate_BS = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ToDate_BS = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.ForClass = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.ColorCode = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.ImagePath = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.AtTime = reader.GetString(11);

                    int daysDiff = (beData.FromDate_AD - DateTime.Today).Days;

                    if (daysDiff > 0)
                        beData.Remaining = daysDiff.ToString() + " Days Remaining";
                    else
                        beData.Remaining = "Passed";


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
        public Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections GetDaysByYrMonth(int UserId,int YearId, int MonthId)
        {
            Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections dataColl = new Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_GetDaysByYrMonth";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AcademicCalendar beData = new Dynamic.BE.AppCMS.Creation.AcademicCalendar();
                    if (!(reader[0] is DBNull)) beData.NY = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.NM = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.ND = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.DaysInMonth = reader.GetInt32(3);
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
        public Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections GetDaysByDate(int UserId,DateTime DateFrom, DateTime DateTo)
        {
            Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections dataColl = new Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_GetDaysByDate";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AcademicCalendar beData = new Dynamic.BE.AppCMS.Creation.AcademicCalendar();
                    if (!(reader[0] is DBNull)) beData.NY = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.NM = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.ND = reader.GetInt32(2);
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
