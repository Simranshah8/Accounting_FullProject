using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.GateMaster
{

	internal class GateEntryDB
	{
		DataAccessLayer1 dal = null;
		public GateEntryDB(string hostname, string dbName)
		{
			dal = new DataAccessLayer1(hostname, dbName);
		}
		public ResponeValues SaveUpdate(BE.GateMaster.GateEntry beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@Narration", beData.Narration);
			cmd.Parameters.AddWithValue("@RefNo", beData.RefNo);
			cmd.Parameters.AddWithValue("@Api_Id", beData.Api_Id);
			cmd.Parameters.AddWithValue("@Api_ResponseId", beData.Api_ResponseId);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@UniqueId", beData.UniqueId);
			cmd.Parameters.AddWithValue("@PassType", beData.PassType);
			cmd.Parameters.AddWithValue("@EntryType", beData.EntryType);
			cmd.Parameters.AddWithValue("@TransactionType", beData.TransactionType);
			cmd.Parameters.AddWithValue("@PartyLedgerId", beData.PartyLedgerId);
			cmd.Parameters.AddWithValue("@VehicleId", beData.VehicleId);
			cmd.Parameters.AddWithValue("@VehicleNo", beData.VehicleNo);
			cmd.Parameters.AddWithValue("@DriverName", beData.DriverName);
			cmd.Parameters.AddWithValue("@DriverMobile", beData.DriverMobile);
			cmd.Parameters.AddWithValue("@DriverLicenseNo", beData.DriverLicenseNo);
			cmd.Parameters.AddWithValue("@Purpose", beData.Purpose);
			cmd.Parameters.AddWithValue("@InvoiceNo", beData.InvoiceNo);
			cmd.Parameters.AddWithValue("@InvoiceDate", beData.InvoiceDate);
			cmd.Parameters.AddWithValue("@EWayBillNo", beData.EWayBillNo);
			cmd.Parameters.AddWithValue("@ExpectedOutDate", beData.ExpectedOutDate);
			cmd.Parameters.AddWithValue("@InWeight", beData.InWeight);
			cmd.Parameters.AddWithValue("@OutWeight", beData.OutWeight);
			cmd.Parameters.AddWithValue("@NetWeight", beData.NetWeight);
			cmd.Parameters.AddWithValue("@InDateTime", beData.InDateTime);
			cmd.Parameters.AddWithValue("@OutDateTime", beData.OutDateTime);
			cmd.Parameters.AddWithValue("@InGateId", beData.InGateId);
			cmd.Parameters.AddWithValue("@OutGateId", beData.OutGateId);
			cmd.Parameters.AddWithValue("@InUserId", beData.InUserId);
			cmd.Parameters.AddWithValue("@OutUserId", beData.OutUserId);
			cmd.Parameters.AddWithValue("@ApprovalStatus", beData.ApprovalStatus);
			cmd.Parameters.AddWithValue("@IsReturnable", beData.IsReturnable);
			cmd.Parameters.AddWithValue("@SealNo", beData.SealNo);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateTransactionGateEntry";
			}
			else
			{
				cmd.Parameters[42].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddTransactionGateEntry";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[43].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[44].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[45].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);

			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[42].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[42].Value);

				if (!(cmd.Parameters[43].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[43].Value);

				if (!(cmd.Parameters[44].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[44].Value);

				if (!(cmd.Parameters[45].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[45].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveItemDetailsGateEntryDetails(beData.CUserId, resVal.RId, beData.ItemDetailsGateEntryColl);
					SavePersonDetailsGateEntryDetails(beData.CUserId, resVal.RId, beData.PersonDetailsGateEntryColl);
					SaveDocumentDet(beData.DocumentColl, resVal.RId, beData.CUserId);
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


		private void SaveItemDetailsGateEntryDetails(int UserId, int TranId, BE.GateMaster.ItemDetailsGateEntryCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.GateMaster.ItemDetailsGateEntry beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
				cmd.Parameters.AddWithValue("@Description", beData.Description);
				cmd.Parameters.AddWithValue("@ActualQty", beData.ActualQty);
				cmd.Parameters.AddWithValue("@BilledQty", beData.BilledQty);
				cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);
				cmd.Parameters.AddWithValue("@Batch", beData.Batch);
				cmd.Parameters.AddWithValue("@MFGDate", beData.MFGDate);
				cmd.Parameters.AddWithValue("@EXPDate", beData.EXPDate);
				cmd.Parameters.AddWithValue("@SerialNo", beData.SerialNo);
				cmd.Parameters.AddWithValue("@MaterialCondition", beData.MaterialCondition);
				cmd.Parameters.AddWithValue("@IsReturnable", beData.IsReturnable);
				cmd.Parameters.AddWithValue("@ReturnDueDate", beData.ReturnDueDate);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddItemDetailsGateEntryDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SavePersonDetailsGateEntryDetails(int UserId, int TranId, BE.GateMaster.PersonDetailsGateEntryCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.GateMaster.PersonDetailsGateEntry beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@GatePassId", beData.GatePassId);
				cmd.Parameters.AddWithValue("@PersonName", beData.PersonName);
				cmd.Parameters.AddWithValue("@Gender", beData.Gender);
				cmd.Parameters.AddWithValue("@MobileNo", beData.MobileNo);
				cmd.Parameters.AddWithValue("@EmailId", beData.EmailId);
				cmd.Parameters.AddWithValue("@CompanyName", beData.CompanyName);
				cmd.Parameters.AddWithValue("@DepartmentName", beData.DepartmentName);
				cmd.Parameters.AddWithValue("@Designation", beData.Designation);
				cmd.Parameters.AddWithValue("@IDProofType", beData.IDProofType);
				cmd.Parameters.AddWithValue("@IDProofNo", beData.IDProofNo);
				cmd.Parameters.AddWithValue("@AddressLine1", beData.AddressLine1);
				cmd.Parameters.AddWithValue("@Purpose", beData.Purpose);
				cmd.Parameters.AddWithValue("@InDateTime", beData.InDateTime);
				cmd.Parameters.AddWithValue("@OutDateTime", beData.OutDateTime);
				cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddPersonDetailsGateEntryDetails";
				cmd.ExecuteNonQuery();
			}

		}

		private void SaveDocumentDet(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int TranId, int UserId)
		{
			foreach (var beData in dataColl)
			{
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@TranId", TranId);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@docDescription", beData.Description);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.CommandText = "usp_AddTransactionGateEntryDocumentDetails";
					cmd.ExecuteNonQuery();

				}

			}
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
			cmd.CommandText = "usp_DelTransactionGateEntryById";
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
		public BE.GateMaster.GateEntryCollections getAllTransactionGateEntry(int UserId, int EntityId,string PassType, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
		{
			BE.GateMaster.GateEntryCollections dataColl = new BE.GateMaster.GateEntryCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@PassType", PassType);
			cmd.CommandText = "usp_GetAllTransactionGateEntry";
			cmd.Parameters.Add("@TotalRows", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PageNumber", PageNumber);
			cmd.Parameters.AddWithValue("@RowsOfPage", RowsOfPage);
			cmd.Parameters.AddWithValue("@SearchBy", SearchBy);
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.GateMaster.GateEntry beData = new BE.GateMaster.GateEntry();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.ManualVoucherNO = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AutoManualNo = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.VoucherId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.CostClassId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[6]);
					if (!(reader[7] is DBNull)) beData.Narration = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.RefNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Api_Id = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.Api_ResponseId = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Attributes = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.UDFKeyVal = reader.GetString(12);
					if (!(reader[14] is DBNull)) beData.UniqueId = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.PassType = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.EntryType = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.TransactionType = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.PartyLedgerId = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.VehicleId = reader.GetInt32(19);
					if (!(reader[20] is DBNull)) beData.VehicleNo = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.DriverName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.DriverMobile = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.DriverLicenseNo = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.Purpose = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.InvoiceNo = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.InvoiceDate = Convert.ToDateTime(reader[26]);
					if (!(reader[27] is DBNull)) beData.EWayBillNo = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.ExpectedOutDate = Convert.ToDateTime(reader[28]);
					if (!(reader[29] is DBNull)) beData.InWeight = Convert.ToDouble(reader[29]);
					if (!(reader[30] is DBNull)) beData.OutWeight = Convert.ToDouble(reader[30]);
					if (!(reader[31] is DBNull)) beData.NetWeight = Convert.ToDouble(reader[31]);
					if (!(reader[32] is DBNull)) beData.InDateTime = Convert.ToDateTime(reader[32]);
					if (!(reader[33] is DBNull)) beData.OutDateTime = Convert.ToDateTime(reader[33]);
					if (!(reader[34] is DBNull)) beData.InGateId = reader.GetInt32(34);
					if (!(reader[35] is DBNull)) beData.OutGateId = reader.GetInt32(35);
					if (!(reader[36] is DBNull)) beData.InUserId = reader.GetInt32(36);
					if (!(reader[37] is DBNull)) beData.OutUserId = reader.GetInt32(37);
					if (!(reader[38] is DBNull)) beData.ApprovalStatus = reader.GetString(38);
					if (!(reader[39] is DBNull)) beData.IsReturnable = Convert.ToBoolean(reader[39]);
					if (!(reader[40] is DBNull)) beData.SealNo = reader.GetString(40);
					if (!(reader[41] is DBNull)) beData.BranchId = reader.GetInt32(41);
					if (!(reader[42] is DBNull)) beData.PhotoPath = reader.GetString(42);
					if (!(reader[43] is DBNull)) beData.VehicleType = reader.GetString(43);
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

		public BE.GateMaster.GateEntry getTransactionGateEntryById(int UserId, int EntityId, int TranId)
		{
			BE.GateMaster.GateEntry beData = new BE.GateMaster.GateEntry();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetTransactionGateEntryById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.GateMaster.GateEntry();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.ManualVoucherNO = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.AutoManualNo = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.VoucherId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.CostClassId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[6]);
					if (!(reader[7] is DBNull)) beData.Narration = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.RefNo = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Api_Id = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.Api_ResponseId = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Attributes = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.UDFKeyVal = reader.GetString(12);
					if (!(reader[14] is DBNull)) beData.UniqueId = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.PassType = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.EntryType = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.TransactionType = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.PartyLedgerId = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.VehicleId = reader.GetInt32(19);
					if (!(reader[20] is DBNull)) beData.VehicleNo = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.DriverName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.DriverMobile = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.DriverLicenseNo = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.Purpose = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.InvoiceNo = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.InvoiceDate = Convert.ToDateTime(reader[26]);
					if (!(reader[27] is DBNull)) beData.EWayBillNo = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.ExpectedOutDate = Convert.ToDateTime(reader[28]);
					if (!(reader[29] is DBNull)) beData.InWeight = Convert.ToDouble(reader[29]);
					if (!(reader[30] is DBNull)) beData.OutWeight = Convert.ToDouble(reader[30]);
					if (!(reader[31] is DBNull)) beData.NetWeight = Convert.ToDouble(reader[31]);
					if (!(reader[32] is DBNull)) beData.InDateTime = Convert.ToDateTime(reader[32]);
					if (!(reader[33] is DBNull)) beData.OutDateTime = Convert.ToDateTime(reader[33]);
					if (!(reader[34] is DBNull)) beData.InGateId = reader.GetInt32(34);
					if (!(reader[35] is DBNull)) beData.OutGateId = reader.GetInt32(35);
					if (!(reader[36] is DBNull)) beData.InUserId = reader.GetInt32(36);
					if (!(reader[37] is DBNull)) beData.OutUserId = reader.GetInt32(37);
					if (!(reader[38] is DBNull)) beData.ApprovalStatus = reader.GetString(38);
					if (!(reader[39] is DBNull)) beData.IsReturnable = Convert.ToBoolean(reader[39]);
					if (!(reader[40] is DBNull)) beData.SealNo = reader.GetString(40);
					if (!(reader[41] is DBNull)) beData.BranchId = reader.GetInt32(41);
					if (!(reader[42] is DBNull)) beData.PhotoPath = reader.GetString(42);

				}
				reader.NextResult();
				beData.ItemDetailsGateEntryColl = new BE.GateMaster.ItemDetailsGateEntryCollections();
				while (reader.Read())
				{
					BE.GateMaster.ItemDetailsGateEntry det1 = new BE.GateMaster.ItemDetailsGateEntry();
					if (!(reader[0] is DBNull)) det1.ItemAllocationId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.TranId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.ProductId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.ActualQty = Convert.ToDouble(reader[4]);
					if (!(reader[5] is DBNull)) det1.BilledQty = Convert.ToDouble(reader[5]);
					if (!(reader[6] is DBNull)) det1.UnitId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) det1.Batch = reader.GetString(7);
					if (!(reader[8] is DBNull)) det1.MFGDate = Convert.ToDateTime(reader[8]);
					if (!(reader[9] is DBNull)) det1.EXPDate = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) det1.SerialNo = reader.GetString(10);
					if (!(reader[11] is DBNull)) det1.MaterialCondition = reader.GetString(11);
					if (!(reader[12] is DBNull)) det1.IsReturnable = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) det1.ReturnDueDate = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) det1.Remarks = reader.GetString(14);
					beData.ItemDetailsGateEntryColl.Add(det1);
				}
				reader.NextResult();
				beData.PersonDetailsGateEntryColl = new BE.GateMaster.PersonDetailsGateEntryCollections();
				while (reader.Read())
				{
					BE.GateMaster.PersonDetailsGateEntry det2 = new BE.GateMaster.PersonDetailsGateEntry();
					if (!(reader[0] is DBNull)) det2.PersonEntryId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.TranId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det2.GatePassId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det2.PersonName = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.Gender = reader.GetString(4);
					if (!(reader[5] is DBNull)) det2.MobileNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) det2.EmailId = reader.GetString(6);
					if (!(reader[7] is DBNull)) det2.CompanyName = reader.GetString(7);
					if (!(reader[8] is DBNull)) det2.DepartmentName = reader.GetString(8);
					if (!(reader[9] is DBNull)) det2.Designation = reader.GetString(9);
					if (!(reader[10] is DBNull)) det2.IDProofType = reader.GetString(10);
					if (!(reader[11] is DBNull)) det2.IDProofNo = reader.GetString(11);
					if (!(reader[12] is DBNull)) det2.AddressLine1 = reader.GetString(12);
					if (!(reader[13] is DBNull)) det2.Purpose = reader.GetString(13);
					if (!(reader[14] is DBNull)) det2.InDateTime = Convert.ToDateTime(reader[14]);
					if (!(reader[15] is DBNull)) det2.OutDateTime = Convert.ToDateTime(reader[15]);
					if (!(reader[16] is DBNull)) det2.IsActive = Convert.ToBoolean(reader[16]);
					beData.PersonDetailsGateEntryColl.Add(det2);
				}
				reader.NextResult();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det2 = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det2.Id = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.Name = reader.GetString(1);
					//if (!(reader[2] is DBNull)) det2.Description = reader.GetString(2);
					if (!(reader[2] is DBNull)) det2.Extension = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.DocPath = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.Description = reader.GetString(4);
					beData.DocumentColl.Add(det2);
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

		public BE.GateMaster.GateEntryCollections GetVehiclesForOutWard(int UserId, int EntityId, String PassType)
		{
			BE.GateMaster.GateEntryCollections dataColl = new BE.GateMaster.GateEntryCollections(); dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PassType", PassType);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetVehiclesForOutWard";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.GateMaster.GateEntry beData = new BE.GateMaster.GateEntry();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VehicleId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VehicleNo = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.DriverName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.DriverMobile = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.DriverLicenseNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.VehicleType = reader.GetString(6);
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

	}

}
