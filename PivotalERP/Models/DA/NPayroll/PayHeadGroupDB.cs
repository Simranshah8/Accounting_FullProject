using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{

	internal class PayHeadGroupDB
	{
		DataAccessLayer1 dal = null;
		public PayHeadGroupDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.PayHeadGroup beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@SNo", beData.SNo);
			cmd.Parameters.AddWithValue("@Description", beData.Description);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@PayHeadGroupId", beData.PayHeadGroupId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdatePayHeadGroup";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddPayHeadGroup";
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

				if (resVal.IsSuccess && resVal.RId > 0)
				{
					SavePayHeadGroupTaxExemptionDetails(beData.PayHeadGroupTaxExemptionColl, resVal.RId, beData.CUserId);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int PayHeadGroupId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@PayHeadGroupId", PayHeadGroupId);
			cmd.CommandText = "usp_DelPayHeadGroupById";
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
		public Dynamic.BE.NPayroll.PayHeadGroupCollections getAllPayHeadGroup(int UserId, int EntityId)
		{
			Dynamic.BE.NPayroll.PayHeadGroupCollections dataColl = new Dynamic.BE.NPayroll.PayHeadGroupCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllPayHeadGroup";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.PayHeadGroup beData = new Dynamic.BE.NPayroll.PayHeadGroup();
					if (!(reader[0] is DBNull)) beData.PayHeadGroupId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.SNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Description = reader.GetString(4);
					dataColl.Add(beData);
				}
				reader.NextResult();
                while (reader.Read())
                {
					Dynamic.BE.NPayroll.PayHeadGroupTaxExemption det1 = new Dynamic.BE.NPayroll.PayHeadGroupTaxExemption();
					if (!(reader[0] is DBNull)) det1.PayHeadGroupId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.GenderId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.MaritalStatusId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.ResidentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.Rate = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det1.Amount = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det1.Formula = reader.GetString(6);
					dataColl.Find(p1=>p1.PayHeadGroupId==det1.PayHeadGroupId).PayHeadGroupTaxExemptionColl.Add(det1);
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

		private void SavePayHeadGroupTaxExemptionDetails(List<Dynamic.BE.NPayroll.PayHeadGroupTaxExemption> dataColl, int PayHeadGroupId, int UserId)
		{
			foreach (var beData in dataColl)
			{
				if (beData.Amount != 0 || beData.Rate != 0)//Edited by suresh on chaitra 26
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@GenderId", beData.GenderId);
					cmd.Parameters.AddWithValue("@MaritalStatusId", beData.MaritalStatusId);
					cmd.Parameters.AddWithValue("@ResidentId", beData.ResidentId);
					cmd.Parameters.AddWithValue("@Rate", beData.Rate);
					cmd.Parameters.AddWithValue("@Amount", beData.Amount);
					cmd.Parameters.AddWithValue("@Formula", beData.Formula);
					cmd.Parameters.AddWithValue("@PayHeadGroupId", PayHeadGroupId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_AddPayHeadGroupTaxExemption";
					cmd.ExecuteNonQuery();
				}
			}
		}


		public Dynamic.BE.NPayroll.PayHeadGroup getPayHeadGroupById(int UserId, int EntityId, int PayHeadGroupId)
		{
			Dynamic.BE.NPayroll.PayHeadGroup beData = new Dynamic.BE.NPayroll.PayHeadGroup();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PayHeadGroupId", PayHeadGroupId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetPayHeadGroupById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.NPayroll.PayHeadGroup();
					if (!(reader[0] is DBNull)) beData.PayHeadGroupId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.SNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Description = reader.GetString(4);
				}
				reader.NextResult();
				beData.PayHeadGroupTaxExemptionColl = new Dynamic.BE.NPayroll.PayHeadGroupTaxExemptionCollections();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.PayHeadGroupTaxExemption det1 = new Dynamic.BE.NPayroll.PayHeadGroupTaxExemption();
					if (!(reader[0] is DBNull)) det1.PayHeadGroupId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.GenderId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.MaritalStatusId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.ResidentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.Rate = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det1.Amount = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det1.Formula = reader.GetString(6);
					beData.PayHeadGroupTaxExemptionColl.Add(det1);
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

