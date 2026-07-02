using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class LabReportTemplate
	{
		DA.Lab.LabReportTemplateDB db = null;

		int _UserId = 0;

		public LabReportTemplate(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.LabReportTemplateDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.LabReportTemplate beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.LabReportTemplateCollections GetAllLabReportTemplate(int EntityId)
		{
			return db.getAllLabReportTemplate(_UserId, EntityId);
		}
		public BE.Lab.LabReportTemplate GetLabReportTemplateById(int EntityId)
		{
			return db.getLabReportTemplateById(_UserId, EntityId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.Lab.LabReportTemplate beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.TemplateTypeId == 0 || beData.TemplateTypeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select TemplayeType ";
				}
				else if (string.IsNullOrEmpty(beData.TemplateName))
				{
					resVal.ResponseMSG = "Please ! Enter TemplateName ";
				}
				else if (string.IsNullOrEmpty(beData.ReportPrintName))
				{
					resVal.ResponseMSG = "Please ! Enter ReportPrintName ";
				}
				else if (string.IsNullOrEmpty(beData.GroupName))
				{
					resVal.ResponseMSG = "Please ! Enter GroupName ";
				}
				else if (string.IsNullOrEmpty(beData.InvestigationName))
				{
					resVal.ResponseMSG = "Please ! Enter InvestigationName ";
				}
				else if (string.IsNullOrEmpty(beData.ResultName))
				{
					resVal.ResponseMSG = "Please ! Enter ResultName ";
				}
				else if (string.IsNullOrEmpty(beData.RefRangeColName))
				{
					resVal.ResponseMSG = "Please ! Enter RefRangeColName ";
				}
				else if (string.IsNullOrEmpty(beData.UnitColName))
				{
					resVal.ResponseMSG = "Please ! Enter UnitColName ";
				}
				else if (string.IsNullOrEmpty(beData.MethodColName))
				{
					resVal.ResponseMSG = "Please ! Enter MethodColName ";
				}
				else if (string.IsNullOrEmpty(beData.RemarkColName))
				{
					resVal.ResponseMSG = "Please ! Enter RemarkColName ";
				}
				else
				{
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}

		public ResponeValues SaveConfigFormData(BE.Lab.HeaderFooterConfig beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidConfig(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateConfig(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.HeaderFooterConfig GetHeaderFooterConfig(int EntityId)
		{
			return db.GetHeaderFooterConfig(_UserId, EntityId);
		}
		public ResponeValues IsValidConfig(ref BE.Lab.HeaderFooterConfig beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else
				{
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	}

}

