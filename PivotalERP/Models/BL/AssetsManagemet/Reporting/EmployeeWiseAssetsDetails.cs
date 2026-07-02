using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class EmployeeWiseAssetsDetails
    {

        DA.AssetManagement.Report.EmployeeWiseAssetsDetailsDB db = null;

        int _UserId = 0;

        public EmployeeWiseAssetsDetails(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.EmployeeWiseAssetsDetailsDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.EmployeeWiseAssetsDetCollections GetEmployeeWiseAssetsDet(int EntityId,int? UsersId)
        {
            return db.GetEmployeeWiseAssetsDet(_UserId, EntityId, UsersId);
        }

    }

}

