using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.HR
{
	public class EmployeeJDDB
	{
		DataAccessLayer1 dal = null;

		public EmployeeJDDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		public ResponeValues SaveUpdate(BE.HR.EmployeeJD beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
			cmd.Parameters.AddWithValue("@Division", beData.Division);
			cmd.Parameters.AddWithValue("@Age", beData.Age);
			cmd.Parameters.AddWithValue("@WorkStation", beData.WorkStation);
			cmd.Parameters.AddWithValue("@ExpYear", beData.ExpYear);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmpJDId", beData.EmpJDId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmployeeJD";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmployeeJD";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
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

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpJDQualificationDetails(beData.CUserId, resVal.RId, beData.EmpJDQualificationColl);
					SaveEmpJDAchievementDetails(beData.CUserId, resVal.RId, beData.EmpJDAchievementColl);
					SaveEmpJDTrainingDetails(beData.CUserId, resVal.RId, beData.EmpJDTrainingColl);
					SaveEmpJDResponsibilityDetails(beData.CUserId, resVal.RId, beData.EmpJDResponsibilityColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int EmpJDId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
			cmd.CommandText = "usp_DelEmployeeJDById";
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
		public BE.HR.EmployeeJDCollections getAllEmployeeJD(int UserId, int EntityId)
		{
			BE.HR.EmployeeJDCollections dataColl = new BE.HR.EmployeeJDCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllEmployeeJD";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.HR.EmployeeJD beData = new BE.HR.EmployeeJD();
					if (!(reader[0] is DBNull)) beData.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Email = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Department = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.ContactNo = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.DOB_BS = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.JobTitle = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Division = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.WorkStation = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.EmployeeCode = reader.GetString(9);
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
		private void SaveEmpJDQualificationDetails(int UserId, int EmpJDId, BE.HR.EmpJDQualificationCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmpJDId == 0)
				return;

			foreach (BE.HR.EmpJDQualification beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
				cmd.Parameters.AddWithValue("@Qualification", beData.Qualification);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddEmpJDQualificationDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveEmpJDAchievementDetails(int UserId, int EmpJDId, BE.HR.EmpJDAchievementCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmpJDId == 0)
				return;

			foreach (BE.HR.EmpJDAchievement beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
				cmd.Parameters.AddWithValue("@OrgName", beData.OrgName);
				cmd.Parameters.AddWithValue("@Designation", beData.Designation);
				cmd.Parameters.AddWithValue("@Duration", beData.Duration);
				cmd.Parameters.AddWithValue("@WorkStation", beData.WorkStation);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddEmpJDAchievementDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveEmpJDTrainingDetails(int UserId, int EmpJDId, BE.HR.EmpJDTrainingCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmpJDId == 0)
				return;

			foreach (BE.HR.EmpJDTraining beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
				cmd.Parameters.AddWithValue("@Training", beData.Training);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddEmpJDTrainingDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveEmpJDResponsibilityDetails(int UserId, int EmpJDId, BE.HR.EmpJDResponsibilityCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmpJDId == 0)
				return;

			foreach (BE.HR.EmpJDResponsibility beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
				cmd.Parameters.AddWithValue("@Responsibility", beData.Responsibility);
				cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@ResponsibilityId", beData.ResponsibilityId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddEmpJDResponsibilityDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.HR.EmployeeJD getEmployeeJDById(int UserId, int EntityId, int EmpJDId)
		{
			BE.HR.EmployeeJD beData = new BE.HR.EmployeeJD();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmpJDId", EmpJDId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetEmployeeJDById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.HR.EmployeeJD();
					if (!(reader[0] is DBNull)) beData.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.Division = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Age = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.WorkStation = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.ExpYear = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Name = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Email = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ContactNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.DOB_AD = reader.GetDateTime(10);
					if (!(reader[11] is DBNull)) beData.DOB_BS = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Designation = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.PhotoPath = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.JobTitle = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.DepartmentId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.DateOfJoining = reader.GetDateTime(16);
					if (!(reader[17] is DBNull)) beData.DateOfJoiningMitti = reader.GetString(17);
				};
				reader.NextResult();
				beData.EmpJDQualificationColl = new BE.HR.EmpJDQualificationCollections();
				while (reader.Read())
				{
					BE.HR.EmpJDQualification det1 = new BE.HR.EmpJDQualification();
					if (!(reader[0] is DBNull)) det1.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Qualification = reader.GetString(1);
					beData.EmpJDQualificationColl.Add(det1);
				}
				reader.NextResult();
				beData.EmpJDAchievementColl = new BE.HR.EmpJDAchievementCollections();
				while (reader.Read())
				{
					BE.HR.EmpJDAchievement det2 = new BE.HR.EmpJDAchievement();
					if (!(reader[0] is DBNull)) det2.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.OrgName = reader.GetString(1);
					if (!(reader[2] is DBNull)) det2.Designation = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.Duration = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.WorkStation = reader.GetString(4);
					beData.EmpJDAchievementColl.Add(det2);
				}
				reader.NextResult();
				beData.EmpJDTrainingColl = new BE.HR.EmpJDTrainingCollections();
				while (reader.Read())
				{
					BE.HR.EmpJDTraining det3 = new BE.HR.EmpJDTraining();
					if (!(reader[0] is DBNull)) det3.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det3.Training = reader.GetString(1);
					beData.EmpJDTrainingColl.Add(det3);
				}
				reader.NextResult();
				beData.EmpJDResponsibilityColl = new BE.HR.EmpJDResponsibilityCollections();
				while (reader.Read())
				{
					BE.HR.EmpJDResponsibility det4 = new BE.HR.EmpJDResponsibility();
					if (!(reader[0] is DBNull)) det4.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det4.Responsibility = reader.GetString(1);
					if (!(reader[2] is DBNull)) det4.IsActive = reader.GetBoolean(2);
					if (!(reader[3] is DBNull)) det4.ResponsibilityId = reader.GetInt32(3);
					beData.EmpJDResponsibilityColl.Add(det4);
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