using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Dashboard
{
    public class SalesMetrices
    {
        DA.Dashboard.SalesMetricesDB db = null;
        int _UserId = 0;
        public SalesMetrices(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Dashboard.SalesMetricesDB(hostName, dbName);
        }
        public BE.Dashboard.ParametersforDashBoardCollection GetSelectionParametersforDashBoard()
        {
            return db.GetSelectionParametersforDashBoard(_UserId);
        }
        public BE.Dashboard.SalesMetrices GetSalesMetricesDashBoard(string FiscalYear, string Quarter, string Month, string ProductGroup, string ProductType, string Area, string Distributor, string LedgerGroup)
        {
            return db.GetSalesMetricesDashBoard(_UserId, FiscalYear, Quarter, Month, ProductGroup, ProductType, Area, Distributor, LedgerGroup);
        }



    }
}