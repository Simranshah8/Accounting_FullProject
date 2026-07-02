using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{

	internal class LabPackageDB
	{

		DataAccessLayer1 dal = null;
		public LabPackageDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Lab.LabPackage beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@OrganizationId", beData.OrganizationId);
			cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
			cmd.Parameters.AddWithValue("@PricingId", beData.PricingId);
			cmd.Parameters.AddWithValue("@Discount", beData.Discount);
			cmd.Parameters.AddWithValue("@FdAmount", beData.FdAmount);
			cmd.Parameters.AddWithValue("@IsProfileTest", beData.IsProfileTest);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@PackageId", beData.PackageId);

			if (isModify)
			{
				cmd.CommandText = "usp_Updatelab_Package";
			}
			else
			{
				cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_Addlab_Package";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[13].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					Savelab_PackageItemsDetails(beData.CUserId, resVal.RId, beData.LabPackageItemsColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int PackageId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@PackageId", PackageId);
			cmd.CommandText = "usp_Dellab_PackageById";
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
		public BE.Lab.LabPackageCollections getAlllab_Package(int UserId, int EntityId)
		{
			BE.Lab.LabPackageCollections dataColl = new BE.Lab.LabPackageCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAlllab_Package";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.LabPackage beData = new BE.Lab.LabPackage();
					if (!(reader[0] is DBNull)) beData.PackageId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.OrganizationId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.CategoryId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.PricingId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Discount = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.FdAmount = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.IsProfileTest = Convert.ToBoolean(reader[8]);
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
		private void Savelab_PackageItemsDetails(int UserId, int PackageId, BE.Lab.LabPackageItemsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0)
				return;

			foreach (BE.Lab.LabPackageItems beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@PackageId", PackageId);
				cmd.Parameters.AddWithValue("@TestProfileId", beData.TestProfileId);
				cmd.Parameters.AddWithValue("@TestName", beData.TestName);
				cmd.Parameters.AddWithValue("@Code", beData.Code);
				cmd.Parameters.AddWithValue("@Qty", beData.Qty);
				cmd.Parameters.AddWithValue("@UnitPrice", beData.UnitPrice);
				cmd.Parameters.AddWithValue("@LineTotal", beData.LineTotal);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@Discount", beData.Discount);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_Addlab_PackageItemsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.Lab.LabPackage getlab_PackageById(int UserId, int EntityId, int PackageId)
		{
			BE.Lab.LabPackage beData = new BE.Lab.LabPackage();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PackageId", PackageId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_Getlab_PackageById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Lab.LabPackage();
					if (!(reader[0] is DBNull)) beData.PackageId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.OrganizationId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.CategoryId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.PricingId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Discount = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.FdAmount = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.IsProfileTest = Convert.ToBoolean(reader[8]);
				}
				reader.NextResult();
				beData.LabPackageItemsColl = new BE.Lab.LabPackageItemsCollections();
				while (reader.Read())
				{
					BE.Lab.LabPackageItems det1 = new BE.Lab.LabPackageItems();
					if (!(reader[0] is DBNull)) det1.PackageId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.TestProfileId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.TestName = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.Qty = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) det1.UnitPrice = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) det1.LineTotal = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Discount = Convert.ToDouble(reader[7]);
					beData.LabPackageItemsColl.Add(det1);
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

