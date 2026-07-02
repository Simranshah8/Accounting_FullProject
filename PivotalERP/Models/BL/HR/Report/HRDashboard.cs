using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL
{
    public class HRDashboard
    {
        DA.HRDashboardDB db = null;
        int _UserId = 0;
        public HRDashboard(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.HRDashboardDB(hostName, dbName);
        }
        public RE.HRDashboard GetHRDashboard(int? ViewDetailsId)
        {
            return db.GetHRDashboard(_UserId, ViewDetailsId);
        }

    }
}