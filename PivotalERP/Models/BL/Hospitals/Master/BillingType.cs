using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class BillingType
	{

		DA.Hospital.BillingTypeDB db = null;

		int _UserId = 0;

		public BillingType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.BillingTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.BillingType beData)
		{
			bool isModify = beData.BillingTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.BillingTypeCollections GetAllBillingType(int EntityId)
		{
			return db.getAllBillingType(_UserId, EntityId);
		}
		public BE.Hospital.BillingType GetBillingTypeById(int EntityId, int BillingTypeId)
		{
			return db.getBillingTypeById(_UserId, EntityId, BillingTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int BillingTypeId)
		{
			return db.DeleteById(_UserId, EntityId, BillingTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.BillingType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.BillingTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.BillingTypeId != 0)
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

