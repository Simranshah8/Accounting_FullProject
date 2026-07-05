using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AppCMS
{

	public class Herbs
	{

		DA.AppCMS.HerbsDB db = null;

		int _UserId = 0;

		public Herbs(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AppCMS.HerbsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.Herbs beData)
		{
			bool isModify = beData.HerbsId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AppCMS.HerbsCollections GetAllHerbs(int EntityId)
		{
			return db.getAllHerbs(_UserId, EntityId);
		}
		public BE.AppCMS.Herbs GetHerbsById(int EntityId, int HerbsId)
		{
			return db.getHerbsById(_UserId, EntityId, HerbsId);
		}
		public ResponeValues DeleteById(int EntityId, int HerbsId)
		{
			return db.DeleteById(_UserId, EntityId, HerbsId);
		}
		public ResponeValues IsValidData(ref BE.AppCMS.Herbs beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.HerbsId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.HerbsId != 0)
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

