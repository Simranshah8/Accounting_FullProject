using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class DiscountType
	{

		DA.Hospital.DiscountTypeDB db = null;

		int _UserId = 0;

		public DiscountType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DiscountTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.DiscountType beData)
		{
			bool isModify = beData.DiscountTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DiscountTypeCollections GetAllDiscountType(int EntityId)
		{
			return db.getAllDiscountType(_UserId, EntityId);
		}
		public BE.Hospital.DiscountType GetDiscountTypeById(int EntityId, int DiscountTypeId)
		{
			return db.getDiscountTypeById(_UserId, EntityId, DiscountTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int DiscountTypeId)
		{
			return db.DeleteById(_UserId, EntityId, DiscountTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.DiscountType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DiscountTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DiscountTypeId != 0)
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

				else if ( !beData.Per.HasValue)
				{
					resVal.ResponseMSG = "Please ! Enter Discount Rate ";
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

