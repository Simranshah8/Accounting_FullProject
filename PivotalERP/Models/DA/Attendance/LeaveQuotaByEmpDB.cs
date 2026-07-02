using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

	internal class LeaveQuotaByEmpDB
	{
		DataAccessLayer1 dal = null;
		public LeaveQuotaByEmpDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.Attendance.LeaveQuotaByEmp beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
			cmd.Parameters.AddWithValue("@PeriodId", beData.PeriodId);
			cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
			cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);
			cmd.Parameters.AddWithValue("@OpeningQty", beData.OpeningQty);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateLeaveQuotaByEmp";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddLeaveQuotaByEmp";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@IsBalance", beData.IsBalance);
			cmd.Parameters.AddWithValue("@EmployeeOrSalesman", beData.EmployeeOrSalesman);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				
				if (resVal.IsSuccess)
				{
					if (beData.LeaveQuotaByEmpDetailsColl != null)
						SaveLeaveQuotaByEmpDetailsDetails(resVal.RId, beData.LeaveQuotaByEmpDetailsColl);
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

		public ResponeValues DeleteById(int UserId, int? TranId, int? PeriodId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
			cmd.CommandText = "usp_DelLeaveQuotaByEmpById";
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
		public Dynamic.BE.Attendance.LeaveQuotaByEmpCollections getAllLeaveQuotaByEmp(int UserId)
		{
			Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl = new Dynamic.BE.Attendance.LeaveQuotaByEmpCollections();

			dal.OpenConnection();

			try
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandText = "usp_GetAllLeaveQuotaByEmp";
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Attendance.LeaveQuotaByEmp beData = new BE.Attendance.LeaveQuotaByEmp();
					beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is System.DBNull)) beData.UserId = reader.GetInt32(1);
					if (!(reader[2] is System.DBNull)) beData.DateFrom = reader.GetDateTime(2);
					if (!(reader[3] is System.DBNull)) beData.DateTo = reader.GetDateTime(3);
					if (!(reader[4] is System.DBNull)) beData.Name = reader.GetString(4);
					if (!(reader[5] is System.DBNull)) beData.Code = reader.GetString(5);
					if (!(reader[6] is System.DBNull)) beData.Branch = reader.GetString(6);
					if (!(reader[7] is System.DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[8]);
					if (!(reader[9] is System.DBNull)) beData.DateFromBS = reader.GetString(9);
					if (!(reader[10] is System.DBNull)) beData.DateToBS = reader.GetString(10);
					if (!(reader[11] is System.DBNull)) beData.PeriodId = reader.GetInt32(11);
					if (!(reader[12] is System.DBNull)) beData.IsBalance = reader.GetBoolean(12);
					if (!(reader[13] is System.DBNull)) beData.PeriodName = reader.GetString(13);
					if (!(reader[14] is System.DBNull)) beData.ForEmpOrSalesman = reader.GetString(14);

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
		private void SaveLeaveQuotaByEmpDetailsDetails(int TranId, BE.Attendance.LeaveQuotaByEmpDetailsCollections dataColl)
		{
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			foreach (var beData in dataColl)
			{
				if (beData.NoOfLeave == 0 || beData.NoOfLeave.HasValue == false)
					continue;
				cmd.Parameters.Clear();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@LeaveId", beData.LeaveTypeId);
				cmd.Parameters.AddWithValue("@NoOfLeave", beData.NoOfLeave);

				cmd.CommandText = "usp_AddLeaveQuotaByEmpDetailsDetails";

				cmd.ExecuteNonQuery();
			}

		}

		public Dynamic.BE.Attendance.LeaveQuotaByEmp getLeaveQuotaByEmpById(int UserId, int UsersId, int PeriodId)
		{
			Dynamic.BE.Attendance.LeaveQuotaByEmp beData = new BE.Attendance.LeaveQuotaByEmp();

			dal.OpenConnection();

			try
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@UsersId", UsersId);
				cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
				cmd.CommandText = "usp_GetLeaveQuotaByEmpById";
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				beData.LeaveQuotaByEmpDetailsColl = new BE.Attendance.LeaveQuotaByEmpDetailsCollections();
				while (reader.Read())
				{
					Dynamic.BE.Attendance.LeaveQuotaByEmpDetails det = new BE.Attendance.LeaveQuotaByEmpDetails();
					det.LeaveTypeId = reader.GetInt32(0);
					if (!(reader[1] is System.DBNull)) det.Name = Convert.ToString(reader[1]);
					if (!(reader[2] is System.DBNull)) det.NoOfLeave = Convert.ToDouble(reader[2]);
					if (!(reader[3] is System.DBNull)) beData.IsBalance = Convert.ToBoolean(reader[3]);
					beData.LeaveQuotaByEmpDetailsColl.Add(det);
				}
				beData.IsSuccess = true;
				beData.ResponseMSG = GLOBALMSG.SUCCESS;
				reader.Close();

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


		public Dynamic.BE.Attendance.LeaveQuotaByEmpCollections getAllEmpLeaveQuota(int UserId, int? BranchId, int? DepartmentId, int? CategoryId, int PeriodId,int EmployeeOrSalesman)
		{
			Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl = new Dynamic.BE.Attendance.LeaveQuotaByEmpCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@CategoryId", CategoryId);
			cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
			cmd.Parameters.AddWithValue("@EmployeeOrSalesman", EmployeeOrSalesman);
			cmd.CommandText = "usp_GetEmployeForLeaveQuota";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Attendance.LeaveQuotaByEmp beData = new Dynamic.BE.Attendance.LeaveQuotaByEmp();
					beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.LeaveTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
					if (!(reader[4] is DBNull)) beData.EmployeeName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Branch = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.LeaveTypeName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.PeriodId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.BranchId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.CategoryId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.DateFrom = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.DateTo = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.OpeningQty = Convert.ToDouble(reader[13]);
					if (!(reader[14] is DBNull)) beData.NoOfLeave = Convert.ToInt32(reader[14]);
					if (!(reader[15] is DBNull)) beData.TranId = Convert.ToInt32(reader[15]);
					if (!(reader[16] is DBNull)) beData.UserId = Convert.ToInt32(reader[16]);
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

		public ResponeValues SaveUpdateLeaveQuotaColl(int UserId, Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
				foreach (var beData in dataColl)
				{
					if (beData.UserId == 0 || beData.UserId.HasValue == false)
						continue;
					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@UsersId", beData.UserId);
					cmd.Parameters.AddWithValue("@DateFrom", beData.DateFrom);
					cmd.Parameters.AddWithValue("@DateTo", beData.DateTo);					
					cmd.Parameters.AddWithValue("@OpeningQty", beData.OpeningQty);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@PeriodId", beData.PeriodId);
					cmd.Parameters.AddWithValue("@IsBalance", beData.IsBalance);
					cmd.Parameters.AddWithValue("@EmployeeOrSalesman", beData.EmployeeOrSalesman);
					cmd.Parameters.Add("@TranId", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;
					cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 250).Direction = System.Data.ParameterDirection.Output;
					cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
					cmd.CommandText = "usp_SaveLeaveQuotaColl";
					cmd.ExecuteNonQuery();
					resVal.RId = cmd.Parameters["@TranId"].Value != DBNull.Value ? Convert.ToInt32(cmd.Parameters["@TranId"].Value) : 0;
					resVal.ResponseMSG = cmd.Parameters["@ResponseMSG"].Value.ToString();
					resVal.IsSuccess = cmd.Parameters["@IsSuccess"].Value != DBNull.Value && Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value);
					if (resVal.IsSuccess && beData.LeaveQuotaByEmpDetailsColl != null)
					{
						SaveLeaveQuotaByEmpDetailsDetails(resVal.RId, beData.LeaveQuotaByEmpDetailsColl);
					}
				}
				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = "Your data has been saved successfully.";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;
		}

	}

}

