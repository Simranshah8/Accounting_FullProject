using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class GoalPeriod
	{

		DA.GoalPeriodDB db = null;

		int _UserId = 0;

		public GoalPeriod(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GoalPeriodDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GoalPeriod beData)
		{
			bool isModify = beData.GoalPeriodId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GoalPeriodCollections GetAllGoalPeriod(int EntityId)
		{
			return db.getAllGoalPeriod(_UserId, EntityId);
		}
		public BE.GoalPeriod GetGoalPeriodById(int EntityId, int GoalPeriodId)
		{
			return db.getGoalPeriodById(_UserId, EntityId, GoalPeriodId);
		}
		public ResponeValues DeleteById(int EntityId, int GoalPeriodId)
		{
			return db.DeleteById(_UserId, EntityId, GoalPeriodId);
		}
		public ResponeValues IsValidData(ref BE.GoalPeriod beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.GoalPeriodId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.GoalPeriodId != 0)
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

