


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.GateMaster
{

	internal class ReOrderStockLevelDB
	{
		DataAccessLayer1 dal = null;
		public ReOrderStockLevelDB (string hostname, string dbName)
		{
			dal = new DataAccessLayer1(hostname, dbName);
		}
		public ResponeValues SaveUpdate(int UserId, BE.GateMaster.ReOrderStockLevelCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
                var fst = dataColl.First();
                cmd.Parameters.AddWithValue("@GodownId", fst.GodownId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_DelReOrderStockLevelById";
                cmd.ExecuteNonQuery();
                foreach (var beData in dataColl)
				{
					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@GodownId", beData.GodownId);
					cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
					cmd.Parameters.AddWithValue("@LeadTimeDays", beData.LeadTimeDays);
					cmd.Parameters.AddWithValue("@MinStock", beData.MinStock);
					cmd.Parameters.AddWithValue("@MaxStock", beData.MaxStock);
					cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
					cmd.Parameters.AddWithValue("@UserId", UserId);

					cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
					cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
					cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
					cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
					cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
					cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;


					cmd.CommandText = "usp_AddReOrderStockLevel";
					cmd.ExecuteNonQuery();
					if (!(cmd.Parameters[7].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[7].Value);
					if (!(cmd.Parameters[8].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[8].Value);
					if (!(cmd.Parameters[9].Value is DBNull)) resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[9].Value);

                    if (!resVal.IsSuccess)
                    {
						break;
                    }
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


		public BE.GateMaster.ReOrderStockLevelCollections getAllReOrderStockLevel(int UserId, int EntityId)
		{
			BE.GateMaster.ReOrderStockLevelCollections dataColl = new BE.GateMaster.ReOrderStockLevelCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllReOrderStockLevel";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.GateMaster.ReOrderStockLevel beData = new BE.GateMaster.ReOrderStockLevel();
					if (!(reader[0] is DBNull))
						beData.GodownId = reader.GetInt32(0);
					if (!(reader[1] is DBNull))
						beData.ProductId = reader.GetInt32(1);
					if (!(reader[2] is DBNull))
						beData.LeadTimeDays = reader.GetInt32(2);
					if (!(reader[3] is DBNull))
						beData.MinStock = reader.GetDouble(3);
					if (!(reader[4] is DBNull))
						beData.MaxStock = reader.GetDouble(4);
					if (!(reader[5] is DBNull))
						beData.IsActive = Convert.ToBoolean(reader[5]);
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

		public BE.GateMaster.ReOrderStockLevelCollections getReOrderStockLevelByGodownId(int UserId, int EntityId, int GodownId)
		{
			BE.GateMaster.ReOrderStockLevelCollections dataColl = new BE.GateMaster.ReOrderStockLevelCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@GodownId", GodownId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetReOrderStockLevelByGodownId";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

				while(reader.Read())
				{
					BE.GateMaster.ReOrderStockLevel beData = new BE.GateMaster.ReOrderStockLevel();
					if (!(reader[0] is DBNull))
						beData.GodownId = reader.GetInt32(0);

					if (!(reader[1] is DBNull))
						beData.ProductId = reader.GetInt32(1);

					if (!(reader[2] is DBNull))
						beData.LeadTimeDays = reader.GetInt32(2);

					if (!(reader[3] is DBNull))
						beData.MinStock = reader.GetDouble(3);

					if (!(reader[4] is DBNull))
						beData.MaxStock = reader.GetDouble(4);

					if (!(reader[5] is DBNull))
						beData.IsActive = Convert.ToBoolean(reader[5]);
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


		public ResponeValues DeleteById(int UserId, int EntityId, int GodownId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@GodownId", GodownId);
			cmd.CommandText = "usp_DelReOrderStockLevelById";
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

	

	}

}




