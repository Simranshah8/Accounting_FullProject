using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;

namespace PivotalERP.Areas.Fraction.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        public ActionResult Billlist()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllBilllist(DateTime DateFrom, DateTime DateTo)
        {
            PivotalERP.BE.BilllistCollections dataColl = new PivotalERP.BE.BilllistCollections();
            try
            {
                dataColl = new PivotalERP.DA.BilllistDB( User.HostName, User.DBName).getAllBilllist(DateFrom, DateTo);
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
        public JsonNetResult GetDeliveryThroughById(int DeliveryThroughId)
        {
            BE.DeliveryThrough resVal = new BE.DeliveryThrough();
            try
            {
                resVal = new PivotalERP.BL.DeliveryThrough(User.UserId, User.HostName, User.DBName).GetDeliveryThroughById(0, DeliveryThroughId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetBillDetailbyId(int TranId, string TranType)
        {
            PivotalERP.BE.BillDetailCollections dataColl = new PivotalERP.BE.BillDetailCollections();
            try
            {
                dataColl = new PivotalERP.BL.Billlist(User.UserId,User.HostName, User.DBName).GetAllBillDetail(TranId, TranType);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
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