using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Finance.Controllers
{
    public class ReportController : PivotalERP.Controllers.BaseController
    {
        // GET: Finance/Report

        #region "LoanCreation"

        public ActionResult LoanCreation()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetLoanCreation(DateTime DateFrom, DateTime DateTo)
        {
            var dataColl = new Dynamic.Reporting.Finance.LoanCreation(User.HostName,User.DBName).getLoanCreation(DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

        #region "LoanCreation"

        public ActionResult LoanDetails()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetLoanDetails(DateTime DateFrom, DateTime DateTo)
        {
            var dataColl = new Dynamic.Reporting.Finance.LoanDetails(User.HostName,User.DBName).getLoanDetails(DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

        #region "LoanCreation"

        public ActionResult LoanMonthly()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetLoanMonthly(DateTime DateFrom, DateTime DateTo)
        {
            var dataColl = new Dynamic.Reporting.Finance.LoanDetails(User.HostName, User.DBName).getLoanMonthly(DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

    }
}