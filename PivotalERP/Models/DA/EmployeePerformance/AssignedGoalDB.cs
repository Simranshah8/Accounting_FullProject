using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.DA
{
    internal class AssignedGoalDB
    {
        DataAccessLayer1 dal = null;
        public AssignedGoalDB(string hostname, string dbName)
        {
            dal = new DataAccessLayer1(hostname, dbName);
        }
        public BE.AssignedGoalCollections GetEmployeeAssignedGoal(int UserId, int CostClassId, int ForId)
        {
            BE.AssignedGoalCollections dataColl = new BE.AssignedGoalCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@CostClassId", CostClassId);
            cmd.Parameters.AddWithValue("@ForId", ForId);
            cmd.CommandText = "usp_GetEmployeeAssignedGoal";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.AssignedGoal beData = new BE.AssignedGoal();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.BranchName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.CompanyRelationship = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.GoalSetupReleaseId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.GoalSetupId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.GoalTypeId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.GoalType = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Description = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.TargetValue = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.GoalMeasurement = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.WeightedId = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.GoalTargetTypeId = reader.GetInt32(15);
                    if (!(reader[16] is DBNull)) beData.GoalTargetType = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.FromDateBS = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.ToDateBS = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[19]);
                    if (!(reader[20] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[20]);
                    if (!(reader[21] is DBNull)) beData.CostClassId = reader.GetInt32(21);
                    if (!(reader[22] is DBNull)) beData.IsMeasurement = Convert.ToBoolean(reader[22]);
                    if (!(reader[23] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[23]);
                    if (!(reader[24] is DBNull)) beData.IsSubmit = Convert.ToBoolean(reader[24]);

                    dataColl.Add(beData);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    BE.KPIAssignedGoal det = new BE.KPIAssignedGoal();
                    if (!reader.IsDBNull(0)) det.TranId = reader.GetInt32(0);
                    if (!reader.IsDBNull(1)) det.GoalReleaseId = reader.GetInt32(1);
                    if (!reader.IsDBNull(2)) det.UserId = reader.GetInt32(2);
                    if (!reader.IsDBNull(3)) det.TargetAchievement = Convert.ToDouble(reader[3]);
                    if (!reader.IsDBNull(4)) det.AchievedDescription = reader.GetString(4);

                    var user = dataColl.Find(p1 => p1.UserId == det.UserId && p1.GoalSetupReleaseId == det.GoalReleaseId);
                    if (user != null)
                    {
                        user.KPIColl.Add(det);
                    }
                }
                reader.NextResult();
                while (reader.Read())
                {
                    BE.GoalSetupAssignedGoal det1 = new BE.GoalSetupAssignedGoal();
                    if (!reader.IsDBNull(0)) det1.ParentSetupId = reader.GetInt32(0);
                    if (!reader.IsDBNull(1)) det1.UserId = reader.GetInt32(1);
                    if (!reader.IsDBNull(2)) det1.GoalSetupId = reader.GetInt32(2);
                    if (!reader.IsDBNull(3)) det1.Description = reader.GetString(3);
                    if (!reader.IsDBNull(4)) det1.TargetValue = Convert.ToDouble(reader[4]);
                    var user = dataColl.Find(p1 => p1.GoalSetupId == det1.ParentSetupId);
                    if (user != null)
                    {
                        user.GoalSetupAssignedGoalColl.Add(det1);
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

        public ResponeValues SaveUpdate(BE.AssignedGoal beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@GoalReleaseId", beData.GoalReleaseId);
            cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
            cmd.Parameters.AddWithValue("@ForId", beData.ForId);
            cmd.Parameters.AddWithValue("@TargetAchievement", beData.TargetAchievement);
            cmd.Parameters.AddWithValue("@AchievedDescription", beData.AchievedDescription);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateAssignedGoal";
            }
            else
            {
                cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddAssignedGoal";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

                if (!(cmd.Parameters[9].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

                if (!(cmd.Parameters[10].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[10].Value);

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

        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_DelAssignedGoalById";
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
        
        public BE.AssignedGoal getAssignedGoalById(int UserId, int EntityId, int TranId)
        {
            BE.AssignedGoal beData = new BE.AssignedGoal();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAssignedGoalById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.AssignedGoal();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.GoalReleaseId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.UserId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.ForId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.TargetAchievement = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.AchievedDescription = reader.GetString(5);
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

        public BE.AssignedGoalCollections GetAssignedGoalSubmited(int UserId)
        {
            BE.AssignedGoalCollections dataColl = new BE.AssignedGoalCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_GetAssignedGoalSubmited";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.AssignedGoal beData = new BE.AssignedGoal();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.BranchName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.CompanyRelationship = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.GoalSetupReleaseId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.GoalSetupId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.GoalTypeId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.GoalType = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Description = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.TargetValue = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.GoalMeasurement = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.WeightedId = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.GoalTargetTypeId = reader.GetInt32(15);
                    if (!(reader[16] is DBNull)) beData.GoalTargetType = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.FromDateBS = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.ToDateBS = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[19]);
                    if (!(reader[20] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[20]);
                    if (!(reader[21] is DBNull)) beData.TotalTargetAchievement = Convert.ToInt32(reader[21]);
                    if (!(reader[22] is DBNull)) beData.SupUserId = reader.GetInt32(22);
                    if (!(reader[23] is DBNull)) beData.SuperVisorName = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.TranId = reader.GetInt32(24);
                    if (!(reader[25] is DBNull)) beData.Rating = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is DBNull)) beData.FeedBackTypeId = reader.GetInt32(26);
                    if (!(reader[27] is DBNull)) beData.Remarks = reader.GetString(27);
                    if (!(reader[28] is DBNull)) beData.HRRating = Convert.ToDouble(reader[28]);
                    if (!(reader[29] is DBNull)) beData.FeedbackType = reader.GetString(29);

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

        public ResponeValues SaveRatingPoint(int UserId, List<BE.RatingPoint> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            try
            {
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
                    cmd.Parameters.AddWithValue("@SupervisorId", beData.SupervisorId);
                    cmd.Parameters.AddWithValue("@HRId", beData.HRId);
                    cmd.Parameters.AddWithValue("@Rating", beData.Rating);
                    cmd.Parameters.AddWithValue("@HRRating", beData.HRRating);
                    cmd.Parameters.AddWithValue("@FeedBackTypeId", beData.FeedBackTypeId);
                    cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                    cmd.Parameters.AddWithValue("@IsHR", beData.IsHR);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@TranId", beData.TranId);
                    // Output parameters
                    cmd.Parameters.Add("@ResponseMSG", SqlDbType.NVarChar, 254).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@IsSuccess", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@ErrorNumber", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.CommandText = "usp_AddRatingPoint";
                    cmd.ExecuteNonQuery();
                    // Read output for each record
                    resVal.ResponseMSG = cmd.Parameters["@ResponseMSG"].Value?.ToString() ?? "";
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value ?? false);
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters["@ErrorNumber"].Value ?? 0);

                    if (!resVal.IsSuccess)
                    {
                        dal.RollbackTransaction();
                        return resVal;
                    }
                }

                dal.CommitTransaction();
                resVal.IsSuccess = resVal.IsSuccess;
                resVal.ResponseMSG = resVal.ResponseMSG;
            }
            catch (SqlException ex)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            catch (Exception ex)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

    }
}
