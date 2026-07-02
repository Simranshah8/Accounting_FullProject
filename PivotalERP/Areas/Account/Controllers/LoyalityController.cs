using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Account.Controllers
{
    public class LoyalityController : PivotalERP.Controllers.BaseController
    {
        // GET: Account/Loyality
        public ActionResult SalesSummary()
        {
            return View();
        }
        public ActionResult SalesDetail()
        {
            return View();
        }
        public ActionResult MembershipPointSummary()
        {
            return View();
        }
        public ActionResult MembershipLedger()
        {
            return View();
        }
        public ActionResult TopNMembers()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllMemSalesSummary(DateTime? DateFrom, DateTime? DateTo, int? BillingTypeId, bool? IsOpenPoint)
        {
            Dynamic.RE.Reporting.Account.MemSalesSummaryCollections dataColl = new Dynamic.RE.Reporting.Account.MemSalesSummaryCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.MemSalesSummary(User.UserId, User.HostName, User.DBName).GetAllMemSalesSummary(DateFrom, DateTo, BillingTypeId, IsOpenPoint);

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
        public JsonNetResultWithEnum GetAllMemSalesDetail(DateTime? DateFrom, DateTime? DateTo, int? BillingTypeId)
        {
            Dynamic.RE.Reporting.Account.MemSalesDetailCollections dataColl = new Dynamic.RE.Reporting.Account.MemSalesDetailCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.MemSalesDetail(User.UserId, User.HostName, User.DBName).GetAllMemSalesDetail(DateFrom, DateTo, BillingTypeId);

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
        public JsonNetResultWithEnum GetAllMemPointSummary(DateTime? DateFrom, DateTime? DateTo, bool? IsOpeningCredit)
        {
            Dynamic.RE.Reporting.Account.MemPointSummaryCollections dataColl = new Dynamic.RE.Reporting.Account.MemPointSummaryCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.MemPointSummary(User.UserId, User.HostName, User.DBName).GetAllMemPointSummary(DateFrom, DateTo, IsOpeningCredit);

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
        public JsonNetResultWithEnum GetAllMembershipLedger(DateTime? DateFrom, DateTime? DateTo, int? MembershipLedgerId)
        {
            Dynamic.RE.Reporting.Account.MembershipLedgerCollections dataColl = new Dynamic.RE.Reporting.Account.MembershipLedgerCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.MembershipLedger(User.UserId, User.HostName, User.DBName).GetAllMembershipLedger(DateFrom, DateTo, MembershipLedgerId);

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
        public JsonNetResultWithEnum GetAllTopNMembers(DateTime? DateFrom, DateTime? DateTo, int RowNo)
        {
            Dynamic.RE.Reporting.Account.TopNMembersCollections dataColl = new Dynamic.RE.Reporting.Account.TopNMembersCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.TopNMembers(User.UserId, User.HostName, User.DBName).GetAllTopNMembers(DateFrom, DateTo, RowNo);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region"Payment Mode List"
        [HttpPost]
        public JsonNetResultWithEnum GetAllPaymentMode()
        {
            Dynamic.BusinessEntity.Enquiry.PaymentModeCollections dataColl = new Dynamic.BusinessEntity.Enquiry.PaymentModeCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Enquiry.PaymentModeDB(User.HostName, User.DBName).getAllPaymentMode(User.UserId);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

    }
}