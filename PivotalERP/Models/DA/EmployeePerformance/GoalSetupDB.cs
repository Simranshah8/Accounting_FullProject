using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{

    internal class GoalSetupDB
    {
        DataAccessLayer1 dal = null;
        public GoalSetupDB(string hostname, string dbName)
        {
            dal = new DataAccessLayer1(hostname, dbName);
        }
        public ResponeValues SaveUpdate(BE.GoalSetup beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
            cmd.Parameters.AddWithValue("@GoalTypeId", beData.GoalTypeId);
            cmd.Parameters.AddWithValue("@Description", beData.Description);
            cmd.Parameters.AddWithValue("@IsMeasurement", beData.IsMeasurement);
            cmd.Parameters.AddWithValue("@TargetValue", beData.TargetValue);
            cmd.Parameters.AddWithValue("@GoalMeasurement", beData.GoalMeasurement);
            cmd.Parameters.AddWithValue("@WeightedId", beData.WeightedId);
            cmd.Parameters.AddWithValue("@GoalTargetTypeId", beData.GoalTargetTypeId);
            cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
            cmd.Parameters.AddWithValue("@FromDate", beData.FromDate);
            cmd.Parameters.AddWithValue("@ToDate", beData.ToDate);

            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@GoalSetupId", beData.GoalSetupId);

            if (isModify)
            {
                cmd.CommandText = "usp_UpdateGoalSetup";
            }
            else
            {
                cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddGoalSetup";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@ParentSetupId", beData.ParentSetupId);
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[13].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[13].Value);

                if (!(cmd.Parameters[14].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[14].Value);

                if (!(cmd.Parameters[15].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[15].Value);

                if (!(cmd.Parameters[16].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[16].Value);

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

        public ResponeValues DeleteById(int UserId, int EntityId, int GoalSetupId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@GoalSetupId", GoalSetupId);
            cmd.CommandText = "usp_DelGoalSetupById";
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
        public BE.GoalSetupCollections getAllGoalSetup(int UserId, int EntityId)
        {
            BE.GoalSetupCollections dataColl = new BE.GoalSetupCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllGoalSetup";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.GoalSetup beData = new BE.GoalSetup();
                    if (!(reader[0] is DBNull)) beData.GoalSetupId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.CostClassId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.GoalTypeId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.IsMeasurement = Convert.ToBoolean(reader[4]);
                    if (!(reader[5] is DBNull)) beData.TargetValue = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.GoalMeasurement = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.WeightedId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.GoalTargetTypeId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[9]);
                    if (!(reader[10] is DBNull)) beData.GoalType = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.GoalTargetType = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.Weighted = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.CostClass = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[14]);
                    if (!(reader[15] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[15]);
                    if (!(reader[16] is DBNull)) beData.FromDateBS = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.ToDateBS = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.ParentSetupId = reader.GetInt32(18);
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
        public BE.GoalSetup getGoalSetupById(int UserId, int EntityId, int GoalSetupId)
        {
            BE.GoalSetup beData = new BE.GoalSetup();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@GoalSetupId", GoalSetupId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetGoalSetupById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.GoalSetup();
                    if (!(reader[0] is DBNull)) beData.GoalSetupId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.CostClassId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.GoalTypeId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.IsMeasurement = Convert.ToBoolean(reader[4]);
                    if (!(reader[5] is DBNull)) beData.TargetValue = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.GoalMeasurement = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.WeightedId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.GoalTargetTypeId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[9]);
                    if (!(reader[10] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[10]);
                    if (!(reader[11] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[11]);
                    if (!(reader[12] is DBNull)) beData.ParentSetupId = reader.GetInt32(12);
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

