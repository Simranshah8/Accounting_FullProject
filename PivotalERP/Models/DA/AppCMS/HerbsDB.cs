using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AppCMS
{
    public class HerbsDB
    {
        DataAccessLayer1 dal = null;
        public HerbsDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
		public ResponeValues SaveUpdate(BE.AppCMS.Herbs beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@ScientificName", beData.ScientificName);
			cmd.Parameters.AddWithValue("@Badge", beData.Badge);
			cmd.Parameters.AddWithValue("@HsubTitle", beData.HsubTitle);
			cmd.Parameters.AddWithValue("@SEOTitle", beData.SEOTitle);
			cmd.Parameters.AddWithValue("@SEODescription", beData.SEODescription);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@AboutPara", beData.AboutPara);
			cmd.Parameters.AddWithValue("@Banner", beData.Banner);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@HerbsId", beData.HerbsId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateHerbs";
			}
			else
			{
				cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddHerbs";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@Tag", beData.Tag);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[13].Value);

				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[14].Value);

				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[15].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int HerbsId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@HerbsId", HerbsId);
			cmd.CommandText = "usp_DelHerbsById";
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
		public BE.AppCMS.HerbsCollections getAllHerbs(int UserId, int EntityId)
		{
			BE.AppCMS.HerbsCollections dataColl = new BE.AppCMS.HerbsCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllHerbs";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.AppCMS.Herbs beData = new BE.AppCMS.Herbs();
					if (!(reader[0] is DBNull)) beData.HerbsId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.ScientificName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Badge = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.HsubTitle = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.SEOTitle = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.SEODescription = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Description = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.AboutPara = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Banner = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Photo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Tag = reader.GetString(11);
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
		public BE.AppCMS.Herbs getHerbsById(int UserId, int EntityId, int HerbsId)
		{
			BE.AppCMS.Herbs beData = new BE.AppCMS.Herbs();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@HerbsId", HerbsId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetHerbsById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AppCMS.Herbs();
					if (!(reader[0] is DBNull)) beData.HerbsId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.ScientificName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Badge = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.HsubTitle = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.SEOTitle = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.SEODescription = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Description = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.AboutPara = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Banner = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Photo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Tag = reader.GetString(11);
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