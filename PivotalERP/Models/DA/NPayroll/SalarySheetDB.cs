using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
    internal class SalarySheetDB : Dynamic.DataAccess.Common.CommonDB
    {
        DataAccessLayer1 dal = null;
        public SalarySheetDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues UpdateSalarySheet(int UserId, List<Dynamic.BE.NPayroll.SalarySheet> DataColl, List<Dynamic.BE.NPayroll.AttendanceType> AttendanceTypeColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsValid", System.Data.SqlDbType.Bit);
                cmd.Parameters[0].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@UserId", UserId);
                System.Data.DataTable tableAllocation = new System.Data.DataTable();
                tableAllocation.Columns.Add("EmployeeId", typeof(int));
                tableAllocation.Columns.Add("PayHeadingId", typeof(int));
                tableAllocation.Columns.Add("Amount", typeof(float));
                tableAllocation.Columns.Add("Rate", typeof(float));
                tableAllocation.Columns.Add("YearId", typeof(int));
                tableAllocation.Columns.Add("MonthId", typeof(int));

                tableAllocation.Columns.Add("Earning", typeof(float));
                tableAllocation.Columns.Add("Deducation", typeof(float));
                tableAllocation.Columns.Add("Tax", typeof(float));
                tableAllocation.Columns.Add("Netpayable", typeof(float));
               // tableAllocation.Columns.Add("CalValue", typeof(float));

                foreach (var v in DataColl)
                {
                    if (v.PayHeadingId > 0)
                    {
                        var row = tableAllocation.NewRow();
                        row["EmployeeId"] = v.EmployeeId;
                        row["PayHeadingId"] = v.PayHeadingId;
                        row["Amount"] = IsNull(v.Amount);
                        row["Rate"] = IsNull(v.Rate);
                        row["YearId"] = v.YearId;
                        row["MonthId"] = v.MonthId;
                        row["Earning"] = IsNull(v.Earning);
                        row["Deducation"] = IsNull(v.Deducation);
                        row["Tax"] = IsNull(v.Tax);
                        row["Netpayable"] = IsNull(v.Netpayable);
                       // row["CalValue"] = IsDBNull(v.CalValue);

                        tableAllocation.Rows.Add(row);
                    }
                  
                }


                // AttendanceType data
                System.Data.DataTable tableAttendance = new System.Data.DataTable();
                tableAttendance.Columns.Add("EmployeeId", typeof(int));
                tableAttendance.Columns.Add("AttendanceTypeId", typeof(int));
                tableAttendance.Columns.Add("Value", typeof(float));
                tableAttendance.Columns.Add("Rate", typeof(float));
                tableAttendance.Columns.Add("YearId", typeof(int));
                tableAttendance.Columns.Add("MonthId", typeof(int));
                foreach (var at in AttendanceTypeColl)
                {
                    if (at.AttendanceTypeId.HasValue)
                    {
                        var row = tableAttendance.NewRow();
                        row["EmployeeId"] = at.EmployeeId;
                        row["AttendanceTypeId"] = at.AttendanceTypeId;
                        row["Value"] = IsNull(at.Value);
                        row["Rate"] = IsNull(at.Rate);
                        row["YearId"] = at.YearId;
                        row["MonthId"] = at.MonthId;
                        tableAttendance.Rows.Add(row);
                    }
                   
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@SalarySheetColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;

                System.Data.SqlClient.SqlParameter sqlParam2 = cmd.Parameters.AddWithValue("@AttendanceTypeColl", tableAttendance);
                sqlParam2.SqlDbType = System.Data.SqlDbType.Structured;


                cmd.CommandText = "usp_AddSalarySheet";
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[0].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[0].Value);
                if (!(cmd.Parameters[1].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[1].Value);

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


        public Dynamic.BE.NPayroll.SalarySheetDetail getAllSalarySheet(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId, int? CompanyRelationshipId)
        {
            Dynamic.BE.NPayroll.SalarySheetDetail dt = new BE.NPayroll.SalarySheetDetail();
            dt.PayColl = new BE.NPayroll.EmployeeForSalarySheetCollections();
            dt.AttColl = new BE.NPayroll.EmployeeForSalarySheetCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.Parameters.AddWithValue("@CompanyRelationshipId", CompanyRelationshipId);
            cmd.CommandText = "usp_GetEmployeForSalarySheet";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.EmployeeForSalarySheet beData = new Dynamic.BE.NPayroll.EmployeeForSalarySheet();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PayHeadingId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Amount = reader.GetDouble(2);
                    if (!(reader[3] is DBNull)) beData.Rate = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) beData.EmployeeCode = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[5]) ;
                    if (!(reader[6] is DBNull)) beData.EmployeeName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Branch = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Designation = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.SNo = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.PayHeading = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.MonthId = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.YearId = reader.GetInt32(13);

                    if (!(reader[14] is DBNull)) beData.IsAllow = Convert.ToBoolean(reader[14]);
                    if (!(reader[15] is DBNull)) beData.BranchId = Convert.ToInt32(reader[15]);
                    if (!(reader[16] is DBNull)) beData.CategoryId = Convert.ToInt32(reader[16]);
                    if (!(reader[17] is DBNull)) beData.TaxRuleAs = Convert.ToInt32(reader[17]);
                    if (!(reader[18] is DBNull)) beData.Resident = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is DBNull)) beData.Gender = Convert.ToString(reader[19]);
                    if (!(reader[20] is DBNull)) beData.MaritalStatus = Convert.ToInt32(reader[20]);
                    if (!(reader[21] is DBNull)) beData.Earning = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.Deducation = Convert.ToDouble(reader[22]);
                    if (!(reader[23] is DBNull)) beData.Tax = Convert.ToDouble(reader[23]);
                    if (!(reader[24] is DBNull)) beData.Netpayable = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is DBNull)) beData.TotalDays = Convert.ToInt32(reader[25]);
                    if (!(reader[26] is DBNull)) beData.IsEditable = Convert.ToBoolean(reader[26]);
                    if (!(reader[27] is DBNull)) beData.LevelId = Convert.ToInt32(reader[27]);
                    if (!(reader[28] is DBNull)) beData.LevelName = Convert.ToString(reader[28]);
                    if (!(reader[29] is DBNull)) beData.PendingMonths = Convert.ToInt32(reader[29]);
                    if (!(reader[30] is DBNull)) beData.PAmount = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is DBNull)) beData.SDRate = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is DBNull)) beData.TotalMonth = reader.GetInt32(32);
                    if (!(reader[33] is DBNull)) beData.TotalWeekEnd = reader.GetInt32(33);
                    if (!(reader[34] is DBNull)) beData.TotalHoliday = reader.GetInt32(34);
                    dt.PayColl.Add(beData);
                }

                reader.NextResult();
                //beData.datacoll1 = new BE.EmployeeForSalarySheet();
                while (reader.Read())
                {
                    BE.NPayroll.EmployeeForSalarySheet det1 = new BE.NPayroll.EmployeeForSalarySheet();
                    if (!(reader[0] is DBNull)) det1.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.AttendanceTypeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det1.Value = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) det1.Rate = Convert.ToDouble(reader[3]);
                    dt.AttColl.Add(det1);                                      
                }
                reader.Close();
                dt.IsSuccess = true;
                dt.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dt.IsSuccess = false;
                dt.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dt;
        }
       
        public ResponeValues DeleteSalarySheet(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_DelSalarySheet";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[8].Value);

                if (!(cmd.Parameters[9].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[9].Value);

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


        public ResponeValues DeleteById(int UserId, int EntityId, int EmployeeId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_DelSalarySheetById";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

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

        public Dynamic.RE.HR.SalarySheetCollections getSalarySheet(int UserId, int YearId, int MonthId, string CompanyIdColl, string BranchIdColl, string DepartmentIdColl, string CategoryIdColl,
              int EmployeeId, string EmployeeIdColl, string EmpGroupIdColl)
        {
            Dynamic.RE.HR.SalarySheetCollections dataColl = new RE.HR.SalarySheetCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@YearId", YearId);
                cmd.Parameters.AddWithValue("@MonthId", MonthId);
                cmd.Parameters.AddWithValue("@CompanyIdColl", CompanyIdColl);
                cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
                cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);
                cmd.Parameters.AddWithValue("@CategoryIdColl", CategoryIdColl);
                cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                cmd.Parameters.AddWithValue("@EmployeeIdColl", EmployeeIdColl);
                cmd.Parameters.AddWithValue("@EmpGroupIdColl", EmpGroupIdColl);
                cmd.CommandText = "sp_PrintPaySlipDetails";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.HR.SalarySheet beData = new RE.HR.SalarySheet();
                    if (!(reader[0] is System.DBNull)) beData.Year = Convert.ToInt32(reader[0]);
                    if (!(reader[1] is System.DBNull)) beData.Month = Convert.ToInt32(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.EmpId = Convert.ToInt32(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.EmpCode = Convert.ToString(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.PanId = Convert.ToString(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.PAddress = Convert.ToString(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.OfficeContactNo = Convert.ToString(reader[6]);
                    if (!(reader[7] is System.DBNull)) beData.Name = Convert.ToString(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.Branch = Convert.ToString(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.Department = Convert.ToString(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.Grade = Convert.ToString(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.Designation = Convert.ToString(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.BankName = Convert.ToString(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.AccountName = Convert.ToString(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.AccountNo = Convert.ToString(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.BranchName = Convert.ToString(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[16]);
                    if (!(reader[17] is System.DBNull)) beData.TotalDays = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.TotalEarning = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is System.DBNull)) beData.TotalDeduction = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is System.DBNull)) beData.NetPayable = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.SNo = Convert.ToInt32(reader[21]);
                    if (!(reader[22] is System.DBNull)) beData.PayHeadingName = Convert.ToString(reader[22]);
                    if (!(reader[23] is System.DBNull)) beData.PayHeadingCode = Convert.ToString(reader[23]);
                    if (!(reader[24] is System.DBNull)) beData.AttendanceRate = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.AttendanceValue = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.Rate = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.Amount = Convert.ToDouble(reader[27]);
                    if (!(reader[28] is System.DBNull)) beData.IsEarning = Convert.ToBoolean(reader[28]);
                    if (!(reader[29] is System.DBNull)) beData.CompanyName = Convert.ToString(reader[29]);
                    if (!(reader[30] is System.DBNull)) beData.CompanyAddress = Convert.ToString(reader[30]);
                    if (!(reader[31] is System.DBNull)) beData.CompanyPanVatNo = Convert.ToString(reader[31]);
                    if (!(reader[32] is System.DBNull)) beData.CompanyRegdNo = Convert.ToString(reader[32]);
                    if (!(reader[33] is System.DBNull)) beData.CompanyEmail = Convert.ToString(reader[33]);
                    if (!(reader[34] is System.DBNull)) beData.LogoPath = Convert.ToString(reader[34]);
                    if (!(reader[35] is System.DBNull)) beData.Attendance = Convert.ToInt32(reader[35]);
                    if (!(reader[36] is System.DBNull)) beData.AttendanceDetails = Convert.ToString(reader[36]);
                    if (!(reader[37] is System.DBNull)) beData.TotalPayable = Convert.ToDouble(reader[37]);
                    if (!(reader[38] is System.DBNull)) beData.RowNo = Convert.ToInt32(reader[38]);

                    try
                    {
                        if (!(reader[39] is System.DBNull)) beData.DepartmentSNo = Convert.ToInt32(reader[39]);
                        if (!(reader[40] is System.DBNull)) beData.DesignationSNo = Convert.ToInt32(reader[40]);
                        if (!(reader[41] is System.DBNull)) beData.DepartmentWiseSNo = Convert.ToInt32(reader[41]);
                        if (!(reader[42] is System.DBNull)) beData.DesignationWiseSNo = Convert.ToInt32(reader[42]);
                        if (!(reader[42] is System.DBNull)) beData.DesignationWiseSNo = Convert.ToInt32(reader[42]);
                        if (!(reader["EmployeeGroup"] is System.DBNull)) beData.EmployeeGroup = Convert.ToString(reader["EmployeeGroup"]);
                    }
                    catch { }

                    dataColl.Add(beData);
                }

                reader.Close();

                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public ResponeValue SaveJV(int UserId, int YearId, int MonthId)
        {
            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                cmd.Parameters[0].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@YearId", YearId);
                cmd.Parameters.AddWithValue("@MonthId", MonthId);
                cmd.CommandText = "usp_SalaryJV";
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[0].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[0].Value);
                if (!(cmd.Parameters[1].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[1].Value);

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

        public (Dynamic.RE.HR.LedgerSJVCollections, Dynamic.RE.HR.PayHeadSJVCollections) GetSalaryJV(int UserId, int YearId, int MonthId)
        {
            Dynamic.RE.HR.LedgerSJVCollections ledgerColl = new Dynamic.RE.HR.LedgerSJVCollections();
            Dynamic.RE.HR.PayHeadSJVCollections payHeadColl = new Dynamic.RE.HR.PayHeadSJVCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_SalaryJV_View";

            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

                // Read first result set (LedgerSJV)
                while (reader.Read())
                {
                    Dynamic.RE.HR.LedgerSJV ledgerData = new Dynamic.RE.HR.LedgerSJV();
                    if (!(reader[0] is DBNull)) ledgerData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) ledgerData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) ledgerData.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull)) ledgerData.DrAmount = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) ledgerData.CrAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) ledgerData.DrCr = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) ledgerData.PayHeadColl = reader.GetString(6);
                    if (!(reader[7] is DBNull)) ledgerData.LedgerGroup = reader.GetString(7);
                    ledgerColl.Add(ledgerData);
                }

                // Move to the next result set (PayHeadSJV)
                if (reader.NextResult())
                {
                    while (reader.Read())
                    {
                        Dynamic.RE.HR.PayHeadSJV payHeadData = new Dynamic.RE.HR.PayHeadSJV();
                        if (!(reader[0] is DBNull)) payHeadData.LedgerId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) payHeadData.LedgerName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) payHeadData.LedgerCode = reader.GetString(2);
                        if (!(reader[3] is DBNull)) payHeadData.PayHeading = reader.GetString(3);
                        if (!(reader[4] is DBNull)) payHeadData.DrAmount = Convert.ToDouble(reader[4]);
                        if (!(reader[5] is DBNull)) payHeadData.CrAmount = Convert.ToDouble(reader[5]);
                        if (!(reader[6] is DBNull)) payHeadData.PayHeadType = reader.GetString(6);
                        if (!(reader[7] is DBNull)) payHeadData.LedgerGroup = reader.GetString(7);
                        payHeadColl.Add(payHeadData);
                    }
                }

                reader.Close();
                ledgerColl.IsSuccess = true;
                ledgerColl.ResponseMSG = GLOBALMSG.SUCCESS;
                payHeadColl.IsSuccess = true;
                payHeadColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ex)
            {
                ledgerColl.IsSuccess = false;
                ledgerColl.ResponseMSG = ex.Message;
                payHeadColl.IsSuccess = false;
                payHeadColl.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return (ledgerColl, payHeadColl);
        }

    }
}