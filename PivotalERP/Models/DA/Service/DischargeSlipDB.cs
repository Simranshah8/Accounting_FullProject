using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{

	internal class DischargeSlipDB
	{
		DataAccessLayer1 dal = null;
		public DischargeSlipDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public ResponeValues SaveUpdate(BE.DischargeSlip beData, bool isModify)
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
		public BE.DischargeSlipCollections getAllDischargeSlip(int UserId, int EntityId)
		{
			BE.DischargeSlipCollections dataColl = new BE.DischargeSlipCollections();
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
					BE.DischargeSlip beData = new BE.DischargeSlip();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DischargeSlipNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DichargeSlipDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.PatientName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AgeSex = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Ward = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.BedNo = reader.GetInt32(9);
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
		private void SaveInvestigationDetailsDetails(int UserId, int TranId, BE.InvestigationDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.InvestigationDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@Test", beData.Test);
				cmd.Parameters.AddWithValue("@Result", beData.Result);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandText = "usp_AddInvestigationDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveMedicationDetailsDetails(int UserId, int TranId, BE.MedicationDetailsCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.MedicationDetails beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandText = "usp_AddMedicationDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.DischargeSlip getDischargeSlipById(int UserId, int EntityId, int TranId)
		{
			BE.DischargeSlip beData = new BE.DischargeSlip();
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
					beData = new BE.DischargeSlip();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.DischargeSlipNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.DichargeSlipDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.PatientName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.AgeSex = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Department = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Ward = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.BedNo = reader.GetInt32(9);
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
				}
				reader.NextResult();
				beData.InvestigationDetailsColl = new BE.InvestigationDetailsCollections();
				while (reader.Read())
				{
					BE.InvestigationDetails det1 = new BE.InvestigationDetails();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Test = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.Result = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Remarks = reader.GetString(3);
					beData.InvestigationDetailsColl.Add(det1);
				}
				reader.NextResult();
				beData.MedicationDetailsColl = new BE.MedicationDetailsCollections();
				while (reader.Read())
				{
					BE.MedicationDetails det2 = new BE.MedicationDetails();
					if (!(reader[0] is DBNull)) det2.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.ProductId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det2.Remarks = reader.GetString(2);
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


		public PivotalERP.BE.PatientDetails getPatientDetailById(int UserId, int PatientId)
		{
			PivotalERP.BE.PatientDetails beData = new PivotalERP.BE.PatientDetails();

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
					beData = new PivotalERP.BE.PatientDetails();
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


		public PivotalERP.BE.DischargeSlipDetailsPrint getDischargeSlipPrint(int UserId, int EntityId, int TranId)
		{
			PivotalERP.BE.DischargeSlipDetailsPrint beData = new PivotalERP.BE.DischargeSlipDetailsPrint();

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
					beData = new PivotalERP.BE.DischargeSlipDetailsPrint();
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

				}

				reader.NextResult();
				beData.InvestigationDetailsColl = new BE.InvestigationDetailsPrintCollections();
				while (reader.Read())
				{
					BE.InvestigationDetailsPrint det1 = new BE.InvestigationDetailsPrint();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.Test = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.Result = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.Remarks = reader.GetString(3);
					beData.InvestigationDetailsColl.Add(det1);
				}

				reader.NextResult();
				beData.MedicationDetailsColl = new BE.MedicationDetailsPrintCollections();
				while (reader.Read())
				{
					BE.MedicationDetailsPrint det1 = new BE.MedicationDetailsPrint();
					if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.ProductId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.MRemarks = reader.GetString(2);
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

