using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class AssetIssueStatus
    {

        DA.AssetManagement.Report.AssetIssueStatusDB db = null;

        int _UserId = 0;

        public AssetIssueStatus(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.AssetIssueStatusDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.AssetIssueStatusCollections GetAllAssetIssueStatus(int EntityId, DateTime? DateFrom, DateTime? DateTo,string IssueStatus)
        {
            return db.GetAllAssetIssueStatus(_UserId, EntityId, DateFrom, DateTo, IssueStatus);
        }

    }

}

