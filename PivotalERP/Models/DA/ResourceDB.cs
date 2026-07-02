using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{

	internal class ResourceDB
	{
		DataAccessLayer1 dal = null;
		public ResourceDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.Resource beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ResourceNo", beData.ResourceNo);
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Alias", beData.Alias);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@ResourceType", beData.ResourceType);
			cmd.Parameters.AddWithValue("@ResourceGroupId", beData.ResourceGroupId);
			cmd.Parameters.AddWithValue("@UOMText", beData.UOMText);
			cmd.Parameters.AddWithValue("@ResUnitsPerTimePeriod", beData.ResUnitsPerTimePeriod);
			cmd.Parameters.AddWithValue("@R_HH", beData.R_HH);
			cmd.Parameters.AddWithValue("@R_MM", beData.R_MM);
			cmd.Parameters.AddWithValue("@R_SS", beData.R_SS);
			cmd.Parameters.AddWithValue("@ResourceAllocationOn", beData.ResourceAllocationOn);
			cmd.Parameters.AddWithValue("@Status", beData.Status);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@ResourceId", beData.ResourceId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateResource";
			}
			else
			{
				cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddResource";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[19].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveResourceCostingDetails(beData.CUserId, resVal.RId, beData.ResourceCostingColl);
				}
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

		public ResponeValues DeleteById(int UserId, int EntityId, int ResourceId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@ResourceId", ResourceId);
			cmd.CommandText = "usp_DelResourceById";
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
		public BE.ResourceCollections getAllResource(int UserId, int EntityId)
		{
			BE.ResourceCollections dataColl = new BE.ResourceCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllResource";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Resource beData = new BE.Resource();
					if (!(reader[0] is DBNull)) beData.ResourceId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ResourceNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Alias = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Code = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.UOMText = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Status = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.ResourceTypeName = reader.GetString(7);
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
		private void SaveResourceCostingDetails(int UserId, int ResourceId, BE.ResourceCostingCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || ResourceId == 0)
				return;

			foreach (BE.ResourceCosting beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@ledgerId", beData.ledgerId);
				cmd.Parameters.AddWithValue("@Name", beData.Name);
				cmd.Parameters.AddWithValue("@CostAmt", beData.CostAmt);
				cmd.Parameters.AddWithValue("@ResourceId", ResourceId);
				cmd.Parameters.AddWithValue("@UserId", UserId);				
				cmd.CommandText = "usp_AddResourceCostingDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.Resource getResourceById(int UserId, int EntityId, int ResourceId)
		{
			BE.Resource beData = new BE.Resource();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ResourceId", ResourceId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetResourceById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Resource();
					if (!(reader[0] is DBNull)) beData.ResourceId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ResourceNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Alias = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Code = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Description = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ResourceType = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ResourceGroupId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.UOMText = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ResUnitsPerTimePeriod = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.R_HH = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.R_MM = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.R_SS = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.ResourceAllocationOn = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.Status = Convert.ToBoolean(reader[14]);
				}
				reader.NextResult();
				beData.ResourceCostingColl = new BE.ResourceCostingCollections();
				while (reader.Read())
				{
					BE.ResourceCosting det1 = new BE.ResourceCosting();
					if (!(reader[0] is DBNull)) det1.ResourceId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ledgerId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.CostAmt = Convert.ToDouble(reader[3]);
					beData.ResourceCostingColl.Add(det1);
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

