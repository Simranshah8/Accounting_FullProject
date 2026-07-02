using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

	internal class DischargeSlipDB
	{
		DataAccessLayer1 dal = null;
		public DischargeSlipDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.Hospital.DischargeSlip beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			cmd.Parameters.AddWithValue("@DischargeSlipNo", beData.DischargeSlipNo);
			cmd.Parameters.AddWithValue("@PatientId", beData.PatientId);
			cmd.Parameters.AddWithValue("@DichargeSlipDate", beData.DichargeSlipDate);
			cmd.Parameters.AddWithValue("@PatientName", beData.PatientName);
			cmd.Parameters.AddWithValue("@AgeSex", beData.AgeSex);
			cmd.Parameters.AddWithValue("@Department", beData.Department);
			cmd.Parameters.AddWithValue("@Address", beData.Address);
			cmd.Parameters.AddWithValue("@Ward", beData.Ward);
			cmd.Parameters.AddWithValue("@BedNo", beData.BedNo);
			cmd.Parameters.AddWithValue("@GuardianName", beData.GuardianName);
			cmd.Parameters.AddWithValue("@Relation", beData.Relation);
			cmd.Parameters.AddWithValue("@PhoneNo", beData.PhoneNo);
			cmd.Parameters.AddWithValue("@DateAdmission", beData.DateAdmission);
			cmd.Parameters.AddWithValue("@FinalDiagnosis", beData.FinalDiagnosis);
			cmd.Parameters.AddWithValue("@DischargeStatus", beData.DischargeStatus);
			cmd.Parameters.AddWithValue("@History", beData.History);
			cmd.Parameters.AddWithValue("@ExaminationAdmission", beData.ExaminationAdmission);
			cmd.Parameters.AddWithValue("@CourseInHospital", beData.CourseInHospital);
			cmd.Parameters.AddWithValue("@ConditionTimeDischarge", beData.ConditionTimeDischarge);
			cmd.Parameters.AddWithValue("@NextFollowupDate", beData.NextFollowupDate);
			cmd.Parameters.AddWithValue("@NextFollowupTime", beData.NextFollowupTime);
			cmd.Parameters.AddWithValue("@Advice", beData.Advice);
			cmd.Parameters.AddWithValue("@Recommendation", beData.Recommendation);
			cmd.Parameters.AddWithValue("@Medications", beData.Medications);
			cmd.Parameters.AddWithValue("@PreparedBy", beData.PreparedBy);
			cmd.Parameters.AddWithValue("@CheckedBy", beData.CheckedBy);
			cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateDischargeSlip";
			}
			else
			{
				cmd.Parameters[29].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddDischargeSlip";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[30].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[31].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[32].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@InPatientId", beData.InPatientId);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);

			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[29].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[29].Value);

				if (!(cmd.Parameters[30].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[30].Value);

				if (!(cmd.Parameters[31].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[31].Value);

				if (!(cmd.Parameters[32].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[32].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveInvestigationDetailsDetails(beData.CUserId, resVal.RId, beData.InvestigationDetailsColl);
					SaveMedicationDetailsDetails(beData.CUserId, resVal.RId, beData.MedicationDetailsColl);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelDischargeSlipById";
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
		public BE.Hospital.DischargeSlipCollections getAllDischargeSlip(int UserId, int EntityId)
		{
			BE.Hospital.DischargeSlipCollections dataColl = new BE.Hospital.DischargeSlipCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllDischargeSlip";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.DischargeSlip beData = new BE.Hospital.DischargeSlip();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DischargeSlipNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DichargeSlipDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.PatientName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AgeSex = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Ward = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.BedNo = Convert.ToString(reader[9]);
					if (!(reader[10] is DBNull)) beData.GuardianName = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Relation = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.PhoneNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.DateAdmission = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) beData.FinalDiagnosis = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.DischargeStatus = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.History = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.ExaminationAdmission = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.CourseInHospital = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.ConditionTimeDischarge = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.NextFollowupDate = Convert.ToDateTime(reader[20]);
					if (!(reader[21] is DBNull)) beData.NextFollowupTime = Convert.ToDateTime(reader[21]);
					if (!(reader[22] is DBNull)) beData.Advice = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.Recommendation = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.Medications = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.PreparedBy = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.CheckedBy = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.ApprovedBy = reader.GetString(27);
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
		private void SaveInvestigationDetailsDetails(int UserId, int TranId, BE.Hospital.InvestigationDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.Hospital.InvestigationDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@Test", beData.Test);
				cmd.Parameters.AddWithValue("@Result", beData.Result);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
				cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
				cmd.CommandText = "usp_AddInvestigationDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveMedicationDetailsDetails(int UserId, int TranId, BE.Hospital.MedicationDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.Hospital.MedicationDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
				cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
				cmd.CommandText = "usp_AddMedicationDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.Hospital.DischargeSlip getDischargeSlipById(int UserId, int EntityId, int TranId)
		{
			BE.Hospital.DischargeSlip beData = new BE.Hospital.DischargeSlip();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDischargeSlipById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.DischargeSlip();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DischargeSlipNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DichargeSlipDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.PatientName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AgeSex = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Ward = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.BedNo = Convert.ToString(reader[9]);
					if (!(reader[10] is DBNull)) beData.GuardianName = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Relation = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.PhoneNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.DateAdmission = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) beData.FinalDiagnosis = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.DischargeStatus = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.History = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.ExaminationAdmission = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.CourseInHospital = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.ConditionTimeDischarge = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.NextFollowupDate = Convert.ToDateTime(reader[20]);
					if (!(reader[21] is DBNull)) beData.NextFollowupTime = Convert.ToDateTime(reader[21]);
					if (!(reader[22] is DBNull)) beData.Advice = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.Recommendation = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.Medications = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.PreparedBy = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.CheckedBy = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.ApprovedBy = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.InPatientId = reader.GetInt32(28);

					if (!(reader["Attributes"] is DBNull)) beData.Attributes = Convert.ToString(reader["Attributes"]);
					if (!(reader["UDFKeyVal"] is DBNull)) beData.UDFKeyVal =Convert.ToString(reader["UDFKeyVal"]);
				 
				}
				reader.NextResult();
				beData.InvestigationDetailsColl = new BE.Hospital.InvestigationDetailsCollections();
				while (reader.Read())
				{
					BE.Hospital.InvestigationDetails det1 = new BE.Hospital.InvestigationDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Test = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.Result = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Remarks = reader.GetString(3);
					if (!(reader["Attributes"] is DBNull)) beData.Attributes = Convert.ToString(reader["Attributes"]);
					if (!(reader["UDFKeyVal"] is DBNull)) beData.UDFKeyVal = Convert.ToString(reader["UDFKeyVal"]);
					beData.InvestigationDetailsColl.Add(det1);
				}
				reader.NextResult();
				beData.MedicationDetailsColl = new BE.Hospital.MedicationDetailsCollections();
				while (reader.Read())
				{
					BE.Hospital.MedicationDetails det2 = new BE.Hospital.MedicationDetails();
					if (!(reader[0] is DBNull)) det2.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.ProductId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det2.Remarks = reader.GetString(2);
					if (!(reader["Attributes"] is DBNull)) beData.Attributes = Convert.ToString(reader["Attributes"]);
					if (!(reader["UDFKeyVal"] is DBNull)) beData.UDFKeyVal = Convert.ToString(reader["UDFKeyVal"]);

					beData.MedicationDetailsColl.Add(det2);
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
		public Dynamic.BusinessEntity.Global.PatientDetailsForBilling getPatientForBilling(int UserId, int PatientId)
		{
			Dynamic.BusinessEntity.Global.PatientDetailsForBilling beData = new BusinessEntity.Global.PatientDetailsForBilling();
			dal.OpenConnection();

			try
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@PatientId", PatientId);
				cmd.CommandText = "sp_GetPatientDetailsForDischargeSlip";

				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					if (!(reader[0] is System.DBNull)) beData.PatientId = reader.GetInt32(0);
					if (!(reader[1] is System.DBNull)) beData.PatientNo = reader.GetInt32(1);
					if (!(reader[2] is System.DBNull)) beData.PatientName = reader.GetString(2);
					if (!(reader[3] is System.DBNull)) beData.Age = reader.GetString(3);
					if (!(reader[4] is System.DBNull)) beData.Address = reader.GetString(4);
					if (!(reader[5] is System.DBNull)) beData.MobileNo = reader.GetString(5);
					if (!(reader[6] is System.DBNull)) beData.AdmitFromDays = reader.GetInt32(6);
					if (!(reader[7] is System.DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is System.DBNull)) beData.Doctor = reader.GetString(8);
					if (!(reader[9] is System.DBNull)) beData.DepositeAmount = Convert.ToDouble(reader[9]);
					if (!(reader[10] is System.DBNull)) beData.PatientType = reader.GetString(10);
					if (!(reader[11] is System.DBNull)) beData.InDate = reader.GetDateTime(11);
					if (!(reader[12] is System.DBNull)) beData.INY = reader.GetInt32(12);
					if (!(reader[13] is System.DBNull)) beData.INM = reader.GetInt32(13);
					if (!(reader[14] is System.DBNull)) beData.IND = reader.GetInt32(14);
					if (!(reader[15] is System.DBNull)) beData.BillingName = reader.GetString(15);
					if (!(reader[16] is System.DBNull)) beData.BillingAddress = reader.GetString(16);
					if (!(reader[17] is System.DBNull)) beData.BillingPAN = reader.GetString(17);
					if (!(reader[18] is System.DBNull)) beData.DonarId = reader.GetInt32(18);
					if (!(reader[19] is System.DBNull)) beData.Donar = reader.GetString(19);
					if (!(reader[20] is System.DBNull)) beData.IsCredit = reader.GetBoolean(20);
					if (!(reader[21] is System.DBNull)) beData.DiscountPer = Convert.ToDouble(reader[21]);
					if (!(reader[22] is System.DBNull)) beData.ClaimCode = Convert.ToString(reader[22]);
					if (!(reader[23] is System.DBNull)) beData.SchemeTypeId = Convert.ToInt32(reader[23]);
					if (!(reader[24] is System.DBNull)) beData.SchemePer = Convert.ToDouble(reader[24]);
					if (!(reader[25] is System.DBNull)) beData.TicketTypeId = Convert.ToInt32(reader[25]);
					if (!(reader[26] is System.DBNull)) beData.ServiceTypeId = Convert.ToInt32(reader[26]);
					if (!(reader[27] is System.DBNull)) beData.ClaimId = Convert.ToInt32(reader[27]);
					if (!(reader[28] is System.DBNull)) beData.Gender = Convert.ToInt32(reader[28]);
					if (!(reader[29] is System.DBNull)) beData.GuardianName = Convert.ToString(reader[29]);
					if (!(reader[30] is System.DBNull)) beData.Relation = Convert.ToString(reader[30]);
					if (!(reader[31] is System.DBNull)) beData.LogDateTime = Convert.ToDateTime(reader[31]);
					if (!(reader[32] is System.DBNull)) beData.InPatientTranId = Convert.ToInt32(reader[32]);
					if (!(reader[33] is System.DBNull)) beData.IDateStr = Convert.ToString(reader[33]);

					if (!(reader[34] is System.DBNull)) beData.Ward = Convert.ToString(reader[34]);
					if (!(reader[35] is System.DBNull)) beData.Room = Convert.ToString(reader[35]);
					if (!(reader[36] is System.DBNull)) beData.BedNo = Convert.ToInt32(reader[36]);

					beData.IsSuccess = true;
					beData.ResponseMSG = GLOBALMSG.SUCCESS;
				}
				else
				{
					beData.IsSuccess = false;
					beData.ResponseMSG = "Patient Not Found";
				}
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

		public BE.Hospital.PatientDetails getPatientDetailById(int UserId, int PatientId)
		{
			BE.Hospital.PatientDetails beData = new BE.Hospital.PatientDetails();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PatientId", PatientId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.CommandText = "usp_GetPatientDetails";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.PatientDetails();
					beData.PatientId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.PatientName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.AgeSex = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Department = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Address = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Ward = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.BedNo = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.GuardianName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Relation = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.PhoneNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.DateAdmission = Convert.ToDateTime(reader[10]);
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


		public BE.Hospital.DischargeSlipDetailsPrint getDischargeSlipPrint(int UserId, int EntityId, int TranId)
		{
			BE.Hospital.DischargeSlipDetailsPrint beData = new BE.Hospital.DischargeSlipDetailsPrint();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDischargeSlipPrint";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.DischargeSlipDetailsPrint();
					beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DischargeSlipNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DichargeSlipDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.FinalDiagnosis = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.DischargeStatus = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.History = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.ExaminationAdmission = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.CourseInHospital = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ConditionTimeDischarge = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.NextFollowupDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.NextFollowupTime = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.Advice = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.Recommendation = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Medications = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.PreparedBy = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.CheckedBy = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.ApprovedBy = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.DichargeSlipDateBS = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.NextFollowupDateBS = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.PatientName = Convert.ToString(reader[20]);
					if (!(reader[21] is DBNull)) beData.AgeSex = Convert.ToString(reader[21]);
					if (!(reader[22] is DBNull)) beData.Department = Convert.ToString(reader[22]);
					if (!(reader[23] is DBNull)) beData.Address = Convert.ToString(reader[23]);
					if (!(reader[24] is DBNull)) beData.Ward = Convert.ToString(reader[24]);
					if (!(reader[25] is DBNull)) beData.BedNo = Convert.ToString(reader[25]);
					if (!(reader[26] is DBNull)) beData.GuardianName = Convert.ToString(reader[26]);
					if (!(reader[27] is DBNull)) beData.Relation = Convert.ToString(reader[27]);
					if (!(reader[28] is DBNull)) beData.PhoneNo = Convert.ToString(reader[28]);
					if (!(reader[29] is DBNull)) beData.DateAdmission = Convert.ToString(reader[29]);
					if (!(reader[30] is DBNull)) beData.InDateTime = Convert.ToDateTime(reader[30]);

				}

				reader.NextResult();
				beData.InvestigationDetailsColl = new BE.Hospital.InvestigationDetailsPrintCollections();
				while (reader.Read())
				{
					BE.Hospital.InvestigationDetailsPrint det1 = new BE.Hospital.InvestigationDetailsPrint();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Test = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.Result = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Remarks = reader.GetString(3);
					beData.InvestigationDetailsColl.Add(det1);
				}

				reader.NextResult();
				beData.MedicationDetailsColl = new BE.Hospital.MedicationDetailsPrintCollections();
				while (reader.Read())
				{
					BE.Hospital.MedicationDetailsPrint det1 = new BE.Hospital.MedicationDetailsPrint();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ProductId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.MRemarks = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Code = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.Name = reader.GetString(4);
					beData.MedicationDetailsColl.Add(det1);
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

		public ResponeValues GetAutoDischargeNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@DischargeSlipNo", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoDischargeNo";
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();


				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				resVal.IsSuccess = true;
				resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

