using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class GoalTargetType
	{

		DA.GoalTargetTypeDB db = null;

		int _UserId = 0;

		public GoalTargetType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GoalTargetTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GoalTargetType beData)
		{
			bool isModify = beData.GoalTargetTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GoalTargetTypeCollections GetAllGoalTargetType(int EntityId)
		{
			return db.getAllGoalTargetType(_UserId, EntityId);
		}
		public BE.GoalTargetType GetGoalTargetTypeById(int EntityId, int GoalTargetTypeId)
		{
			return db.getGoalTargetTypeById(_UserId, EntityId, GoalTargetTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int GoalTargetTypeId)
		{
			return db.DeleteById(_UserId, EntityId, GoalTargetTypeId);
		}
		public ResponeValues IsValidData(ref BE.GoalTargetType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.GoalTargetTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.GoalTargetTypeId != 0)
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

