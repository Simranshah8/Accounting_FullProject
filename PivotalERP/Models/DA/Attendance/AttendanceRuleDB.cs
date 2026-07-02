using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

    internal class AttendanceRuleDB
    {
        DataAccessLayer1 dal = null;
        public AttendanceRuleDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(BE.Attendance.AttendanceRule beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
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

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateAttendanceRule";
            }
            else
            {
                cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddAttendanceRule";
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
            cmd.CommandText = "usp_DelAttendanceRuleById";
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
        public BE.Attendance.AttendanceRuleCollections getAllAttendanceRule(int UserId, int EntityId)
        {
            BE.Attendance.AttendanceRuleCollections dataColl = new BE.Attendance.AttendanceRuleCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllAttendanceRule";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.AttendanceRule beData = new BE.Attendance.AttendanceRule();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PermittedLateArrival = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.PermittedEarlyDeparture = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.HalfDayLessThanHr = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.AbsentiLessThanHr = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.LateArrival = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.LateArrivalCut = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.EarlyDeparture = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.EarlyDepartureCut = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.LateIncoming = Convert.ToBoolean(reader[9]);
                    if (!(reader[10] is DBNull)) beData.NoOfLateInAMonth = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.CutDays = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.IgnoreOTDLessthan = reader.GetInt32(12);
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
        public BE.Attendance.AttendanceRule getAttendanceRuleById(int UserId)
        {
            BE.Attendance.AttendanceRule beData = new BE.Attendance.AttendanceRule();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_GetAttendanceRuleById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.Attendance.AttendanceRule();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PermittedLateArrival = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.PermittedEarlyDeparture = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.HalfDayLessThanHr = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.AbsentiLessThanHr = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.LateArrival = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.LateArrivalCut = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.EarlyDeparture = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.EarlyDepartureCut = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.LateIncoming = Convert.ToBoolean(reader[9]);
                    if (!(reader[10] is DBNull)) beData.NoOfLateInAMonth = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.CutDays = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.IgnoreOTDLessthan = reader.GetInt32(12);
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

