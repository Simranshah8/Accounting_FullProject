using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AppCMS
{

	public class HeroSection
	{

		DA.AppCMS.HeroSectionDB db = null;

		int _UserId = 0;

		public HeroSection(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AppCMS.HeroSectionDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.HeroSection beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AppCMS.HeroSectionCollections GetAllHeroSection(int EntityId)
		{
			return db.getAllHeroSection(_UserId, EntityId);
		}
		public BE.AppCMS.HeroSection GetHeroSectionById(int EntityId, int TranId)
		{
			return db.getHeroSectionById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.AppCMS.HeroSection beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Badge))
				{
					resVal.ResponseMSG = "Please ! Enter Badge ";
				}
				else if (string.IsNullOrEmpty(beData.Title))
				{
					resVal.ResponseMSG = "Please ! Enter Title ";
				}
				else if (string.IsNullOrEmpty(beData.Photo))
				{
					resVal.ResponseMSG = "Please ! Choose Photo ";
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

