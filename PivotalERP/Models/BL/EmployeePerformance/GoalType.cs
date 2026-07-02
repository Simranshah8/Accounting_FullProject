using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class GoalType
	{

		DA.GoalTypeDB db = null;

		int _UserId = 0;

		public GoalType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GoalTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GoalType beData)
		{
			bool isModify = beData.GoalTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GoalTypeCollections GetAllGoalType(int EntityId)
		{
			return db.getAllGoalType(_UserId, EntityId);
		}
		public BE.GoalType GetGoalTypeById(int EntityId, int GoalTypeId)
		{
			return db.getGoalTypeById(_UserId, EntityId, GoalTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int GoalTypeId)
		{
			return db.DeleteById(_UserId, EntityId, GoalTypeId);
		}
		public ResponeValues IsValidData(ref BE.GoalType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.GoalTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.GoalTypeId != 0)
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
				else if (string.IsNullOrEmpty(beData.Description))
				{
					resVal.ResponseMSG = "Please ! Enter Description ";
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

