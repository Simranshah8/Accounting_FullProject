using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AppCMS
{
	public class WelnessGoals
	{

		DA.AppCMS.WelnessGoalsDB db = null;

		int _UserId = 0;

		public WelnessGoals(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AppCMS.WelnessGoalsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.WelnessGoals beData)
		{
			bool isModify = beData.WelnessId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AppCMS.WelnessGoalsCollections GetAllWelnessGoals(int EntityId)
		{
			return db.getAllWelnessGoals(_UserId, EntityId);
		}
		public BE.AppCMS.WelnessGoals GetWelnessGoalsById(int EntityId, int WelnessId)
		{
			return db.getWelnessGoalsById(_UserId, EntityId, WelnessId);
		}
		public ResponeValues DeleteById(int EntityId, int WelnessId)
		{
			return db.DeleteById(_UserId, EntityId, WelnessId);
		}
		public ResponeValues IsValidData(ref BE.AppCMS.WelnessGoals beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.WelnessId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.WelnessId != 0)
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
				else if (string.IsNullOrEmpty(beData.Banner))
				{
					resVal.ResponseMSG = "Please ! Enter Banner ";
				}
				else if (string.IsNullOrEmpty(beData.Image))
				{
					resVal.ResponseMSG = "Please ! Enter Image ";
				}
				else if (string.IsNullOrEmpty(beData.Description))
				{
					resVal.ResponseMSG = "Please ! Enter Description ";
				}
				else if (string.IsNullOrEmpty(beData.Badge))
				{
					resVal.ResponseMSG = "Please ! Enter Badge ";
				}
				else if (beData.HerbId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Herb ID ";

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