using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class AnswerSetValue
	{

		DA.Lab.AnswerSetValueDB db = null;

		int _UserId = 0;

		public AnswerSetValue(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.AnswerSetValueDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.AnswerSetValue beData)
		{
			bool isModify = beData.LookupId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.AnswerSetValueCollections GetAlllab_AnswerSetValue(int EntityId)
		{
			return db.getAlllab_AnswerSetValue(_UserId, EntityId);
		}
		public BE.Lab.AnswerSetValue Getlab_AnswerSetValueById(int EntityId, int LookUpId)
		{
			return db.getlab_AnswerSetValueById(_UserId, EntityId, LookUpId);
		}
		public ResponeValues DeleteById(int EntityId, int LookUpId)
		{
			return db.DeleteById(_UserId, EntityId, LookUpId);
		}
		public ResponeValues IsValidData(ref BE.Lab.AnswerSetValue beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.LookupId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.LookupId != 0)
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
				else if (string.IsNullOrEmpty(beData.Purpose))
				{
					resVal.ResponseMSG = "Please ! Enter Purpose ";
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

