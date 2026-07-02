using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{

	internal class AttendanceTypeDB
	{
		DataAccessLayer1 dal = null;
		public AttendanceTypeDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.AttendanceType beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Alias", beData.Alias);
			cmd.Parameters.AddWithValue("@Types", beData.Types);
			cmd.Parameters.AddWithValue("@UnitsOfWorkId", beData.UnitsOfWorkId);
			cmd.Parameters.AddWithValue("@PeriodType", beData.PeriodType);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@CalculationValue", beData.CalculationValue);
			cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
			cmd.Parameters.AddWithValue("@SNO", beData.SNO);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
			cmd.Parameters.AddWithValue("@CanEditable", beData.CanEditable);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@AttendanceTypeId", beData.AttendanceTypeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAttendanceType";
			}
			else
			{
				cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAttendanceType";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[16].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@ActiveTotalInput", beData.ActiveTotalInput);
			cmd.Parameters.AddWithValue("@Formula", beData.Formula);
			cmd.Parameters.AddWithValue("@ShowInSalarySheet", beData.ShowInSalarySheet);
			cmd.Parameters.AddWithValue("@IsMonthly", beData.IsMonthly);

			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[15].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[15].Value);

				if (!(cmd.Parameters[16].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[16].Value);

				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[18].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.IsSuccess && resVal.RId > 0)
				{
					SaveAttendanceTypeDetailsDetails(beData.CUserId, resVal.RId, beData.AttendanceTypeDetailsColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int AttendanceTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@AttendanceTypeId", AttendanceTypeId);
			cmd.CommandText = "usp_DelAttendanceTypeById";
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
		public Dynamic.BE.NPayroll.AttendanceTypeCollections getAllAttendanceType(int UserId, int EntityId)
		{
			Dynamic.BE.NPayroll.AttendanceTypeCollections dataColl = new Dynamic.BE.NPayroll.AttendanceTypeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllAttendanceType";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.AttendanceType beData = new Dynamic.BE.NPayroll.AttendanceType();
					if (!(reader[0] is DBNull)) beData.AttendanceTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AttendanceTypeName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.UnitsOfWork = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Period = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Description = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.CalculationValue = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.PayHeading = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.SNO = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.BranchId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Code = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.CanEditable = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.ActiveTotalInput = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.Formula = Convert.ToString(reader[15]);
					if (!(reader[16] is DBNull)) beData.ShowInSalarySheet = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.IsMonthly = Convert.ToBoolean(reader[17]);
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

		public Dynamic.BE.NPayroll.AttendanceTypeCollections getAttendanceTypeForTran(int UserId)
		{
			Dynamic.BE.NPayroll.AttendanceTypeCollections dataColl = new Dynamic.BE.NPayroll.AttendanceTypeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);			
			cmd.CommandText = "usp_GetAttendanceTypeForTran";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.AttendanceType beData = new Dynamic.BE.NPayroll.AttendanceType();
					if (!(reader[0] is DBNull)) beData.AttendanceTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AttendanceTypeName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.UnitsOfWork = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Period = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Description = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.CalculationValue = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.PayHeading = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.SNO = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.BranchId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Code = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.CanEditable = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.PayHeadingId = Convert.ToInt32(reader[14]);
					if (!(reader[15] is DBNull)) beData.ActiveTotalInput = Convert.ToBoolean(reader[15]);
					if (!(reader[16] is DBNull)) beData.Formula = Convert.ToString(reader[16]);
					if (!(reader[17] is DBNull)) beData.ShowInSalarySheet = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.IsMonthly = Convert.ToBoolean(reader[18]);
					dataColl.Add(beData);
				}
				reader.NextResult();
                while (reader.Read())
                {
					Dynamic.BE.NPayroll.AttendanceTypeDetails det1 = new Dynamic.BE.NPayroll.AttendanceTypeDetails();
					if (!(reader[0] is DBNull)) det1.AttendanceTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.EmployeeGroupId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.EmployeeCategoryId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.CalculationValue = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.BranchId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) det1.DepartmentId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) det1.EmployeeLevelId = reader.GetInt32(6);
					dataColl.Find(p1=>p1.AttendanceTypeId==det1.AttendanceTypeId).AttendanceTypeDetailsColl.Add(det1);
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
		private void SaveAttendanceTypeDetailsDetails(int UserId, int AttendanceTypeId, Dynamic.BE.NPayroll.AttendanceTypeDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || AttendanceTypeId == 0)
				return;

			foreach (Dynamic.BE.NPayroll.AttendanceTypeDetails beData in beDataColl)
			{
				if(beData.CalculationValue!=0 || beData.EmployeeGroupId > 0)
                {
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@EmployeeGroupId", beData.EmployeeGroupId);
					cmd.Parameters.AddWithValue("@EmployeeCategoryId", beData.EmployeeCategoryId);
					cmd.Parameters.AddWithValue("@CalculationValue", beData.CalculationValue);
					cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
					cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
					cmd.Parameters.AddWithValue("@AttendanceTypeId", AttendanceTypeId);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@EmployeeLevelId", beData.EmployeeLevelId);
					cmd.CommandText = "usp_AddAttendanceTypeDetailsDetails";
					cmd.ExecuteNonQuery();
				}
				
			}

		}

		public Dynamic.BE.NPayroll.AttendanceType getAttendanceTypeById(int UserId, int EntityId, int AttendanceTypeId)
		{
			Dynamic.BE.NPayroll.AttendanceType beData = new Dynamic.BE.NPayroll.AttendanceType();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AttendanceTypeId", AttendanceTypeId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAttendanceTypeById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.NPayroll.AttendanceType();
					if (!(reader[0] is DBNull)) beData.AttendanceTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Types = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.UnitsOfWorkId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.PeriodType = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Description = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.CalculationValue = Convert.ToDouble(reader[7]);
					if (!(reader[8] is DBNull)) beData.PayHeadingId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.SNO = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.BranchId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.Code = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.CanEditable = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.ActiveTotalInput = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.Formula = Convert.ToString(reader[15]);
					if (!(reader[16] is DBNull)) beData.ShowInSalarySheet = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.IsMonthly = Convert.ToBoolean(reader[17]);
				}
				reader.NextResult();
				beData.AttendanceTypeDetailsColl = new Dynamic.BE.NPayroll.AttendanceTypeDetailsCollections();
				while (reader.Read())
				{
					Dynamic.BE.NPayroll.AttendanceTypeDetails det1 = new Dynamic.BE.NPayroll.AttendanceTypeDetails();
					if (!(reader[0] is DBNull)) det1.AttendanceTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.EmployeeGroupId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.EmployeeCategoryId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.CalculationValue = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.BranchId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) det1.DepartmentId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) det1.EmployeeLevelId = reader.GetInt32(6);
					beData.AttendanceTypeDetailsColl.Add(det1);
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

