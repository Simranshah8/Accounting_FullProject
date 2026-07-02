using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Expense.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
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
                    bool isModify = false;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    else if (beData.TranId > 0)
                        isModify = true;

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
        public JsonNetResult GetAllExpClaim(DateTime? DateFrom, DateTime? DateTo,int? EmployeeId,int? StatusId)
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


    }
}