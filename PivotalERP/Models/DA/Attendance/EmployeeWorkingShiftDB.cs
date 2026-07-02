using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.Attendance
{
    internal class EmployeeWorkingShiftDB
    {
        DataAccessLayer1 dal = null;
        public EmployeeWorkingShiftDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(BE.Attendance.WorkingShift beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
           
            cmd.Parameters.AddWithValue("@OnDutyTime", beData.OnDutyTime);
            cmd.Parameters.AddWithValue("@OffDutyTime", beData.OffDutyTime);
            cmd.Parameters.AddWithValue("@ShiftDuration", beData.ShiftDuration);
            cmd.Parameters.AddWithValue("@EnableTwoShiftInADay", beData.EnableTwoShiftInADay);
            cmd.Parameters.AddWithValue("@Break1", beData.Break1);
            cmd.Parameters.AddWithValue("@Break1StartTime", beData.Break1StartTime);
            cmd.Parameters.AddWithValue("@Break1EndTime", beData.Break1EndTime);
            cmd.Parameters.AddWithValue("@Break1Duration", beData.Break1Duration);
            cmd.Parameters.AddWithValue("@Break2", beData.Break2);
            cmd.Parameters.AddWithValue("@Break2StartTime", beData.Break2StartTime);
            cmd.Parameters.AddWithValue("@Break2EndTime", beData.Break2EndTime);
            cmd.Parameters.AddWithValue("@Break2Duration", beData.Break2Duration);
            cmd.Parameters.AddWithValue("@HalfDay", beData.HalfDay);
            cmd.Parameters.AddWithValue("@HalfDayStartTime", beData.HalfDayStartTime);
            cmd.Parameters.AddWithValue("@HalfDayEndTime", beData.HalfDayEndTime);
            cmd.Parameters.AddWithValue("@HalfDayDuration", beData.HalfDayDuration);
            cmd.Parameters.AddWithValue("@FirstWeeklyOff", beData.FirstWeeklyOff);
            cmd.Parameters.AddWithValue("@SecondWeeklyOff", beData.SecondWeeklyOff);
            cmd.Parameters.AddWithValue("@SecondWeeklyOffType", beData.SecondWeeklyOffType);
            cmd.Parameters.AddWithValue("@RemoveDuplicatePunch", beData.RemoveDuplicatePunch);
            cmd.Parameters.AddWithValue("@SinglePunchPolicy", beData.SinglePunchPolicy);
            cmd.Parameters.AddWithValue("@MaxEarlyMinutesAllow", beData.MaxEarlyMinutesAllow);
            cmd.Parameters.AddWithValue("@MaxOTAllow", beData.MaxOTAllow);
            cmd.Parameters.AddWithValue("@NoofPresentforWeeklyOff", beData.NoofPresentforWeeklyOff);
            cmd.Parameters.AddWithValue("@WAWAbsent", beData.WAWAbsent);
            cmd.Parameters.AddWithValue("@LWLAbsent", beData.LWLAbsent);
            cmd.Parameters.AddWithValue("@OTCalculation", beData.OTCalculation);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
            cmd.CommandText = "sp_AddEmpWorkingShift";            
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[29].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[30].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[31].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@AbsentNoticeTime", beData.AbsentNoticeTime);
            // Prasahnt  Code 27 Katrik 
            cmd.Parameters.AddWithValue("@PermittedLateArrival", beData.PermittedLateArrival);
            cmd.Parameters.AddWithValue("@PermittedEarlyDeparture", beData.PermittedEarlyDeparture);
            cmd.Parameters.AddWithValue("@HalfDayLessThanHr", beData.HalfDayLessThanHr);
            cmd.Parameters.AddWithValue("@AbsentiLessThanHr", beData.AbsentiLessThanHr);
            cmd.Parameters.AddWithValue("@LateArrival", beData.LateArrival);
            cmd.Parameters.AddWithValue("@LateArrivalCut", beData.LateArrivalCut);
            cmd.Parameters.AddWithValue("@EarlyDeparture", beData.EarlyDeparture);
            cmd.Parameters.AddWithValue("@EarlyDepartureCut", beData.EarlyDepartureCut);
            cmd.Parameters.AddWithValue("@LateIncoming", beData.LateIncoming);
            cmd.Parameters.AddWithValue("@NoOfLateInAMonth", beData.NoOfLateInAMonth);
            cmd.Parameters.AddWithValue("@CutDays", beData.CutDays);
            cmd.Parameters.AddWithValue("@IgnoreOTDLessthan", beData.IgnoreOTDLessthan);
            //END / Prasahnt  Code 27 Katrik 
            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.RId = beData.EmployeeId.Value;

                if (!(cmd.Parameters[29].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[29].Value);

                if (!(cmd.Parameters[30].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[30].Value);

                if (!(cmd.Parameters[31].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[31].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

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

        public ResponeValues DeleteById(int UserId, int EntityId, int EmployeeId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.CommandText = "usp_DelEmpWorkingShiftById";
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
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

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

        public BE.Attendance.WorkingShiftCollections getAllWorkingShift(int UserId)
        {
            BE.Attendance.WorkingShiftCollections dataColl = new BE.Attendance.WorkingShiftCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllEmpWorkingShift";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.WorkingShift beData = new BE.Attendance.WorkingShift();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[3]);
                        beData.OnDutyTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                        beData.OnDurtyTimeStr = beData.OnDutyTime.Value.ToString("HH:mm tt");
                    }

                    if (!(reader[4] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[4]);
                        beData.OffDutyTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                        beData.OffDutyTimeStr = beData.OffDutyTime.Value.ToString("HH:mm tt");
                    }

                    if (!(reader[5] is System.DBNull)) beData.ShiftDuration = reader.GetInt32(5);

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
        public BE.Attendance.WorkingShift getWorkingShiftById(int EmployeeId, int UserId)
        {
            BE.Attendance.WorkingShift beData = new BE.Attendance.WorkingShift();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetEmpWorkingShiftById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    beData = new BE.Attendance.WorkingShift();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[3]);
                        beData.OnDutyTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[4] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[4]);
                        beData.OffDutyTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[5] is System.DBNull)) beData.ShiftDuration = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.EnableTwoShiftInADay = reader.GetBoolean(6);
                    if (!(reader[7] is System.DBNull)) beData.Break1 = reader.GetBoolean(7);
                    if (!(reader[8] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[8]);
                        beData.Break1StartTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[9] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[9]);
                        beData.Break1EndTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[10] is System.DBNull)) beData.Break1Duration = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.Break2 = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[12]);
                        beData.Break2StartTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[13] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[13]);
                        beData.Break2EndTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[14] is System.DBNull)) beData.Break2Duration = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.HalfDay = reader.GetBoolean(15);
                    if (!(reader[16] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[16]);
                        beData.HalfDayStartTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[17] is System.DBNull))
                    {
                        TimeSpan ts = ((TimeSpan)reader[17]);
                        beData.HalfDayEndTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, ts.Hours, ts.Minutes, ts.Seconds);
                    }
                    if (!(reader[18] is System.DBNull)) beData.HalfDayDuration = reader.GetInt32(18);
                    if (!(reader[19] is System.DBNull)) beData.FirstWeeklyOff = reader.GetInt32(19);
                    if (!(reader[20] is System.DBNull)) beData.SecondWeeklyOff = reader.GetInt32(20);
                    if (!(reader[21] is System.DBNull)) beData.SecondWeeklyOffType = reader.GetInt32(21);
                    if (!(reader[22] is System.DBNull))
                    {
                        beData.RemoveDuplicatePunch = reader.GetInt32(22);
                    }
                    if (!(reader[23] is System.DBNull)) beData.SinglePunchPolicy = reader.GetInt32(23);
                    if (!(reader[24] is System.DBNull))
                    {
                        beData.MaxEarlyMinutesAllow = reader.GetInt32(24);
                    }
                    if (!(reader[25] is System.DBNull))
                    {
                        beData.MaxOTAllow = reader.GetInt32(25);
                    }
                    if (!(reader[26] is System.DBNull)) beData.NoofPresentforWeeklyOff = reader.GetInt32(26);
                    if (!(reader[27] is System.DBNull)) beData.WAWAbsent = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.LWLAbsent = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.OTCalculation = reader.GetInt32(29);
                    if (!(reader[30] is System.DBNull)) beData.AbsentNoticeTime = reader.GetDateTime(30);
                    //Prasahnt  Code 27 Katrik 

                    if (!(reader[31] is System.DBNull)) beData.PermittedLateArrival = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is System.DBNull)) beData.PermittedEarlyDeparture = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is System.DBNull)) beData.HalfDayLessThanHr = Convert.ToDouble(reader[33]);
                    if (!(reader[34] is System.DBNull)) beData.AbsentiLessThanHr = Convert.ToDouble(reader[34]);
                    if (!(reader[35] is System.DBNull)) beData.LateArrival = Convert.ToDouble(reader[35]);
                    if (!(reader[36] is System.DBNull)) beData.LateArrivalCut = reader.GetInt32(36);
                    if (!(reader[37] is System.DBNull)) beData.EarlyDeparture = Convert.ToDouble(reader[37]);
                    if (!(reader[38] is System.DBNull)) beData.EarlyDepartureCut = reader.GetInt32(38);
                    if (!(reader[39] is System.DBNull)) beData.LateIncoming = Convert.ToBoolean(reader[39]);
                    if (!(reader[40] is System.DBNull)) beData.NoOfLateInAMonth = reader.GetInt32(40);
                    if (!(reader[41] is System.DBNull)) beData.CutDays = reader.GetInt32(41);
                    if (!(reader[42] is System.DBNull)) beData.IgnoreOTDLessthan = Convert.ToDouble(reader[42]);
                    //END Prasahnt  Code 27 Katrik 

                    beData.IsSuccess = true;
                    beData.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    beData.IsSuccess = false;
                    beData.ResponseMSG = "No Data Found";
                }
                reader.Close();

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
