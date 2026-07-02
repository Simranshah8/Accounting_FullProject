using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{
	internal class LedgerAuthorizedDB
	{
		DataAccessLayer1 dal = null;
		public LedgerAuthorizedDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}       

		public ResponeValues SaveUpdate(int UserId, BE.LedgerAuthorizedyCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			dal.BeginTransaction();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
				var fst = dataColl.First();
				cmd.Parameters.AddWithValue("@LedgerId", fst.LedgerId);
				cmd.CommandText = "usp_DelLedgerAuthorizedById";
				cmd.ExecuteNonQuery();
				foreach (var beData in dataColl)
				{
					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
					cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
					cmd.Parameters.AddWithValue("@UserId1", beData.UserId1);
					cmd.Parameters.AddWithValue("@UserId2", beData.UserId2);
					cmd.Parameters.AddWithValue("@UserId3", beData.UserId3);
					cmd.Parameters.AddWithValue("@LimitAmt", beData.LimitAmt);
					cmd.Parameters.AddWithValue("@UsedAmt", beData.UsedAmt);
					cmd.Parameters.AddWithValue("@BalanceAmt", beData.BalanceAmt);
					cmd.Parameters.AddWithValue("@LimitAmt_Monthly", beData.LimitAmt_Monthly);
					cmd.Parameters.AddWithValue("@UsedAmt_Monthly", beData.UsedAmt_Monthly);
					cmd.Parameters.AddWithValue("@BalanceAmt_Monthly", beData.BalanceAmt_Monthly);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "SaveLedgerAuthorized";
					cmd.ExecuteNonQuery();
				}
				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = "Ledger Authorized Saved";
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


		public BE.LedgerAuthorizedyCollections getLedgerAuthorized(int UserId, int EntityId, int? LedgerId)
		{
			BE.LedgerAuthorizedyCollections dataColl = new BE.LedgerAuthorizedyCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;			
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
			cmd.CommandText = "usp_GetLedgerAuthorized";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.LedgerAuthorized beData = new BE.LedgerAuthorized();
					if (!(reader[0] is DBNull)) beData.BranchId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserId1 = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.UserId2 = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.UserId3 = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.LimitAmt = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) beData.UsedAmt = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) beData.BalanceAmt = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.LimitAmt_Monthly = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.UsedAmt_Monthly = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.BalanceAmt_Monthly = Convert.ToDouble(reader[9]);
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
	}
}

