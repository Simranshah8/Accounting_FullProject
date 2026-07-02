using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class ObjectiveQuestion
	{

		DA.ObjectiveQuestionDB db = null;

		int _UserId = 0;

		public ObjectiveQuestion(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.ObjectiveQuestionDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.ObjectiveQuestion beData)
		{
			bool isModify = beData.ObjectiveQuestionId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.ObjectiveQuestionCollections GetAllObjectiveQuestion(int EntityId)
		{
			return db.getAllObjectiveQuestion(_UserId, EntityId);
		}
		public BE.ObjectiveQuestion GetObjectiveQuestionById(int EntityId, int ObjectiveQuestionId)
		{
			return db.getObjectiveQuestionById(_UserId, EntityId, ObjectiveQuestionId);
		}
		public ResponeValues DeleteById(int EntityId, int ObjectiveQuestionId)
		{
			return db.DeleteById(_UserId, EntityId, ObjectiveQuestionId);
		}
		public ResponeValues IsValidData(ref BE.ObjectiveQuestion beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ObjectiveQuestionId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ObjectiveQuestionId != 0)
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

