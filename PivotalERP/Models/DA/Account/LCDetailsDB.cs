using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;


namespace Dynamic.DA
{

	internal class LCDetailsDB
	{
		DataAccessLayer1 dal = null;
		public LCDetailsDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.LCDetails beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@FromTo", beData.FromTo);
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			cmd.Parameters.AddWithValue("@BankName", beData.BankName);
			cmd.Parameters.AddWithValue("@BranchName", beData.BranchName);
			cmd.Parameters.AddWithValue("@LCNo", beData.LCNo);
			cmd.Parameters.AddWithValue("@Amount", beData.Amount);
			cmd.Parameters.AddWithValue("@Tolerance", beData.Tolerance);
			cmd.Parameters.AddWithValue("@TAmount", beData.TAmount);
			cmd.Parameters.AddWithValue("@IssuesDate", beData.IssuesDate);
			cmd.Parameters.AddWithValue("@ExpiredDate", beData.ExpiredDate);
			cmd.Parameters.AddWithValue("@LastDateOfShipment", beData.LastDateOfShipment);
			cmd.Parameters.AddWithValue("@PaymentTermsInDays", beData.PaymentTermsInDays);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@Status", beData.Status);
			cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
			cmd.Parameters.AddWithValue("@DeActiveBy", beData.DeActiveBy);
			cmd.Parameters.AddWithValue("@Reason", beData.Reason);
			cmd.Parameters.AddWithValue("@DeActiveDateTime", beData.DeActiveDateTime);
			cmd.Parameters.AddWithValue("@MarginHoldAmt", beData.MarginHoldAmt);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@TotalDr", beData.TotalDr);
			cmd.Parameters.AddWithValue("@TotalCr", beData.TotalCr);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateLCDetails";
			}
			else
			{
				cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddLCDetails";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[25].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[26].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[27].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[24].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[24].Value);

				if (!(cmd.Parameters[25].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[25].Value);

				if (!(cmd.Parameters[26].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[26].Value);

				if (!(cmd.Parameters[27].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[27].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveLCDocumentDetails(beData.CUserId, resVal.RId, beData.DocumentColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelLCDetailsById";
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
		
		public BE.LCDetailsCollections getAllLCDetails(int UserId, int EntityId)
		{
			BE.LCDetailsCollections dataColl = new BE.LCDetailsCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLCDetails";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.LCDetails beData = new BE.LCDetails();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.FromTo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.LedgerId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BankName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.LCNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Amount = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.Tolerance = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.TAmount = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.IssuesDate = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) beData.ExpiredDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.LastDateOfShipment = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.PaymentTermsInDays = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Remarks = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Status = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.UserId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.DeActiveBy = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.Reason = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.DeActiveDateTime = Convert.ToDateTime(reader[18]);
					if (!(reader[19] is DBNull)) beData.MarginHoldAmt = Convert.ToDouble(reader[19]);
					if (!(reader[20] is DBNull)) beData.BranchId = reader.GetInt32(20);
					if (!(reader[21] is DBNull)) beData.TotalDr = Convert.ToDouble(reader[21]);
					if (!(reader[22] is DBNull)) beData.TotalCr = Convert.ToDouble(reader[22]);
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
		private void SaveLCDocumentDetails(int UserId, int TranId, Dynamic.BusinessEntity.GeneralDocumentCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (Dynamic.BusinessEntity.GeneralDocument beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@Name", beData.Name);
				cmd.Parameters.AddWithValue("@Extension", beData.Extension);
				cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
				cmd.Parameters.AddWithValue("@Description", beData.Description);
				cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddLCDocumentDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.LCDetails getLCDetailsById(int UserId, int EntityId, int TranId)
		{
			BE.LCDetails beData = new BE.LCDetails();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetLCDetailsById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.LCDetails();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.FromTo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.LedgerId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BankName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.LCNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Amount = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.Tolerance = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.TAmount = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.IssuesDate = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) beData.ExpiredDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.LastDateOfShipment = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.PaymentTermsInDays = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Remarks = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Status = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.UserId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.DeActiveBy = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.Reason = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.DeActiveDateTime = Convert.ToDateTime(reader[18]);
					if (!(reader[19] is DBNull)) beData.MarginHoldAmt = Convert.ToDouble(reader[19]);
					if (!(reader[20] is DBNull)) beData.BranchId = reader.GetInt32(20);
					if (!(reader[21] is DBNull)) beData.TotalDr = Convert.ToDouble(reader[21]);
					if (!(reader[22] is DBNull)) beData.TotalCr = Convert.ToDouble(reader[22]);
				}

				reader.NextResult();
				beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det1 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det1.Id = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Extension = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.DocPath = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.Description = reader.GetString(4);
					if (!(reader[5] is DBNull)) det1.DocumentTypeId = reader.GetInt32(5);
					beData.DocumentColl.Add(det1);
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