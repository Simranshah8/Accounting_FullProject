using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.Service.Controllers
{
    public class ReportingController : PivotalERP.Controllers.BaseController
    {
        string photoLocation = "/Attachments/service";
        public ActionResult DashBoard()
        {
            return View();
        }
        public ActionResult JobCardList()
        {
            return View();
        }

        public ActionResult JobCardStatus()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetJobHistory(string JobNo,int? BranchId,int? CostClassId)
        {
            Dynamic.ReportEntity.Service.VehicleHistory beData = new Dynamic.ReportEntity.Service.VehicleHistory();
            try
            {

                beData = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardHistory(User.UserId, JobNo,BranchId,CostClassId);

                return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }

        [HttpPost]
        public JsonNetResult GetDashboard(DateTime? dateFrom,DateTime? dateTo)
        {
            Dynamic.ReportEntity.Service.Dashboard beData = new Dynamic.ReportEntity.Service.Dashboard();
            try
            {

                beData = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getDashboard(User.UserId, dateFrom,dateTo);

                return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }

        [HttpGet]
        public JsonNetResult getJobCardByTranId(int tranId)
        {
            Dynamic.ReportEntity.Service.PrintJobCard beData = new Dynamic.ReportEntity.Service.PrintJobCard();
            try
            {
                beData = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardPrint(User.UserId, tranId);

                return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }
        [HttpPost]
        public JsonNetResult GetJobCardList(DateTime dateFrom,DateTime dateTo,int? ReportType)
        {
            Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardList(User.UserId, dateFrom, dateTo, ReportType);

                var newReturn = new
                {
                    DataColl=dataColl,
                    TotalOpen=dataColl.Where(p1=>p1.IsClosed==false).Count(),
                    TotalClose = dataColl.Where(p1 => p1.IsClosed == true).Count(),
                    TotalCancel = dataColl.Where(p1 => p1.IsCancel == true).Count(),
                };

                return new JsonNetResult() { Data = newReturn, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }
        [HttpPost]
        public JsonNetResult GetJobCardCallingRpt(int CallingType,DateTime? dateFrom,DateTime? dateTo)
        {
            Dynamic.ReportEntity.Service.JobCardCallingReportCollections dataColl = new Dynamic.ReportEntity.Service.JobCardCallingReportCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardCallingRpt(User.UserId,CallingType,dateFrom,dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        public ActionResult TicketList()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveClosedTicket()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.TicketClosed>(str);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Service.ServiceTicket(User.UserId, User.HostName, User.DBName).ClosedTicket(beData);
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
        [HttpPost]
        public JsonNetResult GetTicketList(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.ServiceTicketCollections dataColl = new Dynamic.ReportEntity.Service.ServiceTicketCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getTicketList(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpPost]
        public JsonNetResult GetJobCardDetails(int tranId,int vehicleEntryId)
        {
            Dynamic.ReportEntity.Service.JobCardList beData = new Dynamic.ReportEntity.Service.JobCardList();
            try
            {

                beData = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardDetails(User.UserId, tranId, vehicleEntryId);

                return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveFourthCall()
        {            
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.FourthCallFeedback>(str);
                if (beData != null)
                {
                    resVal= new Dynamic.BusinessLogic.Service.FourthCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveFifthCall()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.FifthCallFeedback>(str);
                if (beData != null)
                {
                    resVal = new Dynamic.BusinessLogic.Service.FifthCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveSixthCall()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.SixthCallFeedback>(str);
                if (beData != null)
                {
                    resVal = new Dynamic.BusinessLogic.Service.SixthCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveServiceReminder()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.ServiceReminderCallFeedback>(str);
                if (beData != null)
                {
                    resVal = new Dynamic.BusinessLogic.Service.ServiceReminderCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveRetainedCall()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.FifthCallFeedback>(str);
                if (beData != null)
                {
                    resVal = new Dynamic.BusinessLogic.Service.RetainedCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SavePotentialCall()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.FifthCallFeedback>(str);
                if (beData != null)
                {
                    resVal = new Dynamic.BusinessLogic.Service.PotentialCallFeedback(User.UserId, User.HostName, User.DBName).SaveModify(beData);
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

        public ActionResult FouthCallLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetFourthCallLog(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.FourthCallLogCollections dataColl = new Dynamic.ReportEntity.Service.FourthCallLogCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getFourthCallLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        public ActionResult FifthCallLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetFifthCallLog(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.FifthCallLogCollections dataColl = new Dynamic.ReportEntity.Service.FifthCallLogCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getFifthCallLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        public ActionResult SixthCallLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetSixthCallLog(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.SixthCallLogCollections dataColl = new Dynamic.ReportEntity.Service.SixthCallLogCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getSixthCallLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }











        public ActionResult JobforFeedback()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetJobforFeedbackList(DateTime? dateFrom, DateTime? dateTo, bool isCancel)
        {
            Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardList(User.UserId, dateFrom.Value, dateTo.Value, 0);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        [HttpPost]
        public JsonNetResultWithEnum GetVehicleList(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.VehicleEntryListCollections dataColl = new Dynamic.ReportEntity.Service.VehicleEntryListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getAllVehicleEntryCollections(User.UserId, dateFrom, dateTo);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResultWithEnum GetSparePartsList(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Service.JobCardSparePartsListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardSparePartsListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardSparePartsList(User.UserId, dateFrom, dateTo);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResultWithEnum GetComplainInspectionList(DateTime DateFrom, DateTime DateTo)
        {
            Dynamic.ReportEntity.Service.JobCardInspectionListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardInspectionListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardInspectionList(User.UserId, DateFrom, DateTo);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        //[HttpPost]
        //public JsonNetResultWithEnum GetVehicleHistory(DateTime DateFrom, DateTime DateTo, int VehicleEntryId)
        //{
        //    Dynamic.ReportEntity.Service.VehicleHistory dataColl =new Dynamic.ReportEntity.Service.VehicleHistory();
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
        //public JsonNetResultWithEnum GetPendingInstallationList(DateTime dateFrom, DateTime dateTo)
        //{
        //    Dynamic.ReportEntity.Service.JobCardComplainCollections dataColl = new Dynamic.ReportEntity.Service.JobCardComplainCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getInstallationPending(dateFrom, dateTo);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        [HttpPost]
        public JsonNetResultWithEnum GetRepeatedComplainList(DateTime dateFrom, DateTime dateTo, int count, string Complaint)
        {
            Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).RepeatedComplain(User.UserId, dateFrom, dateTo, count, Complaint);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResultWithEnum GetJobCardDuesList(DateTime forDate, string Complaint, int FromDays = 55, int ToDays = 99)
        {
            Dynamic.ReportEntity.Service.JobCardListCollections dataColl = new Dynamic.ReportEntity.Service.JobCardListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getJobCardDuesList(User.UserId, forDate, Complaint, FromDays, ToDays);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

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



        public ActionResult VehicleHistory(int? vtranId=null)
        {
            if (vtranId.HasValue)
                ViewBag.VTranId = vtranId.Value;
            else
                ViewBag.VTranId = 0;

            return View();
        }

        public ActionResult RdlVH()
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

        #region "Service Reminder"

        public ActionResult ServiceRemainder()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetJobCardForRemarks(int? BranchId, DateTime? DateFrom, DateTime? DateTo)
        {
            Dynamic.BusinessEntity.Service.JobCardCollections dbColl = new Dynamic.BusinessEntity.Service.JobCardCollections();
            try
            {
                dbColl = new Dynamic.BusinessLogic.Service.JobCard(User.HostName, User.DBName).getJobCardListForRemarks(User.UserId, DateFrom, DateTo, BranchId);
                return new JsonNetResult() { Data = dbColl, TotalCount = dbColl.Count, IsSuccess = dbColl.IsSuccess, ResponseMSG = dbColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dbColl.IsSuccess = false;
                dbColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dbColl, TotalCount = dbColl.Count, IsSuccess = dbColl.IsSuccess, ResponseMSG = dbColl.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult SaveJobCardRemarks()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardRemarks>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BusinessLogic.Service.JobCard(User.HostName, User.DBName).SaveRemarks(beData);
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


        [HttpPost]
        public JsonNetResult GetJobCardRemarksById(int TranId)
        {
            Dynamic.BusinessEntity.Service.JobCardRemarksCollections dataColl = new Dynamic.BusinessEntity.Service.JobCardRemarksCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.JobCard(User.HostName, User.DBName).GetJobCardRematks(User.UserId, TranId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion



        [HttpPost]
        public JsonNetResult SaveTransationComment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Service.TransactionComment>(Request["jsonData"]);
                if (beData != null)
                {

                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var attDoc = GetAttachmentDocuments(photoLocation, filesColl[0], true);
                        if (attDoc != null)
                            beData.Documentpath = attDoc.DocPath;
                    }

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Service.TransactionComment(User.UserId, User.HostName, User.DBName).SaveTransactionComment(beData);
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

        [HttpPost]
        public JsonNetResult GetTranCommentsbyId(int? VoucherId,int TranId)
        {
            Dynamic.BE.Service.TransactionCommentCollections dataColl = new Dynamic.BE.Service.TransactionCommentCollections();
            try
            {
                dataColl = new Dynamic.BL.Service.TransactionComment(User.UserId, User.HostName, User.DBName).GetTranCommentsbyId(VoucherId,TranId);
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