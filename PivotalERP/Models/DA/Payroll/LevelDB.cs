using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Payroll
{

	internal class LevelDB
	{
		DataAccessLayer1 dal = null;
		public LevelDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		/// <summary>
		/// Line no 73 to 76 Implement SaveLevelWisePayHeadLedger method
		/// </summary>
		/// <param name="beData"></param>
		/// <param name="isModify"></param>
		/// <returns></returns>
		public ResponeValues SaveUpdate(Dynamic.BE.Payroll.Level beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@OrderNo", beData.OrderNo);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@Description", beData.Description);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@LevelId", beData.LevelId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateLevel";
			}
			else
			{
				cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddLevel";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[8].Value);

				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[9].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.IsSuccess)
				{
					SaveLevelWisePayHeadLedger(beData.CUserId, resVal.RId, beData.LevelWisePayHeadLedgerColl);
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
		/// <summary>
		/// Line no 100 to 118 create SaveLevelWisePayHeadLedger method 
		/// </summary>
		/// <param name="UserId"></param>
		/// <param name="LevelId"></param>
		/// <param name="beDataColl"></param>
		private void SaveLevelWisePayHeadLedger(int UserId, int LevelId, Dynamic.BE.Payroll.LevelWisePayHeadLedgerCollection beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || LevelId == 0)
				return;

			foreach (Dynamic.BE.Payroll.LevelWisePayHeadLedger beData in beDataColl)
			{
				if (beData.LedgerId == 0 || beData.LedgerId == null)
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
				cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
				cmd.Parameters.AddWithValue("@LevelId", LevelId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddLevelWisePayHeadLedger";
				cmd.ExecuteNonQuery();
			}
		}

		public ResponeValues DeleteById(int UserId, int EntityId, int LevelId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@LevelId", LevelId);
			cmd.CommandText = "usp_DelLevelById";
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
		public Dynamic.BE.Payroll.LevelCollections getAllLevel(int UserId, int EntityId)
		{
			Dynamic.BE.Payroll.LevelCollections dataColl = new Dynamic.BE.Payroll.LevelCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLevel";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Payroll.Level beData = new Dynamic.BE.Payroll.Level();
					if (!(reader[0] is DBNull)) beData.LevelId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.OrderNo = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Description = reader.GetString(4);
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
		/// <summary>
		/// Line no 226 to 234 get LevelWisePayHeadLedger saved value According to LevelId
		/// </summary>
		/// <param name="UserId"></param>
		/// <param name="EntityId"></param>
		/// <param name="LevelId"></param>
		/// <returns></returns>
		public Dynamic.BE.Payroll.Level getLevelById(int UserId, int EntityId, int LevelId)
		{
			Dynamic.BE.Payroll.Level beData = new Dynamic.BE.Payroll.Level();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@LevelId", LevelId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetLevelById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.Payroll.Level();
					if (!(reader[0] is DBNull)) beData.LevelId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.OrderNo = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Description = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.LedgerId = reader.GetInt32(5);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BE.Payroll.LevelWisePayHeadLedger det = new Dynamic.BE.Payroll.LevelWisePayHeadLedger();
					if (!(reader[0] is DBNull)) det.LevelId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.PayHeadingId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det.LedgerId = reader.GetInt32(2);
					beData.LevelWisePayHeadLedgerColl.Add(det);
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

