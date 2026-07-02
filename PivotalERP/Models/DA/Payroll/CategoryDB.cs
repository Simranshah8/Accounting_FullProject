using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Payroll
{

	internal class CategoryDB
	{
		DataAccessLayer1 dal = null;
		public CategoryDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		/// <summary>
		/// Line no 72 to 75 implement SaveCategoryWisePayHeadLedger method
		/// </summary>
		/// <param name="beData"></param>
		/// <param name="isModify"></param>
		/// <returns></returns>
		public ResponeValues SaveUpdate(Dynamic.BE.Payroll.Category beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@OrderNo", beData.OrderNo);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateCategory";
			}
			else
			{
				cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddCategory";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.IsSuccess)
				{
					SaveCategoryWisePayHeadLedger(beData.CUserId, resVal.RId, beData.CategoryWisePayHeadLedgerColl);
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
		/// Line no 99 to 117 Create SaveCategoryWisePayHeadLedger method
		/// </summary>
		/// <param name="UserId"></param>
		/// <param name="CategoryId"></param>
		/// <param name="beDataColl"></param>
		private void SaveCategoryWisePayHeadLedger(int UserId, int CategoryId, Dynamic.BE.Payroll.CategoryWisePayHeadLedgerCollection beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || CategoryId == 0)
				return;

			foreach (Dynamic.BE.Payroll.CategoryWisePayHeadLedger beData in beDataColl)
			{
				if (beData.LedgerId == 0 || beData.LedgerId == null)
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
				cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
				cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddCategoryWisePayHeadLedger";
				cmd.ExecuteNonQuery();
			}
		}


		public ResponeValues DeleteById(int UserId, int EntityId, int CategoryId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
			cmd.CommandText = "usp_DelCategoryById";
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
		public Dynamic.BE.Payroll.CategoryCollections getAllCategory(int UserId, int EntityId)
		{
			Dynamic.BE.Payroll.CategoryCollections dataColl = new Dynamic.BE.Payroll.CategoryCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllCategory";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Payroll.Category beData = new Dynamic.BE.Payroll.Category();
					if (!(reader[0] is DBNull)) beData.CategoryId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.OrderNo = reader.GetInt32(3);
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
		/// Line no 236 to 244 get CategoryWisePayHeadLedgerColl saved value According to CategoryId
		/// </summary>
		/// <param name="UserId"></param>
		/// <param name="EntityId"></param>
		/// <param name="CategoryId"></param>
		/// <returns></returns>
		public Dynamic.BE.Payroll.Category getCategoryById(int UserId, int EntityId, int CategoryId)
		{
			Dynamic.BE.Payroll.Category beData = new Dynamic.BE.Payroll.Category();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetCategoryById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.Payroll.Category();
					if (!(reader[0] is DBNull)) beData.CategoryId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.OrderNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.LedgerId = reader.GetInt32(4);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BE.Payroll.CategoryWisePayHeadLedger det = new Dynamic.BE.Payroll.CategoryWisePayHeadLedger();
					if (!(reader[0] is DBNull)) det.CategoryId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.PayHeadingId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det.LedgerId = reader.GetInt32(2);
					beData.CategoryWisePayHeadLedgerColl.Add(det);
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

