using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
	internal class SalaryAddDeductDB
	{
		DataAccessLayer1 dal = null;
		public SalaryAddDeductDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.SalaryAddDeduct beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@DesignationId", beData.DesignationId);
			cmd.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@Gender", beData.Gender);
			cmd.Parameters.AddWithValue("@Title", beData.Title);
			cmd.Parameters.AddWithValue("@TypeId", beData.TypeId);
			cmd.Parameters.AddWithValue("@Amount", beData.Amount);
			cmd.Parameters.AddWithValue("@YearId", beData.YearId);
			cmd.Parameters.AddWithValue("@MonthId", beData.MonthId);
			cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
			cmd.Parameters.AddWithValue("@ForDate", beData.ForDate);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);
			if (isModify)
			{
				cmd.CommandText = "usp_UpdateSalaryAddDeduct";
			}
			else
			{
				cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddSalaryAddDeduct";
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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelSalaryAddDeductById";
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
		public Dynamic.BE.NPayroll.SalaryAddDeductCollections getAllSalaryAddDeduct(int UserId, int EntityId)
		{
			Dynamic.BE.NPayroll.SalaryAddDeductCollections dataColl = new Dynamic.BE.NPayroll.SalaryAddDeductCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllSalaryAddDeduct";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.SalaryAddDeduct beData = new Dynamic.BE.NPayroll.SalaryAddDeduct();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.BranchName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Department = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Designation = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.ServiceType = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.EmployeeName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Title = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.AddDeductType = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Amount = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.PayHeading = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ForDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.Remarks = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.EmployeeCode = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.ForMiti = reader.GetString(13);
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
		public Dynamic.BE.NPayroll.SalaryAddDeduct getSalaryAddDeductById(int UserId, int EntityId, int TranId)
		{
			Dynamic.BE.NPayroll.SalaryAddDeduct beData = new Dynamic.BE.NPayroll.SalaryAddDeduct();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetSalaryAddDeductById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.NPayroll.SalaryAddDeduct();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.BranchId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.DepartmentId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DesignationId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ServiceTypeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.EmployeeId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Gender = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Title = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.TypeId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.Amount = Convert.ToDouble(reader[9]);
					if (!(reader[10] is DBNull)) beData.YearId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.MonthId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.PayHeadingId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.ForDate = reader.GetDateTime(13);
					if (!(reader[14] is DBNull)) beData.Remarks = reader.GetString(14);
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

