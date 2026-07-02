using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{

	internal class LabReportTemplateDB
	{
		DataAccessLayer1 dal = null;
		public LabReportTemplateDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);

		}
		public ResponeValues SaveUpdate(BE.Lab.LabReportTemplate beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TemplateTypeId", beData.TemplateTypeId);
			cmd.Parameters.AddWithValue("@TemplateName", beData.TemplateName);
			cmd.Parameters.AddWithValue("@ReportPrintName", beData.ReportPrintName);
			cmd.Parameters.AddWithValue("@IsGroupRow", beData.IsGroupRow);
			cmd.Parameters.AddWithValue("@GroupName", beData.GroupName);
			cmd.Parameters.AddWithValue("@IsInvestigation", beData.IsInvestigation);
			cmd.Parameters.AddWithValue("@InvestigationName", beData.InvestigationName);
			cmd.Parameters.AddWithValue("@IsResult", beData.IsResult);
			cmd.Parameters.AddWithValue("@ResultName", beData.ResultName);
			cmd.Parameters.AddWithValue("@IsReferenceRange", beData.IsReferenceRange);
			cmd.Parameters.AddWithValue("@RefRangeColName", beData.RefRangeColName);
			cmd.Parameters.AddWithValue("@IsUnitCol", beData.IsUnitCol);
			cmd.Parameters.AddWithValue("@UnitColName", beData.UnitColName);
			cmd.Parameters.AddWithValue("@IsMethod", beData.IsMethod);
			cmd.Parameters.AddWithValue("@MethodColName", beData.MethodColName);
			cmd.Parameters.AddWithValue("@IsRemark", beData.IsRemark);
			cmd.Parameters.AddWithValue("@RemarkColName", beData.RemarkColName);
			cmd.Parameters.AddWithValue("@FlagStyle", beData.FlagStyle);
			cmd.Parameters.AddWithValue("@IsAbnormalRow", beData.IsAbnormalRow);
			cmd.Parameters.AddWithValue("@IsClinicalNotes", beData.IsClinicalNotes);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateLabReportTemplate";
			}
			else
			{
				cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddLabReportTemplate";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[25].Direction = System.Data.ParameterDirection.Output;
			//addded by yubaraj
			cmd.Parameters.AddWithValue("@IsTestNameOrComponent", beData.IsTestNameOrComponent);


			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[23].Value);

				if (!(cmd.Parameters[24].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[24].Value);

				if (!(cmd.Parameters[25].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[25].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelLabReportTemplateById";
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
		public BE.Lab.LabReportTemplateCollections getAllLabReportTemplate(int UserId, int EntityId)
		{
			BE.Lab.LabReportTemplateCollections dataColl = new BE.Lab.LabReportTemplateCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLabReportTemplate";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.LabReportTemplate beData = new BE.Lab.LabReportTemplate();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TemplateTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TemplateName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.ReportPrintName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.IsGroupRow = Convert.ToBoolean(reader[4]);
					if (!(reader[5] is DBNull)) beData.GroupName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.IsInvestigation = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.InvestigationName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.IsResult = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.ResultName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsReferenceRange = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.RefRangeColName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsUnitCol = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.UnitColName = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.IsMethod = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.MethodColName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.IsRemark = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.RemarkColName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.FlagStyle = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.IsAbnormalRow = Convert.ToBoolean(reader[19]);
					if (!(reader[20] is DBNull)) beData.IsClinicalNotes = Convert.ToBoolean(reader[20]);
					if (!(reader[21] is DBNull)) beData.IsTestNameOrComponent = Convert.ToBoolean(reader[21]);
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
		public BE.Lab.LabReportTemplate getLabReportTemplateById(int UserId, int EntityId)
		{
			BE.Lab.LabReportTemplate beData = new BE.Lab.LabReportTemplate();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetLabReportTemplateById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Lab.LabReportTemplate();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.TemplateTypeId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.TemplateName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.ReportPrintName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.IsGroupRow = Convert.ToBoolean(reader[4]);
					if (!(reader[5] is DBNull)) beData.GroupName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.IsInvestigation = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.InvestigationName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.IsResult = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.ResultName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.IsReferenceRange = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.RefRangeColName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.IsUnitCol = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.UnitColName = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.IsMethod = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.MethodColName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.IsRemark = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.RemarkColName = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.FlagStyle = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) beData.IsAbnormalRow = Convert.ToBoolean(reader[19]);
					if (!(reader[20] is DBNull)) beData.IsClinicalNotes = Convert.ToBoolean(reader[20]);
					if (!(reader[21] is DBNull)) beData.IsTestNameOrComponent = Convert.ToBoolean(reader[21]);
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

		public ResponeValues SaveUpdateConfig(BE.Lab.HeaderFooterConfig beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@IsHeader", beData.IsHeader);
			cmd.Parameters.AddWithValue("@IsPatientId", beData.IsPatientId);
			cmd.Parameters.AddWithValue("@IsPatientName", beData.IsPatientName);
			cmd.Parameters.AddWithValue("@IsSampleNo", beData.IsSampleNo);
			cmd.Parameters.AddWithValue("@IsAge", beData.IsAge);
			cmd.Parameters.AddWithValue("@IsGender", beData.IsGender);
			cmd.Parameters.AddWithValue("@IsSampleCollectDate", beData.IsSampleCollectDate);
			cmd.Parameters.AddWithValue("@IsReportingDate", beData.IsReportingDate);
			cmd.Parameters.AddWithValue("@IsReferredBy", beData.IsReferredBy);
			cmd.Parameters.AddWithValue("@IsSampleCollectionAt", beData.IsSampleCollectionAt);
			cmd.Parameters.AddWithValue("@IsBarCode", beData.IsBarCode);
			cmd.Parameters.AddWithValue("@IsQR", beData.IsQR);
			cmd.Parameters.AddWithValue("@IsSignature1", beData.IsSignature1);
			cmd.Parameters.AddWithValue("@IsSignature2", beData.IsSignature2);
			cmd.Parameters.AddWithValue("@SignatureLebel1", beData.SignatureLebel1);
			cmd.Parameters.AddWithValue("@SignatureLebel2", beData.SignatureLebel2);
			cmd.Parameters.AddWithValue("@Signature1", beData.Signature1);
			cmd.Parameters.AddWithValue("@Signature2", beData.Signature2);
			cmd.Parameters.AddWithValue("@FooterNote", beData.FooterNote);
			cmd.Parameters.AddWithValue("@HeaderHeight", beData.HeaderHeight);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateHeaderFooterConfig";
			}
			else
			{
				cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddHeaderFooterConfig";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[25].Direction = System.Data.ParameterDirection.Output;
			//new added
			cmd.Parameters.AddWithValue("@ShowNotes", beData.ShowNotes);
			cmd.Parameters.AddWithValue("@FooterHeight", beData.FooterHeight);
			cmd.Parameters.AddWithValue("@IsFooter", beData.IsFooter);
			cmd.Parameters.AddWithValue("@IsAllSignature", beData.IsAllSignature);

			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[23].Value);

				if (!(cmd.Parameters[24].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[24].Value);

				if (!(cmd.Parameters[25].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[25].Value);

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
		public BE.Lab.HeaderFooterConfig GetHeaderFooterConfig(int UserId, int EntityId)
		{
			BE.Lab.HeaderFooterConfig beData = new BE.Lab.HeaderFooterConfig();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllHeaderFooterConfig";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Lab.HeaderFooterConfig();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.IsHeader = Convert.ToBoolean(reader[1]);
					if (!(reader[2] is DBNull)) beData.IsPatientId = Convert.ToBoolean(reader[2]);
					if (!(reader[3] is DBNull)) beData.IsPatientName = Convert.ToBoolean(reader[3]);
					if (!(reader[4] is DBNull)) beData.IsSampleNo = Convert.ToBoolean(reader[4]);
					if (!(reader[5] is DBNull)) beData.IsAge = Convert.ToBoolean(reader[5]);
					if (!(reader[6] is DBNull)) beData.IsGender = Convert.ToBoolean(reader[6]);
					if (!(reader[7] is DBNull)) beData.IsSampleCollectDate = Convert.ToBoolean(reader[7]);
					if (!(reader[8] is DBNull)) beData.IsReportingDate = Convert.ToBoolean(reader[8]);
					if (!(reader[9] is DBNull)) beData.IsReferredBy = Convert.ToBoolean(reader[9]);
					if (!(reader[10] is DBNull)) beData.IsSampleCollectionAt = Convert.ToBoolean(reader[10]);
					if (!(reader[11] is DBNull)) beData.IsBarCode = Convert.ToBoolean(reader[11]);
					if (!(reader[12] is DBNull)) beData.IsQR = Convert.ToBoolean(reader[12]);
					if (!(reader[13] is DBNull)) beData.IsSignature1 = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.IsSignature2 = Convert.ToBoolean(reader[14]);
					if (!(reader[15] is DBNull)) beData.SignatureLebel1 = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.SignatureLebel2 = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.Signature1 = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.Signature2 = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.FooterNote = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.HeaderHeight = Convert.ToDouble(reader[20]);
					//addeded
					if (!(reader[21] is DBNull)) beData.ShowNotes = Convert.ToBoolean(reader[21]);
					if (!(reader[22] is DBNull)) beData.FooterHeight = Convert.ToDouble(reader[22]);
					if (!(reader[23] is DBNull)) beData.IsFooter = Convert.ToBoolean(reader[23]);
					if (!(reader[24] is DBNull)) beData.IsAllSignature = Convert.ToBoolean(reader[24]);
					
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

