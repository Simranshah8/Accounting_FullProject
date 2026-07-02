using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BE;
using Dynamic.BL;
using Dynamic.DA;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.HR.Controllers
{
    public class ExpensesController : PivotalERP.Controllers.BaseController
    {
        string photoLocation = "/Attachments/Expenses";
        // GET: Expense/Transaction        
        public ActionResult ExpenseClaim()
        {
            return View();
        }
        public ActionResult ExpenseDetail()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveExpenseClaim()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Expense.TranExpenseClaim>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.DocumentColl;
                    var tmpfileColl = beData.DetailsColl;
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;

                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);

                                if (att != null)
                                {
                                    beData.DocumentColl.Add
                                     (
                                      new Dynamic.BusinessEntity.GeneralDocument()
                                      {
                                          Data = att.Data,
                                          DocPath = att.DocPath,
                                          DocumentTypeId = v.DocumentTypeId,
                                          Extension = att.Extension,
                                          Name = v.Name,
                                          Description = v.Description
                                      }
                                     );
                                }
                            }
                            fInd++;
                        }
                        if (tmpfileColl != null)
                        {
                            foreach (var rs in tmpfileColl)
                            {
                                if (rs.ExpenseCategoryId.HasValue)
                                {
                                    var fn = "file2" + rs.ExpenseCategoryId.ToString();
                                    var newDoc = filesColl[fn];
                                    if (newDoc != null)
                                    {
                                        var attD = GetAttachmentDocuments(photoLocation, newDoc, true);
                                        rs.ReciptImage = attD.DocPath;
                                    }
                                }
                            }
                        }
                    }

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
 

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Expense.TranExpenseClaim(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllExpClaim(DateTime? DateFrom, DateTime? DateTo, int? EmployeeId, int? StatusId)
        {
            Dynamic.BE.Expense.TranExpenseClaimCollections dataColl = new Dynamic.BE.Expense.TranExpenseClaimCollections();
            try
            {
                dataColl = new Dynamic.BL.Expense.TranExpenseClaim(User.UserId, User.HostName, User.DBName).GetAllTranExpenseClaim(0, DateFrom, DateTo, EmployeeId, StatusId);
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
        public JsonNetResult UpdateStatus()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Expense.TranExpenseClaim>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    beData.StatusBy = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Expense.TranExpenseClaim(User.UserId, User.HostName, User.DBName).UpdateStatus(beData);
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
        public JsonNetResult GetTranExpenseClaimById(int TranId)
        {
            Dynamic.BE.Expense.TranExpenseClaim resVal = new Dynamic.BE.Expense.TranExpenseClaim();
            try
            {
                resVal = new Dynamic.BL.Expense.TranExpenseClaim(User.UserId, User.HostName, User.DBName).GetTranExpenseClaimById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult UpdateAcClearance()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Expense.TranExpenseClaim>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    beData.AcClearanceBy = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Expense.TranExpenseClaim(User.UserId, User.HostName, User.DBName).UpdateAcClearance(beData);
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

        #region "TravelMode"
        public ActionResult TravelMode()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveTravelMode()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Expense.TravelMode>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TravelModeId.HasValue)
                        beData.TravelModeId = 0;

                    resVal = new Dynamic.BL.Expense.TravelMode(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllTravelMode()
        {
            var dataColl = new Dynamic.BL.Expense.TravelMode(User.UserId, User.HostName, User.DBName).GetAllTravelMode(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]

        public JsonNetResult GetTravelModeById(int TravelModeId)
        {
            var dataColl = new Dynamic.BL.Expense.TravelMode(User.UserId, User.HostName, User.DBName).GetTravelModeById(0, TravelModeId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelTravelMode(int TravelModeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Expense.TravelMode(User.UserId, User.HostName, User.DBName).DeleteById(0, TravelModeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "MonthlyExpenseSummary"
        public ActionResult MonthlyExpenseSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetMonthlyExpenseSummary(DateTime? DateFrom, DateTime? DateTo, int? EmployeeId)
        {
            Dynamic.RE.Expense.MonthlyExpenseSummary resVal = new Dynamic.RE.Expense.MonthlyExpenseSummary();
            try
            {
                resVal = new Dynamic.BL.Expense.MonthlyExpenseSummary(User.UserId, User.HostName, User.DBName).GetMonthlyExpenseSummary(DateFrom, DateTo, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

    }
}