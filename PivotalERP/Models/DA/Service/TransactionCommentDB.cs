using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Service
{

	internal class TransactionCommentDB
	{
		DataAccessLayer1 dal = null;
		public TransactionCommentDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}	

		public ResponeValues SaveTransactionComment(BE.Service.TransactionComment beData)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);
			cmd.Parameters.AddWithValue("@Comment", beData.Comment);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.CommandText = "usp_AddTransactionComment";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@DocumentPath", beData.Documentpath);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

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


		public Dynamic.BE.Service.TransactionCommentCollections getTranCommentsById(int UserId, int? VoucherId, int TranId)
		{
			Dynamic.BE.Service.TransactionCommentCollections dataColl = new Dynamic.BE.Service.TransactionCommentCollections();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@VoucherId", VoucherId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_GetTransactionComments";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Service.TransactionComment beData = new Dynamic.BE.Service.TransactionComment();
					beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.UserName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Comment = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.LogDateTime = reader.GetDateTime(4);
					if (!(reader[5] is DBNull)) beData.LogMiti = reader.GetString(5);

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

