using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Dynamic.ReportEntity.Service;

namespace PivotalERP.Areas.Services.Controllers
{
    public class ReportingController : PivotalERP.Controllers.BaseController
    {
        // GET: Services/Reporting
        public ActionResult JobforFeedback()
        {
            return View();
        }

        //[HttpPost]
        //public JsonNetResultWithEnum GetJobforFeedbackList(DateTime? dateFrom, DateTime? dateTo, bool isCancel)
        //{
        //    Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new JobCardListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardList(User.UserId, dateFrom.Value, dateTo.Value, isCancel);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}



        //[HttpPost]
        //public JsonNetResultWithEnum GetVehicleList(DateTime dateFrom, DateTime dateTo)
        //{
        //    Dynamic.ReportEntity.Service.VehicleEntryListCollections dataColl = new VehicleEntryListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getAllVehicleEntryCollections(dateFrom.Value, dateTo.Value);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpPost]
        //public JsonNetResultWithEnum GetSparePartsList(DateTime dateFrom, DateTime dateTo)
        //{
        //    Dynamic.ReportEntity.Service.JobCardSparePartsListCollections dataColl = new JobCardSparePartsListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardSparePartsList(dateFrom.Value, dateTo.Value);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}


        //[HttpPost]
        //public JsonNetResultWithEnum GetVehicleHistory(DateTime DateFrom, DateTime DateTo, int VehicleEntryId)
        //{
        //    Dynamic.ReportEntity.Service.VehicleHistory dataColl = new VehicleHistory();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getVehicleHistory(DateFrom.Value, DateTo.Value, VehicleEntryId);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpPost]
        //public JsonNetResultWithEnum GetPendingInstallationList(DateTime? Date, DateTime? dateTo)
        //{
        //    Dynamic.ReportEntity.Service.JobCardComplainCollections dataColl = new JobCardComplainCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getInstallationPending(dateFrom.Value, dateTo.Value);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpPost]
        //public JsonNetResultWithEnum GetRepeatedComplainList(DateTime dateFrom, DateTime dateTo, int count, string Complaint)
        //{
        //    Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new JobCardListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).RepeatedComplain(User.UserId, dateFrom.Value, dateTo.Value, count, Complaint);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}


        //[HttpPost]
        //public JsonNetResultWithEnum GetJobCardDuesList(DateTime forDate, string Complaint, int FromDays = 55, int ToDays = 99)
        //{
        //    Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new JobCardListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardDuesList(User.UserId, forDate.Value, Complaint, FromDays, ToDays);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        public ActionResult VehicleList()
        {
            return View();

        }
        public ActionResult ServiceFeedbackList()
        {
            return View();
        }


        public ActionResult ServiceSpareParts()
        {
            return View();
        }

        public ActionResult ComplainInspectionList()
        {
            return View();
        }



        public ActionResult VehicleHistory()
        {
            return View();
        }


        public ActionResult PendingInstallation()
        {
            return View();
        }
        public ActionResult InstallationForFeedback()
        {
            return View();
        }

        public ActionResult FeedbackReport()
        {
            return View();
        }
        public ActionResult JobCardDuesList()
        {
            return View();
        }

        public ActionResult RepeatedComplainList()
        {
            return View();
        }

        public ActionResult JobCardDetail()
        {
            return View();
        }



    }
}