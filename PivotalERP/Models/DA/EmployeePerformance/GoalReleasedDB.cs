using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.DA
{
    internal class GoalReleasedDB
    {
        DataAccessLayer1 dal = null;
        public GoalReleasedDB(string hostname, string dbName)
        {
            dal = new DataAccessLayer1(hostname, dbName);
        }
        public BE.GoalReleasedCollections getEmployeeGoalRelease(int UserId,int CostClassId, int GoalSetupId, int ForId)
        {
            BE.GoalReleasedCollections dataColl = new BE.GoalReleasedCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@CostClassId", CostClassId);
            cmd.Parameters.AddWithValue("@GoalSetupId", GoalSetupId);
            cmd.Parameters.AddWithValue("@ForId", ForId);
            cmd.CommandText = "usp_GetEmployeeGoalRelease";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.GoalReleased beData = new BE.GoalReleased();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.BranchName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.CompanyRelationship = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Status = Convert.ToBoolean(reader[7]);

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

        public ResponeValues SaveGoalRelease(int UserId, List<Dynamic.BE.GoalReleased> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                System.Data.DataTable dt = new System.Data.DataTable();
                dt.Columns.Add(new System.Data.DataColumn("CostClassId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("GoalSetupId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("ForId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("UserId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Status", typeof(bool)));
                foreach (var beData in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();

                    dr["CostClassId"] = beData.CostClassId;
                    dr["GoalSetupId"] = beData.GoalSetupId;
                    dr["ForId"] = beData.ForId;
                    dr["UserId"] = beData.UserId;
                    dr["Status"] = beData.Status;
                    dt.Rows.Add(dr);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@tmpGoalReleaseColl", dt);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;

                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@EntityId", 0);
                cmd.CommandText = "usp_SaveGoalReleaseTy";
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

        public ResponeValues SubmitAssigneGoal(int UserId, int UsersId, int GoalReleasedId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.Parameters.AddWithValue("@GoalReleasedId", GoalReleasedId);
            cmd.CommandText = "usp_SubmitAssigneGoal";
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
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

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

        public BE.GoalReleasedCollections GetAllSupervisors(int UserId)
        {
            BE.GoalReleasedCollections dataColl = new BE.GoalReleasedCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_GetAllSupervisors";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.GoalReleased beData = new BE.GoalReleased();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.BranchName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ContactNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
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

        public BE.GoalReleasedCollections GetEmpGoalSetupBySupId(int UserId, int SupUserId, int CostClassId, int? GoalSetupId)
        {
            BE.GoalReleasedCollections dataColl = new BE.GoalReleasedCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@SupUserId", SupUserId);
            cmd.Parameters.AddWithValue("@CostClassId", CostClassId);
            cmd.Parameters.AddWithValue("@GoalSetupId", GoalSetupId);
            cmd.CommandText = "usp_GetEmpGoalSetupBySupId";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    BE.GoalSetup det = new BE.GoalSetup();
                    if (!(reader[0] is DBNull)) det.ParentSetupId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.GoalSetupId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.Description = reader.GetString(2);
                    if (!(reader[3] is DBNull)) det.TargetValue = Convert.ToDouble(reader[3]);

                    dataColl.GoalSetupColl.Add(det);
                }

                if (reader.NextResult())
                {
                    while (reader.Read())
                    {
                        BE.GoalReleased beData = new BE.GoalReleased();
                        if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                        if (!(reader[2] is DBNull)) beData.EmployeeName = reader.GetString(2);
                        if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                        if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                        if (!(reader[5] is DBNull)) beData.BranchName = reader.GetString(5);
                        if (!(reader[6] is DBNull)) beData.CompanyRelationship = reader.GetString(6);
                        if (!(reader[7] is DBNull)) beData.Status = Convert.ToBoolean(reader[7]);

                        dataColl.EmployeeList.Add(beData);
                    }
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
