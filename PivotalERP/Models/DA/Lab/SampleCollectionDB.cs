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

	internal class SampleCollectDB
	{

		DataAccessLayer1 dal = null;

		public SampleCollectDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);

		}


		public BE.Lab.SampleCollection getAllSampleCollection(int UserId, int EntityId, DateTime? FromDate, DateTime? ToDate)
		{
			BE.Lab.SampleCollection dataColl = new BE.Lab.SampleCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@FromDate", FromDate);
			cmd.Parameters.AddWithValue("@ToDate", ToDate);

			cmd.CommandText = "usp_GetAllSampleCollection";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.SampleCollect beData = new BE.Lab.SampleCollect();
					if (!(reader[0] is DBNull)) beData.VoucherMitti = reader.GetString(0);
					if (!(reader[1] is DBNull)) beData.BillingNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.PatientId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.PatientName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Age = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.Gender = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.MobileNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.DoctorName = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.PatientAddress = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.IsPendingComplete = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.IsCollected = Convert.ToBoolean(reader[12]);

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

		public BE.Lab.BillingDetailsCollection GetBillingDetails(int UserId, int BillingId,bool IsSampleCollected)
		{
			BE.Lab.BillingDetailsCollection dataColl = new BE.Lab.BillingDetailsCollection();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@BillingId", BillingId);
			cmd.Parameters.AddWithValue("@IsSampleCollected", IsSampleCollected);
			cmd.CommandText = "usp_BillingDetails";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.BillingDetails beData = new BE.Lab.BillingDetails();
					if (!(reader[0] is DBNull)) beData.BillingNo = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TestNameId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TestName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.DoctorId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.DoctorName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.OrderPriority = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.IsOutSources = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.DepartmentId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.CollectionMitti = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.CollectionDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.CollectionTime = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.SpecimenId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.Specimen = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.SampleCollectedAt = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.RequestDate = Convert.ToDateTime(reader[15]);
					if (!(reader[16] is DBNull)) beData.RequestMitti = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.BarCodeNumber = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.AutoNumber = reader.GetInt32(18);
					dataColl.Add(beData);
				}
				reader.NextResult();
				while (reader.Read())
				{
					BE.Lab.SpecimenTypeByTest det = new BE.Lab.SpecimenTypeByTest();
					if (!(reader[0] is DBNull)) det.BillingNo = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.TestNameId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det.DefaultSpecimenId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det.DefaultSpecimen = reader.GetString(3);
					var parent = dataColl.Find(p1 => p1.BillingNo == det.BillingNo && p1.TestNameId == det.TestNameId);
					if (parent != null)
						parent.SpecimenTypeColl.Add(det);
					//dataColl.Find(p1 => p1.BillingNo == det.BillingNo && p1.TestNameId == det.TestNameId).SpecimenTypeColl.Add(det);
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

		public ResponeValues SaveUpdate(int UserId, List<BE.Lab.BillingDetails> dataColl)
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
					cmd.CommandText = "usp_AddSampleCollection";
					cmd.Parameters.AddWithValue("@BillingId", beData.BillingId);
					cmd.Parameters.AddWithValue("@TestNameId", beData.TestNameId);
					cmd.Parameters.AddWithValue("@CollectionDate", beData.CollectionDate);
					cmd.Parameters.AddWithValue("@CollectionTime", beData.CollectionTime);
					cmd.Parameters.AddWithValue("@SpecimenId", beData.SpecimenId);
					cmd.Parameters.AddWithValue("@SampleCollectedAt", beData.SampleCollectedAt);
					cmd.Parameters.AddWithValue("@RequestDate", beData.RequestDate);
					cmd.Parameters.AddWithValue("@BarCodeNumber", beData.BarCodeNumber);
					cmd.Parameters.AddWithValue("@AutoNumber", beData.AutoNumber);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@TranId", beData.TranId);
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

		public ResponeValues GenerateSampleBarCode(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			this.dal.OpenConnection();
			SqlCommand cmd = this.dal.GetCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@Code", SqlDbType.NVarChar, 100);
			cmd.Parameters.Add("@AutoNumber", SqlDbType.Int);
			cmd.Parameters.Add("@NumberingMethod", SqlDbType.Int);
			cmd.Parameters[2].Direction = ParameterDirection.Output;
			cmd.Parameters[3].Direction = ParameterDirection.Output;
			cmd.Parameters[4].Direction = ParameterDirection.Output;
			cmd.CommandText = "usp_GenerateSampleBarCode";
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
				{
					resVal.ResponseId = cmd.Parameters[2].Value.ToString();
					resVal.RId = Convert.ToInt32(cmd.Parameters[3].Value);
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[4].Value);
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Success";
				}
				else
				{
					resVal.IsSuccess = false;
					resVal.ResponseMSG = "Unable To Generate Code";
				}
			}
			catch (Exception ex)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ex.Message;
			}
			finally
			{
				this.dal.CloseConnection();
			}
			return resVal;
		}



	}

}
