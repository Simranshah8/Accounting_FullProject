using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.NPayroll
{

	public class PayHeadCategory
	{

		DA.NPayroll.PayHeadCategoryDB db = null;

		int _UserId = 0;

		public PayHeadCategory(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NPayroll.PayHeadCategoryDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.NPayroll.PayHeadCategory beData)
		{
			bool isModify = beData.PayHeadCategoryId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.NPayroll.PayHeadCategoryCollections GetAllPayHeadCategory(int EntityId)
		{
			return db.getAllPayHeadCategory(_UserId, EntityId);
		}
		public Dynamic.BE.NPayroll.PayHeadCategory GetPayHeadCategoryById(int EntityId, int PayHeadCategoryId)
		{
			return db.getPayHeadCategoryById(_UserId, EntityId, PayHeadCategoryId);
		}
		public ResponeValues DeleteById(int EntityId, int PayHeadCategoryId)
		{
			return db.DeleteById(_UserId, EntityId, PayHeadCategoryId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.PayHeadCategory beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.PayHeadCategoryId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.PayHeadCategoryId != 0)
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

