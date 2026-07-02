using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class CompanyRelationshipDB
	{
		
		DataAccessLayer1 dal = null;
		public CompanyRelationshipDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(Dynamic.BE.HR.CompanyRelationship beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@DisplayName", beData.DisplayName);
			cmd.Parameters.AddWithValue("@FullAddress", beData.FullAddress);
			cmd.Parameters.AddWithValue("@State", beData.State);
			cmd.Parameters.AddWithValue("@Country", beData.Country);
			cmd.Parameters.AddWithValue("@ZipCode", beData.ZipCode);
			cmd.Parameters.AddWithValue("@RegNo", beData.RegNo);
			cmd.Parameters.AddWithValue("@PanVatNo", beData.PanVatNo);
			cmd.Parameters.AddWithValue("@Phone", beData.Phone);
			cmd.Parameters.AddWithValue("@Fax", beData.Fax);
			cmd.Parameters.AddWithValue("@Email", beData.Email);
			cmd.Parameters.AddWithValue("@Website", beData.Website);
			cmd.Parameters.AddWithValue("@RelationshipType", beData.RelationshipType);
			cmd.Parameters.AddWithValue("@Logo", beData.LogoPath);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateCompanyRelationship";
			}
			else
			{
				cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddCompanyRelationship";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;

            cmd.Parameters.AddWithValue("@ApiURL", beData.ApiURL);
            cmd.Parameters.AddWithValue("@UserName", beData.UserName);
            cmd.Parameters.AddWithValue("@Password", beData.Password);

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

		public Dynamic.BE.HR.CompanyRelationshipCollections getAllCompanyRelationship(int UserId, int EntityId)
		{
			Dynamic.BE.HR.CompanyRelationshipCollections dataColl = new Dynamic.BE.HR.CompanyRelationshipCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllCompanyRelationship";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.CompanyRelationship beData = new Dynamic.BE.HR.CompanyRelationship();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.DisplayName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.FullAddress = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.State = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Country = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ZipCode = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.RegNo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.PanVatNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Phone = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Fax = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Email = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Website = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.RelationshipType = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.LogoPath = reader.GetString(14);

                    if (!(reader[15] is DBNull)) beData.ApiURL = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.UserName = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Password = reader.GetString(17);

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
		public Dynamic.BE.HR.CompanyRelationship getCompanyRelationshipById(int UserId, int EntityId, int TranId)
		{
			Dynamic.BE.HR.CompanyRelationship beData = new Dynamic.BE.HR.CompanyRelationship();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetCompanyRelationshipById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.CompanyRelationship();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.DisplayName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.FullAddress = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.State = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Country = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ZipCode = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.RegNo = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.PanVatNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Phone = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Fax = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Email = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Website = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.RelationshipType = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.LogoPath = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.ApiURL = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.UserName = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Password = reader.GetString(17);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelCompanyRelationshipById";
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

	}

}

