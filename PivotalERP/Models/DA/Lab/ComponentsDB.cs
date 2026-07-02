using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{
	internal class ComponentsDB
	{
		DataAccessLayer1 dal = null;
		public ComponentsDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);

		}
		public ResponeValues SaveUpdate(BE.Lab.Components beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TestId", beData.TestId);
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@TypeId", beData.TypeId);
			cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);
			cmd.Parameters.AddWithValue("@Decimal", beData.Decimal);
			cmd.Parameters.AddWithValue("@IsCalculated", beData.IsCalculated);
			cmd.Parameters.AddWithValue("@Formula", beData.Formula);
			cmd.Parameters.AddWithValue("@AnswerSetId", beData.AnswerSetId);
			cmd.Parameters.AddWithValue("@SortOrder", beData.SortOrder);
			cmd.Parameters.AddWithValue("@ComponentGroup", beData.ComponentGroup);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@ComponentId", beData.ComponentId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateLabComponents";
			}
			else
			{
				cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddLabComponents";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[14].Value);

				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[15].Value);

				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[17].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int ComponentId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@ComponentId", ComponentId);
			cmd.CommandText = "usp_DelLabComponentsById";
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
		public BE.Lab.ComponentsCollections getAllLabComponents(int UserId, int EntityId)
		{
			BE.Lab.ComponentsCollections dataColl = new BE.Lab.ComponentsCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLabComponents";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.Components beData = new BE.Lab.Components();
					if (!(reader[0] is DBNull)) beData.ComponentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.TypeId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Decimal = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsCalculated = Convert.ToBoolean(reader[5]);
					if (!(reader[6] is DBNull)) beData.Formula = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.AnswerSetId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.SortOrder = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.ComponentGroup = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.Type = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.AnswerSet = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.Symbol = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.TestName = reader.GetString(14);
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
		public BE.Lab.Components getLabComponentsById(int UserId, int EntityId, int ComponentId)
		{
			BE.Lab.Components beData = new BE.Lab.Components();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ComponentId", ComponentId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetLabComponentsById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Lab.Components();
					if (!(reader[0] is DBNull)) beData.ComponentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TestId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.TypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.UnitId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Decimal = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.IsCalculated = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.Formula = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.AnswerSetId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.SortOrder = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.ComponentGroup = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[12]);
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


		public ResponeValues GetAutoComponentCode(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@Code", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutolabComponentCode";
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);
				resVal.IsSuccess = true;
				resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

