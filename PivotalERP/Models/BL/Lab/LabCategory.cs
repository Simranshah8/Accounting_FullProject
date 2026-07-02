using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class LabCategory
	{

		DA.LabCategoryDB db = null;

		int _UserId = 0;

		public LabCategory(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LabCategoryDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.LabCategory beData)
		{
			bool isModify = beData.TestGroupId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.LabCategoryCollections GetAllLabCategory(int EntityId)
		{
			return db.getAllLabCategory(_UserId, EntityId);
		}
		public BE.LabCategory GetLabCategoryById(int EntityId, int LabCategoryId)
		{
			return db.getLabCategoryById(_UserId, EntityId, LabCategoryId);
		}
		public ResponeValues DeleteById(int EntityId, int LabCategoryId)
		{
			return db.DeleteById(_UserId, EntityId, LabCategoryId);
		}


		public ResponeValues GetAutoLabCategoryCode(int EntityId)
		{
			return db.GetAutoLabCategoryCode(_UserId, EntityId);
		}
		public ResponeValues IsValidData(ref BE.LabCategory beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TestGroupId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TestGroupId != 0)
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

