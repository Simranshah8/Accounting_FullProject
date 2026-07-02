using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Dynamic.DA.Attendance
{
    internal class AllowLeaveTypeDB
    {
        DataAccessLayer1 dal = null;
        public AllowLeaveTypeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues UpdateAllowLeaveType(int UserId, List<Dynamic.BE.Attendance.AllowLeaveType> DataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsValid", System.Data.SqlDbType.Bit);
                cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Bit);
                cmd.Parameters[0].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@UserId", UserId);
                System.Data.DataTable tableAllocation = new System.Data.DataTable();
                tableAllocation.Columns.Add("UserId", typeof(int));
                tableAllocation.Columns.Add("LeaveTypeId", typeof(int));


                foreach (var v in DataColl)
                {
                    var row = tableAllocation.NewRow();
                    row["UserId"] = v.UserId;
                    row["LeaveTypeId"] = v.LeaveTypeId;
                    tableAllocation.Rows.Add(row);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@AllowLeaveTypeColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;
                cmd.CommandText = "usp_AddAllowLeaveType";
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[0].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[0].Value);
                if (!(cmd.Parameters[1].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[1].Value);
                if (!(cmd.Parameters[2].Value is DBNull)) resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[2].Value);

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


        public Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections getAllAllowLeaveType(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? DesignationId, int? LevelId, int? EmployeeGroupId, int? CompanyRelationshipId = null)
        {
            Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections dataColl = new Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
            cmd.Parameters.AddWithValue("@LevelId", LevelId);
            cmd.Parameters.AddWithValue("@EmployeeGroupId", EmployeeGroupId);
            cmd.Parameters.AddWithValue("@CompanyRelationshipId", CompanyRelationshipId);
            cmd.CommandText = "usp_GetEmployeForAllowLeaveType";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.EmployeeForAllowLeaveType beData = new Dynamic.BE.Attendance.EmployeeForAllowLeaveType();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.LeaveTypeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.IsAllow = Convert.ToBoolean(reader[2]);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[4]);
                    if (!(reader[5] is DBNull)) beData.EmployeeName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Branch = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Designation = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.SNo = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.LeaveType = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.TranId = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.UserId = reader.GetInt32(12);
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
        //Add by prashtn Baishak 09
        public Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections GetLeaveTypeByEmployee(int UserId, int UsersId)
        {
            Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections dataColl = new Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.CommandText = "usp_GetLeaveTypeByEmployee";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.EmployeeForAllowLeaveType beData = new Dynamic.BE.Attendance.EmployeeForAllowLeaveType();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.LeaveTypeId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.LeaveType = reader.GetString(3);
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