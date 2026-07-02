
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class AssetWiseReport
    {

        DA.AssetManagement.Report.AssetWiseReportDB db = null;

        int _UserId = 0;

        public AssetWiseReport(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.AssetWiseReportDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.AssetWiseReportCollections GetAllAssetWiseReport(int EntityId, DateTime? DateFrom, DateTime? DateTo, int? TranId, int? BranchId)
        {
            return db.GetAllAssetWiseReport(_UserId, EntityId, DateFrom, DateTo, TranId, BranchId);
        }

    }

}

