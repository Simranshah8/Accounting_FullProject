using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.HR
{
    public class UpdateEmployeeDB
    {
        DataAccessLayer1 dal = null;
        public UpdateEmployeeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.RE.HR.UpdateEmpCollections getEmployeeForUpdate(int UserId, int? BranchId, int? CompanyRelationId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
        {
            Dynamic.RE.HR.UpdateEmpCollections dataColl = new Dynamic.RE.HR.UpdateEmpCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@CompanyRelationId", CompanyRelationId);
            cmd.CommandText = "usp_GetEmployeeListForUpdate";
            cmd.Parameters.Add("@TotalRows", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@PageNumber", PageNumber);
            cmd.Parameters.AddWithValue("@RowsOfPage", RowsOfPage);
            cmd.Parameters.AddWithValue("@SearchBy", SearchBy);
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.HR.UpdateEmployee beData = new Dynamic.RE.HR.UpdateEmployee();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.FirstName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.MiddleName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LastName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[4]);
                    if (!(reader[5] is DBNull)) beData.EmployeeCode = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.CardNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.DOB_AD = Convert.ToDateTime(reader[7]);
                    if (!(reader[8] is DBNull)) beData.DateOfJoining = Convert.ToDateTime(reader[8]);
                    if (!(reader[9] is DBNull)) beData.Gender = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.OfficeContactNo = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.OfficeEmailId = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.TA_FullAddress = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.Nationality = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.PanId = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.MaritalStatus = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.EmployeeGroupId = Convert.ToInt32(reader[16]);
                    if (!(reader[17] is DBNull)) beData.TaxRuleAs = Convert.ToInt32(reader[17]);
                    if (!(reader[18] is DBNull)) beData.LeaveApplicableDate = Convert.ToDateTime(reader[18]);
                    if (!(reader[19] is DBNull)) beData.SalaryApplicableYearId = Convert.ToInt32(reader[19]);
                    if (!(reader[20] is DBNull)) beData.SalaryApplicableMonthId = Convert.ToInt32(reader[20]);
                    if (!(reader[21] is DBNull)) beData.IsAllowOT = reader.GetBoolean(21);
                    if (!(reader[22] is DBNull)) beData.LevelId = Convert.ToInt32(reader[22]);
                    if (!(reader[23] is DBNull)) beData.S_FirstLevelId = Convert.ToInt32(reader[23]);
                    if (!(reader[24] is DBNull)) beData.S_SecondLevelId = Convert.ToInt32(reader[24]);
                    if (!(reader[25] is DBNull)) beData.EMSId = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.DepartmentId = Convert.ToInt32(reader[26]);
                    if (!(reader[27] is DBNull)) beData.DesignationId = Convert.ToInt32(reader[27]);
                    if (!(reader[28] is DBNull)) beData.CategoryId = Convert.ToInt32(reader[28]);
                    if (!(reader[29] is DBNull)) beData.S_ThirdLevelId = reader.GetInt32(29);
                    dataColl.Add(beData);
                }
                reader.Close();
                TotalRows = Convert.ToInt32(cmd.Parameters[3].Value);
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


        public ResponeValues UpdateEmployee(int UserId, List<Dynamic.RE.HR.UpdateEmployee> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                System.Data.DataTable dt = new System.Data.DataTable();
                dt.Columns.Add(new System.Data.DataColumn("EmployeeId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("FirstName", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("MiddleName", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("LastName", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("EnrollNumber", typeof(long)));
                dt.Columns.Add(new System.Data.DataColumn("CardNo", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("EMSId", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("Gender", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("OfficeContactNo", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("OfficeEmailId", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("TA_FullAddress", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("Nationality", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("PanId", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("MaritalStatus", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("DepartmentId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("DesignationId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("CategoryId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("LevelId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("DateOfJoining", typeof(DateTime)));
                dt.Columns.Add(new System.Data.DataColumn("TaxRuleAs", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("SalaryApplicableYearId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("SalaryApplicableMonthId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("EmployeeCode", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("Qualification", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("S_FirstLevelId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("S_SecondLevelId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("IsAllowOT", typeof(bool)));
                dt.Columns.Add(new System.Data.DataColumn("LeaveApplicableDate", typeof(DateTime)));
                dt.Columns.Add(new System.Data.DataColumn("DOB_AD", typeof(DateTime)));
                dt.Columns.Add(new System.Data.DataColumn("S_ThirdLevelId", typeof(int)));
                foreach (var beData in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();

                    dr["EmployeeId"] = beData.EmployeeId;
                    dr["FirstName"] = beData.FirstName;
                    dr["MiddleName"] = beData.MiddleName;
                    dr["LastName"] = beData.LastName;
                    dr["EnrollNumber"] = beData.EnrollNumber;
                    if (!string.IsNullOrWhiteSpace(beData.CardNo))
                        dr["CardNo"] = beData.CardNo;
                    else
                        dr["CardNo"] = DBNull.Value;

                    dr["EMSId"] = beData.EMSId;
                    dr["Gender"] = beData.Gender;
                    dr["OfficeContactNo"] = beData.OfficeContactNo;
                    dr["OfficeEmailId"] = beData.OfficeEmailId;
                    dr["TA_FullAddress"] = beData.TA_FullAddress;
                    dr["Nationality"] = beData.Nationality;
                    dr["PanId"] = beData.PanId;
                    dr["MaritalStatus"] = beData.MaritalStatus;

                    if (beData.DepartmentId.HasValue && beData.DepartmentId.Value > 0)
                        dr["DepartmentId"] = beData.DepartmentId;
                    else
                        dr["DepartmentId"] = DBNull.Value;

                    if (beData.DesignationId.HasValue && beData.DesignationId.Value > 0)
                        dr["DesignationId"] = beData.DesignationId;
                    else
                        dr["DesignationId"] = DBNull.Value;

                    if (beData.CategoryId.HasValue && beData.CategoryId.Value > 0)
                        dr["CategoryId"] = beData.CategoryId;
                    else
                        dr["CategoryId"] = DBNull.Value;

                    if (beData.LevelId.HasValue && beData.LevelId.Value > 0)
                        dr["LevelId"] = beData.LevelId;
                    else
                        dr["LevelId"] = DBNull.Value;

                    if (beData.DateOfJoining.HasValue)
                        dr["DateOfJoining"] = beData.DateOfJoining.Value;
                    else
                        dr["DateOfJoining"] = DBNull.Value;

                    dr["TaxRuleAs"] = beData.TaxRuleAs;

                    if (beData.SalaryApplicableYearId.HasValue && beData.SalaryApplicableYearId.Value > 0)
                        dr["SalaryApplicableYearId"] = beData.SalaryApplicableYearId;
                    else
                        dr["SalaryApplicableYearId"] = DBNull.Value;


                    if (beData.SalaryApplicableMonthId.HasValue && beData.SalaryApplicableMonthId.Value > 0)
                        dr["SalaryApplicableMonthId"] = beData.SalaryApplicableMonthId;
                    else
                        dr["SalaryApplicableMonthId"] = DBNull.Value;

                    dr["EmployeeCode"] = beData.EmployeeCode;

                    dr["Qualification"] = (beData.Qualification);


                    if (beData.S_FirstLevelId.HasValue && beData.S_FirstLevelId.Value > 0)
                        dr["S_FirstLevelId"] = beData.S_FirstLevelId;
                    else
                        dr["S_FirstLevelId"] = DBNull.Value;

                    if (beData.S_SecondLevelId.HasValue && beData.S_SecondLevelId.Value > 0)
                        dr["S_SecondLevelId"] = beData.S_SecondLevelId;
                    else
                        dr["S_SecondLevelId"] = DBNull.Value;

                    dr["IsAllowOT"] = beData.IsAllowOT;
                    if (beData.LeaveApplicableDate.HasValue)
                        dr["LeaveApplicableDate"] = beData.LeaveApplicableDate.Value;
                    else
                        dr["LeaveApplicableDate"] = DBNull.Value;
                    
                    if (beData.DOB_AD.HasValue)
                        dr["DOB_AD"] = beData.DOB_AD.Value;
                    else
                        dr["DOB_AD"] = DBNull.Value;

                    if (beData.S_ThirdLevelId.HasValue && beData.S_ThirdLevelId.Value > 0)
                        dr["S_ThirdLevelId"] = beData.S_ThirdLevelId;
                    else
                        dr["S_ThirdLevelId"] = DBNull.Value;

                    dt.Rows.Add(dr);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@tmpEmployeeColl", dt);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;

                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@EntityId", 0);
                cmd.CommandText = "usp_UpdateEmployeeFromEt";
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
                cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

                if (!resVal.IsSuccess)
                    return resVal;

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