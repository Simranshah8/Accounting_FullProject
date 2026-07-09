using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AppCMS
{
    public class ProductDocumentsDB
    {
		DataAccessLayer1 dal = null;
		public ProductDocumentsDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.AppCMS.ProductDocuments beData)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EcommerceDescription", beData.EcommerceDescription);
			cmd.Parameters.AddWithValue("@IngredientsDescription", beData.IngredientsDescription);
			cmd.Parameters.AddWithValue("@UsageDescription", beData.UsageDescription);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);

			cmd.CommandText = "usp_UpdateProductDocuments";
			
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			
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

		private void SaveDocumentDet(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int ProductId, int UserId)
		{
			foreach (var beData in dataColl)
			{
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@docDescription", beData.Description);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@ProductId", ProductId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_ProductDocumentAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}

        public BE.AppCMS.ProductDocumentsCollections GetAllProductDoc(int UserId, int EntityId)
        {
            BE.AppCMS.ProductDocumentsCollections dataColl = new BE.AppCMS.ProductDocumentsCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllProductDocuments";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.AppCMS.ProductDocuments beData = new BE.AppCMS.ProductDocuments();
                    if (!(reader[0] is DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ProductName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.CategoryName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EcommerceDescription = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.IngredientsDescription = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.UsageDescription = reader.GetString(5);

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

        public BE.AppCMS.ProductDocuments GetProductDocById(int UserId, int EntityId, int ProductId)
		{
			BE.AppCMS.ProductDocuments beData = new BE.AppCMS.ProductDocuments();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ProductId", ProductId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetProductDocById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.AppCMS.ProductDocuments();
					if (!(reader[0] is DBNull)) beData.ProductId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EcommerceDescription = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.IngredientsDescription = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.UsageDescription = reader.GetString(3);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det2 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det2.Name = reader.GetString(0);
					if (!(reader[1] is DBNull)) det2.Description = reader.GetString(1);
					if (!(reader[2] is DBNull)) det2.Extension = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.DocPath = reader.GetString(3);
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

		//public ResponeValues DeleteProductDoc(int UserId, int EntityId, int ProductId)
		//{
		//	ResponeValues resVal = new ResponeValues();
		//	dal.OpenConnection();
		//	System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
		//	cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//	cmd.Parameters.AddWithValue("@UserId", UserId);
		//	cmd.Parameters.AddWithValue("@EntityId", EntityId);
		//	cmd.Parameters.AddWithValue("@ProductId", ProductId);
		//	cmd.CommandText = "usp_DelProductDocumentById";
		//	cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
		//	cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
		//	cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
		//	cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
		//	cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
		//	cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
		//	try
		//	{
		//		cmd.ExecuteNonQuery();

		//		if (!(cmd.Parameters[3].Value is DBNull))
		//			resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

		//		if (!(cmd.Parameters[4].Value is DBNull))
		//			resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

		//		if (!(cmd.Parameters[5].Value is DBNull))
		//			resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

		//		if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
		//			resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

		//	}
		//	catch (System.Data.SqlClient.SqlException ee)
		//	{
		//		resVal.IsSuccess = false;
		//		resVal.ResponseMSG = ee.Message;
		//	}
		//	catch (Exception ee)
		//	{
		//		resVal.IsSuccess = false;
		//		resVal.ResponseMSG = ee.Message;
		//	}
		//	finally
		//	{
		//		dal.CloseConnection();
		//	}
		//	return resVal;
		//}
	}
}