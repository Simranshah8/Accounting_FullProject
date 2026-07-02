using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BL
{
    public class ProductInOutType
    {
		DA.ProductInOutTypeDB db = null;

		int _UserId = 0;

		public ProductInOutType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.ProductInOutTypeDB(hostName, dbName);
		}

		public ResponeValues SaveUpdateProductInOutType(BE.ProductInOutType beData)
		{
			bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValid(beData, isModify);
            if (isValid.IsSuccess)
				return db.SaveUpdateProductInOutType(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues DeleteProductInOutType(int EntityId, int TranId)
        {
			return db.DeleteProductInOutType(EntityId, _UserId, TranId);
        }
		public BE.ProductInOutTypeCollection GetAllProductInOutType(int EntityId)
        {
			return db.GetAllProductInOutType(EntityId, _UserId);
        }
		public BE.ProductInOutType GetProductInOutTypeById(int EntityId, int TranId)
        {
			return db.GetProductInOutTypeById(EntityId, _UserId, TranId);
        }
		public ResponeValues IsValid(BE.ProductInOutType beData, bool IsModify)
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
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
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