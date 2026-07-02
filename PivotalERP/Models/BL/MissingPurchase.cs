using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BusinessLogic.Inventory
{

	public class MissingPurchase
	{

		Dynamic.DataAccess.Inventory.MissingPurchaseDB db = null;

		int _UserId = 0;

		public MissingPurchase(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DataAccess.Inventory.MissingPurchaseDB(hostName, dbName);
		}
		public Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections GetMissingPurchase(int EntityId)
		{
			return db.getMissingPurchase(_UserId, EntityId);
		}
		public ResponeValues IsValidData(ref Dynamic.BusinessEntity.Inventory.MissingPurchase beData)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
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

