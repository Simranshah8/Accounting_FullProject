using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{
    internal class FinancialPeriodDB
    {

        DataAccessLayer1 dal = null;
        public FinancialPeriodDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.FinancialPeriod beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@StartDate", beData.StartDate_AD);
            cmd.Parameters.AddWithValue("@EndDate", beData.EndDate_AD);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@PeriodId", beData.PeriodId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdateFinancialPeriod";
            }
            else
            {
                cmd.CommandText = "usp_AddFinancialPeriod";
                cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            }

            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
          
            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;

        }

        public ResponeValues DeleteById(int UserId, int EntityId, int PeriodId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
            cmd.CommandText = "usp_DelFinancialPeriodById";
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


        public Dynamic.BE.Attendance.FinancialPeriodCollections GetAllLeave(int UserId)
        {
            Dynamic.BE.Attendance.FinancialPeriodCollections dataColl = new Dynamic.BE.Attendance.FinancialPeriodCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetAllFinancialPeriod";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Attendance.FinancialPeriod beData = new Dynamic.BE.Attendance.FinancialPeriod();
                    beData.PeriodId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.StartDate_AD = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.EndDate_AD = reader.GetDateTime(3);
                    if (!(reader[4] is System.DBNull)) beData.StartDate_BS = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.EndDate_BS = reader.GetString(5);
                    
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
        public Dynamic.BE.Attendance.FinancialPeriod getLeaveById(int PeriodId, int UserId)
        {
            Dynamic.BE.Attendance.FinancialPeriod beData = new BE.Attendance.FinancialPeriod();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetFinancialPeriodById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    beData = new Dynamic.BE.Attendance.FinancialPeriod();
                    beData.PeriodId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.StartDate_AD = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.EndDate_AD = reader.GetDateTime(3);
                    //if (!(reader[4] is System.DBNull)) beData.StartDate_BS = reader.GetString(4);
                    //if (!(reader[5] is System.DBNull)) beData.EndDate_BS = reader.GetString(5);

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

    }
}