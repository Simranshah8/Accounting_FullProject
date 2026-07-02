using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class TemplateType
	{

		DA.TemplateTypeDB db = null;

		int _UserId = 0;

		public TemplateType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.TemplateTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.TemplateType beData)
		{
			bool isModify = beData.TemplateTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.TemplateTypeCollections GetAllTemplateType(int EntityId)
		{
			return db.getAllTemplateType(_UserId, EntityId);
		}
		public BE.TemplateType GetTemplateTypeById(int EntityId, int TemplateTypeId)
		{
			return db.getTemplateTypeById(_UserId, EntityId, TemplateTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int TemplateTypeId)
		{
			return db.DeleteById(_UserId, EntityId, TemplateTypeId);
		}
		public ResponeValues IsValidData(ref BE.TemplateType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TemplateTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TemplateTypeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
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

