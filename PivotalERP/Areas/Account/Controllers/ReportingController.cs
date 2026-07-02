using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Dynamic.ReportEntity.Account;

namespace PivotalERP.Areas.Account.Controllers
{
    public class ReportingController : PivotalERP.Controllers.BaseController
    {
        // GET: Account/Reporting
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.DayBook, true)]
        public ActionResult DayBook()
        {
            ViewBag.Title = "Ledger List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.DayBook);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetDayBook(DateTime? dateFrom, DateTime? dateTo, int voucherType, bool isPost, int branchId)
        {
            Dynamic.ReportEntity.Account.DayBookCollections dataColl = new Dynamic.ReportEntity.Account.DayBookCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).getDayBook(dateFrom.Value, dateTo.Value, voucherType, true, branchId, User.UserId);

                if (dataColl.IsSuccess)
                {
                    dataColl = new Dynamic.ReportLogic.Account.DayBook(dataColl).getDayBook();
                }

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult DayBookSummary()
        {
            return View();
        }
        public ActionResult PharmacyDayBook()
        {
            return View();
        }
        public ActionResult PharmacySalesReturn()
        {
            return View();
        }
        public ActionResult DayBookSummaryOnly()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetDayBookSummary(DateTime? dateFrom, DateTime? dateTo, int voucherType)
        {
            Dynamic.ReportEntity.Account.DayBookCollections dataColl = new Dynamic.ReportEntity.Account.DayBookCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).getDayBookSummaryOnly(User.UserId, dateFrom.Value, dateTo.Value, voucherType, true);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult DayBookSummaryList()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetDayBookSummaryList(DateTime? dateFrom, DateTime? dateTo, int voucherType)
        {
            Dynamic.ReportEntity.Account.DayBookCollections dataColl = new Dynamic.ReportEntity.Account.DayBookCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).getDayBookSummary(User.UserId, dateFrom.Value, dateTo.Value, voucherType);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult ChequeBook()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResult GetAllLedgerFlow(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double OpeningAmt = 0;
        //    Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerFlow(User.UserId, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt);
        //    Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
        //    double currentClosing = OpeningAmt;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v.DrAmount - v.CrAmount;
        //        v.Closing = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

        //    double cl = OpeningAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = OpeningAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };
        //    return new JsonNetResult() { Data = returnVal };
        //}
        //[HttpPost]
        //public JsonNetResultWithEnum GetChequeBook(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double OpeningAmt = 0;
        //    Dynamic.ReportEntity.Account.ChequeBookCollections dataColl = new Dynamic.Reporting.Account.ChequeBook(User.HostName, User.DBName).getChequeBook(User.UserId, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt);

        //    Dynamic.ReportEntity.Account.ChequeBookCollections tmpDataColl = new Dynamic.ReportEntity.Account.ChequeBookCollections();
        //    double currentClosing = OpeningAmt;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v.DrAmount - v.CrAmount;
        //        v.Cl = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

        //    double cl = OpeningAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = OpeningAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };

        //}
        [HttpPost]
        public JsonNetResultWithEnum GetChequeBook(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.ChequeBookCollections dataColl = new Dynamic.ReportEntity.Account.ChequeBookCollections();

            try
            {
                dataColl = new Dynamic.Reporting.Account.ChequeBook(User.HostName, User.DBName).getChequeBook(User.UserId, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        public ActionResult Annex10()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAnnex10(DateTime? dateFrom, DateTime? dateTo, int voucherType)
        {
            Dynamic.ReportEntity.Account.Annex10Collections dataColl = new Dynamic.ReportEntity.Account.Annex10Collections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.Annex10(User.HostName, User.DBName).getAnnex10(User.UserId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult CancelVoucherSummary()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetCancelVoucherSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.CancelVoucherSummaryCollections dataColl = new Dynamic.ReportEntity.Account.CancelVoucherSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CancelVoucherSummary(User.HostName, User.DBName).getAllCancelVoucherList(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResult GetAllBranchList()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).getAll(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count(), IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }
        [HttpGet]
        public JsonNetResult GetAllLedgerList()
        {
            Dynamic.BusinessEntity.Account.LedgerCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllVoucherList()
        {
            Dynamic.BusinessEntity.Account.VoucherModeCollections dataColl = new Dynamic.BusinessEntity.Account.VoucherModeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }






        public ActionResult Ledger()
        {
            ViewBag.Title = "Ledger List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfLedger);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllLedger()
        {
            Dynamic.BusinessEntity.Account.LedgerCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerContactList()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllLedgerContactList()
        {
            Dynamic.ReportEntity.Account.LedgerContactListCollections dataColl = new Dynamic.ReportEntity.Account.LedgerContactListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.LedgerContactList(User.HostName, User.DBName).getAllLedgerContactList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        public ActionResult LedgerOpening()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllLedgerOpening()
        {
            Dynamic.ReportEntity.Account.LedgerOpeningDetailsCollections dataColl = new Dynamic.ReportEntity.Account.LedgerOpeningDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.LedgerOpeningDetails(User.HostName, User.DBName).getLedgerOpeningDetails(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        public ActionResult SubLedger()
        {

            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllSubLedger()
        {
            Dynamic.BusinessEntity.Account.CostCenterCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult Salesman()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllSalesman()
        {
            Dynamic.BusinessEntity.Account.AgentCollections dataColl = new Dynamic.BusinessEntity.Account.AgentCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult Area()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllArea()
        {
            Dynamic.BusinessEntity.Account.AreaMasterCollections dataColl = new Dynamic.BusinessEntity.Account.AreaMasterCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult Voucher()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllVoucher()
        {

            Dynamic.BusinessEntity.Account.VoucherModeCollections dataColl = new Dynamic.BusinessEntity.Account.VoucherModeCollections();
            try
            {


                dataColl = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult BankGuarantee()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResult GetAllBankGuarantee()
        {
            Dynamic.BusinessEntity.Account.BGDetailsCollections dataColl = new Dynamic.BusinessEntity.Account.BGDetailsCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.BGDetails(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult PostDatedCheque()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllPostDatedCheque()
        {
            Dynamic.BusinessEntity.Account.PDCCollections dataColl = new Dynamic.BusinessEntity.Account.PDCCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult OpenDatedCheque()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetAllOpenDatedCheque()
        {
            Dynamic.BusinessEntity.Account.PDCCollections dataColl = new Dynamic.BusinessEntity.Account.PDCCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "IELedgerOpening"

        public ActionResult IELedgerOpening()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResult GetAllIELedgerOpening()
        {
            Dynamic.ReportEntity.Account.IELedgerOpeningCollections dataColl = new Dynamic.ReportEntity.Account.IELedgerOpeningCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.Ledger(User.HostName, User.DBName).getAllLedgerIEOpening();
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

        #region "JournalOpening"

        public ActionResult JournalOpening()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResult GetAllJournalOpening()
        {
            Dynamic.ReportEntity.Account.JournalOpeningCollections dataColl = new Dynamic.ReportEntity.Account.JournalOpeningCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.Ledger(User.HostName, User.DBName).getAllJournalOpening();
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

        #region "JournalOpening"

        public ActionResult BillWise()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllBillWise(DateTime? dateFrom, DateTime? dateTo, int LedgerGroupId, int SalesLedgerId, string ledgerIdColl)
        {
            Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections dataColl = new Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.PartyWiseDuesBillList(User.HostName, User.DBName).getPartyWiseDuesBillCollections(User.UserId, dateFrom.Value, dateTo.Value, LedgerGroupId, SalesLedgerId, ledgerIdColl, false);
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

        public ActionResult BGDetails()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllBGDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.BGDetailsCollections dataColl = new Dynamic.ReportEntity.Account.BGDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.BGDetails(User.HostName, User.DBName).getBGDetails(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult TDSVat()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllTDSVat(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.TDSVatCollections dataColl = new Dynamic.ReportEntity.Account.TDSVatCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.TDSVat(User.HostName, User.DBName).getTDSVat(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult AccountConfirmationLetter()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAccountConfirmationLetter(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.AccountConfirmationLetterCollections dataColl = new Dynamic.ReportEntity.Account.AccountConfirmationLetterCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.AccountConfirmationLetter(User.HostName, User.DBName).getAccountConfirmation(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult CancelVoucherSummaryList()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllCancelVoucherSummaryList(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.CancelVoucherSummaryCollections dataColl = new Dynamic.ReportEntity.Account.CancelVoucherSummaryCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.CancelVoucherSummary(User.HostName, User.DBName).getAllCancelVoucherList(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult LedgerFlow()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllLedgerFlow(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerFlow(User.UserId, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt);
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            double currentClosing = OpeningAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmount - v.CrAmount;
                v.Closing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

            double cl = OpeningAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = OpeningAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        public ActionResult AreaClosingBalance()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAllAreaClosingBalance(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.AreaWiseClosingCollections dataColl = new Dynamic.ReportEntity.Account.AreaWiseClosingCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.AreaMaster(User.HostName, User.DBName).getAllAreaClosing(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult AreaMonthlySummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAreaMonthlySummary(int AreaId)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.AreaMaster(User.HostName, User.DBName).getAreaMonthlySummary(User.UserId, BaseDate.NepaliDate, AreaId, ref OpeningAmt);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult AreaDailySummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetAreaDailySummary(int AreaId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.AreaMaster(User.HostName, User.DBName).getAreaDailySummary(User.UserId, BaseDate.NepaliDate, AreaId, dateFrom.Value, dateTo.Value, ref OpeningAmt);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult BankReconciliation()
        {
            return View();
        }


        //[HttpPost]
        //public JsonNetResult GetBankReconciliation(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double OpeningAmt = 0;
        //    Dynamic.ReportEntity.Account.BankReconciliationCollections dataColl = new Dynamic.Reporting.Account.BankReconciliation(User.HostName, User.DBName).getBankReconciliation(User.UserId, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt);
        //    Dynamic.ReportEntity.Account.BankReconciliationCollections tmpDataColl = new Dynamic.ReportEntity.Account.BankReconciliationCollections();
        //    double currentClosing = OpeningAmt;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v.DrAmt - v.CrAmt;
        //        v.ClosingAmt = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

        //    double cl = OpeningAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = OpeningAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };
        //    return new JsonNetResult() { Data = returnVal };
        //}
        public ActionResult CostCenterOpeningDetails()
        {
            return View();
        }


        [HttpGet]
        public JsonNetResult GetAllCostCenterOpeningDetails()
        {
            Dynamic.ReportEntity.Account.CostCenterOpeningDetailsCollections dataColl = new Dynamic.ReportEntity.Account.CostCenterOpeningDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterOpening(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult Ledgerwise()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetLedgerTypeWiseSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.LedgerTypeWiseSummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerTypeWiseSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerTypeWiseSummary(User.HostName, User.DBName).getLedgerTypeWiseSummary(User.UserId, dateFrom.Value, dateTo.Value, true);
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
        //public JsonNetResultWithEnum GetGroupTypeWiseSummary(DateTime? dateFrom, DateTime? dateTo)
        //{
        //    Dynamic.ReportEntity.Account. dataColl = new Dynamic.ReportEntity.Account.LedgerTypeWiseSummaryCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.LedgerGroupMonthlySummary(User.HostName, User.DBName).getAllLedgerGroup(User.UserId);
        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}



        public ActionResult Groupwise()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetGroupwise(DateTime? fromDate, DateTime? toDate, int LedgerGroupId, string BranchIdColl)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.TrailBalanceSheet(User.HostName, User.DBName).getTrailBalance(fromDate.Value, toDate.Value, LedgerGroupId, BranchIdColl, User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult VoucherRegisterMonthly()
        {
            return View();
        }
        public ActionResult VoucherRegisterDaily()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetVoucherRegisterMonthly(DateTime? fromDate, DateTime? toDate, int LedgerGroupId, string BranchIdColl)
        //{
        //    Dynamic.ReportEntity.Account.Voucher dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.Vouch(User.HostName, User.DBName).getTrailBalance(fromDate.Value, toDate.Value, LedgerGroupId, BranchIdColl, User.UserId);
        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult CreditorDuesBillList()
        {
            return View();
        }
        public ActionResult PartyWiseDuesBillList()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetCreditorDuesBillList(DateTime? dateFrom, DateTime? dateTo, int LedgerGroupId, int SalesLedgerId, string ledgerIdColl)
        {
            Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections dataColl = new Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.PartyWiseDuesBillList(User.HostName, User.DBName).getPartyWiseDuesBillCollections(User.UserId, dateFrom.Value, dateTo.Value, LedgerGroupId, SalesLedgerId, ledgerIdColl);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerVoucher()
        {
            ViewBag.Title = "LedgerVoucher";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerVoucher);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerVoucher(DateTime dateFrom, DateTime dateTo, int ledgerId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            double OpeningPoint = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucher(User.UserId, BaseDate.NepaliDate, ledgerId, dateFrom, dateTo, ref openingAmt, ref OpeningPoint, true, false);

            Dynamic.ReportEntity.Account.LedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DebitAmt - v.CreditAmt;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DebitAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CreditAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        public ActionResult LedgerVoucherDetails()
        {
            ViewBag.Title = "LedgerVoucherDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerVoucherDetail);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerVoucherDetails(DateTime dateFrom, DateTime dateTo, int ledgerId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucherDetails(User.UserId, ledgerId, dateFrom, dateTo, ref OpeningAmt, false, false);

            Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections();
            double currentClosing = OpeningAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmount - v.CrAmount;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

            double cl = OpeningAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = OpeningAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }
        public ActionResult LedgerVoucherDetailsAsList()
        {
            ViewBag.Title = "LedgerVoucherDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerVoucherAsList);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerVoucherDetailsAsList(DateTime dateFrom, DateTime dateTo, int ledgerId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getDateWiseLedgerVoucher(User.UserId, ledgerId, dateFrom, dateTo, ref OpeningAmt);

            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();
            double currentClosing = OpeningAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.ClosingAmt = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = OpeningAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = OpeningAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }
        public ActionResult CashBankBookDetails()
        {
            ViewBag.Title = "CashBankBookDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerVoucherAsList);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetCashBankBookDetails(DateTime dateFrom, DateTime dateTo, int ledgerId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucherDetails(User.UserId, ledgerId, dateFrom, dateTo, ref OpeningAmt, false, false);

            Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherDetailsCollections();
            double currentClosing = OpeningAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmount - v.CrAmount;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

            double cl = OpeningAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = OpeningAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        public ActionResult CostCategoriesVoucher()
        {
            ViewBag.Title = "CostCategoriesVoucher";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerVoucherAsList);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetCostCategoriesVoucher(DateTime dateFrom, DateTime dateTo, int CostCategoriesId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.CostCenterVoucher(User.HostName, User.DBName).getCostCategoriesVoucher(User.UserId, CostCategoriesId, dateFrom, dateTo, ref OpeningAmt);

            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();
            double currentClosing = OpeningAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.ClosingAmt = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = OpeningAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = OpeningAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }
        public ActionResult MultipleLedgerDayBook()
        {
            ViewBag.Title = "MultipleLedgerDayBook";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.MultipleLedgerDayBookDetails);
            return View();
        }
        //[HttpPost]
        //public JsonNetResult GetMultipleLedgerDayBook(DateTime dateFrom, DateTime dateTo, string ledgerId)
        //{
        //    Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

        //    double OpeningAmt = 0;
        //    List<GroupDayBookDetails> dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getMultipleLedgerDayBookDetails(User.UserId, ledgerId, dateFrom, dateTo, ref OpeningAmt);

        //    List<GroupDayBookDetails> tmpDataColl = new List<GroupDayBookDetails>();
        //    double currentClosing = OpeningAmt;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v. - v.;
        //        v.c = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DrAmount);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CrAmount);

        //    double cl = OpeningAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = OpeningAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };
        //    return new JsonNetResult() { Data = returnVal };
        //}
        [HttpPost]
        public JsonNetResult PrintLedgerVoucher()
        {
            var jsonData = Request["jsonData"];
            List<Dynamic.ReportEntity.Account.LedgerVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.LedgerVoucher>>(jsonData);
            ResponeValues resVal = new ResponeValues();
            try
            {
                var key = Guid.NewGuid().ToString().Replace("-", "");
                Session.Add(key, paraData);
                resVal.ResponseId = key;
                resVal.IsSuccess = true;
                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        public ActionResult Branchwise()
        {
            return View();

        }
        [HttpPost]
        public JsonNetResultWithEnum GetBranchwise(DateTime? dateFrom, DateTime? dateTo, int legderGroupId, string BranchId)
        {
            Dynamic.ReportEntity.Account.BranchWiseTrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.BranchWiseTrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.BranchWiseTrailBalance(User.HostName, User.DBName).getBranchWiseTrailBalance(User.UserId, legderGroupId, dateFrom.Value, dateTo.Value, BranchId);
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
        //public JsonNetResultWithEnum GetProfitandLoss(DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double openingStock = 0; double closingStock = 0; double closingStockOpening = 0;
        //    Dynamic.ReportEntity.Account.ProfitAndLosssCollections dataColl = new Dynamic.ReportEntity.Account.ProfitAndLosssCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.ProfitAndLoss(User.HostName, User.DBName).getProfitAndLoss(User.UserId, dateFrom.Value, dateTo.Value, ref openingStock, ref closingStock, ref closingStockOpening);
        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult BalanceSheet()
        {
            return View();

        }
        public ActionResult BalanceSheetAsT()
        {
            return View();


        }
        public ActionResult ProfitAndLossAsT()
        {
            return View();

        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetBalanceSheet(DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double netprofitandlossOpening = 0; double netprofitandlossTransaction = 0;
        //    Dynamic.ReportEntity.Account.ProfitAndLosssCollections dataColl = new Dynamic.ReportEntity.Account.ProfitAndLosssCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.ProfitAndLoss(User.HostName, User.DBName).getBalanceSheet(User.UserId, dateFrom.Value, dateTo.Value, ref netprofitandlossOpening, ref netprofitandlossTransaction);
        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult TransactionSummary()
        {
            ViewBag.Title = "Ledger List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerGroupWiseTransactionSummary);
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetTransactionSummary(int legderGroupId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.LedgerTransactionSummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerTransactionSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerTransactionSummary(User.HostName, User.DBName).getLedgerTransactionSummary(User.UserId, legderGroupId, dateFrom.Value, dateTo.Value);
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
        public JsonNetResultWithEnum GetCostCenterWiseTrail(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterForTrailBalance(User.UserId, dateFrom.Value, dateTo.Value, LedgerId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult LedgerGroupWise()
        {
            return View();
        }
        public ActionResult TrailBalanceCostCenter()
        {
            return View();
        }

        public ActionResult SalesManVoucher()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetSalesManVoucher(DateTime dateFrom, DateTime dateTo, int AgentId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getSalesManVoucher(User.UserId, BaseDate.NepaliDate, AgentId, dateFrom, dateTo, ref openingAmt, false);

            Dynamic.ReportEntity.Account.LedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DebitAmt - v.CreditAmt;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DebitAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CreditAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        //[HttpGet]
        //public JsonNetResultWithEnum GetTrailBalanceCostCenter()
        //{
        //    Dynamic.ReportEntity.Account.CostCenterWiseTrailCollections dataColl = new Dynamic.ReportEntity.Account.CostCenterWiseTrailCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.LedgerWiseCostCenterVoucher(User.HostName, User.DBName).getLedgerWiseCostCenterVoucher(dateFrom.Value, dateTo.Value, voucherType, true, 0, User.UserId);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult ProfitAndLoss()
        {
            return View();
        }





        //[HttpPost]
        //public JsonNetResult GetLedgerVoucher(DateTime? dateFrom, DateTime? dateTo, int ledgerId)
        //{
        //    Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

        //    double openingAmt = 0;
        //    Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucher(User.UserId,BaseDate.NepaliDate, ledgerId, dateFrom.Value, dateTo.Value, ref openingAmt, true, false);

        //    Dynamic.ReportEntity.Account.LedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
        //    double currentClosing = openingAmt;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v.DebitAmt - v.CreditAmt;
        //        v.CurrentClosing = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DebitAmt);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CreditAmt);

        //    double cl = openingAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = openingAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };
        //    return new JsonNetResult() { Data = returnVal };
        //}


        public ActionResult MultipleLedger()
        {
            return View();
        }



        public ActionResult LedgerGroupVoucher()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerGroupVoucher(DateTime dateFrom, DateTime dateTo, int LedgerGroupId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerGroupMonthlySummary(User.HostName, User.DBName).getLedgerGroupVoucher(User.UserId, LedgerGroupId, dateFrom, dateTo, ref openingAmt);

            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.ClosingAmt = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }
        public ActionResult CostCenterVoucher()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetCostCenterVoucher(DateTime dateFrom, DateTime dateTo, int CostCenterId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.CostCenterVoucher(User.HostName, User.DBName).getCostCenterVoucher(User.UserId, CostCenterId, dateFrom, dateTo, ref openingAmt, false, 0);

            Dynamic.ReportEntity.Account.LedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DebitAmt - v.CreditAmt;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DebitAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CreditAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }
        public ActionResult CostCenterBreakupLedgerWise()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetCostCenterBreakupLedgerWise(DateTime dateFrom, DateTime dateTo, int CostCategoriesId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterBreakupLedgerWise(User.UserId, CostCategoriesId, dateFrom, dateTo, ref openingAmt);

            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections tmpDataColl = new Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.Closing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal , TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult getCostCenterBreakupLedgerWises(int CostCenterId, DateTime dateFrom, DateTime dateTo)
        {
            double openingAmt = 0;
            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections dataColl = new Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections();
            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections tmpDataColl = new Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterBreakupLedgerWise(User.UserId, CostCenterId, dateFrom, dateTo, ref openingAmt);
                double currentClosing = openingAmt;
                foreach (var v in dataColl)
                {
                    currentClosing += v.DrAmt - v.CrAmt;
                    v.Closing = currentClosing;
                    tmpDataColl.Add(v);
                }
                double drAmt = 0, crAmt = 0;
                drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
                crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

                double cl = openingAmt + drAmt - crAmt;

                var returnVal = new
                {
                    OpeningAmt = openingAmt,
                    DrAmt = drAmt,
                    CrAmt = crAmt,
                    ClosingAmt = cl,
                    DataColl = tmpDataColl
                };
                return new JsonNetResult() { Data = returnVal, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult LedgerBreakupCostCenterWise()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerBreakupCostCenterWise(string BranchIdColl, DateTime dateFrom, DateTime dateTo, int CostCategoriesId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getLedgerBreakupCostCenterWise(User.UserId, BranchIdColl, CostCategoriesId, dateFrom, dateTo, ref openingAmt);

            Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections tmpDataColl = new Dynamic.ReportEntity.Account.CostCenterBreakupLedgerWiseCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.Closing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        public ActionResult LedgerWiseCostCenterVoucher()
        {
            return View();
        }
        [HttpPost]
        //public JsonNetResult GetLedgerWiseCostCenterVoucher(DateTime dateFrom, DateTime dateTo, string LedgerIdColl = "", string CostCenterIdColl = "")
        //{
        //    ref LedgerWiseCostCenterOpeningCollections openingColl;
        //    Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;


        //    Dynamic.ReportEntity.Account.LedgerWiseCostCenterVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerWiseCostCenterVoucher(User.HostName, User.DBName).getLedgerWiseCostCenterVoucher(ref openingColl, User.UserId, dateFrom, dateTo);

        //    Dynamic.ReportEntity.Account.LedgerWiseCostCenterVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerWiseCostCenterVoucherCollections();
        //    double currentClosing = openingColl;
        //    foreach (var v in dataColl)
        //    {
        //        currentClosing += v.DrAmt - v.CrAmt;
        //        v.Closing = currentClosing;
        //        tmpDataColl.Add(v);
        //    }

        //    double drAmt = 0, crAmt = 0;
        //    drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
        //    crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

        //    double cl = openingAmt + drAmt - crAmt;

        //    var returnVal = new
        //    {
        //        OpeningAmt = openingAmt,
        //        DrAmt = drAmt,
        //        CrAmt = crAmt,
        //        ClosingAmt = cl,
        //        DataColl = tmpDataColl
        //    };
        //    return new JsonNetResult() { Data = returnVal };
        //}


        //[HttpPost]
        //public JsonNetResult GetSalesmanWiseLedgerVoucher(DateTime dateFrom, DateTime dateTo, string LedgerId)
        //{
        //    Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

        //    double openingAmt = 0;
        //    List<GroupDayBookDetails> dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getMultipleLedgerDayBookDetails(User.UserId,LedgerId, dateFrom, dateTo, ref openingAmt);

        //    Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();




        //}

        public ActionResult LedgerGroupDayBook()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLedgerGroupDayBook(DateTime dateFrom, DateTime dateTo, int LedgerGroupId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerGroupDayBook(User.UserId, LedgerGroupId, dateFrom, dateTo, ref openingAmt);

            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.ClosingAmt = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }





        #region "Cost Categories"

        public ActionResult CostCategories()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllProductCategories()
        {
            Dynamic.BusinessEntity.Account.CostCategoryCollections dataColl = new Dynamic.BusinessEntity.Account.CostCategoryCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Cost Class"

        public ActionResult CostClass()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllCostClass()
        {
            Dynamic.BusinessEntity.Account.CostClassCollections dataColl = new Dynamic.BusinessEntity.Account.CostClassCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.CostClass(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Cost Class"

        public ActionResult CostCenter()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllCostCenter()
        {
            Dynamic.BusinessEntity.Account.CostCenterCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Ledger Group"

        public ActionResult LedgerGroup()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllLedgerGroup()
        {
            Dynamic.BusinessEntity.Account.LedgerGroupCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerGroupCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "NarrationMaster"

        public ActionResult NarrationMaster()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllNarrationMaster()
        {
            Dynamic.BusinessEntity.Account.NarrationMasterCollections dataColl = new Dynamic.BusinessEntity.Account.NarrationMasterCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Currency"

        public ActionResult Currency()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllCurrency()
        {
            Dynamic.BusinessEntity.Account.CurrencyCollections dataColl = new Dynamic.BusinessEntity.Account.CurrencyCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.Currency(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        #region "CurrencyRate"

        public ActionResult CurrencyRate()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllCurrencyRate()
        {
            Dynamic.BusinessEntity.Account.CurrencyRateCollections dataColl = new Dynamic.BusinessEntity.Account.CurrencyRateCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.CurrencyRate(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Voucher Mode"

        public ActionResult VoucherMode()
        {
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllVoucherMode()
        {
            Dynamic.BusinessEntity.Account.VoucherModeCollections dataColl = new Dynamic.BusinessEntity.Account.VoucherModeCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult RemitDetails()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllRemitDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.RemitDetailsCollections dataColl = new Dynamic.ReportEntity.Account.RemitDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.RemitDetails(User.HostName, User.DBName).getRemitDetails(User.UserId, dateFrom.Value, dateTo.Value);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerVoucherAsList()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetLedgerVoucherAsList(int LedgerId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            double OpeningPoint = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucher(User.UserId, BaseDate.NepaliDate, LedgerId, dateFrom.Value, dateTo.Value, ref OpeningAmt, ref OpeningPoint, false,false);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult PendingDayBook()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllPendingDayBook(DateTime? dateFrom, DateTime? dateTo, int VoucherType)
        {
            Dynamic.ReportEntity.Account.PendingDayBookCollections dataColl = new Dynamic.ReportEntity.Account.PendingDayBookCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).getPendingDayBook(User.UserId, dateFrom.Value, dateTo.Value, VoucherType, true);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult StatisticVoucher()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllStatisticVoucher(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.StatisticVoucherCollections dataColl = new Dynamic.ReportEntity.Account.StatisticVoucherCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.StatisticVoucher(User.HostName, User.DBName).getStatisticsVoucher(User.UserId, dateFrom.Value, dateTo.Value);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult StatutoryReports()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetStatutoryReports(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.LedgerTypeWiseSummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerTypeWiseSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerTypeWiseSummary(User.HostName, User.DBName).getLedgerTypeWiseSummary(User.UserId, dateFrom.Value, dateTo.Value, true);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerCurrentStatus()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetLedgerCurrentStatus(DateTime? dateFrom, DateTime? dateTo, int LedgerId)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.TrailBalanceSheet(User.HostName, User.DBName).getBranchWiseLedgerStatus(dateFrom.Value, dateTo.Value, LedgerId, User.UserId);



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
        public JsonNetResultWithEnum getBranchWiseLedgerStatus(DateTime dateFrom, DateTime dateTo, int LedgerId)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.TrailBalanceSheet(User.HostName, User.DBName).getBranchWiseLedgerStatus(dateFrom, dateTo, LedgerId, User.UserId);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult SalesVatRegister()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetSalesVatRegister(DateTime? dateFrom, DateTime? dateTo, int VoucherId, int BranchId)
        {
            Dynamic.ReportEntity.Account.NewSalesVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewSalesVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getSalesVatRegister(User.UserId, dateFrom.Value, dateTo.Value, VoucherId, BranchId);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerMonthlySummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetLedgerMonthlySummary(int LedgerId, string BranchIdColl, DateTime? startDate, DateTime? endDate)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerMonthlySummary(User.UserId, BaseDate.NepaliDate, LedgerId, BranchIdColl, ref OpeningAmt, startDate.Value, endDate.Value);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult LedgerDailySummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetLedgerDailySummary(int LedgerId, string BranchIdColl, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerDailySummary(User.UserId, LedgerId, BranchIdColl, dateFrom.Value, dateTo.Value, ref OpeningAmt, BaseDate.NepaliDate);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult PurchaseVatRegister()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseVatRegister(DateTime? dateFrom, DateTime? dateTo, int VoucherId = 0, int BranchId = 0)
        {
            Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getPurchaseVatRegister(User.UserId, dateFrom.Value, dateTo.Value, VoucherId, BranchId);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult StatisticVoucherMonthly()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllStatisticVoucherMonthly(int VoucherId, int VoucherType)
        {
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.StatisticVoucher(User.HostName, User.DBName).getVoucherMonthlySummary(User.UserId, VoucherId, VoucherType);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult StatisticVoucherDaily()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllStatisticVoucherDaily(int VoucherId, int VoucherType, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.StatisticVoucher(User.HostName, User.DBName).getLedgerGroupDailySummary(User.UserId, VoucherId, VoucherType, dateFrom.Value, dateTo.Value, true);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult BillsReceivable()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetBillsReceivable(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.BillsReceivableCollections dataColl = new Dynamic.ReportEntity.Account.BillsReceivableCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.BillsReceivable(User.HostName, User.DBName).getBillsReceivable(User.UserId, true, dateFrom.Value, dateTo.Value);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult BillsPayable()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetBillsPayable(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.BillsReceivableCollections dataColl = new Dynamic.ReportEntity.Account.BillsReceivableCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.BillsReceivable(User.HostName, User.DBName).getBillsPayable(User.UserId, true, dateFrom.Value, dateTo.Value);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult BillsReceivableSummary()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetBillsReceivableSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.BillsReceivableCollections dataColl = new Dynamic.ReportEntity.Account.BillsReceivableCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.BillsReceivable(User.HostName, User.DBName).getBillsReceivableSummary(User.UserId, dateFrom.Value, dateTo.Value);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult InterestCalculationLedgerWise()
        {
            return View();
        }
        public ActionResult InterestCalculationLedgerGroupWise()
        {
            return View();
        }
        public ActionResult InterestCalculationCostCenterWise()
        {
            return View();
        }
        public ActionResult InterestCalculationCostCategoriesWise()
        {
            return View();
        }
        public ActionResult InterestCalculationLedgerWiseAfterDays()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetInterestCalculationLedgerWise(DateTime? dateFrom, DateTime? dateTo)
        //{
        //    Dynamic.ReportEntity.Account.BillsReceivableCollections dataColl = new Dynamic.ReportEntity.Account.BillsReceivableCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Account.BillsReceivable(User.HostName, User.DBName).getBillsReceivableSummary(User.UserId, dateFrom.Value, dateTo.Value);



        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}



        #endregion


        #region "Cash And Bank Book"
        public ActionResult CashAndBankBook()
        {
            ViewBag.Title = "CashAndBankBook";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CashAndBankBook);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllCashAndBankBook(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.TrailBalanceSheet(User.HostName, User.DBName).getCashAndBankBook(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "Cash And Bank Book LedgerWise"
        public ActionResult CashAndBankBookLedgerWise()
        {
            ViewBag.Title = "CashAndBankBookLedgerWise";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CashAndBankBookLedgerWise);
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllCashAndBankBookLedgerWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.TrailBalanceSheet(User.HostName, User.DBName).getCashAndBankBookLedgerWise(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "Cash and Bank Book Details"
        public ActionResult CashAndBankBookDetails()
        {
            ViewBag.Title = "CashAndBankBookDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CashBankBookLedgerDetails);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetCashAndBankBookDetails(DateTime dateFrom, DateTime dateTo, int ledgerId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            double OpeningPoint = 0;
            Dynamic.ReportEntity.Account.LedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerVoucher(User.UserId, BaseDate.NepaliDate, ledgerId, dateFrom, dateTo, ref openingAmt,ref OpeningPoint,true, false);

            Dynamic.ReportEntity.Account.LedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.LedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DebitAmt - v.CreditAmt;
                v.CurrentClosing = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DebitAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CreditAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }

        //[HttpPost]
        //public JsonNetResult PrintLedgerVoucher()
        //{
        //    var jsonData = Request["jsonData"];
        //    List<Dynamic.ReportEntity.Account.LedgerVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.LedgerVoucher>>(jsonData);
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        var key = Guid.NewGuid().ToString().Replace("-", "");
        //        Session.Add(key, paraData);
        //        resVal.ResponseId = key;
        //        resVal.IsSuccess = true;
        //        return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        #endregion
        #region "Cheque Book Summary"
        public ActionResult ChequeBookSummary()
        {
            ViewBag.Title = "ChequeBookSummary";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ChequeBookSummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllChequeBookSummary(int LedgerId, DateTime? dateFrom, DateTime? dateTo, string VoucherIdColl, string BranchIdColl)
        {
            Dynamic.ReportEntity.Account.ChequeBookSummaryCollections dataColl = new Dynamic.ReportEntity.Account.ChequeBookSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.ChequeBook(User.HostName, User.DBName).getChequeBookSummary(LedgerId, User.UserId, dateFrom.Value, dateTo.Value, VoucherIdColl, BranchIdColl, true);
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

        #region "Cheque Details List"
        public ActionResult ChequeDetailsList()
        {
            ViewBag.Title = "ChequeDetailsList";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ChequeDetailsList);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllChequeDetailsList(DateTime? dateFrom, DateTime? dateTo, int ReportType)
        {
            Dynamic.ReportEntity.Account.ChequeDetailsCollections dataColl = new Dynamic.ReportEntity.Account.ChequeDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.ChequeBook(User.HostName, User.DBName).getChequeDetails(User.UserId, dateFrom.Value, dateTo.Value, ReportType);
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
        #region 'LedgerMonthly"
        public ActionResult LedgerMonthly()
        {
            ViewBag.Title = "LedgerMonthly";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerMonthlySummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllLedgerMonthlySummary(int LedgerId, string BranchIdColl, DateTime? startDate, DateTime? endDate)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerMonthlySummary(User.UserId, BaseDate.NepaliDate, LedgerId, BranchIdColl, ref OpeningAmt, startDate.Value, endDate.Value);
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
        #region "Ledger Daily Summary"
        public ActionResult LedgerDaily()
        {
            ViewBag.Title = "LedgerDaily";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerDailySummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllLedgerDailySummary(int LedgerId, string BranchIdColl, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerSummary(User.HostName, User.DBName).getLedgerDailySummary(User.UserId, LedgerId, BranchIdColl, dateFrom.Value, dateTo.Value, ref OpeningAmt, BaseDate.NepaliDate);
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
        #region "ledger group Summary"
        public ActionResult LedgerGroupSummary()
        {
            return View();
        }
        #endregion
        #region "Ledger Group Monthly"
        public ActionResult LedgerGroupMonthly()
        {
            ViewBag.Title = "LedgerGroupMonthly";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerGroupMonthlySummary);
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllLedgerGroupMonthlySummary(int LedgerGroupId)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerGroupMonthlySummary(User.HostName, User.DBName).getLedgerGroupMonthlySummary(User.UserId, BaseDate.NepaliDate, LedgerGroupId, ref OpeningAmt);
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

        #region "Ledger Group Daily"
        public ActionResult LedgerGroupDaily()
        {
            ViewBag.Title = "LedgerGroupDaily";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.LedgerGroupDailySummary);
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllLedgerGroupDailySummary(int LedgerGroupId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.LedgerGroupMonthlySummary(User.HostName, User.DBName).getLedgerGroupDailySummary(User.UserId, LedgerGroupId, dateFrom.Value, dateTo.Value, ref OpeningAmt, BaseDate.NepaliDate);
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
        #region "COST CENTER"

        #region "CostCenter Summary"
        public ActionResult CostCenterSummary()
        {
            ViewBag.Title = "CostCenterSummary";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCenterClosingBalance);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCenterClosing(DateTime? fromDate, DateTime? toDate, int LedgerId, string LedgerCode = "")
        {

            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterClosingBalance(User.UserId, fromDate.Value, toDate.Value, LedgerId, LedgerCode);
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



        #region "CostCenter Monthly"
        public ActionResult CostCenterMonthly()
        {
            ViewBag.Title = "CostCenterMonthly";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCenterMonthlySummary);

            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCenterMonthly(int CostCenterId)

        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterMonthlySummary(User.UserId, BaseDate.NepaliDate, CostCenterId, ref OpeningAmt);
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

        #region "Cost Center Daily"
        public ActionResult CostCenterDaily()
        {
            ViewBag.Title = "CostCenterDaily";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCenterDailySummary);

            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCenterDaily(int CostCenterId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterDailySummary(User.UserId, CostCenterId, dateFrom.Value, dateTo.Value, ref OpeningAmt, BaseDate.NepaliDate);
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

        #endregion
        #region "COST CATEGORIES"

        #region "CostCategories Summary"
        public ActionResult CostCategoriesSummary()
        {
            ViewBag.Title = "CostCategoriesSummary";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCenterClosingBalance);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetCostCategoriesSummary(int CostCategoriesId, DateTime? dateFrom, DateTime? dateTo)
        {

            Dynamic.ReportEntity.Account.CostCategoriesSummaryCollections dataColl = new Dynamic.ReportEntity.Account.CostCategoriesSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCategoriesSummary(User.UserId, CostCategoriesId, dateFrom.Value, dateTo.Value);
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

        #region "AllCostCategoriesSummary"
        public ActionResult AllCostCategoriesSummary()
        {
            ViewBag.Title = "AllCostCategoriesSummary";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.AllCostCategorySummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCategoriesSummary(DateTime? dateFrom, DateTime? dateTo)
        {

            Dynamic.ReportEntity.Account.CostCategoriesSummaryCollections dataColl = new Dynamic.ReportEntity.Account.CostCategoriesSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getAllCostCategoriesSummary(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "CostCategories Monthly"
        public ActionResult CostCategoriesMonthly()
        {
            ViewBag.Title = "CostCategoriesMonthly";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCategoriesMonthlySummary);

            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCategoriesMonthlySummary(int CostCategoriesId)

        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCategoriesMonthlySummary(User.UserId, BaseDate.NepaliDate, CostCategoriesId, ref OpeningAmt);
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

        #region "Cost Categories Daily"
        public ActionResult CostCategoriesDaily()
        {
            ViewBag.Title = "CostCategoriesDaily";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCategoriesDailySummary);

            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCategoriesDailySummary(int CostCategoriesId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCategoriesDailySummary(User.UserId, CostCategoriesId, dateFrom.Value, dateTo.Value, ref OpeningAmt, BaseDate.NepaliDate);
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

        #region "Cost Categories Details"
        public ActionResult CostCategoriesDetails()
        {
            ViewBag.Title = "CostCategoriesDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CostCategoriesDetails);

            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllCostCategoriesDetails(DateTime? dateFrom, DateTime? dateTo)
        {

            Dynamic.ReportEntity.Account.CostCategoriesDetailsCollections dataColl = new Dynamic.ReportEntity.Account.CostCategoriesDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCategoriesDetails(User.UserId, dateFrom.Value, dateTo.Value);
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

        #endregion
        #region "SALESMAN REPORT"

        #region "SALESMAN CLOSING"
        public ActionResult SalesManClosing()
        {
            ViewBag.Title = "SalesManClosing";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.SalesManClosingBalance);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllSalesManClosing(DateTime? fromDate, DateTime? toDate)
        {

            Dynamic.ReportEntity.Account.TrailBalanceCollections dataColl = new Dynamic.ReportEntity.Account.TrailBalanceCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.SalesMan(User.HostName, User.DBName).getSalesManClosingBalance(User.UserId, fromDate.Value, toDate.Value);
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

        #region "SALESMAN DAILY"
        public ActionResult SalesManDaily()
        {
            ViewBag.Title = "SalesManDaily";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.SalesManDailySummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllSalesManDaily(int AgentId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.SalesMan(User.HostName, User.DBName).getSalesManDailySummary1(AgentId, dateFrom.Value, dateTo.Value, User.UserId, ref OpeningAmt);
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

        #region "SALESMAN MONTHLY"
        public ActionResult SalesManMonthly()
        {
            ViewBag.Title = "SalesManMonthly";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.SalesManMonthlySummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllSalesManMonthly(int AgentId)
        {
            double OpeningAmt = 0;
            Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Account.LedgerMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.SalesMan(User.HostName, User.DBName).getSalesManMonthlySummary(User.UserId, BaseDate.NepaliDate, AgentId, ref OpeningAmt);
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

        #region "SALESMAN COMMISSION"
        public ActionResult SalesManCommission()
        {
            ViewBag.Title = "SalesManCommission";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.SalesManCommissionSummary);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllSalesManCommission(DateTime? fromDate, DateTime? toDate)
        {

            Dynamic.ReportEntity.Account.SalesManCommissionCollections dataColl = new Dynamic.ReportEntity.Account.SalesManCommissionCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.SalesMan(User.HostName, User.DBName).getSalesManCommissionSummary(User.UserId, fromDate.Value, toDate.Value);
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

        #endregion
        [HttpGet]
        public JsonNetResult GetAllAgentList()
        {
            Dynamic.BusinessEntity.Account.AgentCollections dataColl = new Dynamic.BusinessEntity.Account.AgentCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllCostCenterList()
        {
            Dynamic.BusinessEntity.Account.CostCenterCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllCostCategoriesList()
        {
            Dynamic.BusinessEntity.Account.CostCategoryCollections dataColl = new Dynamic.BusinessEntity.Account.CostCategoryCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult SalesmanWiseLedgerVoucher()
        {
            return View();
        }
        public ActionResult DateWiseLedgerGroupVoucher()
        {
            return View();
        }

        public ActionResult PharmacyLedgerVoucher()
        {
            return View();
        }
        public ActionResult IncomeExpenditure()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetDateWiseLedgerGroupVoucher(DateTime dateFrom, DateTime dateTo, int LedgerGroupId)
        {
            Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser = User;

            double openingAmt = 0;
            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections dataColl = new Dynamic.Reporting.Account.LedgerGroupMonthlySummary(User.HostName, User.DBName).getLedgerGroupVoucher(User.UserId, LedgerGroupId, dateFrom, dateTo, ref openingAmt);

            Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections tmpDataColl = new Dynamic.ReportEntity.Account.DateWiseLedgerVoucherCollections();
            double currentClosing = openingAmt;
            foreach (var v in dataColl)
            {
                currentClosing += v.DrAmt - v.CrAmt;
                v.ClosingAmt = currentClosing;
                tmpDataColl.Add(v);
            }

            double drAmt = 0, crAmt = 0;
            drAmt = tmpDataColl.Sum(p1 => p1.DrAmt);
            crAmt = tmpDataColl.Sum(p1 => p1.CrAmt);

            double cl = openingAmt + drAmt - crAmt;

            var returnVal = new
            {
                OpeningAmt = openingAmt,
                DrAmt = drAmt,
                CrAmt = crAmt,
                ClosingAmt = cl,
                DataColl = tmpDataColl
            };
            return new JsonNetResult() { Data = returnVal };
        }


        public ActionResult OneLakhAbovePurchase()
        {
            return View();
        }

        public ActionResult BudgetReporting()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.CancelVouchersList, true)]
        public ActionResult CancelDayBook()
        {
            ViewBag.Title = "CancelDayBook";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CancelVouchersList);
            return View();
        }


        #region "CostCenter Analysis 

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.CostCenterAnalysis, true)]
        public ActionResult CostCenterAnalysis()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetCostCenterAnalysis(DateTime dateFrom, DateTime dateTo, int? branchId, int? ledgerId, int? costCenterId)
        {
            Dynamic.ReportEntity.Account.CostCenterAnalysisCollections dataColl = new Dynamic.ReportEntity.Account.CostCenterAnalysisCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Account.CostCenter(User.HostName, User.DBName).getCostCenterAnalysis(User.UserId, dateFrom, dateTo, branchId, ledgerId, costCenterId);
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

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.ExciseRegister, true)]
        public ActionResult ExciseRegister()
        {
            return View();
        }
        public ActionResult PurchaseReturnVatRegister()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseReturnVatRegister(DateTime dateFrom, DateTime dateTo, int VoucherId = 0, int BranchId = 0, int ReportType = 1)
        {
            Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getPurchaseReturnVatRegister(User.UserId, dateFrom, dateTo, VoucherId, BranchId, ReportType);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult SalesReturnVatRegister()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetSalesReturnVatRegister(DateTime? dateFrom, DateTime? dateTo, int VoucherId, int BranchId, int ReportType = 1)
        {
            Dynamic.ReportEntity.Account.NewSalesVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewSalesVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getSalesReturnVatRegister(User.UserId, dateFrom.Value, dateTo.Value, VoucherId, BranchId, ReportType);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult OneLakhAboveSales()
        {
            return View();
        }

        public ActionResult SalesDashboard()

        {
            return View();
        }


        #region "NEW STOCK REPORT"

        public ActionResult NewStockReport()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllNewStockReporting(int? ProductGroupId, int? GodownId, DateTime? DateFrom, DateTime? DateTo)
        {
            Dynamic.RE.Reporting.Account.NewStockReportingCollections dataColl = new Dynamic.RE.Reporting.Account.NewStockReportingCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.NewStockReporting(User.UserId, User.HostName, User.DBName).GetAllNewStockReporting(ProductGroupId, GodownId, DateFrom, DateTo);

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

        #region "NEW T.B."

        public ActionResult NewTB()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllNewTB(int? LedgerGroupId, int? ReportType, DateTime? DateFrom, DateTime? DateTo, int? ForBranchId, string BranchIdColl)
        {
            Dynamic.RE.Reporting.Account.NewTBCollections dataColl = new Dynamic.RE.Reporting.Account.NewTBCollections();
            try
            {
                dataColl = new Dynamic.BL.Reporting.Account.NewTB(User.UserId, User.HostName, User.DBName).GetAllNewTB(LedgerGroupId, ReportType, DateFrom, DateTo, ForBranchId, BranchIdColl);

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


        public ActionResult StockDashboard()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetBudgetSummary(string BranchIdColl, DateTime? DateFrom, DateTime? DateTo, int? CostClassId, int? DateType)
        {
            Dynamic.BE.Report.BudgetReportingCollections dataColl = new Dynamic.BE.Report.BudgetReportingCollections();
            try
            {
                dataColl = new Dynamic.BL.Report.BudgetReporting(User.UserId, User.HostName, User.DBName).GetBudgetSummary(BranchIdColl, DateFrom, DateTo, 1, DateType);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetSalesDashboard()
        {
            Dynamic.BE.Dashboard.SalesDashboard dataColl = new Dynamic.BE.Dashboard.SalesDashboard();
            try
            {
                dataColl = new Dynamic.BL.Dashboard.SalesDashboard(User.UserId, User.HostName, User.DBName).GetSalesDashboard();
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult DairyLedgerVoucher()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetDairyLedgerVoucher(int? ledgerId,DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.RE.Reporting.Account.DairyLedgerVoucherCollections dataColl = new Dynamic.RE.Reporting.Account.DairyLedgerVoucherCollections();
            try
            {
                double openingAmt = 0;
                dataColl = new Dynamic.BL.Report.DairyLedgerVoucher(User.UserId, User.HostName, User.DBName).GetDailyLedgerVoucher(BaseDate.NepaliDate, ledgerId, dateFrom, dateTo, ref openingAmt, true, false);
                double currentClosing = openingAmt;
               
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPartyWiseDuesBillList(DateTime? dateFrom, DateTime? dateTo, int LedgerGroupId, string ledgerIdColl, bool isCreditor, string branchIdColl)
        {
            Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections dataColl = new Dynamic.ReportEntity.Account.PartyWiseDuesBillListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Account.PartyWiseDuesBillList(User.HostName, User.DBName).getPartyWiseDuesBillCollections(User.UserId, dateFrom.Value, dateTo.Value, LedgerGroupId, 0, ledgerIdColl, isCreditor, branchIdColl);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        //added by yubaraj

        public ActionResult BudgetSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetBudgetSummaryReport(DateTime? DateFrom, DateTime? DateTo)
        {
            var dataColl = new Dynamic.BL.Report.BudgetSummary(User.UserId, User.HostName, User.DBName).GetBudgetSummary(0, DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
    }


}
