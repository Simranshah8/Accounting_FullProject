using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Task
{
	public class TaskType
	{
		DA.Task.TaskTypeDB db = null;

		int _UserId = 0;

		public TaskType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Task.TaskTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Task.TaskType beData)
		{
			bool isModify = beData.TaskTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Task.TaskTypeCollections GetAllTaskType(int EntityId)
		{
			return db.getAllTaskType(_UserId, EntityId);
		}
		public BE.Task.TaskType GetTaskTypeById(int EntityId, int TaskTypeId)
		{
			return db.getTaskTypeById(_UserId, EntityId, TaskTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int TaskTypeId)
		{
			return db.DeleteById(_UserId, EntityId, TaskTypeId);
		}
		public ResponeValues IsValidData(ref BE.Task.TaskType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TaskTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TaskTypeId != 0)
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

