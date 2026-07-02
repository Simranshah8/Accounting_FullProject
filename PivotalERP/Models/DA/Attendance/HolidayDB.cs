using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{
    internal class HolidayDB
    {
        DataAccessLayer1 dal = null;
        public HolidayDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.Holiday beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdateHolidays";
            }
            else
            {
                cmd.CommandText = "usp_AddHolidays";
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            }

            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@Code", beData.Code);
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                cmd.CommandType = System.Data.CommandType.Text;

                if (resVal.IsSuccess)
                {
                    beData.HolidayId = resVal.RId;

                    if (beData.CompanyId != null && beData.CompanyId.Count > 0)
                    {
                        if (!beData.CompanyId.Contains(0))
                        {
                            foreach (int CompanyId in beData.CompanyId)
                            {
                                if (CompanyId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_CompanyWiseHoliday(CompanyId,HolidayId) values(@CompanyId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }

                    }

                    if (beData.BranchId != null && beData.BranchId.Count > 0)
                    {
                        if (!beData.BranchId.Contains(0))
                        {
                            foreach (int BranchId in beData.BranchId)
                            {
                                if (BranchId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@BranchId", BranchId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_BranchWiseHoliday(BranchId,HolidayId) values(@BranchId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }

                    }
                    if (beData.DepartmentId != null && beData.DepartmentId.Count > 0)
                    {
                        if (!beData.DepartmentId.Contains(0))
                        {
                            foreach (int DepartmentId in beData.DepartmentId)
                            {
                                if (DepartmentId > 0)
                                {

                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_DepartmentwiseHoliday(DepartmentId,HolidayId) values(@DepartmentId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }

                    }
                    if (beData.DesignationId != null && beData.DesignationId.Count > 0)
                    {
                        if (!beData.DesignationId.Contains(0))
                        {
                            foreach (int DesignationId in beData.DesignationId)
                            {
                                if (DesignationId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_DesignationwiseHoliday(DesignationId,HolidayId) values(@DesignationId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }
                    if (beData.ServiceTypeId != null && beData.ServiceTypeId.Count > 0)
                    {
                        if (!beData.ServiceTypeId.Contains(0))
                        {
                            foreach (int ServiceTypeId in beData.ServiceTypeId)
                            {
                                if (ServiceTypeId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@ServiceTypeId", ServiceTypeId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_ServiceTypewiseHoliday(ServiceTypeId,HolidayId) values(@ServiceTypeId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }

                        }

                    }
                    if (beData.EmployeeId != null && beData.EmployeeId.Count > 0)
                    {
                        if (!beData.EmployeeId.Contains(0))
                        {
                            foreach (int EmployeeId in beData.EmployeeId)
                            {
                                if (EmployeeId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_EmployeewiseHoliday(EmployeeId,HolidayId) values(@EmployeeId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }

                    if (beData.GenderId != null && beData.GenderId.Count > 0)
                    {
                        if (!beData.GenderId.Contains(0))
                        {
                            foreach (int GenderId in beData.GenderId)
                            {
                                if (GenderId > 0)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@GenderId", GenderId);
                                    cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                                    cmd.CommandText = "insert into tbl_GenderWiseHoliday(GenderId,HolidayId) values(@GenderId,@HolidayId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }

                    dal.CommitTransaction();

                    //cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    //cmd.Parameters.Clear();
                    //cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
                    //cmd.Parameters.AddWithValue("@HolidayId", beData.HolidayId);
                    //cmd.CommandText = "usp_SaveUpdateAllowEmployeeWiseHoliday";
                    //cmd.ExecuteNonQuery();

                }

            }

            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.ResponseMSG = ee.Message;

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues DeleteById(int UserId, int EntityId, int HolidayId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@HolidayId", HolidayId);
            cmd.CommandText = "usp_DelHolidayById";
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

        public Dynamic.BE.Attendance.HolidayCollections getAllHoliday(int UserId)
        {
            Dynamic.BE.Attendance.HolidayCollections dataColl = new Dynamic.BE.Attendance.HolidayCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetAllHoliday";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.Holiday beData = new Dynamic.BE.Attendance.Holiday();
                    beData.HolidayId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.DateFrom = reader.GetDateTime(1);
                    if (!(reader[2] is System.DBNull)) beData.DateTo = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.DateFromBS = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.DateToBS = reader.GetString(5);
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
        public Dynamic.BE.Attendance.Holiday getHolidayById(int UserId, int HolidayId)
        {
            Dynamic.BE.Attendance.Holiday beData = new BE.Attendance.Holiday();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@HolidayId", HolidayId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetHolidayById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.Attendance.Holiday();
                    beData.HolidayId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.DateFrom = reader.GetDateTime(1);
                    if (!(reader[2] is System.DBNull)) beData.DateTo = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                }
                reader.NextResult();

                beData.CompanyId = new List<int>();
                while (reader.Read())
                {
                    beData.CompanyId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

                beData.BranchId = new List<int>();
                while (reader.Read())
                {
                    beData.BranchId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

                beData.DepartmentId = new List<int>();
                while (reader.Read())
                {
                    beData.DepartmentId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

                beData.DesignationId = new List<int>();
                while (reader.Read())
                {
                    beData.DesignationId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

                beData.ServiceTypeId = new List<int>();
                while (reader.Read())
                {
                    beData.ServiceTypeId.Add(reader.GetInt32(0));
                }

                reader.NextResult();

                beData.EmployeeId = new List<int>();
                while (reader.Read())
                {
                    beData.EmployeeId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

                beData.GenderId = new List<int>();
                while (reader.Read())
                {
                    beData.GenderId.Add(reader.GetInt32(0));
                }
                reader.NextResult();

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