using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL.Inventory
{
    public class MStock
    {
        DA.Inventory.MStockDB db = null;
        int _UserId = 0;
        public MStock(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Inventory.MStockDB(hostName, dbName);
        }
       
        public BE.Inventory.MStockCollections GetAllMStock(int EntityId)
        {
            return db.getAllMStock(_UserId, EntityId);
        }

    }
}
