using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AppCMS
{

	public class TagSection
	{

		DA.AppCMS.TagSectionDB db = null;

		int _UserId = 0;

		public TagSection(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AppCMS.TagSectionDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.TagSection beData)
		{
			bool isModify = beData.TagId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AppCMS.TagSectionCollections GetAllTagSection(int EntityId)
		{
			return db.getAllTagSection(_UserId, EntityId);
		}
		public BE.AppCMS.TagSection GetTagSectionById(int EntityId, int TagId)
		{
			return db.getTagSectionById(_UserId, EntityId, TagId);
		}
		public ResponeValues DeleteById(int EntityId, int TagId)
		{
			return db.DeleteById(_UserId, EntityId, TagId);
		}
		public ResponeValues IsValidData(ref BE.AppCMS.TagSection beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TagId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TagId != 0)
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

