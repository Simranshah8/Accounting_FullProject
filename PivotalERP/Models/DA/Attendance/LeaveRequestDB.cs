using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{
    internal class LeaveRequestDB
    {
        DataAccessLayer1 dal = null;
        public LeaveRequestDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.LeaveRequest beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
            cmd.Parameters.AddWithValue("@LeaveTypeId", beData.LeaveTypeId);
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);
            cmd.Parameters.AddWithValue("@TotalDays", beData.TotalDays);
            cmd.Parameters.AddWithValue("@AlternativeEmployeeId", beData.AlternativeEmployeeId);
            cmd.Parameters.AddWithValue("@MessagetoAllEmployee", beData.MessagetoAllEmployee);
            cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
            cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@LeaveRequestId", beData.LeaveRequestId);

            if (isModify)
            {
                cmd.CommandText = "sp_UpdateLeaveRequest";
            }
            else
            {
                cmd.CommandText = "sp_AddLeaveRequest";
                cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
            }

            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;

            cmd.Parameters.AddWithValue("@LeaveDuration", beData.LeaveDuration);
            cmd.Parameters.AddWithValue("@LeavePeriod", beData.LeavePeriod);
            cmd.Parameters.AddWithValue("@LeaveHours", beData.LeaveHours);

            try
            {
                cmd.ExecuteNonQuery();


                if (!(cmd.Parameters[10].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[10].Value);

                if (!(cmd.Parameters[11].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[11].Value);

                if (!(cmd.Parameters[12].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[12].Value);

                if (beData.LeaveRequestDocumentColl != null && beData.LeaveRequestDocumentColl.Count > 0)
                    SaveLeaveRequestDocument(resVal.RId, beData.LeaveRequestDocumentColl);


            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;

            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;

            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        public void UpdateLeaveRequest(Dynamic.BE.Attendance.LeaveRequest beData)
        {
            dal.OpenConnection();

            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@LeaveRequestId", beData.LeaveRequestId);
            cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
            cmd.Parameters.AddWithValue("@ApprovedByUser", beData.ApprovedByUser);
            cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
            cmd.Parameters.AddWithValue("@ApprovedType", beData.ApprovedType);
            cmd.CommandText = "sp_UpdateLeaveRequestApproved";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@EmployeeId", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;


            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    beData.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    beData.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    beData.EmployeeId = Convert.ToInt32(cmd.Parameters[7].Value);

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                beData.ResponseMSG = ee.Message;
                beData.IsSuccess = false;
                //throw ee;
            }
            catch (Exception ee)
            {
                beData.ResponseMSG = ee.Message;
                beData.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        private void SaveLeaveRequestDocument(int LeaveRequestId, Dynamic.BusinessEntity.GeneralDocumentCollections beDataColl)
        {


            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            foreach (var beData in beDataColl)
            {
                if (LeaveRequestId == 0)
                    continue;

                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@LeaveRequestId", LeaveRequestId);

                if (beData.DocumentTypeId.HasValue && beData.DocumentTypeId.Value > 0)
                    cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
                else
                    cmd.Parameters.AddWithValue("@DocumentTypeId", DBNull.Value);

                cmd.Parameters.AddWithValue("@Path", beData.DocPath);
                cmd.Parameters.AddWithValue("@Description", beData.Description);

                cmd.CommandText = "usp_AddLeaveRequestDocument";


                cmd.ExecuteNonQuery();

            }

        }
        public ResponeValues DeleteById(int UserId, int EntityId, int LeaveRequestId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@LeaveRequestId", LeaveRequestId);
            cmd.CommandText = "usp_DelLeaveRequestById";
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

        public Dynamic.BE.Attendance.LeaveRequestCollections GetAllLeaveRequest(int UserId)
        {
            Dynamic.BE.Attendance.LeaveRequestCollections dataColl = new Dynamic.BE.Attendance.LeaveRequestCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllLeaveRequest";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.LeaveRequest beData = new Dynamic.BE.Attendance.LeaveRequest();
                    beData.LeaveRequestId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.BranchName = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.DepartmentName = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.EmployeeName = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.EmployeeCode = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.LeaveTypeName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.DateFrom = reader.GetDateTime(6);
                    if (!(reader[7] is System.DBNull)) beData.DateTo = reader.GetDateTime(7);
                    if (!(reader[8] is System.DBNull)) beData.TotalDays = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.AlternativeEmployeeId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.MessagetoAllEmployee = reader.GetString(10);
                    if (!(reader[11] is System.DBNull)) beData.ApprovedBy = reader.GetInt32(11);
                    if (!(reader[12] is System.DBNull)) beData.Remarks = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.UserName = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.DateFromBS = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.DateToBS = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.RequestFrom = reader.GetString(16);

                    if (!(reader[17] is System.DBNull)) beData.LeaveDuration = (Dynamic.BE.Attendance.LEAVEDURATION)reader.GetInt32(17);
                    if (!(reader[18] is System.DBNull)) beData.LeavePeriod = (Dynamic.BE.Attendance.LEAVEPERIOD)reader.GetInt32(18);
                    if (!(reader[19] is System.DBNull)) beData.LeaveHours = Convert.ToDouble(reader[19]);

                    if (beData.TotalDays == 0)
                        beData.TotalDays = Math.Abs((beData.DateFrom - beData.DateTo).TotalDays) + 1;

                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                return dataColl;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BE.Attendance.LeaveRequest getLeaveRequestById(int LeaveRequestId, int UserId)
        {
            Dynamic.BE.Attendance.LeaveRequest beData = null;

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@LeaveRequestId", LeaveRequestId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetLeaveRequestById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    beData = new Dynamic.BE.Attendance.LeaveRequest();
                    beData.LeaveRequestId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.BranchId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.DepartmentId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.DesignationId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.ServiceTypeId = reader.GetInt32(4);
                    if (!(reader[5] is System.DBNull)) beData.EmployeeId = reader.GetInt32(5);
                    //if (!(reader[6] is System.DBNull)) beData.Gender = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.LeaveTypeId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.DateFrom = reader.GetDateTime(8);
                    if (!(reader[9] is System.DBNull)) beData.DateTo = reader.GetDateTime(9);
                    if (!(reader[10] is System.DBNull)) beData.TotalDays = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.AlternativeEmployeeId = reader.GetInt32(11);
                    if (!(reader[12] is System.DBNull)) beData.MessagetoAllEmployee = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.ApprovedBy = reader.GetInt32(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CUserId = reader.GetInt32(15);

                    if (!(reader[16] is System.DBNull)) beData.LeaveDuration = (Dynamic.BE.Attendance.LEAVEDURATION)reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.LeavePeriod = (Dynamic.BE.Attendance.LEAVEPERIOD)reader.GetInt32(17);
                    if (!(reader[18] is System.DBNull)) beData.LeaveHours = Convert.ToDouble(reader[18]);

                }
                reader.Close();
                return beData;
            }
            catch (Exception ee)
            {
                return null;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        //Use to save Employee Leave Request
        public ResponeValues SaveFromApp(Dynamic.API.Attendance.LeaveRequest beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@LeaveTypeId", beData.LeaveTypeId);
            cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);
            cmd.Parameters.AddWithValue("@TotalDays", Math.Abs((beData.DateFrom - beData.DateTo).TotalDays + 1));
            cmd.Parameters.AddWithValue("@LeaveDuration", beData.LeaveDuration);
            cmd.Parameters.AddWithValue("@LeavePeriod", beData.LeavePeriod);
            cmd.Parameters.AddWithValue("@LeaveHours", beData.LeaveHours);
            cmd.Parameters.AddWithValue("@MessagetoAllEmployee", beData.MessageToEmployee);
            cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
            cmd.Parameters.AddWithValue("@Lat", beData.Lat);
            cmd.Parameters.AddWithValue("@Lan", beData.Lan);
            cmd.Parameters.AddWithValue("@Location", beData.Location);
            cmd.Parameters.AddWithValue("@AlternativeUserId", beData.AlternativeUserId);            
            cmd.CommandText = "usp_AddLeaveRequestFromApp";
            cmd.Parameters.Add("@LeaveRequestId", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254).Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;            
            cmd.Parameters.AddWithValue("@EmployeeOrSalesman", beData.EmployeeOrSalesman);

            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters["@LeaveRequestId"].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters["@LeaveRequestId"].Value);

                if (!(cmd.Parameters["@ResponseMSG"].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters["@ResponseMSG"].Value);

                if (!(cmd.Parameters["@IsSuccess"].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value);

                if (resVal.RId > 0)
                {
                    if (beData.DocumentColl != null && beData.DocumentColl.Count() > 0)
                        SaveLeaveRequestDocument(resVal.RId, beData.DocumentColl);
                }

                dal.CommitTransaction();

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues LeaveApproved(Dynamic.API.Attendance.LeaveApprove beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@LeaveRequestId", beData.LeaveRequestId);
            cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
            cmd.Parameters.AddWithValue("@ApprovedByUser", beData.ApprovedByUser);
            cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
            cmd.Parameters.AddWithValue("@ApprovedType", beData.ApprovedType);
            cmd.CommandText = "sp_UpdateLeaveRequestApproved";
            cmd.Parameters.Add("@UserId", System.Data.SqlDbType.Int);
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                dal.CommitTransaction();

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public Dynamic.RE.Attendance.EmpLeaveRequestCollections getEmpLeaveRequestLst(int UserId, DateTime? dateFrom, DateTime? dateTo, int LeaveStatus, int? ForUserId,int EmployeeOrSalesman,bool forApproval)
        {
            Dynamic.RE.Attendance.EmpLeaveRequestCollections dataColl = new RE.Attendance.EmpLeaveRequestCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.Parameters.AddWithValue("@LeaveStatus", LeaveStatus);
                cmd.Parameters.AddWithValue("@ForUserId", ForUserId);
                cmd.Parameters.AddWithValue("@EmployeeOrSalesman", EmployeeOrSalesman);
                cmd.Parameters.AddWithValue("@ForApproval", forApproval);
                cmd.CommandText = "usp_GetEmpLeaveRequest";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                //cmd.ExecuteNonQuery();
                while (reader.Read())
                {
                    Dynamic.RE.Attendance.EmpLeaveRequest beData = new RE.Attendance.EmpLeaveRequest();
                    if (!(reader[0] is System.DBNull)) beData.LeaveRequestId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.EmployeeCode = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Department = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Designation = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.ContactNo = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.LeaveType = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.DateFrom = reader.GetDateTime(7);
                    if (!(reader[8] is System.DBNull)) beData.DateTo = reader.GetDateTime(8);
                    if (!(reader[9] is System.DBNull)) beData.MitiFrom = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) beData.MitiTo = reader.GetString(10);
                    if (!(reader[11] is System.DBNull)) beData.TotalDays = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.LeaveDuration = ((Dynamic.BE.Attendance.LEAVEDURATION)reader.GetInt32(12)).ToString();
                    if (!(reader[13] is System.DBNull)) beData.LeavePeriod = ((Dynamic.BE.Attendance.LEAVEPERIOD)reader.GetInt32(13)).ToString();
                    if (!(reader[14] is System.DBNull)) beData.LeaveHours = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.Al_EmployeeCode = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.AL_Name = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.MessageToAllEmployee = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.ApprovedBy = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) beData.ApprovedType = ((Dynamic.BE.Attendance.APPROVEDTYPES)reader.GetInt32(19)).ToString();
                    if (!(reader[20] is System.DBNull)) beData.ApprovedRemarks = reader.GetString(20);
                    if (!(reader[21] is System.DBNull)) beData.AprovedLogDate = reader.GetDateTime(21);
                    if (!(reader[22] is System.DBNull)) beData.ApprovedLogMiti = reader.GetString(22);
                    if (!(reader[23] is System.DBNull)) beData.Remarks = reader.GetString(23);
                    if (!(reader[24] is System.DBNull)) beData.Lan = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.Lat = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.Location = reader.GetString(26);
                    if (!(reader[27] is System.DBNull)) beData.LogDateTime = reader.GetDateTime(27);
                    if (!(reader[28] is System.DBNull)) beData.LogMiti = reader.GetString(28);
                    if (!(reader[29] is System.DBNull)) beData.UserId = reader.GetInt32(29);
                    if (!(reader[30] is System.DBNull)) beData.BranchName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.BranchAddress = reader.GetString(31);

                    if (!(reader[19] is System.DBNull)) beData.ApprovedTypeId = reader.GetInt32(19);

                    dataColl.Add(beData);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.GeneralDocument doc = new Dynamic.BusinessEntity.GeneralDocument();
                    int tranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) doc.DocumentTypeId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) doc.DocPath = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) doc.Description = reader.GetString(3);
                    dataColl.Find(p1 => p1.LeaveRequestId == tranId).DocumentColl.Add(doc);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.RE.Attendance.LeaveBalance beData = new RE.Attendance.LeaveBalance();
                    if (!(reader[0] is System.DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LeaveType = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.QuotaQty = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.LeaveQty = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.BalanceQty = Convert.ToDouble(reader[5]);
                    dataColl.LeaveBalanceColl.Add(beData);
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