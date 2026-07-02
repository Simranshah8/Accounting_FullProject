using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

	internal class HMSVoucherDB
	{
		DataAccessLayer1 dal = null;

		public HMSVoucherDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);

		}
		public ResponeValues SaveUpdate(BE.Hospital.HMSVoucher beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VoucherName", beData.VoucherName);
			cmd.Parameters.AddWithValue("@VoucherType", beData.VoucherType);
			cmd.Parameters.AddWithValue("@NumberingMethod", beData.NumberingMethod);
			cmd.Parameters.AddWithValue("@StartNumber", beData.StartNumber);
			cmd.Parameters.AddWithValue("@NumericalPartWidth", beData.NumericalPartWidth);
			cmd.Parameters.AddWithValue("@PrefilZero", beData.PrefilZero);
			cmd.Parameters.AddWithValue("@UseCommonNarration", beData.UseCommonNarration);
			cmd.Parameters.AddWithValue("@PrintVoucherAfterSaving", beData.PrintVoucherAfterSaving);
			cmd.Parameters.AddWithValue("@PrintVoucherAfterModify", beData.PrintVoucherAfterModify);
			cmd.Parameters.AddWithValue("@AllowAutoPrintOnDefaultPrinter", beData.AllowAutoPrintOnDefaultPrinter);
			cmd.Parameters.AddWithValue("@NoOfCopies", beData.NoOfCopies);
			cmd.Parameters.AddWithValue("@AllowDiscount", beData.AllowDiscount);
			cmd.Parameters.AddWithValue("@AllowDiscountEachRow", beData.AllowDiscountEachRow);
			cmd.Parameters.AddWithValue("@CanEntryDateChange", beData.CanEntryDateChange);
			cmd.Parameters.AddWithValue("@TaxRate", beData.TaxRate);
			cmd.Parameters.AddWithValue("@SendSMSAfterSave", beData.SendSMSAfterSave);
			cmd.Parameters.AddWithValue("@Doctorcompulsory", beData.Doctorcompulsory);
			cmd.Parameters.AddWithValue("@NoOfTemplates", beData.NoOfTemplates);
			cmd.Parameters.AddWithValue("@Prefix", beData.Prefix);
			cmd.Parameters.AddWithValue("@Suffix", beData.Suffix);
			cmd.Parameters.AddWithValue("@AllowSchame", beData.AllowSchame);
			cmd.Parameters.AddWithValue("@AllowSchameEachRow", beData.AllowSchameEachRow);
			cmd.Parameters.AddWithValue("@ValidateTender", beData.ValidateTender);
			cmd.Parameters.AddWithValue("@CashLedgerId", beData.CashLedgerId);
			cmd.Parameters.AddWithValue("@CreditLedgerId", beData.CreditLedgerId);
			cmd.Parameters.AddWithValue("@GHTLedgerId", beData.GHTLedgerId);
			cmd.Parameters.AddWithValue("@VoucherTypeId", beData.VoucherTypeId);
			cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
			cmd.Parameters.AddWithValue("@AllowDoctorSelectionEachRow", beData.AllowDoctorSelectionEachRow);
			cmd.Parameters.AddWithValue("@IsCashBilling", beData.IsCashBilling);
			cmd.Parameters.AddWithValue("@DonorLedgerId", beData.DonorLedgerId);
			cmd.Parameters.AddWithValue("@CommissionOtherDoctor", beData.CommissionOtherDoctor);
			cmd.Parameters.AddWithValue("@AllowMemoBilling", beData.AllowMemoBilling);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateHMSVoucher";
			}
			else
			{
				cmd.Parameters[35].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddHMSVoucher";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[36].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[37].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[38].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[35].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[35].Value);

				if (!(cmd.Parameters[36].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[36].Value);

				if (!(cmd.Parameters[37].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[37].Value);

				if (!(cmd.Parameters[38].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[38].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int VoucherId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@VoucherId", VoucherId);
			cmd.CommandText = "usp_DelHMSVoucherById";
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
		public BE.Hospital.HMSVoucherCollections getAllHMSVoucher(int UserId, int EntityId)
		{
			BE.Hospital.HMSVoucherCollections dataColl = new BE.Hospital.HMSVoucherCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllHMSVoucher";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.HMSVoucher beData = new BE.Hospital.HMSVoucher();
					if (!(reader[0] is DBNull)) beData.VoucherId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.VoucherType = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.NumberingMethod = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.StartNumber = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.NumericalPartWidth = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.PrefilZero = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.UseCommonNarration = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.PrintVoucherAfterSaving = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.PrintVoucherAfterModify = Convert.ToBoolean(reader[9]);
					if (!(reader[10] is DBNull)) beData.AllowAutoPrintOnDefaultPrinter = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.NoOfCopies = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.AllowDiscount = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.AllowDiscountEachRow = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.CanEntryDateChange = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.TaxRate = Convert.ToDouble(reader[15]);
					if (!(reader[16] is DBNull)) beData.SendSMSAfterSave = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.Doctorcompulsory = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.NoOfTemplates = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.Prefix = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.Suffix = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.AllowSchame = Convert.ToBoolean(reader[21]);
					if (!(reader[22] is DBNull)) beData.AllowSchameEachRow = Convert.ToBoolean(reader[22]);
					if (!(reader[23] is DBNull)) beData.ValidateTender = Convert.ToBoolean(reader[23]);
					if (!(reader[24] is DBNull)) beData.CashLedgerId = reader.GetInt32(24);
					if (!(reader[25] is DBNull)) beData.CreditLedgerId = reader.GetInt32(25);
					if (!(reader[26] is DBNull)) beData.GHTLedgerId = reader.GetInt32(26);
					if (!(reader[27] is DBNull)) beData.VoucherTypeId = reader.GetInt32(27);
					if (!(reader[28] is DBNull)) beData.CostClassId = reader.GetInt32(28);
					if (!(reader[29] is DBNull)) beData.AllowDoctorSelectionEachRow = Convert.ToBoolean(reader[29]);
					if (!(reader[30] is DBNull)) beData.IsCashBilling = Convert.ToBoolean(reader[30]);
					if (!(reader[31] is DBNull)) beData.DonorLedgerId = reader.GetInt32(31);
					if (!(reader[32] is DBNull)) beData.CommissionOtherDoctor = Convert.ToBoolean(reader[32]);
					if (!(reader[33] is DBNull)) beData.AllowMemoBilling = Convert.ToBoolean(reader[33]);
					if (!(reader[34] is DBNull)) beData.NumberingMethodValue = reader.GetString(34);
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
		public BE.Hospital.HMSVoucher getHMSVoucherById(int UserId, int EntityId, int VoucherId)
		{
			BE.Hospital.HMSVoucher beData = new BE.Hospital.HMSVoucher();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@VoucherId", VoucherId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetHMSVoucherById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.HMSVoucher();
					if (!(reader[0] is DBNull)) beData.VoucherId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.VoucherName = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.VoucherType = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.NumberingMethod = reader.GetInt32(3);
					if (!(reader[4] is DBNull)) beData.StartNumber = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.NumericalPartWidth = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.PrefilZero = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.UseCommonNarration = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.PrintVoucherAfterSaving = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.PrintVoucherAfterModify = Convert.ToBoolean(reader[9]);
					if (!(reader[10] is DBNull)) beData.AllowAutoPrintOnDefaultPrinter = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.NoOfCopies = reader.GetInt32(11);
					if (!(reader[12] is DBNull)) beData.AllowDiscount = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.AllowDiscountEachRow = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.CanEntryDateChange = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.TaxRate = Convert.ToDouble(reader[15]);
					if (!(reader[16] is DBNull)) beData.SendSMSAfterSave = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.Doctorcompulsory = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.NoOfTemplates = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.Prefix = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.Suffix = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.AllowSchame = Convert.ToBoolean(reader[21]);
					if (!(reader[22] is DBNull)) beData.AllowSchameEachRow = Convert.ToBoolean(reader[22]);
					if (!(reader[23] is DBNull)) beData.ValidateTender = Convert.ToBoolean(reader[23]);
					if (!(reader[24] is DBNull)) beData.CashLedgerId = reader.GetInt32(24);
					if (!(reader[25] is DBNull)) beData.CreditLedgerId = reader.GetInt32(25);
					if (!(reader[26] is DBNull)) beData.GHTLedgerId = reader.GetInt32(26);
					if (!(reader[27] is DBNull)) beData.VoucherTypeId = reader.GetInt32(27);
					if (!(reader[28] is DBNull)) beData.CostClassId = reader.GetInt32(28);
					if (!(reader[29] is DBNull)) beData.AllowDoctorSelectionEachRow = Convert.ToBoolean(reader[29]);
					if (!(reader[30] is DBNull)) beData.IsCashBilling = Convert.ToBoolean(reader[30]);
					if (!(reader[31] is DBNull)) beData.DonorLedgerId = reader.GetInt32(31);
					if (!(reader[32] is DBNull)) beData.CommissionOtherDoctor = Convert.ToBoolean(reader[32]);
					if (!(reader[33] is DBNull)) beData.AllowMemoBilling = Convert.ToBoolean(reader[33]);
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

