using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Payroll
{

	public class Level : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Payroll.LevelDB db = null;

		int _UserId = 0;

		public Level(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Payroll.LevelDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.Payroll.Level beData)
		{
			bool isModify = beData.LevelId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.Payroll.LevelCollections GetAllLevel(int EntityId)
		{
			return db.getAllLevel(_UserId, EntityId);
		}
		public Dynamic.BE.Payroll.Level GetLevelById(int EntityId, int LevelId)
		{
			return db.getLevelById(_UserId, EntityId, LevelId);
		}
		public ResponeValues DeleteById(int EntityId, int LevelId)
		{
			return db.DeleteById(_UserId, EntityId, LevelId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.Payroll.Level beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.LevelId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.LevelId != 0)
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

