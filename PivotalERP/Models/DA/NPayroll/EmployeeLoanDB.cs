using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
    internal class EmployeeLoanDB
    {
        DataAccessLayer1 dal = null;
        public EmployeeLoanDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.EmployeeLoan beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
            cmd.Parameters.AddWithValue("@LoanDate", beData.LoanDate);
            cmd.Parameters.AddWithValue("@LoanTypeId", beData.LoanTypeId);
            cmd.Parameters.AddWithValue("@PrincipleAmount", beData.PrincipleAmount);
            cmd.Parameters.AddWithValue("@InterestRate", beData.InterestRate);
            cmd.Parameters.AddWithValue("@Period", beData.Period);
            cmd.Parameters.AddWithValue("@EMIAmount", beData.EMIAmount);
            cmd.Parameters.AddWithValue("@EffDate", beData.EffDate);
            cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdateEmployeeLoan";
            }
            else
            {
                cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddEmployeeLoan";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);  //Added by Simran

            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[11].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[11].Value);

                if (!(cmd.Parameters[12].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[12].Value);

                if (!(cmd.Parameters[13].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[13].Value);

                if (!(cmd.Parameters[14].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[14].Value);

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
        public Dynamic.BE.NPayroll.EmployeeLoanCollections getAllEmployeeLoan(int UserId, int EntityId)
        {
            Dynamic.BE.NPayroll.EmployeeLoanCollections dataColl = new Dynamic.BE.NPayroll.EmployeeLoanCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllEmployeeLoan";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.EmployeeLoan beData = new Dynamic.BE.NPayroll.EmployeeLoan();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.EmployeeName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LoanTypeId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.PrincipleAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) beData.InterestRate = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) beData.Period = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.EMIAmount = reader.GetDouble(7);
                    if (!(reader[8] is DBNull)) beData.EffDate = reader.GetDateTime(8);
                    if (!(reader[9] is DBNull)) beData.Remarks = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.LoanTypeName = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.EffMiti = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.CompanyName = reader.GetString(12); //Added by Simran
                    if (!(reader[13] is DBNull)) beData.BranchName = reader.GetString(13); //Added by Simran
                    if (!(reader[14] is DBNull)) beData.CompanyId = reader.GetInt32(14);  //Added by Simran

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
        public Dynamic.BE.NPayroll.EmployeeLoan getEmployeeLoanById(int UserId, int EntityId, int TranId)
        {
            Dynamic.BE.NPayroll.EmployeeLoan beData = new Dynamic.BE.NPayroll.EmployeeLoan();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetEmployeeLoanById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.NPayroll.EmployeeLoan();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.LoanDate = reader.GetDateTime(2);
                    if (!(reader[3] is DBNull)) beData.LoanTypeId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.PrincipleAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) beData.InterestRate = reader.GetDouble(5);
                    if (!(reader[6] is DBNull)) beData.Period = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.EMIAmount = reader.GetDouble(7);
                    if (!(reader[8] is DBNull)) beData.EffDate = reader.GetDateTime(8);
                    if (!(reader[9] is DBNull)) beData.Remarks = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.UserId = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.CompanyId = reader.GetInt32(11);  //Added by Simran
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
        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_DelEmployeeLoanById";
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
    }
}