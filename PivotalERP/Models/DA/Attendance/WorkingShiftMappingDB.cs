using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.Attendance
{
    internal class WorkingShiftMappingDB
    {
        DataAccessLayer1 dal = null;
        public WorkingShiftMappingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveWSM(BE.Attendance.WorkingShiftMapping beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();           
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
            cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
            cmd.CommandText = "usp_DelShiftMappingforSet";
            cmd.ExecuteNonQuery();

            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
            cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.Add("@ShiftMappingId", System.Data.SqlDbType.Int);
            cmd.CommandText = "sp_AddShiftMapping";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@IsMultipleShift", beData.IsMultipleShift);
            var newGuId = Guid.NewGuid().ToString();            
            cmd.Parameters.AddWithValue("@NewGuId", newGuId);

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

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

        public ResponeValues DelDuplicate(int UserId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);            
            cmd.CommandText = "usp_DelDuplicateWorkingShift";            
            try
            {
                cmd.ExecuteNonQuery();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Duplicate Shiftmapping was deleted";

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
        public ResponeValues DeleteById(int UserId, int EntityId, int ShiftMappingId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);            
            cmd.Parameters.AddWithValue("@ShiftMappingId", ShiftMappingId);
            cmd.CommandText = "sp_DeleteShiftMapping";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[2].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[2].Value);

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[3].Value);

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[4].Value);

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

        public ResponeValues DeleteById(int UserId, int WorkingShiftId,int EmployeeId,DateTime DateFrom,DateTime DateTo)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@WorkingShiftId", WorkingShiftId);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_DelShiftMappingforSet";            
            try
            {
                cmd.ExecuteNonQuery();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "ShiftMapping deleted";
              
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

        public BE.Attendance.WorkingShiftMappingCollections getAllShiftMapping(int UserId)
        {
            BE.Attendance.WorkingShiftMappingCollections dataColl = new BE.Attendance.WorkingShiftMappingCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllShiftMapping";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.WorkingShiftMapping beData = new BE.Attendance.WorkingShiftMapping();
                    beData.ShiftMappingId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Department = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Designation = reader.GetString(2);                    
                    if (!(reader[3] is System.DBNull)) beData.EmployeeId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.WorkingShiftName = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.DateFrom_AD = reader.GetDateTime(5);
                    if (!(reader[6] is System.DBNull)) beData.DateTo_AD = reader.GetDateTime(6);
                    if (!(reader[7] is System.DBNull)) beData.EmpName = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.EmpCode = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) beData.DateFrom_BS = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) beData.DateTo_BS = reader.GetString(10);

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


        //Code add by Prashant on 30 Kartik


        //Code add by Prashant on 07 Mangsir
        //Change in filter 
        //Added Parameter to GetMappingEmployee ,BranchId ,DepartmentId,CategoryId,DesignationId
        //Also Add In bdData

        public BE.Attendance.WorkingShiftMappingCollections GetMappingEmployee(int UserId, int? WorkingShiftId, DateTime? DateFrom, DateTime? DateTo, int? BranchId, int? DepartmentId, int? CategoryId, int? DesignationId,int? CompanyId)
        {
            BE.Attendance.WorkingShiftMappingCollections dataColl = new BE.Attendance.WorkingShiftMappingCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@WorkingShiftId", WorkingShiftId);
                cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
                cmd.Parameters.AddWithValue("@DateTo", DateTo);
                cmd.Parameters.AddWithValue("@BranchId", BranchId);
                cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
                cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
                cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
                cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
                cmd.CommandText = "usp_GetMappingEmployee";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.WorkingShiftMapping beData = new BE.Attendance.WorkingShiftMapping();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.EmpName = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.EmpCode = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.BranchName = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Department = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.Designation = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.WorkingShiftId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.WorkingShift = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) beData.DateFrom_AD = reader.GetDateTime(9);
                    if (!(reader[10] is System.DBNull)) beData.DateTo_AD = reader.GetDateTime(10);
                    if (!(reader[11] is System.DBNull)) beData.ShiftMappingId = reader.GetInt32(11);

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

        //Code add by Prashant on 06 Mangsir

        public Dynamic.BE.Attendance.WorkingShiftMappingCollections GetShiftMappingByEmp(int UserId, int EmployeeId)
        {
            Dynamic.BE.Attendance.WorkingShiftMappingCollections beData = new BE.Attendance.WorkingShiftMappingCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                cmd.CommandText = "usp_GetShiftMappingByEmp";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.WorkingShiftMapping det = new BE.Attendance.WorkingShiftMapping();
                    det.ShiftMappingId = reader.GetInt32(0);
                    if (!(reader[0] is System.DBNull)) det.ShiftMappingId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) det.WorkingShiftId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) det.WorkingShift = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) det.DateFrom_AD = reader.GetDateTime(3);
                    if (!(reader[4] is System.DBNull)) det.DateTo_AD = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) det.IsMultipleShift = Convert.ToBoolean(reader[5]);
                    beData.Add(det);
                }

                beData.IsSuccess = true;
                beData.ResponseMSG = GLOBALMSG.SUCCESS;
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


        public ResponeValues SaveUpdate(int UserId, List<BE.Attendance.WorkingShiftMapping> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                var fst = dataColl.First();

                var newGuId = Guid.NewGuid().ToString();
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
                    cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
                    cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
                    cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
                    cmd.CommandText = "usp_DelShiftMappingforSet";
                    cmd.ExecuteNonQuery();

                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
                    cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
                    cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
                    cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.Add("@ShiftMappingId", System.Data.SqlDbType.Int);
                    cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                    cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                    cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
                    cmd.CommandText = "sp_AddShiftMapping";
                    cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@IsMultipleShift", beData.IsMultipleShift);
                    cmd.Parameters.AddWithValue("@NewGuId",newGuId);
                    cmd.ExecuteNonQuery();

                }
                dal.CommitTransaction();

                DelDuplicate(UserId);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Your data has been saved successfully.";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }


        public ResponeValues SaveSMColl(int UserId, Dynamic.BE.Attendance.WorkingShiftMappingCollections dataColl)
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
                    cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
                    cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
                    cmd.CommandText = "usp_DelShiftMappingforSet";
                    cmd.ExecuteNonQuery();

                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
                    cmd.Parameters.AddWithValue("@WorkingShiftId", beData.WorkingShiftId);
                    cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom_AD);
                    cmd.Parameters.AddWithValue("@DateTo", beData.DateTo_AD);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.Add("@ShiftMappingId", System.Data.SqlDbType.Int);
                    cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                    cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                    cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
                    cmd.CommandText = "sp_AddShiftMapping";
                    cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@IsMultipleShift", beData.IsMultipleShift);
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




    }
}
