using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

    internal class AttendanceColorConfigDB
    {
        DataAccessLayer1 dal = null;
        public AttendanceColorConfigDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(BE.Attendance.AttendanceColorConfig beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Present", beData.Present);
            cmd.Parameters.AddWithValue("@PColor", beData.PColor);
            cmd.Parameters.AddWithValue("@PCellColor", beData.PCellColor);
            cmd.Parameters.AddWithValue("@PresentB", beData.PresentB);
            cmd.Parameters.AddWithValue("@Absent", beData.Absent);
            cmd.Parameters.AddWithValue("@AColor", beData.AColor);
            cmd.Parameters.AddWithValue("@ACellColor", beData.ACellColor);
            cmd.Parameters.AddWithValue("@AbsentB", beData.AbsentB);
            cmd.Parameters.AddWithValue("@Leave", beData.Leave);
            cmd.Parameters.AddWithValue("@LColor", beData.LColor);
            cmd.Parameters.AddWithValue("@LCellColor", beData.LCellColor);
            cmd.Parameters.AddWithValue("@LeaveB", beData.LeaveB);
            cmd.Parameters.AddWithValue("@Weekend", beData.Weekend);
            cmd.Parameters.AddWithValue("@WColor", beData.WColor);
            cmd.Parameters.AddWithValue("@WCellColor", beData.WCellColor);
            cmd.Parameters.AddWithValue("@WeekendB", beData.WeekendB);
            cmd.Parameters.AddWithValue("@Holiday", beData.Holiday);
            cmd.Parameters.AddWithValue("@HColor", beData.HColor);
            cmd.Parameters.AddWithValue("@HCellColor", beData.HCellColor);
            cmd.Parameters.AddWithValue("@HolidayB", beData.HolidayB);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateAttendanceColorConfig";
            }
            else
            {
                cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddAttendanceColorConfig";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[25].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[22].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[22].Value);

                if (!(cmd.Parameters[23].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[23].Value);

                if (!(cmd.Parameters[24].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[24].Value);

                if (!(cmd.Parameters[25].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[25].Value);

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
        public BE.Attendance.AttendanceColorConfig getAllAttendanceColorConfig(int UserId, int EntityId)
        {
            BE.Attendance.AttendanceColorConfig beData = new BE.Attendance.AttendanceColorConfig();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllAttendanceColorConfig";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.Attendance.AttendanceColorConfig();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Present = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.PColor = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.PCellColor = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.PresentB = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.Absent = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.AColor = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ACellColor = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.AbsentB = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.Leave = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.LColor = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.LCellColor = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.LeaveB = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.Weekend = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.WColor = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.WCellColor = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.WeekendB = reader.GetInt32(16);
                    if (!(reader[17] is DBNull)) beData.Holiday = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.HColor = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.HCellColor = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.HolidayB = reader.GetInt32(20);

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

