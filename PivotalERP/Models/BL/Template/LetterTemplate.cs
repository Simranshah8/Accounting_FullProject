using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class LetterTemplate  
	{ 

		DA.LetterTemplateDB db = null;

		int _UserId = 0;

		public LetterTemplate(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LetterTemplateDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.LetterTemplate beData)
		{
			bool isModify = beData.LetterTemplateId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.LetterTemplateCollections GetAllLetterTemplate(int EntityId)
		{
			return db.getAllLetterTemplate(_UserId, EntityId);
		}
		public BE.LetterTemplate GetLetterTemplateById(int EntityId, int TemplateTypeId)
		{
			return db.getLetterTemplateById(_UserId, EntityId, TemplateTypeId);
		}
		public BE.UserDetails GetUserDetailsById(int EntityId, int UsersId)
		{
			return db.GetUserDetailsById(_UserId, EntityId, UsersId);
		}
		public ResponeValues DeleteById(int EntityId, int LetterTemplateId)
		{
			return db.DeleteById(_UserId, EntityId, LetterTemplateId);
		}
		public ResponeValues IsValidData(ref BE.LetterTemplate beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.LetterTemplateId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.LetterTemplateId != 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}
			else if (beData.TemplateTypeId==0 || beData.TemplateTypeId.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select TemplateType ";
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

