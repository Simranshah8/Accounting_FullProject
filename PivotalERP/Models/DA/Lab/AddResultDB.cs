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

	internal class AddResultDB
	{

		DataAccessLayer1 dal = null;

		public AddResultDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public BE.Lab.AddResultCollection getAllAddResult(int UserId, int EntityId, DateTime? FromDate, DateTime? ToDate,string GroupIdColl = "")
		{
			BE.Lab.AddResultCollection dataColl = new BE.Lab.AddResultCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@FromDate", FromDate);
			cmd.Parameters.AddWithValue("@ToDate", ToDate);
			cmd.Parameters.AddWithValue("@GroupIdColl", GroupIdColl);
			cmd.CommandText = "usp_GetAllAddResult";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.AddResult beData = new BE.Lab.AddResult();
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
					if (!(reader[12] is DBNull)) beData.BarCodeNumber = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.IsPendingComplete = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.CollectionDate = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.DoctorName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.IsVerified = Convert.ToBoolean(reader[16]); 


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

		public BE.Lab.AddResultCollection GetAddResult(int UserId, int BarCodeNumber, int Age, string Gender)
		{
			BE.Lab.AddResultCollection dataColl = new BE.Lab.AddResultCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@Age", Age);
			cmd.Parameters.AddWithValue("@Gender", Gender);
			cmd.Parameters.AddWithValue("@BarCodeNo", BarCodeNumber);
			cmd.CommandText = "usp_GetAddResultById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.AddResult beData = new BE.Lab.AddResult();

					if (!(reader[0] is DBNull)) beData.BillingId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TestName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Component = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Unit = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.DisplaySequence = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Value = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.isCompleted = reader.GetBoolean(6);
					if (!(reader[7] is DBNull)) beData.Code = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.ValueType = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.MethodName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Remarks = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Formula = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.DefValue = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.IsActive = reader.GetBoolean(13);
					if (!(reader[14] is DBNull)) beData.NormalLow = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.NormalHigh = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.TestGroupId = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.TestGroupName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.TestNameId = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.TypeId = reader.GetInt32(19);
					if (!(reader[20] is DBNull)) beData.AnswerSetId = reader.GetInt32(20);
					//if (!(reader[21] is DBNull)) beData.Description = reader.GetString(21);
					//if (!(reader[22] is DBNull)) beData.ComponentGroup = reader.GetString(22);
					
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


		public ResponeValues SaveUpdate(int UserId, List<BE.Lab.AddResult> dataColl)
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
					cmd.CommandText = "usp_AddAddResultComponent";
					cmd.Parameters.AddWithValue("@TestGroupId", beData.TestGroupId);
					cmd.Parameters.AddWithValue("@TestNameId", beData.TestNameId);
					cmd.Parameters.AddWithValue("@PatientId", beData.PatientId);
					cmd.Parameters.AddWithValue("@BillingId", beData.BillingId);   
					cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);
					cmd.Parameters.AddWithValue("@MethodId", beData.MethodId);
					cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
					cmd.Parameters.AddWithValue("@NormalLow", beData.NormalLow);
					cmd.Parameters.AddWithValue("@NormalHigh", beData.NormalHigh);
					cmd.Parameters.AddWithValue("@BarCodeNumber", beData.AutoNumber);
					cmd.Parameters.AddWithValue("@DisplaySequence", beData.DisplaySequence);
					cmd.Parameters.AddWithValue("@Notes", beData.Notes);
					cmd.Parameters.AddWithValue("@DoctorId", beData.DoctorId);
					cmd.Parameters.AddWithValue("@ReportingDate", beData.ReportingDate);
					cmd.Parameters.AddWithValue("@DoctorId2", beData.DoctorId2);
					cmd.Parameters.AddWithValue("@DoctorId3", beData.DoctorId3);
					cmd.Parameters.AddWithValue("@isCompleted", beData.isCompleted);
					cmd.Parameters.AddWithValue("@Value", beData.Value);
					cmd.Parameters.AddWithValue("@UnitName", beData.UnitName);
					cmd.Parameters.AddWithValue("@MethodName", beData.MethodName);
					cmd.Parameters.AddWithValue("@Component", beData.Component);
					//cmd.Parameters.AddWithValue("@ComponentGroup", beData.ComponentGroup);
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

