using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{
	internal class ReferenceRuleDB
	{
		DataAccessLayer1 dal = null;

		public ReferenceRuleDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.Lab.ReferenceRule beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ModeId", beData.ModeId);
			cmd.Parameters.AddWithValue("@TestNameId", beData.TestNameId);
			cmd.Parameters.AddWithValue("@TestComponentId", beData.TestComponentId);
			cmd.Parameters.AddWithValue("@ComponentGlobalId", beData.ComponentGlobalId);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@RefRuleId", beData.RefRuleId);

			if (isModify)
			{
				cmd.CommandText = "usp_Updatelab_ReferenceRule";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_Addlab_ReferenceRule";
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

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveRefRuleLookUpsDetails(beData.CUserId, resVal.RId, beData.RefRuleLookUpsColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int RefRuleId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@RefRuleId", RefRuleId);
			cmd.CommandText = "usp_Dellab_ReferenceRuleById";
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
		public BE.Lab.ReferenceRuleCollections GetAllLabReferenceRule(int UserId, int EntityId)
		{
			BE.Lab.ReferenceRuleCollections dataColl = new BE.Lab.ReferenceRuleCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAlllab_ReferenceRule";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.ReferenceRule beData = new BE.Lab.ReferenceRule();
					if (!(reader[0] is DBNull)) beData.RefRuleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ModeId = Convert.ToBoolean(reader[1]);
					if (!(reader[2] is DBNull)) beData.TestNameId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.TestComponentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ComponentGlobalId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[5]);
					if (!(reader[6] is DBNull)) beData.GenderName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.MinAge = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.MaxAge = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.NormalHigh = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.NormalLow = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.TestName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.ComponentName = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.GlobalComponentName = reader.GetString(13);
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
		private void SaveRefRuleLookUpsDetails(int UserId, int RefRuleId, BE.Lab.RefRuleLookUpsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0)
				return;

			foreach (BE.Lab.RefRuleLookUps beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@RefRuleId", RefRuleId);
				cmd.Parameters.AddWithValue("@GenderId", beData.GenderId);
				cmd.Parameters.AddWithValue("@MinAge", beData.MinAge);
				cmd.Parameters.AddWithValue("@MaxAge", beData.MaxAge);
				cmd.Parameters.AddWithValue("@NormalLow", beData.NormalLow);
				cmd.Parameters.AddWithValue("@NormalHigh", beData.NormalHigh);
				cmd.Parameters.AddWithValue("@CriticalLow", beData.CriticalLow);
				cmd.Parameters.AddWithValue("@CriticalHigh", beData.CriticalHigh);
				cmd.Parameters.AddWithValue("@TextualRef", beData.TextualRef);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddRefRuleLookUpsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.Lab.ReferenceRule GetLabReferenceRuleById(int UserId, int EntityId, int RefRuleId)
		{
			BE.Lab.ReferenceRule beData = new BE.Lab.ReferenceRule();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@RefRuleId", RefRuleId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_Getlab_ReferenceRuleById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Lab.ReferenceRule();
					if (!(reader[0] is DBNull)) beData.RefRuleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.ModeId = Convert.ToBoolean(reader[1]);
					if (!(reader[2] is DBNull)) beData.TestNameId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.TestComponentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ComponentGlobalId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[5]);
				}
				reader.NextResult();
				beData.RefRuleLookUpsColl = new BE.Lab.RefRuleLookUpsCollections();
				while (reader.Read())
				{
					BE.Lab.RefRuleLookUps det1 = new BE.Lab.RefRuleLookUps();
					if (!(reader[0] is DBNull)) det1.RefRuleId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.GenderId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.MinAge = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.MaxAge = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.NormalLow = reader.GetString(4);
					if (!(reader[5] is DBNull)) det1.NormalHigh = reader.GetString(5);
					if (!(reader[6] is DBNull)) det1.CriticalLow = reader.GetString(6);
					if (!(reader[7] is DBNull)) det1.CriticalHigh = reader.GetString(7);
					if (!(reader[8] is DBNull)) det1.TextualRef = reader.GetString(8);
					beData.RefRuleLookUpsColl.Add(det1);
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

