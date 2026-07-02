using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{

	internal class JobWorkOrderDB
	{
		DataAccessLayer1 dal = null;
		public JobWorkOrderDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.JobWorkOrder beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@JobCardId", beData.JobCardId);
			cmd.Parameters.AddWithValue("@FromDate", beData.FromDate);
			cmd.Parameters.AddWithValue("@ToDate", beData.ToDate);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateJobWorkOrder";
			}
			else
			{
				cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddJobWorkOrder";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
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

	internal class JobWorksOrderDB
	{
		DataAccessLayer1 dal = null;
		public JobWorksOrderDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.JobWorksOrder beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNo", beData.ManualVoucherNo);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@PartyLedgerId", beData.PartyLedgerId);
			cmd.Parameters.AddWithValue("@PartyName", beData.PartyName);
			cmd.Parameters.AddWithValue("@Address", beData.Address);
			cmd.Parameters.AddWithValue("@ContactNo", beData.ContactNo);
			cmd.Parameters.AddWithValue("@JobCardId", beData.JobCardId);
			cmd.Parameters.AddWithValue("@FromDate", beData.FromDate);
			cmd.Parameters.AddWithValue("@ToDate", beData.ToDate);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateJobWorksOrder";
			}
			else
			{
				cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddJobWorksOrder";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[19].Value);

				if (!(cmd.Parameters[20].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[20].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveDocumentDet(beData.DocumentColl, resVal.RId, beData.CUserId);

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
			cmd.CommandText = "usp_DelJobWorksOrderById";
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
		public BE.JobWorksOrderCollections getAllJobWorksOrder(int UserId, int EntityId)
		{
			BE.JobWorksOrderCollections dataColl = new BE.JobWorksOrderCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllJobWorksOrder";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.JobWorksOrder beData = new BE.JobWorksOrder();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.CostClassId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ManualVoucherNo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AutoManualNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BranchId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.PartyLedgerId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.PartyName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Address = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ContactNo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.JobCardId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) beData.Remarks = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[15]);
					if (!(reader[16] is DBNull)) beData.VoucherName = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.FiscalYear = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.BranchName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.FromMiti = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.ToMiti = reader.GetString(20);

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
		public BE.JobWorksOrder getJobWorksOrderById(int UserId, int EntityId, int TranId)
		{
			BE.JobWorksOrder beData = new BE.JobWorksOrder();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetJobWorksOrderById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.JobWorksOrder();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.CostClassId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ManualVoucherNo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AutoManualNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BranchId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.PartyLedgerId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.PartyName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Address = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ContactNo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.JobCardId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.FromDate = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.ToDate = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) beData.Remarks = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[15]);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det2 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det2.DocumentTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) det2.Description = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.Extension = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.DocPath = reader.GetString(4);
					beData.DocumentColl.Add(det2);
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


		private void SaveDocumentDet(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int TranId, int UserId)
		{
			foreach (var beData in dataColl)
			{
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@docDescription", beData.Description);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@Document", beData.Data);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@TranId", TranId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_JobWorksOrderDocAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}

	}

}

