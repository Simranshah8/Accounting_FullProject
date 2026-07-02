using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Dashboard.Controllers
{
    public class InventoryController : PivotalERP.Controllers.BaseController
    {
        // GET: Dashboard/Inventory
        public ActionResult SalesMetricesDashboard()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetSelectionParametersforDashBoard()
        {
            Dynamic.BE.Dashboard.ParametersforDashBoardCollection dataColl = new Dynamic.BE.Dashboard.ParametersforDashBoardCollection();
            try
            {
                dataColl = new Dynamic.BL.Dashboard.SalesMetrices(User.UserId,User.HostName, User.DBName).GetSelectionParametersforDashBoard();
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSalesMetricesDashBoard(string FiscalYear, string Quarter, string Month, string ProductGroup, string ProductType, string Area, string Distributor, string LedgerGroup)
        {
            Dynamic.BE.Dashboard.SalesMetrices dataColl = new Dynamic.BE.Dashboard.SalesMetrices();
            try
            {
                dataColl = new Dynamic.BL.Dashboard.SalesMetrices(User.UserId, User.HostName, User.DBName).GetSalesMetricesDashBoard(FiscalYear, Quarter, Month, ProductGroup, ProductType, Area, Distributor, LedgerGroup);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult CDashboard()
        {
            return View();
        }

    }
}