using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
    internal class ArrearSalarySheetDB
    {
        DataAccessLayer1 dal = null;
        public ArrearSalarySheetDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues UpdateArrearSalarySheet(int UserId, List<Dynamic.BE.NPayroll.ArrearSalarySheet> DataColl, List<Dynamic.BE.NPayroll.AttendanceType> AttendanceTypeColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            //dal.BeginTransaction();
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

                foreach (var v in DataColl)
                {
                    var row = tableAllocation.NewRow();
                    row["EmployeeId"] = v.EmployeeId;
                    row["PayHeadingId"] = v.PayHeadingId;
                    row["Amount"] = v.Amount ?? 0;
                    row["Rate"] = v.Rate ?? 0;
                    row["YearId"] = v.YearId;
                    row["MonthId"] = v.MonthId;
                    row["Earning"] = v.Earning;
                    row["Deducation"] = v.Deducation;
                    row["Tax"] = v.Tax;
                    row["Netpayable"] = v.Netpayable;

                    tableAllocation.Rows.Add(row);
                }


                //Prashant Code Add AttendanceType data
                System.Data.DataTable tableAttendance = new System.Data.DataTable();
                tableAttendance.Columns.Add("EmployeeId", typeof(int));
                tableAttendance.Columns.Add("AttendanceTypeId", typeof(int));
                tableAttendance.Columns.Add("Value", typeof(float));
                tableAttendance.Columns.Add("Rate", typeof(float));
                tableAttendance.Columns.Add("YearId", typeof(int));
                tableAttendance.Columns.Add("MonthId", typeof(int));
                foreach (var at in AttendanceTypeColl)
                {
                    var row = tableAttendance.NewRow();
                    row["EmployeeId"] = at.EmployeeId;
                    row["AttendanceTypeId"] = at.AttendanceTypeId;
                    row["Value"] = at.Value ?? 0;
                    row["Rate"] = at.Rate ?? 0;
                    row["YearId"] = at.YearId;
                    row["MonthId"] = at.MonthId;
                    tableAttendance.Rows.Add(row);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@ArrearSalarySheetColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;

                System.Data.SqlClient.SqlParameter sqlParam2 = cmd.Parameters.AddWithValue("@AttendanceTypeColl", tableAttendance);
                sqlParam2.SqlDbType = System.Data.SqlDbType.Structured;


                cmd.CommandText = "usp_AddArrearSalarySheet";
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[0].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[0].Value);
                if (!(cmd.Parameters[1].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[1].Value);

            }
            catch (Exception ee)
            {
                //dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

        public Dynamic.BE.NPayroll.ArrearSalaryDetail getAllArrearSalarySheet(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId)
        {
            Dynamic.BE.NPayroll.ArrearSalaryDetail dt = new BE.NPayroll.ArrearSalaryDetail();
            dt.PayColl = new BE.NPayroll.EmployeeForArrearSalarySheetCollections();
            dt.AttColl = new BE.NPayroll.EmployeeForArrearSalarySheetCollections();

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
            cmd.CommandText = "usp_GetEmployeForArrearSalarySheet";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.EmployeeForArrearSalarySheet beData = new Dynamic.BE.NPayroll.EmployeeForArrearSalarySheet();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PayHeadingId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Amount = reader.GetDouble(2);
                    if (!(reader[3] is DBNull)) beData.Rate = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) beData.EmployeeCode = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[5]); 
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
                    if (!(reader[19] is DBNull)) beData.GenderId = Convert.ToInt32(reader[19]);
                    if (!(reader[20] is DBNull)) beData.MaritalStatus = Convert.ToInt32(reader[20]);
                    if (!(reader[21] is DBNull)) beData.Earning = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.Deducation = Convert.ToDouble(reader[22]);
                    if (!(reader[23] is DBNull)) beData.Tax = Convert.ToDouble(reader[23]);
                    if (!(reader[24] is DBNull)) beData.Netpayable = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is DBNull)) beData.TotalDays = Convert.ToInt32(reader[25]);
                    if (!(reader[26] is DBNull)) beData.IsEditable = Convert.ToBoolean(reader[26]);

                    dt.PayColl.Add(beData);
                }

                reader.NextResult();
                //beData.datacoll1 = new BE.EmployeeForSalarySheet();
                while (reader.Read())
                {
                    BE.NPayroll.EmployeeForArrearSalarySheet det1 = new BE.NPayroll.EmployeeForArrearSalarySheet();
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
        public ResponeValues UpdateArrearSalarySheet(int UserId, List<Dynamic.BE.NPayroll.ArrearSalarySheet> DataColl)
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
                tableAllocation.Columns.Add("YearId", typeof(int));
                tableAllocation.Columns.Add("MonthId", typeof(int));

                foreach (var v in DataColl)
                {
                    var row = tableAllocation.NewRow();
                    row["EmployeeId"] = v.EmployeeId;
                    row["PayHeadingId"] = v.PayHeadingId;
                    row["Amount"] = v.Amount;
                    row["YearId"] = v.YearId;
                    row["MonthId"] = v.MonthId;
                    tableAllocation.Rows.Add(row);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@ArrearSalarySheetColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;
                cmd.CommandText = "usp_AddArrearSalarySheet";
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

        //public Dynamic.BE.NPayroll.EmployeeForArrearSalarySheetCollections getAllArrearSalarySheet(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId)
        //{
        //    Dynamic.BE.NPayroll.EmployeeForArrearSalarySheetCollections dataColl = new Dynamic.BE.NPayroll.EmployeeForArrearSalarySheetCollections();

        //    dal.OpenConnection();
        //    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
        //    cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //    cmd.Parameters.AddWithValue("@UserId", UserId);
        //    cmd.Parameters.AddWithValue("@EntityId", EntityId);
        //    cmd.Parameters.AddWithValue("@BranchId", BranchId);
        //    cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
        //    cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
        //    cmd.Parameters.AddWithValue("@YearId", YearId);
        //    cmd.Parameters.AddWithValue("@MonthId", MonthId);
        //    cmd.CommandText = "usp_GetEmployeForArrearSalarySheet";
        //    try
        //    {
        //        System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
        //        while (reader.Read())
        //        {
        //            Dynamic.BE.NPayroll.EmployeeForArrearSalarySheet beData = new Dynamic.BE.NPayroll.EmployeeForArrearSalarySheet();
        //            beData.EmployeeId = reader.GetInt32(0);
        //            if (!(reader[1] is DBNull)) beData.PayHeadingId = reader.GetInt32(1);
        //            if (!(reader[2] is DBNull)) beData.Amount = reader.GetDouble(2);
        //            if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
        //            if (!(reader[4] is DBNull)) beData.EnrollNo = reader.GetInt32(4);
        //            if (!(reader[5] is DBNull)) beData.EmployeeName = reader.GetString(5);
        //            if (!(reader[6] is DBNull)) beData.Branch = reader.GetString(6);
        //            if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
        //            if (!(reader[8] is DBNull)) beData.Designation = reader.GetString(8);
        //            if (!(reader[9] is DBNull)) beData.SNo = reader.GetInt32(9);
        //            if (!(reader[10] is DBNull)) beData.PayHeading = reader.GetString(10);
        //            if (!(reader[11] is DBNull)) beData.MonthId = reader.GetInt32(11);
        //            if (!(reader[12] is DBNull)) beData.YearId = reader.GetInt32(12);
        //            dataColl.Add(beData);
        //        }
        //        reader.Close();
        //        dataColl.IsSuccess = true;
        //        dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;
        //    }
        //    finally
        //    {
        //        dal.CloseConnection();
        //    }
        //    return dataColl;
        //}

        public ResponeValues DeleteArrearSalarySheet(int UserId, int EntityId, int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
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
            cmd.CommandText = "usp_DelArrearSalarySheet";
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
            cmd.CommandText = "usp_DelArrearSalarySheetById";
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
    }
}