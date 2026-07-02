using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Inventory
{
    public class StockTransfer
    {
        Dynamic.DA.Inventory.StockTransferDB db = null;
        int _UserId = 0;
        public StockTransfer(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new Dynamic.DA.Inventory.StockTransferDB(hostName, dbName);
        }

        public Dynamic.ReportEntity.Inventory.StockTransferCollections GetAllStockTransfer(int EntityId, DateTime? dateFrom, DateTime? dateTo, int GodownId)
        {
            return db.getAllStockTransfer(_UserId, EntityId, dateFrom, dateTo, GodownId);
        }

       
    }
}
