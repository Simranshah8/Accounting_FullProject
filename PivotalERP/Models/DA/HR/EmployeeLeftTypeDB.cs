using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class EmployeeLeftTypeDB
	{
		DataAccessLayer1 dal = null;
		public EmployeeLeftTypeDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(Dynamic.BE.HR.EmployeeLeftType beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@LeftDate", beData.LeftDate);
			cmd.Parameters.AddWithValue("@EffectiveDate", beData.EffectiveDate);
			cmd.Parameters.AddWithValue("@LeftTypeId", beData.LeftTypeId);
			cmd.Parameters.AddWithValue("@Reason", beData.Reason);
			cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
			cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
			cmd.Parameters.AddWithValue("@VerifiedBy", beData.VerifiedBy);
			cmd.Parameters.AddWithValue("@VerifiedRemarks", beData.VerifiedRemarks);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmpLeftTypeId", beData.EmpLeftTypeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmployeeLeftType";
			}
			else
			{
				cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmployeeLeftType";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[14].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[13].Value);

				if (!(cmd.Parameters[14].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[14].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpLeftAttDetails(beData.AttachmentColl, resVal.RId, beData.CUserId);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int EmpLeftTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@EmpLeftTypeId", EmpLeftTypeId);
			cmd.CommandText = "usp_DelEmployeeLeftTypeById";
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
		private void SaveEmpLeftAttDetails(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int EmpLeftTypeId, int UserId)
		{
			foreach (var beData in dataColl)
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@Description", beData.Description);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@Document", beData.Data);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@EmpLeftTypeId", EmpLeftTypeId);
					cmd.CommandText = "usp_AddEmpLeftAttDetails";
					cmd.ExecuteNonQuery();
				}

		}
		public Dynamic.BE.HR.EmployeeLeftTypeCollections getAllEmployeeLeftType(int UserId, int EntityId)
		{
			Dynamic.BE.HR.EmployeeLeftTypeCollections dataColl = new Dynamic.BE.HR.EmployeeLeftTypeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllEmployeeLeftType";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.EmployeeLeftType beData = new Dynamic.BE.HR.EmployeeLeftType();
					if (!(reader[0] is DBNull)) beData.EmpLeftTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.LeftDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.EffectiveDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.Name = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.EmployeeCode = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.BranchName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.LevelName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Designation = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.VerifiedBy = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.ApprovedBy = reader.GetInt32(11);
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
		public Dynamic.BE.HR.EmployeeLeftType getEmployeeLeftTypeById(int UserId, int EntityId, int EmpLeftTypeId)
		{
			Dynamic.BE.HR.EmployeeLeftType beData = new Dynamic.BE.HR.EmployeeLeftType();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmpLeftTypeId", EmpLeftTypeId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetEmployeeLeftTypeById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.EmployeeLeftType();
					if (!(reader[0] is DBNull)) beData.EmpLeftTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.LeftDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.EffectiveDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.LeftTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Reason = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ApprovedBy = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.ApprovedRemarks = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.VerifiedBy = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.VerifiedRemarks = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.UserId = reader.GetInt32(10);
				}

				reader.NextResult();

				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det.DocumentTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) det.Extension = reader.GetString(2);
					if (!(reader[3] is DBNull)) det.DocPath = reader.GetString(3);
					if (!(reader[4] is DBNull)) det.Description = reader.GetString(4);
					beData.AttachmentColl.Add(det);
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

        public ResponeValues UpdateEmpLeftVerify(int UserId, int EmpLeftTypeId, string VerifiedRemarks)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EmpLeftTypeId", EmpLeftTypeId);
            cmd.Parameters.AddWithValue("@VerifiedRemarks", VerifiedRemarks);
            cmd.CommandText = "usp_UpdateEmpLeftVerify";
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

        public ResponeValues UpdateEmpLeftApproved(int UserId, int EmpLeftTypeId, string ApprovedRemarks)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EmpLeftTypeId", EmpLeftTypeId);
            cmd.Parameters.AddWithValue("@ApprovedRemarks", ApprovedRemarks);
            cmd.CommandText = "usp_UpdateEmpLeftApproved";
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

