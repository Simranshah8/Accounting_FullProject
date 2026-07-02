using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class ReferenceRule
	{

		DA.Lab.ReferenceRuleDB db = null;

		int _UserId = 0;

		public ReferenceRule(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.ReferenceRuleDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.ReferenceRule beData)
		{
			bool isModify = beData.RefRuleId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.ReferenceRuleCollections GetAllLabReferenceRule(int EntityId)
		{
			return db.GetAllLabReferenceRule(_UserId, EntityId);
		}
		public BE.Lab.ReferenceRule GetLabReferenceRuleById(int EntityId, int RefRuleId)
		{
			return db.GetLabReferenceRuleById(_UserId, EntityId, RefRuleId);
		}
		public ResponeValues DeleteById(int EntityId, int RefRuleId)
		{
			return db.DeleteById(_UserId, EntityId, RefRuleId);
		}
		public ResponeValues IsValidData(ref BE.Lab.ReferenceRule beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.RefRuleId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.RefRuleId != 0)
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

