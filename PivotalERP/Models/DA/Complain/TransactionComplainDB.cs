using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{

	internal class TransactionComplainDB
	{

		DataAccessLayer1 dal = null;
		public TransactionComplainDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.TransactionComplain beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@AutoVoucherNo", beData.AutoVoucherNo);
			cmd.Parameters.AddWithValue("@ManualVoucherNO", beData.ManualVoucherNO);
			cmd.Parameters.AddWithValue("@AutoManualNo", beData.AutoManualNo);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@TicketForId", beData.TicketForId);
			cmd.Parameters.AddWithValue("@VoucherDate", beData.VoucherDate);
			cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
			cmd.Parameters.AddWithValue("@PhoneNo", beData.PhoneNo);
			cmd.Parameters.AddWithValue("@CustomerAddress", beData.CustomerAddress);
			cmd.Parameters.AddWithValue("@SourceId", beData.SourceId);
			cmd.Parameters.AddWithValue("@NatureId", beData.NatureId);
			cmd.Parameters.AddWithValue("@VehicleId", beData.VehicleId);
			cmd.Parameters.AddWithValue("@STPLComplaintNo", beData.STPLComplaintNo);
			cmd.Parameters.AddWithValue("@STPLEntryTime", beData.STPLEntryTime);
			cmd.Parameters.AddWithValue("@STPLContactCode", beData.STPLContactCode);
			cmd.Parameters.AddWithValue("@STPLEntryDate", beData.STPLEntryDate);
			cmd.Parameters.AddWithValue("@STPLContactName", beData.STPLContactName);
			cmd.Parameters.AddWithValue("@SyncedwithSupplierErp", beData.SyncedwithSupplierErp);
			cmd.Parameters.AddWithValue("@STPlEntryDatebyUser", beData.STPlEntryDatebyUser);
			cmd.Parameters.AddWithValue("@SatisfcationVerificationDate", beData.SatisfcationVerificationDate);
			cmd.Parameters.AddWithValue("@ComplaintStatus", beData.ComplaintStatus);
			cmd.Parameters.AddWithValue("@TypeofSatisfactionVerify", beData.TypeofSatisfactionVerify);
			cmd.Parameters.AddWithValue("@ComplaintClosedDate", beData.ComplaintClosedDate);
			cmd.Parameters.AddWithValue("@ValidationRemarks", beData.ValidationRemarks);
			cmd.Parameters.AddWithValue("@ComplaintClosedTime", beData.ComplaintClosedTime);
			cmd.Parameters.AddWithValue("@FirstResponseDateAndTime", beData.FirstResponseDateAndTime);
			cmd.Parameters.AddWithValue("@ComplaintClosedBy", beData.ComplaintClosedBy);
			cmd.Parameters.AddWithValue("@AttendedDateAndTime", beData.AttendedDateAndTime);
			cmd.Parameters.AddWithValue("@IsCorrectiveActionRequired", beData.IsCorrectiveActionRequired);
			cmd.Parameters.AddWithValue("@VehicleOnRoadDateTime", beData.VehicleOnRoadDateTime);
			cmd.Parameters.AddWithValue("@TargetDateForComplaintClosure", beData.TargetDateForComplaintClosure);
			cmd.Parameters.AddWithValue("@ValidationStatus", beData.ValidationStatus);
			cmd.Parameters.AddWithValue("@Reopened", beData.Reopened);
			cmd.Parameters.AddWithValue("@RepairStatus", beData.RepairStatus);
			cmd.Parameters.AddWithValue("@ReopenedDateTime", beData.ReopenedDateTime);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateTransactionComplain";
			}
			else
			{
				cmd.Parameters[41].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddTransactionComplain";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[42].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[43].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[44].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[41].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[41].Value);

				if (!(cmd.Parameters[42].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[42].Value);

				if (!(cmd.Parameters[43].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[43].Value);

				if (!(cmd.Parameters[44].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[44].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveComplainLinesDetails(beData.CUserId, resVal.RId, beData.ComplainLinesColl);
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
			cmd.CommandText = "usp_DelTransactionComplainById";
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
		public BE.TransactionComplainCollections getAllTransactionComplain(int UserId, int EntityId)
		{
			BE.TransactionComplainCollections dataColl = new BE.TransactionComplainCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllTransactionComplain";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.TransactionComplain beData = new BE.TransactionComplain();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[2]);
					if (!(reader[3] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.ComplaintStatus = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.ComplainDetail = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.CustomerCode = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.CustomerName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.CustomerAddress = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.PhoneNo = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ModelNo = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.ModelVersionNo = reader.GetString(10);
					if (!(reader[12] is DBNull)) beData.VinNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.RegdNo = reader.GetString(13);
					
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
		private void SaveComplainLinesDetails(int UserId, int TranId, BE.ComplainLinesCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (BE.ComplainLines beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				
				cmd.Parameters.AddWithValue("@SNo", beData.SNo);
				cmd.Parameters.AddWithValue("@NatureId", beData.NatureId);
				cmd.Parameters.AddWithValue("@Department", beData.Department);
				cmd.Parameters.AddWithValue("@LubeSegment", beData.LubeSegment);
				cmd.Parameters.AddWithValue("@SubType", beData.SubType);
				cmd.Parameters.AddWithValue("@Type", beData.Type);
				cmd.Parameters.AddWithValue("@ComplaintDetails", beData.ComplaintDetails);
				cmd.Parameters.AddWithValue("@Status", beData.Status);
				cmd.Parameters.AddWithValue("@ForwardedBranch", beData.ForwardedBranch);
				cmd.Parameters.AddWithValue("@ClosedBy", beData.ClosedBy);
				cmd.Parameters.AddWithValue("@STPLForwardedDate", beData.STPLForwardedDate);
				cmd.Parameters.AddWithValue("@STPLForwaededTime", beData.STPLForwaededTime);
				cmd.Parameters.AddWithValue("@ResponsibleEmployee", beData.ResponsibleEmployee);
				cmd.Parameters.AddWithValue("@Reference", beData.Reference);
				cmd.Parameters.AddWithValue("@VerifiedBy", beData.VerifiedBy);
				cmd.Parameters.AddWithValue("@RootCause", beData.RootCause);
				cmd.Parameters.AddWithValue("@ResolutionDetail", beData.ResolutionDetail);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@ResolvedBY", beData.ResolvedBY);
				cmd.Parameters.AddWithValue("@ResolvedDate", beData.ResolvedDate);
				cmd.Parameters.AddWithValue("@ResolvedTime", beData.ResolvedTime);
				cmd.Parameters.AddWithValue("@PartNo", beData.PartNo);
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandText = "usp_AddComplainLinesDetails";
				cmd.ExecuteNonQuery();

                //beData.AllocationId = Convert.ToInt32(cmd.Parameters[0].Value);
                //SaveActionTaken(UserId, beData.AllocationId.Value, beData.ActionTakenColl);

            }
		}

		private void SaveActionTaken(int UserId, int AllocationId, BE.ActionTakenCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || AllocationId == 0)
				return;

			foreach (BE.ActionTaken beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.Parameters.AddWithValue("@ComplaintDetails", beData.ComplaintDetails);
				cmd.Parameters.AddWithValue("@Type", beData.Type);
				cmd.Parameters.AddWithValue("@ActionDate", beData.ActionDate);
				cmd.Parameters.AddWithValue("@ActionTime", beData.ActionTime);
				cmd.Parameters.AddWithValue("@ImmediateAndFurtherAction", beData.ImmediateAndFurtherAction);
				cmd.Parameters.AddWithValue("@CommitmentDate", beData.CommitmentDate);
				cmd.Parameters.AddWithValue("@CommitmentTime", beData.CommitmentTime);
				cmd.Parameters.AddWithValue("@ComplaintSubType", beData.ComplaintSubType);
				cmd.Parameters.AddWithValue("@DeputedPerson", beData.DeputedPerson);
				cmd.Parameters.AddWithValue("@DeputedPersonName", beData.DeputedPersonName);
				cmd.Parameters.AddWithValue("@DeputedTime", beData.DeputedTime);
				cmd.Parameters.AddWithValue("@AllocationId", AllocationId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandText = "usp_SaveComplainActionTaken";
				cmd.ExecuteNonQuery();
			}

		}


		public BE.TransactionComplain getTransactionComplainById(int UserId, int EntityId, int TranId)
		{
			BE.TransactionComplain beData = new BE.TransactionComplain();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetTransactionComplainById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.TransactionComplain();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.CostClassId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.BranchId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.ManualVoucherNO = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.AutoManualNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Attributes = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.UDFKeyVal = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.TicketForId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[10]);
					if (!(reader[11] is DBNull)) beData.LedgerId = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.PhoneNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.CustomerAddress = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.SourceId = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.NatureId = reader.GetInt32(15);
					if (!(reader[16] is DBNull)) beData.VehicleId = reader.GetInt32(16);
					if (!(reader[17] is DBNull)) beData.STPLComplaintNo = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.STPLEntryTime = Convert.ToDateTime(reader[18]);
					if (!(reader[19] is DBNull)) beData.STPLContactCode = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.STPLEntryDate = Convert.ToDateTime(reader[20]);
					if (!(reader[21] is DBNull)) beData.STPLContactName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.SyncedwithSupplierErp = Convert.ToBoolean(reader[22]);
					if (!(reader[23] is DBNull)) beData.STPlEntryDatebyUser = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.SatisfcationVerificationDate = Convert.ToDateTime(reader[24]);
					if (!(reader[25] is DBNull)) beData.ComplaintStatus = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.TypeofSatisfactionVerify = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.ComplaintClosedDate = Convert.ToDateTime(reader[27]);
					if (!(reader[28] is DBNull)) beData.ValidationRemarks = reader.GetString(28);
					if (!(reader[29] is DBNull)) beData.ComplaintClosedTime = Convert.ToDateTime(reader[29]);
					if (!(reader[30] is DBNull)) beData.FirstResponseDateAndTime = Convert.ToDateTime(reader[30]);
					if (!(reader[31] is DBNull)) beData.ComplaintClosedBy = reader.GetString(31);
					if (!(reader[32] is DBNull)) beData.AttendedDateAndTime = Convert.ToDateTime(reader[32]);
					if (!(reader[33] is DBNull)) beData.IsCorrectiveActionRequired = Convert.ToBoolean(reader[33]);
					if (!(reader[34] is DBNull)) beData.VehicleOnRoadDateTime = Convert.ToDateTime(reader[34]);
					if (!(reader[35] is DBNull)) beData.TargetDateForComplaintClosure = Convert.ToDateTime(reader[35]);
					if (!(reader[36] is DBNull)) beData.ValidationStatus = reader.GetString(36);
					if (!(reader[37] is DBNull)) beData.Reopened = Convert.ToBoolean(reader[37]);
					if (!(reader[38] is DBNull)) beData.RepairStatus = reader.GetString(38);
					if (!(reader[39] is DBNull)) beData.ReopenedDateTime = Convert.ToDateTime(reader[39]);
				}
				reader.NextResult();
				beData.ComplainLinesColl = new BE.ComplainLinesCollections();
				while (reader.Read())
				{
					BE.ComplainLines det1 = new BE.ComplainLines();
					if (!(reader[0] is DBNull)) det1.AllocationId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.TranId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.SNo = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det1.NatureId = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) det1.Department = reader.GetString(4);
					if (!(reader[5] is DBNull)) det1.LubeSegment = reader.GetString(5);
					if (!(reader[6] is DBNull)) det1.SubType = reader.GetString(6);
					if (!(reader[7] is DBNull)) det1.Type = reader.GetString(7);
					if (!(reader[8] is DBNull)) det1.ComplaintDetails = reader.GetString(8);
					if (!(reader[9] is DBNull)) det1.Status = reader.GetString(9);
					if (!(reader[10] is DBNull)) det1.ForwardedBranch = reader.GetString(10);
					if (!(reader[11] is DBNull)) det1.ClosedBy = reader.GetString(9);
					if (!(reader[12] is DBNull)) det1.STPLForwardedDate = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) det1.STPLForwaededTime = Convert.ToDateTime(reader[13]);
					if (!(reader[14] is DBNull)) det1.ResponsibleEmployee = reader.GetString(14);
					if (!(reader[15] is DBNull)) det1.Reference = reader.GetString(15);
					if (!(reader[16] is DBNull)) det1.VerifiedBy = reader.GetString(16);
					if (!(reader[17] is DBNull)) det1.RootCause = reader.GetString(17);
					if (!(reader[18] is DBNull)) det1.ResolutionDetail = reader.GetString(18);
					if (!(reader[19] is DBNull)) det1.Remarks = reader.GetString(19);
					if (!(reader[20] is DBNull)) det1.ResolvedBY = reader.GetString(20);
					if (!(reader[21] is DBNull)) det1.ResolvedDate = Convert.ToDateTime(reader[21]);
					if (!(reader[22] is DBNull)) det1.ResolvedTime = Convert.ToDateTime(reader[22]);
					if (!(reader[23] is DBNull)) det1.PartNo = reader.GetString(23);
					beData.ComplainLinesColl.Add(det1);
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


		public ResponeValues GetAutoVoucherNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@AutoNumber", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_GetAutoVoucherNo";
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

