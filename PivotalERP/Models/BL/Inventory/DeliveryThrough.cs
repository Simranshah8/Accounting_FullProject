using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BusinessLogic.Inventory
{
    public class DeliveryThrough
	{

		Dynamic.DataAccess.Inventory.DeliveryThroughDB db = null;

		int _UserId = 0;

		public DeliveryThrough(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DataAccess.Inventory.DeliveryThroughDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BusinessEntity.Inventory.DeliveryThrough beData)
		{
			bool isModify = beData.DeliveryThroughId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BusinessEntity.Inventory.DeliveryThroughCollections GetAllDeliveryThrough(int EntityId)
		{
			return db.getAllDeliveryThrough(_UserId, EntityId);
		}
		public Dynamic.BusinessEntity.Inventory.DeliveryThrough GetDeliveryThroughById(int EntityId, int DeliveryThroughId)
		{
			return db.getDeliveryThroughById(_UserId, EntityId, DeliveryThroughId);
		}
		public ResponeValues DeleteById(int EntityId, int DeliveryThroughId)
		{
			return db.DeleteById(_UserId, EntityId, DeliveryThroughId);
		}
		public ResponeValues IsValidData(ref Dynamic.BusinessEntity.Inventory.DeliveryThrough beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DeliveryThroughId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DeliveryThroughId != 0)
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

