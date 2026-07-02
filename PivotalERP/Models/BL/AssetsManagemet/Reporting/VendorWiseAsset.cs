using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class VendorWiseAsset
    {

        DA.AssetManagement.Report.VendorWiseAssetDB db = null;

        int _UserId = 0;

        public VendorWiseAsset(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.VendorWiseAssetDB(hostName, dbName);
        }
        
        public RE.AssetManagement.Report.VendorWiseAssetCollections GetAllVendorWiseAsset(int EntityId, DateTime? DateFrom, DateTime? DateTo)
        {
            return db.GetAllVendorWiseAsset(_UserId, EntityId, DateFrom, DateTo);
        }
     
    }

}

