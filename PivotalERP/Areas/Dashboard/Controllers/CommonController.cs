using Dynamic.BusinessEntity.Common;
using Dynamic.BusinessEntity.Inventory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.DashBoard.Controllers
{
    public class CommonController : PivotalERP.Controllers.BaseController
    {
        // GET: DashBoard/Common

        public ActionResult CDashboard(int tranId)
        {
            ViewBag.TranId = tranId;
            return View();
        }

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Index_Dugar()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetCommonDashboard()
        {
            Dynamic.Dashboard.BE.Common common = new Dynamic.Dashboard.BE.Common();
            try
            {
                Dynamic.Dashboard.BE.CommonPara para = new Dynamic.Dashboard.BE.CommonPara();
                para.UserId = User.UserId;
                para.DateFrom = null;
                para.DateTo = null;
                //para.ReportTypes = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,28";
                para.ReportTypes = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,29,30";
                common = new Dynamic.Dashboard.DA.CommonDB(User.HostName, User.DBName).getCommon(para);

                return new JsonNetResult() { Data = common, TotalCount = 1, IsSuccess = common.IsSuccess, ResponseMSG = common.ResponseMSG };
            }
            catch (Exception ee)
            {
                common.IsSuccess = false;
                common.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = common.IsSuccess, ResponseMSG = common.ResponseMSG };
        }

        public ActionResult Dashboard1()
        {
            return View();
        }
        public ActionResult NonMovingItems(DateTime? dateFrom, DateTime? dateTo, int? ProductBrandId, int? ProductTypeId)
        {
            ViewBag.DateFrom = dateFrom;
            ViewBag.DateTo = dateTo;
            ViewBag.ProductBrandId = ProductBrandId;
            ViewBag.ProductTypeId = ProductTypeId;

            return View();
        }

        [HttpPost]
        public JsonNetResult GetTopNonMovingItems(int ProductBrandId)
        {
            Dynamic.Dashboard.BE.NonMovingItemsCollections dataColl = new Dynamic.Dashboard.BE.NonMovingItemsCollections();
            try
            {
                Dynamic.Dashboard.BE.CommonPara para = new Dynamic.Dashboard.BE.CommonPara();
                para.UserId = User.UserId;
                para.DateFrom = null;
                para.DateTo = null;
                para.ReportTypes = "28";
                para.ProductBrandId = ProductBrandId;                
                var data= new Dynamic.Dashboard.DA.CommonDB(User.HostName, User.DBName).getCommon(para);
                dataColl = data.NonMovingItemsColl;

                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = data.IsSuccess, ResponseMSG = data.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetNonMovingItems(DateTime? dateFrom,DateTime? dateTo, int? ProductBrandId,int? ProductTypeId)
        {
            Dynamic.Dashboard.BE.NonMovingItemsCollections dataColl = new Dynamic.Dashboard.BE.NonMovingItemsCollections();
            try
            {
                dataColl = new Dynamic.Dashboard.DA.CommonDB(User.HostName, User.DBName).getSalesDashBoardDetails28(User.UserId, dateFrom, dateTo, ProductTypeId, ProductBrandId);
                
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult SalesForce()
        {
            return View();
        }

        [HttpPost]        
        public JsonNetResult GetSalesForce()
        {
            Dynamic.Dashboard.BE.SalesForce resVal = new Dynamic.Dashboard.BE.SalesForce();
            try
            {
                resVal = new Dynamic.Dashboard.DA.SalesForceDB(User.HostName, User.DBName).getDashboard(User.UserId,0);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        public ActionResult HRMDashboard()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetHRMDashBoard(int ForDate)
        {
            Dynamic.RE.Dashboard.HRMDashboard dataColl = new Dynamic.RE.Dashboard.HRMDashboard();
            try
            {
                dataColl = new Dynamic.BL.Dashboard.HRMDashBoard(User.UserId, User.HostName, User.DBName).GetHRMDashBoard(ForDate);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
    }
}