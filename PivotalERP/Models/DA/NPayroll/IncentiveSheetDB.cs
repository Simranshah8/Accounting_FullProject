using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.NPayroll
{
    internal class IncentiveSheetDB : Dynamic.DataAccess.Common.CommonDB
    {
        DataAccessLayer1 dal = null;
        public IncentiveSheetDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveIncentiveSheet(int UserId, List<Dynamic.BE.NPayroll.IncentiveSheet> DataColl)
        {
            ResponeValues resVal = new ResponeValues();
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
                System.Data.DataTable tableAllocation = new System.Data.DataTable();
                tableAllocation.Columns.Add("ProductBrandId", typeof(int));
                tableAllocation.Columns.Add("UserId", typeof(int));
                tableAllocation.Columns.Add("PayHeadingId", typeof(int));
                tableAllocation.Columns.Add("Amount", typeof(float));
                tableAllocation.Columns.Add("IncentiveDate", typeof(DateTime));

                tableAllocation.Columns.Add("Netpayable", typeof(float));
                tableAllocation.Columns.Add("Remark", typeof(string));

                foreach (var v in DataColl)
                {
                    var row = tableAllocation.NewRow();
                    row["ProductBrandId"] = v.ProductBrandId;
                    row["UserId"] = v.UserId;
                    row["PayHeadingId"] = v.PayHeadingId;
                    row["Amount"] = IsNull(v.Amount);
                    row["IncentiveDate"] = v.IncentiveDate;
                    row["Netpayable"] = IsNull(v.Netpayable);
                    row["Remark"] = IsNull(v.Remark);

                    tableAllocation.Rows.Add(row);
                }
                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@IncentiveSheetColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;
                cmd.CommandText = "usp_AddIncentiveSheet";
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
        public Dynamic.BE.NPayroll.IncentiveSheetCollections getAllIncentiveSheet(int UserId, int EntityId, int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            Dynamic.BE.NPayroll.IncentiveSheetCollections dataColl = new Dynamic.BE.NPayroll.IncentiveSheetCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@CompanyRelationshipId", CompanyRelationshipId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@ProductBrandId", ProductBrandId);
            cmd.Parameters.AddWithValue("@IncentiveDate", IncentiveDate);
            cmd.CommandText = "usp_GetEmployeForIncentiveSheet";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.IncentiveSheet beData = new Dynamic.BE.NPayroll.IncentiveSheet();
                    beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.PayHeadingId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.Amount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.EmployeeCode = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[5]);
                    if (!(reader[6] is DBNull)) beData.EmployeeName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Branch = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Designation = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.SNo = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.PayHeading = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.IncentiveDate = Convert.ToDateTime(reader[12]);
                    if (!(reader[13] is DBNull)) beData.IsAllow = Convert.ToBoolean(reader[13]);
                    if (!(reader[14] is DBNull)) beData.BranchId = Convert.ToInt32(reader[14]);
                    if (!(reader[15] is DBNull)) beData.CategoryId = Convert.ToInt32(reader[15]);
                    if (!(reader[16] is DBNull)) beData.TaxRuleAs = Convert.ToInt32(reader[16]);
                    if (!(reader[17] is DBNull)) beData.Resident = Convert.ToBoolean(reader[17]);
                    if (!(reader[18] is DBNull)) beData.Gender = Convert.ToString(reader[18]);
                    if (!(reader[19] is DBNull)) beData.MaritalStatus = Convert.ToInt32(reader[19]);
                    if (!(reader[20] is DBNull)) beData.Netpayable = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is DBNull)) beData.LevelId = Convert.ToInt32(reader[21]);
                    if (!(reader[22] is DBNull)) beData.LevelName = Convert.ToString(reader[22]);
                    if (!(reader[23] is DBNull)) beData.Remark = Convert.ToString(reader[23]);
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

        public ResponeValues DeleteIncentiveSheet(int UserId, int? UsersId, int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.Parameters.AddWithValue("@CompanyRelationshipId", CompanyRelationshipId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@ProductBrandId", ProductBrandId);
            cmd.Parameters.AddWithValue("@IncentiveDate", IncentiveDate);
            cmd.CommandText = "usp_DelIncentiveSheet";
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


        public Dynamic.BE.NPayroll.IncentiveSheetCollections GetAllIncentiveList(int UserId)
        {
            Dynamic.BE.NPayroll.IncentiveSheetCollections dataColl = new Dynamic.BE.NPayroll.IncentiveSheetCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_GetAllIncentiveList";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.IncentiveSheet beData = new Dynamic.BE.NPayroll.IncentiveSheet();
                    if (!(reader[0] is DBNull)) beData.ProductBrandId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ProductBrand = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.CompanyName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.CompanyRelationshipId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.BranchId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.Branch = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.DepartmentId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.IncentiveDate = Convert.ToDateTime(reader[8]);
                    if (!(reader[9] is DBNull)) beData.IncentiveMitti = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Remark = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Netpayable = Convert.ToDouble(reader[11]);
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