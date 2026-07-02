using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Misreport.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
    {
        // GET: Misreport/Transaction
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult SalesAnalysis()
        {
            return View();
        }
        public ActionResult ProductPriceList()
        {
            return View();
        }
        public ActionResult DashboardDVGrp()
        {
            return View();
        }

        public ActionResult LandStatus()
        {
            return View();
        }


        [HttpPost]
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getDashboardDVGrpById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.DashboardDVGrp(User.UserId, User.HostName, User.DBName).GetDashboardDVGrpById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        public ActionResult DistributorTransfer()
        {
            return View();
        }

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.TravelType)]
        public JsonNetResult SaveUpdateDistributorTransfer()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.DistributorTransfer>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;                  

                    resVal = new Dynamic.BL.DistributorTransfer(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        public ActionResult OutletMap()
        {
            return View();
        }
    }
}