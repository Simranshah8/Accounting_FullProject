using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using System.Data;

namespace Dynamic.DA.Hospital
{
	internal class DiscountCommissionMappingDB
	{
		DataAccessLayer1 dal = null;
		public DiscountCommissionMappingDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public BE.Hospital.DiscountCommissionMappingCollections getAllDiscountCommissionMapping(int UserId, int EntityId)
		{
			BE.Hospital.DiscountCommissionMappingCollections dataColl = new BE.Hospital.DiscountCommissionMappingCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllDiscountForCommisionMapping";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.DiscountCommissionMapping beData = new BE.Hospital.DiscountCommissionMapping();
					if (!(reader[0] is DBNull)) beData.DiscountTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DiscountType = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.CommissionTypeId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.TranId = reader.GetInt32(3);
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


		public ResponeValues SaveUpdate(int UserId, List<BE.Hospital.DiscountCommissionMapping> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
				foreach (var beData in dataColl)
				{
					if (!beData.CommissionTypeId.HasValue)
						continue;
					cmd.Parameters.Clear();
					cmd.CommandText = "usp_AddDiscountCommissionMapping";
					cmd.Parameters.AddWithValue("@DiscountTypeId", beData.DiscountTypeId);
					cmd.Parameters.AddWithValue("@CommissionTypeId", beData.CommissionTypeId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@TranId", beData.TranId);
					// Output parameters
					cmd.Parameters.Add("@ResponseMSG", SqlDbType.NVarChar, 254).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@IsSuccess", SqlDbType.Bit).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@ErrorNumber", SqlDbType.Int).Direction = ParameterDirection.Output;
					cmd.ExecuteNonQuery();
					// Read output for each record
					resVal.ResponseMSG = cmd.Parameters["@ResponseMSG"].Value?.ToString() ?? "";
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value ?? false);
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters["@ErrorNumber"].Value ?? 0);
					}

				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = resVal.ResponseMSG;
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

