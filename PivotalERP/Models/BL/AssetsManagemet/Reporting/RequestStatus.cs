using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement.Report
{

    public class RequestStatus
    {

        DA.AssetManagement.Report.RequestStatusDB db = null;

        int _UserId = 0;

        public RequestStatus(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssetManagement.Report.RequestStatusDB(hostName, dbName);
        }

        public RE.AssetManagement.Report.RequestStatusCollections GetAllRequestStatus(int EntityId, DateTime? DateFrom, DateTime? DateTo,string ReqStatus)
        {
            return db.GetAllRequestStatus(_UserId, EntityId, DateFrom, DateTo, ReqStatus);
        }

    }

}

