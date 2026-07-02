using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{
	internal class GrievanceFormDB
	{
		DataAccessLayer1 dal = null;
		public GrievanceFormDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.HR.GrievanceForm beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ForUserId", beData.UserId);
			cmd.Parameters.AddWithValue("@GrievanceTypeId", beData.GrievanceTypeId);
			cmd.Parameters.AddWithValue("@IncidentDate", beData.IncidentDate);
			cmd.Parameters.AddWithValue("@LocationOfInc", beData.LocationOfInc);
			cmd.Parameters.AddWithValue("@Suggestion", beData.Suggestion);
			cmd.Parameters.AddWithValue("@Declaration", beData.Declaration);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@Attachment", beData.Attachment);
			cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
			cmd.Parameters.AddWithValue("@ActionTaken", beData.ActionTaken);
			cmd.Parameters.AddWithValue("@ActionTakenById", beData.ActionTakenById);
			cmd.Parameters.AddWithValue("@AssignedToId", beData.AssignedToId);
			cmd.Parameters.AddWithValue("@ActionTakenAt", beData.ActionTakenAt);
			cmd.Parameters.AddWithValue("@Notes", beData.Notes);
			cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
			cmd.Parameters.AddWithValue("@ClosureDate", beData.ClosureDate);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateGrievanceForm";
			}
			else
			{
				cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddGrievanceForm";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@EmployeeOrSalesman", beData.EmployeeOrSalesman);

			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[19].Value);

				if (!(cmd.Parameters[20].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[20].Value);

				if (!(cmd.Parameters[21].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[21].Value);

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


		public BE.HR.GrievanceForm getGrievanceDetailsById(int UserId, int EntityId, int TranId)
		{
			BE.HR.GrievanceForm beData = new BE.HR.GrievanceForm();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetGrievanceDetailsById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.HR.GrievanceForm();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.GrievanceTypeId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.IncidentDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.LocationOfInc = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Suggestion = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Declaration = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.Description = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Attachment = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.StatusId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.ActionTaken = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.ActionTakenById = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.AssignedToId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.ActionTakenAt = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) beData.Notes = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.Remarks = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.ClosureDate = Convert.ToDateTime(reader[16]); 
					if (!(reader[17] is DBNull)) beData.EmployeeName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.EmployeeCode = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.GrievanceTypeName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.SubmissionMiti = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.AssignTo = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.IncidentMiti = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.ActionTakenMiti = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.EmployeeOrSalesman = reader.GetInt32(24);

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

		public BE.HR.GrievanceForm GetEmployeeDetByUserId(int UserId, int EntityId, int? EmpUserId, int EmployeeOrSalesman)
		{
			BE.HR.GrievanceForm beData = new BE.HR.GrievanceForm();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmpUserId", EmpUserId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@EmployeeOrSalesman", EmployeeOrSalesman);
			cmd.CommandText = "usp_GetEmployeeDetByUserId";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.HR.GrievanceForm();
					if (!(reader[0] is DBNull)) beData.UserId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Department = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Designation = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EmailId = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.EnrollNumber = reader.GetInt64(5);
					if (!(reader[6] is DBNull)) beData.EmployeeName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.ContactNo = reader.GetString(7);
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

