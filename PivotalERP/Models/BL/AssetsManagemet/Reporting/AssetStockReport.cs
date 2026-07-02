using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class AssetStockReport
    {

        DA.AssetManagement.Report.AssetStockReportDB db = null;

        int _UserId = 0;

        public AssetStockReport(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.AssetStockReportDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.AssetStockReportCollections GetAllAssetStockReport(int EntityId, DateTime? DateFrom, DateTime? DateTo, int? AssetGroupId, int? BranchId)
        {
            return db.GetAllAssetStockReport(_UserId, EntityId, DateFrom, DateTo, AssetGroupId, BranchId);
        }

    }

}

