using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Dashboard
{
    public class SalesDashboard
    {
        DA.Dashboard.SalesDashboardDB db = null;
        int _UserId = 0;
        public SalesDashboard(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Dashboard.SalesDashboardDB(hostName, dbName);
        }
        public BE.Dashboard.SalesDashboard GetSalesDashboard()
        {
            return db.GetSalesDashboard(_UserId);
        }

    }
}