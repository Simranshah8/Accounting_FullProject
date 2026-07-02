using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

	internal class EmployeeWiseWeekendDB
	{
		DataAccessLayer1 dal = null;
		public EmployeeWiseWeekendDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		public Dynamic.BE.Attendance.EmployeeWiseWeekendCollections GetEmployeeWiseWeekend(int UserId,int YearId, int MonthId, int? BranchId, int? DepartmentId)
		{
			Dynamic.BE.Attendance.EmployeeWiseWeekendCollections dataColl = new Dynamic.BE.Attendance.EmployeeWiseWeekendCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@YearId", YearId);
			cmd.Parameters.AddWithValue("@MonthId", MonthId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.CommandText = "usp_GetEmployeeWiseWeekend";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.Attendance.EmployeeWiseWeekend beData = new Dynamic.BE.Attendance.EmployeeWiseWeekend();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
					if (!(reader[4] is DBNull)) beData.Day1 = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Day2 = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Day3 = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Day4 = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.Day5 = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.Day6 = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.Day7 = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Day8 = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.Day9 = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Day10 = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.Day11 = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.Day12 = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.Day13 = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.Day14 = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.Day15 = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.Day16 = reader.GetInt32(19);
					if (!(reader[20] is DBNull)) beData.Day17 = reader.GetInt32(20);
					if (!(reader[21] is DBNull)) beData.Day18 = reader.GetInt32(21);
					if (!(reader[22] is DBNull)) beData.Day19 = reader.GetInt32(22);
					if (!(reader[23] is DBNull)) beData.Day20 = reader.GetInt32(23);
					if (!(reader[24] is DBNull)) beData.Day21 = reader.GetInt32(24);
					if (!(reader[25] is DBNull)) beData.Day22 = reader.GetInt32(25);
					if (!(reader[26] is DBNull)) beData.Day23 = reader.GetInt32(26);
					if (!(reader[27] is DBNull)) beData.Day24 = reader.GetInt32(27);
					if (!(reader[28] is DBNull)) beData.Day25 = reader.GetInt32(28);
					if (!(reader[29] is DBNull)) beData.Day26 = reader.GetInt32(29);
					if (!(reader[30] is DBNull)) beData.Day27 = reader.GetInt32(30);
					if (!(reader[31] is DBNull)) beData.Day28 = reader.GetInt32(31);
					if (!(reader[32] is DBNull)) beData.Day29 = reader.GetInt32(32);
					if (!(reader[33] is DBNull)) beData.Day30 = reader.GetInt32(33);
					if (!(reader[34] is DBNull)) beData.Day31 = reader.GetInt32(34);
					if (!(reader[35] is DBNull)) beData.Day32 = reader.GetInt32(35);
					if (!(reader[36] is DBNull)) beData.TotalDays = reader.GetInt32(36);
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

		public ResponeValues SaveEmpWiseWeekend(int UserId, Dynamic.BE.Attendance.EmployeeWiseWeekendCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			try
			{
				foreach (var beData in dataColl)
				{
					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
					cmd.Parameters.AddWithValue("@EntryDate", beData.W_Date);
					cmd.Parameters.AddWithValue("@NY", beData.NY);
					cmd.Parameters.AddWithValue("@NM", beData.NM);
					cmd.Parameters.AddWithValue("@ND", beData.ND);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@IsWeekEnd", beData.IsWeekEnd);
					cmd.CommandText = "sp_AddEmployeeWiseWeekend";
					cmd.ExecuteNonQuery();
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

		public ResponeValues CopyEmpWiseWeekend(int UserId, int FromYearId, int FromMonthId, int ToYearId, int ToMonthId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@FromYearId", FromYearId);
			cmd.Parameters.AddWithValue("@FromMonthId", FromMonthId);
			cmd.Parameters.AddWithValue("@ToYearId", ToYearId);
			cmd.Parameters.AddWithValue("@ToMonthId", ToMonthId);
			cmd.CommandText = "usp_CopyEmployeeWiseWeekEndForMonth";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);
				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);
				if (!resVal.IsSuccess)
				{
					if (resVal.ErrorNumber > 0)
						resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";
				}
			}
			catch (System.Data.SqlClient.SqlException ex)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			catch (Exception ex)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues DeleteById(int BranchId, int DepartmentId, int YearId, int MonthId)
		{
			ResponeValues resVal = new ResponeValues();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@NY", YearId);
			cmd.Parameters.AddWithValue("@NM", MonthId);
			cmd.CommandText = "sp_DeleteEmployeeWiseWeekend";
			cmd.ExecuteNonQuery();
			dal.CloseConnection();
			resVal.ResponseMSG = ("Delete Sucessfull");
			return resVal;
		}

	}
}