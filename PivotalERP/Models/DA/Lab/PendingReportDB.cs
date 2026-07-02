using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.Lab
{

	internal class PendingReportDB
	{

		DataAccessLayer1 dal = null;

		public PendingReportDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}


		public BE.Lab.PendingReportCollection GetPendingReportById(int UserId, int BarCodeNumber)
		{
			BE.Lab.PendingReportCollection dataColl = new BE.Lab.PendingReportCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@BarCodeNo", BarCodeNumber);
			cmd.CommandText = "usp_GetPendingReportById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.PendingReport beData = new BE.Lab.PendingReport();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TestGroupId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TestNameId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.PatientId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.BillingId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.UnitId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.MethodId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.Remarks = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.NormalLow = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.NormalHigh = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.BarCodeNumber = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.DisplaySequence = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.isCompleted = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.Value = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Notes = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.DoctorId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.ReportingDate = Convert.ToDateTime(reader[16]);
					if (!(reader[17] is DBNull)) beData.TestName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.TestGroupName =  reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.CollectionMitti = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.UnitName = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.MethodName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.Component = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.DoctorSignature = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.TypeId = reader.GetInt32(24);
					if (!(reader[25] is DBNull)) beData.AnswerSetId = reader.GetInt32(25);
					if (!(reader[26] is DBNull)) beData.DoctorName = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.DoctorDesignation = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.DoctorId2 = reader.GetInt32(28);
					if (!(reader[29] is DBNull)) beData.DoctorName2 = reader.GetString(29);
					if (!(reader[30] is DBNull)) beData.DoctorSignature2 = reader.GetString(30);
					if (!(reader[31] is DBNull)) beData.DoctorDesignation2 = reader.GetString(31);
					if (!(reader[32] is DBNull)) beData.DoctorId3 = reader.GetInt32(32);
					if (!(reader[33] is DBNull)) beData.DoctorName3 = reader.GetString(33);
					if (!(reader[34] is DBNull)) beData.DoctorSignature3 = reader.GetString(34);
					if (!(reader[35] is DBNull)) beData.DoctorDesignation3 = reader.GetString(35);
					if (!(reader[36] is DBNull)) beData.Description = reader.GetString(36);
					if (!(reader[37] is DBNull)) beData.ComponentGroup = reader.GetString(37);
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

	

		public BE.Lab.PendingReportCollection GetAllPendingReport(int UserId, int EntityId, int Status, DateTime? FromDate, DateTime? ToDate, string GroupIdColl = "")
		{
			BE.Lab.PendingReportCollection dataColl = new BE.Lab.PendingReportCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@Status", Status);
			cmd.Parameters.AddWithValue("@FromDate", FromDate);
			cmd.Parameters.AddWithValue("@ToDate", ToDate);
			cmd.Parameters.AddWithValue("@GroupIdColl", GroupIdColl);
			

			cmd.CommandText = "usp_GetAllPendingReport";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.PendingReport beData = new BE.Lab.PendingReport();
					if (!(reader[0] is DBNull)) beData.BillingId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.PatientId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Age = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.Gender = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MobileNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PatientAddress = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.TestNameIds = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.TestName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.TestGroupName = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.AutoNumber = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.BarCode = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.CollectionDate = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.DoctorName = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.IsVerified = Convert.ToBoolean(reader[15]);
					if (!(reader[16] is DBNull)) beData.IsPendingComplete = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.VerificationRemarks = reader.GetString(17); 

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

		public ResponeValues SaveUpdate(int UserId, List<BE.Lab.PendingReport> dataColl)
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
					cmd.CommandText = "usp_VerifyPendingReport";
					cmd.Parameters.AddWithValue("@TestNameId", beData.TestNameId);
					cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
					cmd.Parameters.AddWithValue("@DisplaySequence", beData.DisplaySequence);
					cmd.Parameters.AddWithValue("@Value", beData.Value);
					cmd.Parameters.AddWithValue("@IsVerified", beData.IsVerified);
					cmd.Parameters.AddWithValue("@VerificationRemarks", beData.VerificationRemarks);
					cmd.Parameters.AddWithValue("@BarCodeNumber", beData.BarCodeNumber);


					cmd.Parameters.AddWithValue("@UserId", UserId);
					// Output parameters
					cmd.Parameters.Add("@ResponseMSG", SqlDbType.NVarChar, 254).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@IsSuccess", SqlDbType.Bit).Direction = ParameterDirection.Output;
					cmd.Parameters.Add("@ErrorNumber", SqlDbType.Int).Direction = ParameterDirection.Output;
					cmd.ExecuteNonQuery();
					// Read output for each record
					resVal.ResponseMSG = cmd.Parameters["@ResponseMSG"].Value?.ToString() ?? "";
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters["@IsSuccess"].Value ?? false);
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters["@ErrorNumber"].Value ?? 0);

					if (!resVal.IsSuccess)
					{
						dal.RollbackTransaction();
						return resVal;
					}
				}

				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = resVal.ResponseMSG;
			}
			catch (SqlException ex)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			catch (Exception ex)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;
		}

	}

}

