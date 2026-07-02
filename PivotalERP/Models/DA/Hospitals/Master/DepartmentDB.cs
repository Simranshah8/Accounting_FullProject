using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

	internal class DepartmentDB
	{
		DataAccessLayer1 dal = null;
		public DepartmentDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Hospital.Department beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Alias", beData.Alias);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@OutPatientCharge", beData.OutPatientCharge);
			cmd.Parameters.AddWithValue("@CanChangeOPDCharge", beData.CanChangeOPDCharge);
			cmd.Parameters.AddWithValue("@InPatientCharge", beData.InPatientCharge);
			cmd.Parameters.AddWithValue("@CanChageInCharge", beData.CanChageInCharge);
			cmd.Parameters.AddWithValue("@DepositeAmount", beData.DepositeAmount);
			cmd.Parameters.AddWithValue("@CanChangeDepositeAmount", beData.CanChangeDepositeAmount);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
			cmd.Parameters.AddWithValue("@ApplyTax", beData.ApplyTax);
			cmd.Parameters.AddWithValue("@IncludeTax", beData.IncludeTax);
			cmd.Parameters.AddWithValue("@RoomNo", beData.RoomNo);
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			cmd.Parameters.AddWithValue("@LabDoctor", beData.LabDoctor);
			cmd.Parameters.AddWithValue("@ParentId", beData.ParentId);
			cmd.Parameters.AddWithValue("@ForInPatient", beData.ForInPatient);
			cmd.Parameters.AddWithValue("@DoctorSign", beData.DoctorSign);
			cmd.Parameters.AddWithValue("@DoctorNotes", beData.DoctorNotes);
			cmd.Parameters.AddWithValue("@DoctorDesignation", beData.DoctorDesignation);
			cmd.Parameters.AddWithValue("@DoctorLicNo", beData.DoctorLicNo);
			cmd.Parameters.AddWithValue("@ForOutPatient", beData.ForOutPatient);
			cmd.Parameters.AddWithValue("@ActiveAccount", beData.ActiveAccount);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@CostCenterId", beData.CostCenterId);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateDepartment";
			}
			else
			{
				cmd.Parameters[27].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddDepartment";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[28].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[29].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[30].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@IsAppointmentApplicable", beData.IsAppointmentApplicable);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[27].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[27].Value);

				if (!(cmd.Parameters[28].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[28].Value);

				if (!(cmd.Parameters[29].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[29].Value);

				if (!(cmd.Parameters[30].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[30].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveDepartmentDetailsDetails(beData.CUserId, resVal.RId, beData.DepartmentDetailsColl);
					SaveDepartmentDoctorRateDetails(beData.CUserId, resVal.RId, beData.DepartmentDoctorRateColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int DepartmentId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.CommandText = "usp_DelDepartmentById";
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
		public BE.Hospital.DepartmentCollections getAllDepartment(int UserId, int EntityId)
		{
			BE.Hospital.DepartmentCollections dataColl = new BE.Hospital.DepartmentCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLabDepartmet";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.Department beData = new BE.Hospital.Department();
					if (!(reader[0] is DBNull)) beData.DepartmentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
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
		private void SaveDepartmentDetailsDetails(int UserId, int DepartmentId, BE.Hospital.DepartmentDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || DepartmentId == 0)
				return;

			foreach (BE.Hospital.DepartmentDetails beData in beDataColl)
			{
				if (!beData.OPDTicketTypeId.HasValue)
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@DepartmentId",DepartmentId);
				cmd.Parameters.AddWithValue("@OPDTicketTypeId", beData.OPDTicketTypeId);
				cmd.Parameters.AddWithValue("@OutPatientCharge", beData.OutPatientCharge);
				cmd.Parameters.AddWithValue("@InPatientCharge", beData.InPatientCharge);
				cmd.Parameters.AddWithValue("@DepositeAmount", beData.DepositeAmount);
				cmd.Parameters.AddWithValue("@ValidDays", beData.ValidDays);
				cmd.Parameters.AddWithValue("@ReOutPatientCharge", beData.ReOutPatientCharge);
				cmd.Parameters.AddWithValue("@UserId",UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddDepartmentDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveDepartmentDoctorRateDetails(int UserId, int DepartmentId, BE.Hospital.DepartmentDoctorRateCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || DepartmentId == 0)
				return;

			foreach (BE.Hospital.DepartmentDoctorRate beData in beDataColl)
			{
				if (!beData.OPDTicketTypeId.HasValue)
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@DoctorId", beData.DoctorId);
				cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
				cmd.Parameters.AddWithValue("@OPDTicketTypeId", beData.OPDTicketTypeId);
				cmd.Parameters.AddWithValue("@OutPatientCharge", beData.OutPatientCharge);
				cmd.Parameters.AddWithValue("@InPatientCharge", beData.InPatientCharge);
				cmd.Parameters.AddWithValue("@DepositeAmount", beData.DepositeAmount);
				cmd.Parameters.AddWithValue("@ValidDays", beData.ValidDays);
				cmd.Parameters.AddWithValue("@ReOutPatientCharge", beData.ReOutPatientCharge);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddDepartmentDoctorRateDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.Hospital.Department getDepartmentById(int UserId, int EntityId, int DepartmentId)
		{
			BE.Hospital.Department beData = new BE.Hospital.Department();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDepartmentById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.Department();
					if (!(reader[0] is DBNull)) beData.DepartmentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.OutPatientCharge = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) beData.CanChangeOPDCharge = Convert.ToBoolean(reader[5]);
					if (!(reader[6] is DBNull)) beData.InPatientCharge = Convert.ToDouble(reader[6]);
					if (!(reader[7] is DBNull)) beData.CanChageInCharge = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.DepositeAmount = Convert.ToDouble(reader[8]);
					if (!(reader[9] is DBNull)) beData.CanChangeDepositeAmount = Convert.ToBoolean(reader[9]);
					if (!(reader[10] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.ApplyTax = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.IncludeTax = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.RoomNo = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.LedgerId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.LabDoctor = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.ParentId = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.ForInPatient = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.DoctorSign = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.DoctorNotes = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.DoctorDesignation = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.DoctorLicNo = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.ForOutPatient = Convert.ToBoolean(reader[22]);
					if (!(reader[23] is DBNull)) beData.ActiveAccount = Convert.ToBoolean(reader[23]);
					if (!(reader[24] is DBNull)) beData.BranchId = reader.GetInt32(24);
					if (!(reader[25] is DBNull)) beData.CostCenterId = reader.GetInt32(25);
					if (!(reader[26] is DBNull)) beData.IsAppointmentApplicable = Convert.ToBoolean(reader[26]);
				}
				reader.NextResult();
				beData.DepartmentDetailsColl = new BE.Hospital.DepartmentDetailsCollections();
				while (reader.Read())
				{
					BE.Hospital.DepartmentDetails det1 = new BE.Hospital.DepartmentDetails();
					if (!(reader[0] is DBNull)) det1.DepartmentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.OPDTicketTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.OutPatientCharge = Convert.ToDouble(reader[2]);
					if (!(reader[3] is DBNull)) det1.InPatientCharge = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det1.DepositeAmount = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det1.ValidDays = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) det1.ReOutPatientCharge = Convert.ToDouble(reader[6]);
					beData.DepartmentDetailsColl.Add(det1);
				}
				reader.NextResult();
				beData.DepartmentDoctorRateColl = new BE.Hospital.DepartmentDoctorRateCollections();
				while (reader.Read())
				{
					BE.Hospital.DepartmentDoctorRate det2 = new BE.Hospital.DepartmentDoctorRate();
					if (!(reader[0] is DBNull)) det2.DoctorId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.DepartmentId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det2.OPDTicketTypeId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det2.OutPatientCharge = Convert.ToDouble(reader[3]);
					if (!(reader[4] is DBNull)) det2.InPatientCharge = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det2.DepositeAmount = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det2.ValidDays = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) det2.ReOutPatientCharge = Convert.ToDouble(reader[7]);
					beData.DepartmentDoctorRateColl.Add(det2);
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

