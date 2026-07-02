using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{
	public class LedgerCategory
	{
		Dynamic.DA.LedgerCategoryDB db = null;
		int _UserId = 0;

		public LedgerCategory(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LedgerCategoryDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.LedgerCategory beData)
		{
			bool isModify = beData.CategoryId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.LedgerCategoryCollections GetAllLedgerCategory(int EntityId)
		{
			return db.getAllLedgerCategory(_UserId, EntityId);
		}
		public BE.LedgerCategory GetLedgerCategoryById(int EntityId, int CategoryId)
		{
			return db.getLedgerCategoryById(_UserId, EntityId, CategoryId);
		}
		public ResponeValues DeleteById(int EntityId, int CategoryId)
		{
			return db.DeleteById(_UserId, EntityId, CategoryId);
		}
		public ResponeValues IsValidData(ref BE.LedgerCategory beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.CategoryId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.CategoryId != 0)
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

