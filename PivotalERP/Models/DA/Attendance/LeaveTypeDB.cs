using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{
   internal class LeaveTypeDB
   {

        DataAccessLayer1 dal = null;
        public LeaveTypeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.LeaveType beData, bool isModify)
       {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
           System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
           cmd.CommandType = System.Data.CommandType.StoredProcedure;
           cmd.Parameters.AddWithValue("@Name", beData.Name);
           cmd.Parameters.AddWithValue("@Code", beData.Code);
           cmd.Parameters.AddWithValue("@IncludeWeeklyOff", beData.IncludeWeeklyOff);
           cmd.Parameters.AddWithValue("@IncludeHoliday", beData.IncludeHoliday);
           cmd.Parameters.AddWithValue("@PaidLeave", beData.PaidLeave);
           cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@LeaveTypeId", beData.LeaveTypeId);
            if (isModify)
           {
               cmd.CommandText = "usp_UpdateLeaveType";
           }
           else
           {                
               cmd.CommandText = "usp_AddLeaveType";
               cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
           }

           cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
           cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
           cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
           cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
           cmd.Parameters.AddWithValue("@SNO", beData.SNo);
           cmd.Parameters.AddWithValue("@CarriedForward", beData.CarriedForward);
           cmd.Parameters.AddWithValue("@ApplicableForId", beData.ApplicableForId);

            try
           {
               cmd.ExecuteNonQuery();
               dal.CommitTransaction();

               if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[7].Value);

               if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

               if (!(cmd.Parameters[9].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

           }
           catch (System.Data.SqlClient.SqlException ee)
           {
                resVal.ResponseMSG = ee.Message;
           }
           catch (Exception ee)
           {
                resVal.ResponseMSG = ee.Message;
           }
           finally
           {
               dal.CloseConnection();
           }
            return resVal;

       }

        public ResponeValues DeleteById(int UserId, int EntityId, int LeaveTypeId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@LeaveTypeId", LeaveTypeId);
            cmd.CommandText = "usp_DelLeaveTypeById";
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

    
       public Dynamic.BE.Attendance.LeaveTypeCollections GetAllLeave(int UserId)
       {
           Dynamic.BE.Attendance.LeaveTypeCollections dataColl = new Dynamic.BE.Attendance.LeaveTypeCollections();

           dal.OpenConnection();

           try
           {
               System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
               cmd.CommandType = System.Data.CommandType.StoredProcedure;
               cmd.Parameters.AddWithValue("@UserId", UserId);
               cmd.CommandText = "usp_GetAllLeaveType";
               System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
               while (reader.Read())
               {
                   Dynamic.BE.Attendance.LeaveType beData = new Dynamic.BE.Attendance.LeaveType();
                   beData.LeaveTypeId = reader.GetInt32(0);
                   if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                   if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                   if (!(reader[3] is System.DBNull)) beData.IncludeWeeklyOff= reader.GetBoolean(3);
                   if (!(reader[4] is System.DBNull)) beData.IncludeHoliday = reader.GetBoolean(4);
                   if (!(reader[5] is System.DBNull)) beData.PaidLeave = reader.GetBoolean(5);
                   if (!(reader[6] is System.DBNull)) beData.Remarks = reader.GetString(6);
                   if (!(reader[7] is System.DBNull)) beData.UserName = reader.GetString(7);
                   if (!(reader[8] is System.DBNull)) beData.SNo = reader.GetInt32(8);
                   if (!(reader[9] is System.DBNull)) beData.CarriedForward = reader.GetBoolean(9);
                   if (!(reader[10] is System.DBNull)) beData.ApplicableForId =(BE.Attendance.LEAVETYPEAPPLICABLEFOR) reader.GetInt32(10);

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
       public Dynamic.BE.Attendance.LeaveType getLeaveById(int LeaveTypeId, int UserId)
       {
            Dynamic.BE.Attendance.LeaveType beData = new BE.Attendance.LeaveType() ;

           dal.OpenConnection();

           try
           {
               System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
               cmd.CommandType = System.Data.CommandType.StoredProcedure;
               cmd.Parameters.AddWithValue("@LeaveTypeId", LeaveTypeId);
               cmd.Parameters.AddWithValue("@UserId", UserId);
               cmd.CommandText = "usp_GetLeaveTypeById";
               System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
               if (reader.Read())
               {
                   beData = new Dynamic.BE.Attendance.LeaveType();
                   beData.LeaveTypeId = reader.GetInt32(0);
                   if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                   if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                   if (!(reader[3] is System.DBNull)) beData.IncludeWeeklyOff = reader.GetBoolean(3);
                   if (!(reader[4] is System.DBNull)) beData.IncludeHoliday = reader.GetBoolean(4);
                   if (!(reader[5] is System.DBNull)) beData.PaidLeave = reader.GetBoolean(5);
                   if (!(reader[6] is System.DBNull)) beData.Remarks = reader.GetString(6);
                   if (!(reader[7] is System.DBNull)) beData.CUserId = reader.GetInt32(7);
                   if (!(reader[8] is System.DBNull)) beData.SNo = reader.GetInt32(8);
                   if (!(reader[9] is System.DBNull)) beData.CarriedForward = reader.GetBoolean(9);
                   if (!(reader[10] is System.DBNull)) beData.ApplicableForId = (BE.Attendance.LEAVETYPEAPPLICABLEFOR)reader.GetInt32(10);
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