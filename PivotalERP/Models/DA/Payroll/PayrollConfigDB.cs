using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Payroll
{
	internal class PayrollConfigDB
	{
		DataAccessLayer1 dal = null;
		public PayrollConfigDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Payroll.PayrollConfig beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@JV_VoucherId", beData.JV_VoucherId);
			cmd.Parameters.AddWithValue("@JV_CostClassId", beData.JV_CostClassId);
			cmd.Parameters.AddWithValue("@JV_AutoGenerate", beData.JV_AutoGenerate);
			cmd.Parameters.AddWithValue("@JV_AutoCancelRegenerate", beData.JV_AutoCancelRegenerate);
			cmd.Parameters.AddWithValue("@PV_VoucherId", beData.PV_VoucherId);
			cmd.Parameters.AddWithValue("@PV_CostClassId", beData.PV_CostClassId);
			cmd.Parameters.AddWithValue("@PV_AutoGenerate", beData.PV_AutoGenerate);
			cmd.Parameters.AddWithValue("@PV_AutoCancelRegenerate", beData.PV_AutoCancelRegenerate);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdatePayrollConfig";
			}
			else
			{
				cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddPayrollConfig";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;


			cmd.Parameters.AddWithValue("@AV_VoucherId", beData.AV_VoucherId);
			cmd.Parameters.AddWithValue("@AV_CostClassId", beData.AV_CostClassId);
			cmd.Parameters.AddWithValue("@AV_AutoGenerate", beData.AV_AutoGenerate);
			cmd.Parameters.AddWithValue("@AV_AutoCancelRegenerate", beData.AV_AutoCancelRegenerate);
			cmd.Parameters.AddWithValue("@NoOfDecimal", beData.NoOfDecimal);
			//NEw Field Added
			cmd.Parameters.AddWithValue("@PaySlipTemplateId", beData.PaySlipTemplateId);
			//added by yubaraj
			cmd.Parameters.AddWithValue("@ShowSalAttn", beData.ShowSalAttn);
			cmd.Parameters.AddWithValue("@BlockScreenshot", beData.BlockScreenshot);
			cmd.Parameters.AddWithValue("@AllowPayslipDL", beData.AllowPayslipDL);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[12].Value);

				if (!(cmd.Parameters[13].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[13].Value);

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


		public BE.Payroll.PayrollConfig getPayrollConfig(int UserId, int EntityId)
		{
			BE.Payroll.PayrollConfig beData = new BE.Payroll.PayrollConfig();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllPayrollConfig";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Payroll.PayrollConfig();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.JV_VoucherId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.JV_CostClassId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.JV_AutoGenerate = Convert.ToBoolean(reader[3]);
					if (!(reader[4] is DBNull)) beData.JV_AutoCancelRegenerate = Convert.ToBoolean(reader[4]);
					if (!(reader[5] is DBNull)) beData.PV_VoucherId = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.PV_CostClassId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.PV_AutoGenerate = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.PV_AutoCancelRegenerate = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.AV_VoucherId = reader.GetInt32(9);
					if (!(reader[10] is DBNull)) beData.AV_CostClassId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.AV_AutoGenerate = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.AV_AutoCancelRegenerate = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.NoOfDecimal = reader.GetInt32(13);

					//New Field Added
					if (!(reader[14] is DBNull)) beData.PaySlipTemplateId = reader.GetInt32(14);
					//added by yubaraj
					if (!(reader[15] is DBNull)) beData.ShowSalAttn = Convert.ToBoolean(reader[15]);
					if (!(reader[16] is DBNull)) beData.BlockScreenshot = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.AllowPayslipDL = Convert.ToBoolean(reader[17]);

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

		//Added By Suresh For PaySlip Get
        public BE.Payroll.PaySlipReportCollections getAllPaySlipReport(int UserId, int EntityId)
        {
            BE.Payroll.PaySlipReportCollections dataColl = new BE.Payroll.PaySlipReportCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetReportForPaySlip";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Payroll.PaySlipReport beData = new BE.Payroll.PaySlipReport();
                    if (!(reader[0] is DBNull)) beData.RptTranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ReportName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Path = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.IsDefault = Convert.ToBoolean(reader[3]);
                    if (!(reader[4] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[4]);
                   
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

