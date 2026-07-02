using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{
    internal class LeaveQuotaDB
    {
         DataAccessLayer1 dal = null;
        public LeaveQuotaDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.LeaveQuota beData, bool isModify)
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
            cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
            if (isModify)
            {
                cmd.CommandText = "sp_UpdateLeaveQuota";
            }
            else
            {   
                cmd.CommandText = "sp_AddLeaveQuota";
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            }

            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@PeriodId", beData.PeriodId);

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
                    beData.LeaveQuotaId = resVal.RId;

                    if (beData.LeaveQuotaDetail != null)
                        SaveLeaveDetail(beData.LeaveQuotaId.Value, beData.LeaveQuotaDetail);


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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_CompanyWiseLeaveQuota(CompanyId,LeaveQuotaId) values(@CompanyId,@LeaveQuotaId)";
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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_BranchWiseLeaveQuota(BranchId,LeaveQuotaId) values(@BranchId,@LeaveQuotaId)";
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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_DepartmentwiseLeaveQuota(DepartmentId,LeaveQuotaId) values(@DepartmentId,@LeaveQuotaId)";
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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_DesignationwiseLeaveQuota(DesignationId,LeaveQuotaId) values(@DesignationId,@LeaveQuotaId)";
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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_ServiceTypewiseLeaveQuota(ServiceTypeId,LeaveQuotaId) values(@ServiceTypeId,@LeaveQuotaId)";
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
                                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                                    cmd.CommandText = "insert into tbl_EmployeewiseLeaveQuota(EmployeeId,LeaveQuotaId) values(@EmployeeId,@LeaveQuotaId)";
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        } 
                    }

                    dal.CommitTransaction();

                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
                    cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                    cmd.CommandText = "sp_SaveUpdateAllowEmployeeWiseLeaveQuota";
                    cmd.ExecuteNonQuery();
                    
                }
                //if (beData.Gender != null && beData.Gender.Count > 0)
                //{
                //    foreach (int Gender in beData.Gender)
                //    {
                //        cmd.Parameters.Clear();
                //        cmd.Parameters.AddWithValue("@Gender", Gender);
                //        cmd.Parameters.AddWithValue("@LeaveQuotaId", beData.LeaveQuotaId);
                //        cmd.CommandText = "insert into tbl_GenderwiseHoliday(Gender,LeaveQuotaId) values(@Gender,@LeaveQuotaId)";
                //        cmd.ExecuteNonQuery();
                //    }
                //}

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
        private void SaveLeaveDetail(int LeaveQuotaId, Dynamic.BE.Attendance.LeaveQuotaDetailsCollections dataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            foreach (var beData in dataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@LeaveQuotaId", LeaveQuotaId);
                cmd.Parameters.AddWithValue("@LeaveTypeId", beData.LeaveTypeId);
                cmd.Parameters.AddWithValue("@NoOfLeave", beData.NoOfLeave);

                cmd.CommandText = "sp_AddLeaveDetails";

                cmd.ExecuteNonQuery();
            }


        }

        public ResponeValues DeleteById(int UserId, int EntityId, int LeaveQuotaId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@LeaveQuotaId", LeaveQuotaId);
            cmd.CommandText = "usp_DelLeaveQuotaById";
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
  
        public Dynamic.BE.Attendance.LeaveQuotaCollections getAllLeaveQuota(int UserId)
        {
            Dynamic.BE.Attendance.LeaveQuotaCollections dataColl = new Dynamic.BE.Attendance.LeaveQuotaCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllLeaveQuota";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.LeaveQuota beData = new Dynamic.BE.Attendance.LeaveQuota();
                    beData.LeaveQuotaId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.DateFrom = reader.GetDateTime(1);
                    if (!(reader[2] is System.DBNull)) beData.DateTo = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.UserName = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.DateFromBS = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.DateToBS = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.PeriodId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.PeriodName = reader.GetString(8);
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
        public Dynamic.BE.Attendance.LeaveQuota getLeaveQuotaById(int UserId, int LeaveQuotaId)
        {
            Dynamic.BE.Attendance.LeaveQuota beData = new BE.Attendance.LeaveQuota();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@LeaveQuotaId", LeaveQuotaId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetLeaveQuotaById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.Attendance.LeaveQuota();
                    beData.LeaveQuotaId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.DateFrom = reader.GetDateTime(1);
                    if (!(reader[2] is System.DBNull)) beData.DateTo = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.UserName = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.PeriodId = reader.GetInt32(5);
                }
                reader.NextResult();

                beData.LeaveQuotaDetail = new BE.Attendance.LeaveQuotaDetailsCollections();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.LeaveQuotaDetails det = new BE.Attendance.LeaveQuotaDetails();
                    det.LeaveTypeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) det.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) det.NoOfLeave = Convert.ToDouble(reader[2]);
                    beData.LeaveQuotaDetail.Add(det);                    
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

                //while (reader.Read())
                //{
                //    BusinessEntity.Attendance.LeaveQuotaDetails lqd = new BusinessEntity.Attendance.LeaveQuotaDetails();
                //    if (!(reader[0] is System.DBNull)) lqd.LeaveId = reader.GetInt32(0);
                //    if (!(reader[1] is System.DBNull)) lqd.NoOfLeave = reader.GetDouble(1);

                //    beData.LeaveQuotaDetail.Add(lqd);
                //}
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


        public RE.Leave.LeaveQuotaSummaryCollections getLeaveBalanceSummary(int UserId, string BranchIdColl, string DepartmentIdColl, string CategoryIdColl, int? EmployeeId, int? PeriodId,int? LeaveTypeId,int? ForUserId)
        {
            RE.Leave.LeaveQuotaSummaryCollections dataColl = new RE.Leave.LeaveQuotaSummaryCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
                cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);
                cmd.Parameters.AddWithValue("@CategoryIdColl", CategoryIdColl);                 
                cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
                cmd.Parameters.AddWithValue("@LeaveTypeId", LeaveTypeId);
                cmd.Parameters.AddWithValue("@ForUserId", ForUserId);
                cmd.CommandText = "sp_GetLeaveBalanaceSummary";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int sno = 1;
                while (reader.Read())
                {
                    RE.Leave.LeaveQuotaSummary beData = new RE.Leave.LeaveQuotaSummary();
                    beData.SNo = sno;
                    if (!(reader[0] is System.DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LeaveId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.EmployeeCode = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Branch = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Department = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.Category = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.OfficeContact = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.PersonalContact = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) beData.LeaveName = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) beData.LeaveCode = reader.GetString(10);
                    if (!(reader[11] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.QuotaQty = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.LeaveQty = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.Balance = Convert.ToDouble(reader[14]);

                    dataColl.Add(beData);
                    sno++;
                }

                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = "Success";

                return dataColl;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
                return dataColl;
            }
            finally
            {
                dal.CloseConnection();
            }
        }


    }
}