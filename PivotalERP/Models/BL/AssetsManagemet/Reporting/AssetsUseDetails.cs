using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class AssetsUseDetails
    {

        DA.AssetManagement.Report.AssetsUseDetailsDB db = null;

        int _UserId = 0;

        public AssetsUseDetails(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.AssetsUseDetailsDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.AssetsUseDetailsCollections GetAllAssetsUseDetails(int EntityId, DateTime? DateFrom, DateTime? DateTo, int? TranId)
        {
            return db.GetAllAssetsUseDetails(_UserId, EntityId, DateFrom, DateTo, TranId);
        }

    }

}

