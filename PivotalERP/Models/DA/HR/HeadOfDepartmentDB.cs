using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class HeadOfDepartmentDB
	{
		DataAccessLayer1 dal = null;
		public HeadOfDepartmentDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		public ResponeValues SaveUpdate(Dynamic.BE.HR.HeadOfDepartment beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@CoEmployeeId", beData.CoEmployeeId);
			cmd.Parameters.AddWithValue("@StartDate", beData.StartDate);
			cmd.Parameters.AddWithValue("@Note", beData.Note);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateHeadOfDepartment";
			}
			else
			{
				cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddHeadOfDepartment";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@CompanyRelationshipIds", beData.CompanyRelationshipIds);
			cmd.Parameters.AddWithValue("@BranchIds", beData.BranchIds);
			cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);  //Added by Simran
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

        public Dynamic.BE.HR.HeadOfDepartmentCollections getAllHeadOfDepartment(int UserId, int EntityId)
        {
            Dynamic.BE.HR.HeadOfDepartmentCollections dataColl = new Dynamic.BE.HR.HeadOfDepartmentCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllHeadOfDepartment";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.HR.HeadOfDepartment beData = new Dynamic.BE.HR.HeadOfDepartment();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.CompanyId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.BranchId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ServiceTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.EmployeeId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.CoEmployeeId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.StartDate = Convert.ToDateTime(reader[7]);
					if (!(reader[8] is DBNull)) beData.Company = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Branch = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Department = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.ServiceType = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Employee = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.CoEmployee = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.StartDateMiti = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.EmployeeCode = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.CoEmployeeCode = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.Note = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.ProductId = reader.GetInt32(18);   //Added by Simran
					if (!(reader[19] is DBNull)) beData.ProductName = reader.GetString(19);   //Added by Simran
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

        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelHeadOfDepartmentById";
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

		public Dynamic.BE.HR.HeadOfDepartment getHeadOfDepartmentById(int UserId, int EntityId, int TranId)
		{
			Dynamic.BE.HR.HeadOfDepartment beData = new Dynamic.BE.HR.HeadOfDepartment();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetHeadOfDepartmentById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.HeadOfDepartment();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.CompanyId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.BranchId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DepartmentId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ServiceTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.EmployeeId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.CoEmployeeId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.StartDate = Convert.ToDateTime(reader[7]);
					if (!(reader[8] is DBNull)) beData.Note = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.UserId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.CoUserId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.CompanyRelationshipIds = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.BranchIds = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.ProductId = reader.GetInt32(13);  
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

