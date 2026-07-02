using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Dashboard
{
    public class HRMDashBoard
    {
        DA.Dashboard.HRMDashBoardDB db = null;
        int _UserId = 0;

        public HRMDashBoard(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Dashboard.HRMDashBoardDB(hostName, dbName);
        }
        public RE.Dashboard.HRMDashboard GetHRMDashBoard(int ForDate)
        {
            return db.GetHRMDashBoard(_UserId, ForDate);
        }
    }
}