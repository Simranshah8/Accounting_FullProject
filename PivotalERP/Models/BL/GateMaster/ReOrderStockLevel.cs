


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.GateMaster
{

	public class ReOrderStockLevel
	{

		DA.GateMaster.ReOrderStockLevelDB db = null;

		int _UserId = 0;

		public ReOrderStockLevel(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GateMaster.ReOrderStockLevelDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(int UserId,BE.GateMaster.ReOrderStockLevelCollections beData)
		{
			return db.SaveUpdate(UserId,beData);
		}

		public BE.GateMaster.ReOrderStockLevelCollections getAllReOrderStockLevel(int EntityId)
		{
			return db.getAllReOrderStockLevel(_UserId, EntityId);
		}

		public BE.GateMaster.ReOrderStockLevelCollections getReOrderStockLevelByGodownId(int EntityId, int GodownId)
		{
			return db.getReOrderStockLevelByGodownId(_UserId, EntityId, GodownId);
		}
		public ResponeValues DeleteById(int EntityId, int GodownId)
		{
			return db.DeleteById(_UserId, EntityId, GodownId);
		}
		

	}

}

