using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DataAccess.Security
{

	internal class SSFAPIUserDB
	{
		DataAccessLayer1 dal = null;
		public SSFAPIUserDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Security.SSFAPIUser beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@BaseUrl", beData.BaseUrl);
			cmd.Parameters.AddWithValue("@UserName", beData.UserName);
			cmd.Parameters.AddWithValue("@Pwd", beData.Pwd);
			cmd.Parameters.AddWithValue("@RemoteUser", beData.RemoteUser);
			cmd.Parameters.AddWithValue("@Practitioner", beData.Practitioner);
			cmd.Parameters.AddWithValue("@PractitionerRole", beData.PractitionerRole);
			cmd.Parameters.AddWithValue("@ServiceProvider", beData.ServiceProvider);

			cmd.CommandText = "usp_AddSSFAPIUser";

			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();

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

		public Dynamic.BusinessEntity.Security.SSFAPIUser getSSFAPIUser(int UserId)
		{
			Dynamic.BusinessEntity.Security.SSFAPIUser beData = new Dynamic.BusinessEntity.Security.SSFAPIUser();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.CommandText = "use_GetSSFAPIUser";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BusinessEntity.Security.SSFAPIUser();
					if (!(reader[0] is DBNull)) beData.BaseUrl = reader.GetString(0);
					if (!(reader[1] is DBNull)) beData.UserName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Pwd = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.RemoteUser = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Practitioner = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.PractitionerRole = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ServiceProvider = reader.GetString(6);
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

