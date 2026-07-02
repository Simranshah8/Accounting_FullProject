using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

	internal class DonarDB
	{
		DataAccessLayer1 dal = null;
		public DonarDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Hospital.Donar beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AutoNumber", beData.AutoNumber);
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Address", beData.Address);
			cmd.Parameters.AddWithValue("@Notes", beData.Notes);
			cmd.Parameters.AddWithValue("@PhoneNo", beData.PhoneNo);
			cmd.Parameters.AddWithValue("@MobileNo", beData.MobileNo);
			cmd.Parameters.AddWithValue("@FaxNo", beData.FaxNo);
			cmd.Parameters.AddWithValue("@EmailId", beData.EmailId);
			cmd.Parameters.AddWithValue("@Pan", beData.Pan);
			cmd.Parameters.AddWithValue("@DiscountPer", beData.DiscountPer);
			cmd.Parameters.AddWithValue("@IsCredit", beData.IsCredit);
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			cmd.Parameters.AddWithValue("@CanChangeCashCredit", beData.CanChangeCashCredit);
			cmd.Parameters.AddWithValue("@CanChangeDisPer", beData.CanChangeDisPer);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@DonarId", beData.DonarId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateDonar";
			}
			else
			{
				cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddDonar";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[19].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int DonarId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DonarId", DonarId);
			cmd.CommandText = "usp_DelDonarById";
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
		public BE.Hospital.DonarCollections getAllDonar(int UserId, int EntityId)
		{
			BE.Hospital.DonarCollections dataColl = new BE.Hospital.DonarCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllDonar";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.Donar beData = new BE.Hospital.Donar();
					if (!(reader[0] is DBNull)) beData.DonarId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Address = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.PhoneNo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MobileNo = reader.GetString(5);
					
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
		public BE.Hospital.Donar getDonarById(int UserId, int EntityId, int DonarId)
		{
			BE.Hospital.Donar beData = new BE.Hospital.Donar();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@DonarId", DonarId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDonarById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.Donar();
					if (!(reader[0] is DBNull)) beData.DonarId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Address = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Notes = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.PhoneNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.MobileNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.FaxNo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.EmailId = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Pan = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.DiscountPer = Convert.ToDouble(reader[10]);
					if (!(reader[11] is DBNull)) beData.IsCredit = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.LedgerId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.CanChangeCashCredit = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.CanChangeDisPer = Convert.ToBoolean(reader[14]);
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

