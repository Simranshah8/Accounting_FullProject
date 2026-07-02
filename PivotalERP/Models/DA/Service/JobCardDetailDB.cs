using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{
    internal class JobCardDetailDB
    {
        DataAccessLayer1 dal = null;
        public JobCardDetailDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
		public BE.JobCardDetailCollections getAllJobCardDetail(int UserId, int EntityId, DateTime DateFrom, DateTime DateTo)
		{
			BE.JobCardDetailCollections dataColl = new BE.JobCardDetailCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
			cmd.Parameters.AddWithValue("@DateTo", DateTo);
			cmd.CommandText = "usp_GetAllJobCardDetail";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.JobCardDetail beData = new BE.JobCardDetail();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.PartyName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Address = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.PhoneNo = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.RegdNo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.RunningKM = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) beData.Remarks = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.JobNo = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.NextServiceDate = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) beData.VinNo = reader.GetInt32(9);
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

		public ResponeValues SaveJobCardRemarks(BE.JobCardRemarks beData)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.CommandText = "usp_AddJobCardRemarks";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();


				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[6].Value);

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

		public BE.JobCardRemarksCollections getJobCardRemarksById(int UserId, int TranId)
		{
			BE.JobCardRemarksCollections dataColl = new BE.JobCardRemarksCollections();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_GetJobCardRemarks";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.JobCardRemarks beData = new BE.JobCardRemarks();
					beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Remarks = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.LogDateTime = reader.GetDateTime(3);
					if (!(reader[4] is DBNull)) beData.LogMiti = reader.GetString(4);

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
