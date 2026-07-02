using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;

namespace PivotalERP.Areas.Account.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
    {

        #region "Receipt"

        public ActionResult Receipt(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Receipt);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Receipt);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateReceipt()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Transaction.Journal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        for (int fi = 0; fi < Request.Files.Count; fi++)
                        {
                            HttpPostedFileBase file = Request.Files["file" + fi];
                            if (file != null)
                            {
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/receipt", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    bool isModify = false;

                    if (beData.TranId > 0)
                    {
                        isModify = true;
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt).ModifyFormData(beData);
                    }
                    else
                    {
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt).SaveFormData(beData);
                    }


                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.TranId : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Receipt;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Amount.ToString("N") : "New " + auditLog.EntityId.ToString()) + beData.Amount.ToString("N");
                        auditLog.AutoManualNo = IsNullStr(beData.AutoManualNo);
                        SaveAuditLog(auditLog);
                    }

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

        //[HttpPost]
        //public JsonNetResult GetReceiptById(int tranId)
        //{
        //    var tranBL = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt);
        //    var beData = tranBL.getJournalByTranId(tranId);


        //    return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        //}


        #endregion

        #region "Payment"

        public ActionResult Payment(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Payment);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Payment);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdatePayment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Transaction.Journal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        for (int fi = 0; fi < Request.Files.Count; fi++)
                        {
                            HttpPostedFileBase file = Request.Files["file" + fi];
                            if (file != null)
                            {
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/payment", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    bool isModify = false;
                    if (beData.TranId > 0)
                    {
                        isModify = true;
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment).ModifyFormData(beData);
                    }
                    else
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment).SaveFormData(beData);

                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.TranId : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Payment;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify" + beData.Amount.ToString("N") : "New " + auditLog.EntityId.ToString()) + beData.Amount.ToString("N");
                        auditLog.AutoManualNo = IsNullStr(beData.AutoManualNo);
                        SaveAuditLog(auditLog);
                    }
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
        //[HttpPost]
        //public JsonNetResult GetPaymentById(int tranId)
        //{
        //    var tranBL = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment);
        //    var beData = tranBL.getJournalByTranId(tranId);


        //    return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        //}
        #endregion

        #region "Journal"

        public ActionResult Journal(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Journal);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Journal);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateJournal()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Transaction.Journal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        for (int fi = 0; fi < Request.Files.Count; fi++)
                        {
                            HttpPostedFileBase file = Request.Files["file" + fi];
                            if (file != null)
                            {
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/Journal", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    bool isModify = false;
                    if (beData.TranId > 0)
                    {
                        isModify = true;
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal).ModifyFormData(beData);
                    }
                    else
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal).SaveFormData(beData);

                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.TranId : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Journal;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify" + beData.Amount.ToString("N") : "New " + auditLog.EntityId.ToString()) + beData.Amount.ToString("N");
                        auditLog.AutoManualNo = IsNullStr(beData.AutoManualNo);
                        SaveAuditLog(auditLog);
                    }
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
        //[HttpPost]
        //public JsonNetResult GetJournalById(int tranId)
        //{
        //    var tranBL = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal);
        //    var beData = tranBL.getJournalByTranId(tranId);


        //    return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        //}
        #endregion

        #region "Contra"

        public ActionResult Contra(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Contra);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Contra);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateContra()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Transaction.Journal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        for (int fi = 0; fi < Request.Files.Count; fi++)
                        {
                            HttpPostedFileBase file = Request.Files["file" + fi];
                            if (file != null)
                            {
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/Contra", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    bool isModify = false;
                    if (beData.TranId > 0)
                    {
                        isModify = true;
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra).ModifyFormData(beData);
                    }
                    else
                        resVal = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra).SaveFormData(beData);

                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.TranId : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Contra;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify" + beData.Amount.ToString("N") : "New " + auditLog.EntityId.ToString()) + beData.Amount.ToString("N");
                        auditLog.AutoManualNo = IsNullStr(beData.AutoManualNo);
                        SaveAuditLog(auditLog);
                    }
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
        //[HttpPost]
        //public JsonNetResult GetContraById(int tranId)
        //{
        //    var tranBL = new Dynamic.BusinessLogic.Account.Transaction.Journal(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra);
        //    var beData = tranBL.getJournalByTranId(tranId);


        //    return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        //}
        #endregion




        public ActionResult PharmacyCashDeposit()
        {
            return View();
        }

        public ActionResult PharmacyCashRefund()
        {
            return View();
        }

        public ActionResult ComplainInspection()
        {
            return View();
        }

        public ActionResult SalesInvoice()
        {
            return View();
        }
        public ActionResult CounterSales()
        {
            return View();
        }
        //public ActionResult VendorPayment()
        //{
        //    return View();
        //}

        public ActionResult VendorPayment(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Payment);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Payment);
            ViewBag.DefaultKeyValues = getFilterKeyValue((int)ViewBag.EntityId);
            ViewBag.EntityId1 = Convert.ToInt32(FormsEntity.OutgoingPayment);
            ViewBag.EntityId2 = Convert.ToInt32(FormsEntity.VendorPayment);
            return View();
        }
    }

}