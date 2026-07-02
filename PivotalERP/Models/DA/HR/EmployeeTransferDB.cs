using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{

	internal class EmployeeTransferDB
	{
		DataAccessLayer1 dal = null;
		public EmployeeTransferDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.EmployeeTransfer beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@TransferDate", beData.TransferDate);
			cmd.Parameters.AddWithValue("@EffectiveDate", beData.EffectiveDate);
			cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
			cmd.Parameters.AddWithValue("@DesignationId", beData.DesignationId);
			cmd.Parameters.AddWithValue("@HeadQtr", beData.HeadQtr);
			cmd.Parameters.AddWithValue("@NewCompanyId", beData.NewCompanyId);
			cmd.Parameters.AddWithValue("@NewBranchId", beData.NewBranchId);
			cmd.Parameters.AddWithValue("@NewDepartmentId", beData.NewDepartmentId);
			cmd.Parameters.AddWithValue("@NewCategoryId", beData.NewCategoryId);
			cmd.Parameters.AddWithValue("@NewDesignationId", beData.NewDesignationId);
			cmd.Parameters.AddWithValue("@NewHeadQuarter", beData.NewHeadQuarter);
			cmd.Parameters.AddWithValue("@RecommendedById", beData.RecommendedById);
			cmd.Parameters.AddWithValue("@VerifiedById", beData.VerifiedById);
			cmd.Parameters.AddWithValue("@RecommendedRemarks", beData.RecommendedRemarks);
			cmd.Parameters.AddWithValue("@VerifiedRemarks", beData.VerifiedRemarks);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TransferId", beData.TransferId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmployeeTransfer";
			}
			else
			{
				cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmployeeTransfer";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[25].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[23].Value);

				if (!(cmd.Parameters[24].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[24].Value);

				if (!(cmd.Parameters[25].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[25].Value);

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

		private void SaveDocumentDet(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int TransferId, int UserId)
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
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@TransferId", TransferId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_AddEmployeeTransferAtt";
					cmd.ExecuteNonQuery();

				}

			}
		}
		public ResponeValues DeleteById(int UserId, int EntityId, int TransferId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TransferId", TransferId);
			cmd.CommandText = "usp_DelEmployeeTransferById";
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
		public BE.EmployeeTransferCollections getAllEmployeeTransfer(int UserId, int EntityId)
		{
			BE.EmployeeTransferCollections dataColl = new BE.EmployeeTransferCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllEmployeeTransfer";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.EmployeeTransfer beData = new BE.EmployeeTransfer();
					if (!(reader[0] is DBNull)) beData.TransferId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TransferDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.EffectiveDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.CompanyId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.BranchId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.DepartmentId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.CategoryId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.DesignationId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.HeadQtr = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.NewCompanyId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.NewBranchId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.NewDepartmentId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.NewCategoryId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.NewDesignationId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.NewHeadQuarter = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.RecommendedById = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.VerifiedById = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.RecommendedRemarks = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.VerifiedRemarks = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.Remarks = reader.GetString(20);

					if (!(reader[21] is DBNull)) beData.CompanyName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.BranchName = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.EmployeeName = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.Department = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.CategoryName = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.TransferMitti = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.EffectiveMitti = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.TransferBy = reader.GetString(28);
					if (!(reader[29] is DBNull)) beData.LogMitti = reader.GetString(29);
					if (!(reader[30] is DBNull)) beData.UpdateMitti = reader.GetString(30);
					if (!(reader[31] is DBNull)) beData.EmployeeCode = reader.GetString(31);
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
		
		public BE.EmployeeTransfer getEmployeeTransferById(int UserId, int EntityId, int TransferId)
		{
			BE.EmployeeTransfer beData = new BE.EmployeeTransfer();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TransferId", TransferId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetEmployeeTransferById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.EmployeeTransfer();
					if (!(reader[0] is DBNull)) beData.TransferId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TransferDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.EffectiveDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.CompanyId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.BranchId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.DepartmentId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.CategoryId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.DesignationId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.HeadQtr = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.NewCompanyId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.NewBranchId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.NewDepartmentId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.NewCategoryId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.NewDesignationId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.NewHeadQuarter = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.RecommendedById = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.VerifiedById = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.RecommendedRemarks = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.VerifiedRemarks = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.Remarks = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.UserId = reader.GetInt32(21);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det2 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det2.Id = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.DocumentTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det2.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.Extension = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.DocPath = reader.GetString(4);
					if (!(reader[5] is DBNull)) det2.Description = reader.GetString(5);
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

	}

}

