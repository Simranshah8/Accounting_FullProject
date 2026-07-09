using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AppCMS
{
    public class ProductDocuments
    {
		DA.AppCMS.ProductDocumentsDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public ProductDocuments(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AppCMS.ProductDocumentsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.ProductDocuments beData)
		{
			bool isModify = beData.ProductId > 0;
			ResponeValues isValid = IsValidData(ref beData);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData);
			else
				return isValid;
		}
        public BE.AppCMS.ProductDocumentsCollections GetAllProductDoc(int EntityId)
        {
            return db.GetAllProductDoc(_UserId, EntityId);
        }
        public BE.AppCMS.ProductDocuments GetProductDocById(int EntityId, int ProductId)
		{
			return db.GetProductDocById(_UserId, EntityId, ProductId);
		}
		//public ResponeValues DeleteProductDoc(int EntityId, int ProductId)
		//{
		//	return db.DeleteProductDoc(_UserId, EntityId, ProductId);
		//}
		public ResponeValues IsValidData(ref BE.AppCMS.ProductDocuments beData)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
                else if(beData.ProductId == 0 || beData.ProductId.HasValue == false)
                {
					resVal.IsSuccess = false;
					resVal.ResponseMSG = "Please! Select Product.";
					return resVal;
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