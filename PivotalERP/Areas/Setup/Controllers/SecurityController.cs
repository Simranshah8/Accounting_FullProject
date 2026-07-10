using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data.OleDb;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;

using System.IO.Compression;
using System.IO;

using System.Security.AccessControl;
using System.Security.Principal;

namespace PivotalERP.Areas.Setup.Controllers
{
    public class SecurityController : PivotalERP.Controllers.BaseController
    {

        public ActionResult NotApplicableLedger()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetNotApplicableLedger()
        {
            var retVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getNotApplicableLedgerForItemAdtionalCost(User.UserId);

            return new JsonNetResultWithEnum() { Data = retVal, TotalCount = retVal.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult SaveNotApplicableLedger()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<List<int>>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).saveNotApplicableLedgerForItemAdtionalCost(User.UserId, beData);
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

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.UDFClass)]
        public ActionResult UDF()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.UDFClass)]
        public JsonNetResult SaveUDF()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<UDFClass>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.EntityId == Dynamic.BusinessEntity.Global.FormsEntity.NewCompany)
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Please ! Select Valid Entity Name";
                    }
                    else
                    {
                        var tranBL = new Dynamic.BusinessLogic.Global.UDFClass(User.HostName, User.DBName);

                        if (beData.Id > 0)
                            resVal = tranBL.ModifyFormData(beData);
                        else
                            resVal = tranBL.SaveFormData(beData);
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

        [HttpPost]
        [PermissionsAttribute(Actions.View, (int)FormsEntity.UDFClass, false)]
        public JsonNetResultWithEnum GetAllUDF()
        {
            var retVal = new Dynamic.BusinessLogic.Global.UDFClass(User.HostName, User.DBName).getAllAsList(User.UserId);

            return new JsonNetResultWithEnum() { Data = retVal, TotalCount = 1, IsSuccess = retVal.IsSuccess, ResponseMSG = retVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult getUDFById(int Id)
        {
            UDFClass resVal = new UDFClass();
            try
            {
                resVal = new Dynamic.BusinessLogic.Global.UDFClass(User.HostName, User.DBName).getUDFById(User.UserId, Id);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult getUDFByEntitId(Dynamic.BusinessEntity.Global.FormsEntity EntityId)
        {
            UDFClassCollections dataColl = new UDFClassCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Global.UDFClass(User.HostName, User.DBName).getUDFByEntityId(EntityId);
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.UDFClass, false, 0, true)]
        public JsonNetResult DeleteUDF(int Id)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (Id < 0)
                {
                    resVal.ResponseMSG = "can't delete default UDF name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Global.UDFClass(User.HostName, User.DBName).DeleteById(Id);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [PermissionsAttribute(Actions.View, (int)FormsEntity.YearClosing, false)]
        public ActionResult YearClosing()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.SecurityConsole, false)]
        public ActionResult IPRestrictions()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Actions.View, (int)FormsEntity.SecurityConsole, false)]
        public JsonNetResult GetIPDetails()
        {
            var retVal = new Dynamic.DataAccess.Security.IPRestrictionsDB(User.HostName, User.DBName).getIPRestrictions(User.UserId);

            return new JsonNetResult() { Data = retVal, TotalCount = 1, IsSuccess = retVal.IsSuccess, ResponseMSG = retVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.SecurityConsole, false)]
        public JsonNetResult SaveIPDetails(Dynamic.BusinessEntity.Security.IPRestrictions beData)
        {
            beData.CUserId = User.UserId;

            var retVal = new Dynamic.DataAccess.Security.IPRestrictionsDB(User.HostName, User.DBName).SaveUpdate(beData);

            return new JsonNetResult() { Data = retVal, TotalCount = 1, IsSuccess = retVal.IsSuccess, ResponseMSG = retVal.ResponseMSG };
        }



        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.SMSAPILog, true)]
        public ActionResult SAPApiLog()
        {
            return View();
        }

        //[HttpPost]
        //public JsonNetResult GetSAPApiLog(DateTime dateFrom, DateTime dateTo)
        //{

        //    PivotalOtherLib.SAP_BE.SAPTranApiLogCollections dataColl = new PivotalOtherLib.SAP_BE.SAPTranApiLogCollections();
        //    try
        //    {
        //        dataColl = new PivotalOtherLib.Global.SAPConnection(User.HostName, User.DBName).getTranApiLog(User.UserId, dateFrom, dateTo);

        //        return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        [HttpPost]
        public JsonNetResult PushTranToSAP_H(int voucherType, int? BranchId)
        {

            ResponeValues resVal = new ResponeValues();
            try
            {

                resVal = new PivotalOtherLib.Hulas.BL.Transaction(User.UserId, User.HostName, User.DBName).PushPendingTranToSAP(User.UserId, voucherType, BranchId);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        //[HttpPost]
        //public JsonNetResult PushTranToSAP(int TranId, int voucherType)
        //{

        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        Dynamic.BusinessEntity.Account.VoucherTypes vt = (Dynamic.BusinessEntity.Account.VoucherTypes)voucherType;
        //        resVal = pushToSAP(TranId, vt);

        //        return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        //private ResponeValues pushToSAP(int tranId, Dynamic.BusinessEntity.Account.VoucherTypes vt)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    var tranBL = new PivotalOtherLib.Global.SAPConnection(User.UserId, hostName, dbName);
        //    switch (vt)
        //    {
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
        //            resVal = tranBL.SaveReceiptByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdAcc(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailAcc(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt);
        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
        //            resVal = tranBL.SavePaymentByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdAcc(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailAcc(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteAdditionalInvoice:
        //            resVal = tranBL.SaveGRNLandedCostByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdAcc(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailAcc(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
        //            resVal = tranBL.SaveReceiptNoteByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.ReceiptNote);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.ReceiptNote);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
        //            resVal = tranBL.SaveDeliveryNoteByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.DeliveryNote);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.DeliveryNote);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
        //            resVal = tranBL.SavePurchaseOrderByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseOrder);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseOrder);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
        //            resVal = tranBL.SavePurchaseInvoiceByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseInvoice);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseInvoice);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
        //            resVal = tranBL.SavePurchaseReturnByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseReturn);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseReturn);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.IndentForm:
        //            resVal = tranBL.SaveIndentByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.IndentForm);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.IndentForm);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
        //            resVal = tranBL.SaveSalesInvoiceByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesInvoice);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesInvoice);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.SalesDebitNote:
        //            resVal = tranBL.SaveSalesDebitNoteByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesDebitNote);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesDebitNote);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
        //            resVal = tranBL.SaveSalesReturnByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesReturn);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesReturn);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
        //            resVal = tranBL.SaveGoodsReceiptByTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockJournal);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockJournal);

        //            resVal = tranBL.SaveGoodsIssueyTranId(tranId);
        //            if (resVal.IsSuccess)
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPiIdInv(tranId, 0, resVal.ResponseId, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockJournal);
        //            else
        //                resVal = new PivotalOtherLib.Global.SAPConnection(hostName, dbName).updateAPIFailInv(tranId, resVal.ResponseMSG, Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockJournal);

        //            break;
        //        case Dynamic.BusinessEntity.Account.VoucherTypes.ProductionAditionalCost:
        //            resVal = tranBL.PushCustomer(tranId)[0];
        //            break;
        //    }

        //    return resVal;
        //}



        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.WebAPILog, true)]
        public ActionResult WebApiLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetWebAPILog(DateTime dateFrom, DateTime dateTo)
        {

            LogMetadataCollections dataColl = new LogMetadataCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getWebApiLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.WebAPILog, true)]
        public ActionResult SqlErrorLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetSqlErrorLog(DateTime dateFrom, DateTime dateTo)
        {

            SqlErrorLogCollections dataColl = new SqlErrorLogCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getSqlErrorLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.WebAPILog, true)]
        public ActionResult IRDApiLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetIRDAPILog(DateTime dateFrom, DateTime dateTo, int? branchId)
        {

            IRDApiLogCollections dataColl = new IRDApiLogCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getIRDApiLog(User.UserId, dateFrom, dateTo, branchId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetJSONForIRD(int tranId, string billType)
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getJSONForIRDApi(User.UserId, tranId, billType);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult PushSalesReturnToIRD(int tranId, string billType)
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).pushSalesReturnToIRD(User.UserId, tranId, billType);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.SMSAPILog, true)]
        public ActionResult SMSApiLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetSMSAPILog(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            List<SMSLog> dataColl = new List<SMSLog>();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getSMSLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.SMSAPILog, true)]
        public ActionResult JobLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetJobLog(DateTime? dateFrom, DateTime? dateTo)
        {
            var dataColl = new Dynamic.BusinessLogic.Job.JobEntity(User.UserId, User.HostName, User.DBName).getJobHistory(dateFrom, dateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.NotificaionAPILog, true)]
        public ActionResult NotificationLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetNotificationLog(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            List<Dynamic.BusinessEntity.Global.NotificationLog> dataColl = new List<NotificationLog>();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getNotificationLog(User.UserId, dateFrom, dateTo, null);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [PermissionsAttribute(Actions.View, (int)RptFormsEntity.EmailLog, true)]
        public ActionResult EmailLog()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmailLog(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            List<Dynamic.BusinessEntity.Global.MailDetails> dataColl = new List<MailDetails>();
            try
            {
                dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getMailLog(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetAllUserList()
        {

            Dynamic.BusinessEntity.Security.UserCollections dataColl = new Dynamic.BusinessEntity.Security.UserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllUserShortDetailForWeb(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        [HttpPost]
        public JsonNetResult GetUserListForSecurity()
        {

            Dynamic.BusinessEntity.Security.UserCollections dataColl = new Dynamic.BusinessEntity.Security.UserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllUserShortDetailForSecurity(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public JsonNetResult GetAllBranchList()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).getAll(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count(), IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }


        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public JsonNetResult GetAllBranchListForEntry()
        {
            var dataColl = new Dynamic.DataAccess.Security.BranchDB(User.HostName, User.DBName).getAllBranchForEntry(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count(), IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult GetBranchById(int BranchId)
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).getBranchById(User.UserId, BranchId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };


        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Branch, false, 0, true)]
        public JsonNetResult DelBranch(int BranchId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (BranchId < 2)
                {
                    resVal.ResponseMSG = "can't delete default branch name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).DeleteById(BranchId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        #region "Email Setup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.EmailSetup_No_Reply)]
        public ActionResult EmailSetup()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult UpdateEmailSetup(string EmailId, string UserName, string Password, string SMTP, int Port, bool UseSSL, string SMSAPI)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                System.Configuration.Configuration configFile = null;
                System.Configuration.ExeConfigurationFileMap map = new System.Configuration.ExeConfigurationFileMap { ExeConfigFilename = System.AppDomain.CurrentDomain.BaseDirectory + "/Web.Config" };
                configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                var settings = configFile.AppSettings.Settings;
                string key = "emailId";

                if (settings[key] == null)
                    settings.Add(key, EmailId);
                else
                    settings[key].Value = EmailId;

                key = "emailUser";
                if (settings[key] == null)
                    settings.Add(key, UserName);
                else
                    settings[key].Value = UserName;

                key = "emailPwd";
                if (settings[key] == null)
                    settings.Add(key, Password);
                else
                    settings[key].Value = Password;


                key = "smtp";
                if (settings[key] == null)
                    settings.Add(key, SMTP);
                else
                    settings[key].Value = SMTP;

                key = "smtpPort";
                if (settings[key] == null)
                    settings.Add(key, Port.ToString());
                else
                    settings[key].Value = Port.ToString();

                key = "useSSL";
                if (settings[key] == null)
                    settings.Add(key, UseSSL.ToString());
                else
                    settings[key].Value = UseSSL.ToString();

                key = "smsAPI";
                if (settings[key] == null)
                    settings.Add(key, SMSAPI.ToString());
                else
                    settings[key].Value = SMSAPI.ToString();

                configFile.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection(configFile.AppSettings.SectionInformation.Name);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Email Setup Updated";

                //MailDetails md = new MailDetails();
                //md.UserName = UserName;
                //md.From = EmailId;
                //md.Password = Password;
                //md.Smtp = SMTP;
                //md.Port = Port;
                //md.Use_SSL = UseSSL;
                //resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).enableEmailServer(User.UserId, md);

                //if (resVal.IsSuccess)
                //{
                //    resVal.IsSuccess = true;
                //    resVal.ResponseMSG = "Email Setup Updated";
                //}                
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, ResponseMSG = resVal.ResponseMSG, IsSuccess = resVal.IsSuccess, TotalCount = 1 };
        }

        [HttpPost]
        public JsonNetResult TestEmailSetup(string EmailId, string UserName, string Password, string SMTP, int Port, bool UseSSL, string SMSAPI)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {

                MailDetails md = new MailDetails();
                md.UserName = UserName;
                md.From = EmailId;
                md.Password = Password;
                md.Smtp = SMTP;
                md.Port = Port;
                md.Use_SSL = UseSSL;
                resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).enableEmailServer(User.UserId, md);

                if (resVal.IsSuccess)
                {
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Email Setup Updated";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, ResponseMSG = resVal.ResponseMSG, IsSuccess = resVal.IsSuccess, TotalCount = 1 };
        }

        [HttpPost]
        public JsonNetResult getEmailSetup()
        {
            string emailId = "", pwd = "", smpt = "", userName = "", smsAPI = "";
            int port = 0;
            bool useSSL = false;
            try
            {
                System.Configuration.Configuration configFile = null;

                System.Configuration.ExeConfigurationFileMap map = new System.Configuration.ExeConfigurationFileMap { ExeConfigFilename = System.AppDomain.CurrentDomain.BaseDirectory + "/Web.Config" };
                configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                var settings = configFile.AppSettings.Settings;

                if (settings.AllKeys.Contains("emailId"))
                    emailId = settings["emailId"].Value;

                if (settings.AllKeys.Contains("emailPwd"))
                    pwd = settings["emailPwd"].Value;

                if (settings.AllKeys.Contains("emailUser"))
                    userName = settings["emailUser"].Value;

                if (settings.AllKeys.Contains("smtp"))
                    smpt = settings["smtp"].Value;

                if (settings.AllKeys.Contains("smtpPort"))
                    port = Convert.ToInt32(settings["smtpPort"].Value);

                if (settings.AllKeys.Contains("useSSL"))
                    useSSL = Convert.ToBoolean(settings["useSSL"].Value);

                if (settings.AllKeys.Contains("smsAPI"))
                    smsAPI = Convert.ToString(settings["smsAPI"].Value);

                var data = new
                {
                    EmailId = emailId,
                    Password = pwd,
                    SMTP = smpt,
                    Port = port,
                    UserName = userName,
                    UseSSL = useSSL,
                    SMSAPI = smsAPI
                };
                return new JsonNetResult() { Data = data, ResponseMSG = GLOBALMSG.SUCCESS, IsSuccess = true, TotalCount = 1 };

            }
            catch (Exception ee)
            {
                return new JsonNetResult() { Data = null, ResponseMSG = ee.Message, IsSuccess = false, TotalCount = 0 };
            }

        }


        #endregion

        #region "OneSignal Setup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.OneSignalSetup)]
        public ActionResult OneSignalSetup()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult UpdateOneSignalSetup(string ApiId, string ApiKey, int? UserId, string SmsAPI)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                System.Configuration.Configuration configFile = null;
                System.Configuration.ExeConfigurationFileMap map = new System.Configuration.ExeConfigurationFileMap { ExeConfigFilename = System.AppDomain.CurrentDomain.BaseDirectory + "/Web.Config" };
                configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                var settings = configFile.AppSettings.Settings;
                string key = "oneSignal_App_Id";

                if (settings[key] == null)
                    settings.Add(key, ApiId);
                else
                    settings[key].Value = ApiId;

                key = "oneSignal_Api_Key";
                if (settings[key] == null)
                    settings.Add(key, ApiKey);
                else
                    settings[key].Value = ApiKey;

                key = "oneSignal_SMS_UserId";

                string usrId = UserId.HasValue ? UserId.Value.ToString() : "";

                if (settings[key] == null)
                    settings.Add(key, usrId);
                else
                    settings[key].Value = usrId;

                key = "smsAPI";
                if (settings[key] == null)
                    settings.Add(key, SmsAPI);
                else
                    settings[key].Value = SmsAPI;

                configFile.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection(configFile.AppSettings.SectionInformation.Name);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "OneSignal/SMS Setup Updated";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, ResponseMSG = resVal.ResponseMSG, IsSuccess = resVal.IsSuccess, TotalCount = 1 };
        }


        [HttpPost]
        public JsonNetResult getOneSignalSetup()
        {
            string apiId = "", apiKey = "", userId = "", SmsAPI = "";
            try
            {
                System.Configuration.Configuration configFile = null;

                System.Configuration.ExeConfigurationFileMap map = new System.Configuration.ExeConfigurationFileMap { ExeConfigFilename = System.AppDomain.CurrentDomain.BaseDirectory + "/Web.Config" };
                configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                var settings = configFile.AppSettings.Settings;

                if (settings.AllKeys.Contains("oneSignal_App_Id"))
                    apiId = settings["oneSignal_App_Id"].Value;

                if (settings.AllKeys.Contains("oneSignal_Api_Key"))
                    apiKey = settings["oneSignal_Api_Key"].Value;

                if (settings.AllKeys.Contains("oneSignal_SMS_UserId"))
                    userId = settings["oneSignal_SMS_UserId"].Value;

                if (settings.AllKeys.Contains("smsAPI"))
                    SmsAPI = settings["smsAPI"].Value;

                var data = new
                {
                    ApiId = apiId,
                    ApiKey = apiKey,
                    UserId = (userId.Trim().Length > 0 ? Convert.ToInt32(userId) : 0),
                    SmsAPI = SmsAPI
                };
                return new JsonNetResult() { Data = data, ResponseMSG = GLOBALMSG.SUCCESS, IsSuccess = true, TotalCount = 1 };

            }
            catch (Exception ee)
            {
                return new JsonNetResult() { Data = null, ResponseMSG = ee.Message, IsSuccess = false, TotalCount = 0 };
            }

        }


        #endregion

        #region "Custom SMS Email Notication Templates"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.SMS_EMail_Notification)]
        public ActionResult SENTCustom()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateSENTCustom(SMSEmailNotification beData)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No Data Found for save/update";
                }
                else if (string.IsNullOrEmpty(beData.Message))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Pls Enter Message Body Details";
                }
                else
                {
                    beData.CUserId = User.UserId;
                    bool isValid = true;
                    if (isValid)
                    {
                        resVal = new Dynamic.DataAccess.Global.CustomSMSEmailNotificationDB(User.HostName, User.DBName).SaveUpdate(beData);
                    }
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSENTCustom(int AutoNumber, int ForTemplate)
        {
            SMSEmailNotification beData = new Dynamic.DataAccess.Global.CustomSMSEmailNotificationDB(User.HostName, User.DBName).getSMSEmailNotificationById(User.UserId, AutoNumber, (FORTEMPLATES)ForTemplate);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }

        [HttpGet]
        public JsonNetResult GetAllSENTCustom()
        {
            List<SMSEmailNotification> dataColl = new Dynamic.DataAccess.Global.CustomSMSEmailNotificationDB(User.HostName, User.DBName).getAll(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }
        [HttpPost]
        public JsonNetResult DelCustomSEN(int AutoNumber)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (AutoNumber <= 0)
                {
                    resVal.ResponseMSG = "Invalid Template";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.DataAccess.Global.CustomSMSEmailNotificationDB(User.HostName, User.DBName).delSEN(User.UserId, AutoNumber);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "SMS EMail Notification Templates"
        [PermissionsAttribute(Actions.View, (int)FormsEntity.SMS_EMail_Notification)]
        public ActionResult SENT()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateSENT(SMSEmailNotification beData)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No Data Found for save/update";
                }
                else if (string.IsNullOrEmpty(beData.Message))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Pls Enter Message Body Details";
                }
                else
                {
                    beData.CUserId = User.UserId;
                    bool isValid = true;
                    if (isValid)
                    {
                        resVal = new Dynamic.DataAccess.Global.SMSEmailNotificationDB(User.HostName, User.DBName).SaveUpdate(beData);
                    }
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSENT(int EntityId, bool IsReport, int ForTemplate)
        {
            SMSEmailNotification beData = new Dynamic.DataAccess.Global.SMSEmailNotificationDB(User.HostName, User.DBName).getSMSEmailNotificationById(User.UserId, EntityId, IsReport, (FORTEMPLATES)ForTemplate);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }

        [HttpPost]
        public JsonNetResult GetEntityByModule(Modules modul, bool IsReport)
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                switch (modul)
                {
                    case Modules.Account:
                        {
                            if (IsReport)
                            {
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.LedgerVoucher), Text = RptFormsEntity.LedgerVoucher.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.TrailBalanceLedgerGroupWise), Text = RptFormsEntity.TrailBalanceLedgerGroupWise.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.TrailBalanceLedgerWise), Text = RptFormsEntity.TrailBalanceLedgerWise.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.ProfitAndLossAsTFormat), Text = RptFormsEntity.ProfitAndLossAsTFormat.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.BalanceSheetAsTFormat), Text = RptFormsEntity.BalanceSheetAsTFormat.ToString() });

                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.AccountPurchaseRegister), Text = "Purchase Vat Register" });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.AccountPurchaseReturnRegister), Text = "Purchase Return Vat Register" });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.AccountSalesRegister), Text = "Sales Vat Register" });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.AccountSalesReturnRegister), Text = "Sales Return Vat Register" });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.AccountConfirmationLetter), Text = RptFormsEntity.AccountConfirmationLetter.ToString() });

                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.DailySalesAndCollections), Text = "Daily Sales Receipt" });
                            }
                            else
                            {
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.LedgerGroup), Text = FormsEntity.LedgerGroup.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.Ledger), Text = FormsEntity.Ledger.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.LedgerMerge), Text = FormsEntity.LedgerMerge.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.PDC), Text = FormsEntity.PDC.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.BGDetails), Text = FormsEntity.BGDetails.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.Receipt), Text = FormsEntity.Receipt.ToString() });
                                dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.Payment), Text = FormsEntity.Payment.ToString() });
                            }
                        }
                        break;
                    case Modules.Inventory:
                        if (IsReport)
                        {
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.PartyWiseAgeingReport), Text = RptFormsEntity.PartyWiseAgeingReport.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.BillWiseAgeing), Text = RptFormsEntity.BillWiseAgeing.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.CreditLimitExpiredParty), Text = RptFormsEntity.CreditLimitExpiredParty.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.OutStockBillWise), Text = RptFormsEntity.OutStockBillWise.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.PendingPurchaseOrder), Text = RptFormsEntity.PendingPurchaseOrder.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.PendingSalesOrder), Text = RptFormsEntity.PendingSalesOrder.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.SalesInvoiceDetails), Text = RptFormsEntity.SalesInvoiceDetails.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.MonthlySalesAnalysisPartyWise), Text = RptFormsEntity.MonthlySalesAnalysisPartyWise.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(RptFormsEntity.ConsumpationList), Text = RptFormsEntity.ConsumpationList.ToString() });

                        }
                        else
                        {
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.Product), Text = FormsEntity.Product.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.BankQuotation), Text = FormsEntity.BankQuotation.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.PurchaseOrder), Text = FormsEntity.PurchaseOrder.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.SalesOrder), Text = FormsEntity.SalesOrder.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.DeliveryNote), Text = FormsEntity.DeliveryNote.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.SalesInvoice), Text = FormsEntity.SalesInvoice.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.SalesReturn), Text = FormsEntity.SalesReturn.ToString() });
                        }
                        break;
                    case Modules.Service:
                        if (IsReport)
                        {

                        }
                        else
                        {
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.JobCard), Text = FormsEntity.JobCard.ToString() });
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.JobCardClose), Text = FormsEntity.JobCardClose.ToString() });
                        }
                        break;
                    case Modules.Setup:
                        if (IsReport)
                        {

                        }
                        else
                        {
                            dataColl.Add(new Dynamic.APIEnitity.Common() { Id = Convert.ToInt32(FormsEntity.SMS_Fail_Notification), Text = FormsEntity.SMS_Fail_Notification.ToString() });
                        }
                        break;
                }

                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, ResponseMSG = dataColl.ResponseMSG, IsSuccess = dataColl.IsSuccess, TotalCount = dataColl.Count };
        }

        [HttpPost]
        public JsonNetResult GetPropertiesList(int entityId, bool IsReport)
        {
            List<CommonClass> entityColl = new List<CommonClass>();
            if (IsReport)
            {
                entityColl = GetReportEntityProperties((RptFormsEntity)entityId);
            }
            else
            {
                entityColl = GetTransactionEntityProperties((FormsEntity)entityId);
            }
            return new JsonNetResult() { Data = entityColl, ResponseMSG = GLOBALMSG.SUCCESS, IsSuccess = true, TotalCount = entityColl.Count };
        }

        private List<CommonClass> GetReportEntityProperties(RptFormsEntity entity)
        {
            List<CommonClass> entityColl = new List<CommonClass>();

            Type type = GetReportEntityType(entity);

            if (type != null)
            {
                System.Reflection.PropertyInfo[] propertyInfos = type.GetProperties();

                foreach (System.Reflection.PropertyInfo propertyInfo in propertyInfos)
                {
                    var att = propertyInfo.GetCustomAttributes(typeof(DescriptionAttribute), true);
                    if (att.Length > 0)
                    {
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = ((DescriptionAttribute)att[0]).Description });
                    }
                    else
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = "" });
                }
            }
            return entityColl;
        }
        private Type GetReportEntityType(RptFormsEntity entity)
        {
            switch (entity)
            {
                case RptFormsEntity.CreditLimitExpiredParty:
                    return typeof(Dynamic.ReportEntity.Inventory.CreditLimitExpired);
                case RptFormsEntity.DailySalesAndCollections:
                    return typeof(Dynamic.SEN_BE.Account.DailySalesReceipt);
                case RptFormsEntity.PartyWiseAgeingReport:
                    return typeof(Dynamic.SEN_BE.Account.PartyWiseAgeing);
                case RptFormsEntity.BillWiseAgeing:
                    return typeof(Dynamic.SEN_BE.Account.BillWiseAgeing);
                default:
                    return null;
            }
        }


        private List<CommonClass> GetTransactionEntityProperties(FormsEntity entity)
        {
            List<CommonClass> entityColl = new List<CommonClass>();

            Type type = GetTransactionEntityType(entity);

            if (type != null)
            {
                System.Reflection.PropertyInfo[] propertyInfos = type.GetProperties();

                foreach (System.Reflection.PropertyInfo propertyInfo in propertyInfos)
                {
                    var att = propertyInfo.GetCustomAttributes(typeof(DescriptionAttribute), true);
                    if (att.Length > 0)
                    {
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = ((DescriptionAttribute)att[0]).Description });
                    }
                    else
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = "" });
                }
            }
            return entityColl;
        }
        private Type GetTransactionEntityType(FormsEntity entity)
        {
            switch (entity)
            {
                case FormsEntity.JobCard:
                case FormsEntity.JobCardClose:
                    return typeof(Dynamic.SEN_BE.Service.JobCard);
                case FormsEntity.LedgerGroup:
                    return typeof(Dynamic.SEN_BE.Account.LedgerGroup);
                case FormsEntity.Ledger:
                case FormsEntity.Customer:
                    return typeof(Dynamic.SEN_BE.Account.Ledger);
                case FormsEntity.LedgerMerge:
                    return typeof(Dynamic.SEN_BE.Account.LedgerMerge);
                case FormsEntity.Product:
                    return typeof(Dynamic.SEN_BE.Inventory.Product);
                case FormsEntity.BankQuotation:
                    return typeof(Dynamic.SEN_BE.Inventory.BankQuotation);
                case FormsEntity.DeliveryNote:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.SalesOrder:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.SalesInvoice:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.SalesReturn:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesReturn);
                case FormsEntity.ReceiptNote:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.PurchaseOrder:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.PurchaseInvoice:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.PurchaseReturn:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesReturn);
                case FormsEntity.SalesAllotment:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case FormsEntity.PDC:
                    return typeof(Dynamic.SEN_BE.Account.PDC);
                case FormsEntity.BGDetails:
                    return typeof(Dynamic.ReportEntity.Account.BGDetails);
                case FormsEntity.Receipt:
                    return typeof(Dynamic.SEN_BE.Account.Receipt);
                case FormsEntity.Payment:
                    return typeof(Dynamic.SEN_BE.Account.Payment);
                default:
                    return null;
            }
        }


        #endregion

        #region "SMS EMail Notification Templates For Voucher"
        [PermissionsAttribute(Actions.View, (int)FormsEntity.SMS_EMail_Notification)]
        public ActionResult SENTVoucher()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateSENTVoucher(SMSEmailNotification beData)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No Data Found for save/update";
                }
                else if (string.IsNullOrEmpty(beData.Message))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Pls Enter Message Body Details";
                }
                else
                {
                    beData.CUserId = User.UserId;
                    bool isValid = true;
                    if (isValid)
                    {
                        resVal = new Dynamic.DataAccess.Global.SMSEmailNotificationVoucherDB(User.HostName, User.DBName).SaveUpdate(beData);
                    }
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSENTVoucher(int VoucherId, bool IsReport, int ForTemplate)
        {
            SMSEmailNotification beData = new Dynamic.DataAccess.Global.SMSEmailNotificationVoucherDB(User.HostName, User.DBName).getSMSEmailNotificationById(User.UserId, VoucherId, IsReport, (FORTEMPLATES)ForTemplate);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };

        }


        [HttpPost]
        public JsonNetResult GetVoucherPropertiesList(int voucherId, int voucherType)
        {
            List<CommonClass> entityColl = new List<CommonClass>();
            entityColl = GetVoucherEntityProperties(voucherType);
            return new JsonNetResult() { Data = entityColl, ResponseMSG = GLOBALMSG.SUCCESS, IsSuccess = true, TotalCount = entityColl.Count };
        }

        private List<CommonClass> GetVoucherEntityProperties(int voucherTypeId)
        {
            Dynamic.BusinessEntity.Account.VoucherTypes voucherType = (Dynamic.BusinessEntity.Account.VoucherTypes)voucherTypeId;

            List<CommonClass> entityColl = new List<CommonClass>();

            Type type = GetVoucherEntityType(voucherType);

            if (type != null)
            {
                System.Reflection.PropertyInfo[] propertyInfos = type.GetProperties();

                foreach (System.Reflection.PropertyInfo propertyInfo in propertyInfos)
                {
                    var att = propertyInfo.GetCustomAttributes(typeof(DescriptionAttribute), true);
                    if (att.Length > 0)
                    {
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = ((DescriptionAttribute)att[0]).Description });
                    }
                    else
                        entityColl.Add(new CommonClass() { datatype = propertyInfo.Name, text = "" });
                }
            }
            return entityColl;
        }
        private Type GetVoucherEntityType(Dynamic.BusinessEntity.Account.VoucherTypes entity)
        {
            switch (entity)
            {

                case Dynamic.BusinessEntity.Account.VoucherTypes.BankQuotation:
                    return typeof(Dynamic.SEN_BE.Inventory.BankQuotation);
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesReturn);
                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesInvoice);
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return typeof(Dynamic.SEN_BE.Inventory.SalesReturn);
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return typeof(Dynamic.SEN_BE.Account.Receipt);
                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return typeof(Dynamic.SEN_BE.Account.Payment);
                case Dynamic.BusinessEntity.Account.VoucherTypes.IndentForm:
                    return typeof(Dynamic.SEN_BE.Inventory.Indent);
                default:
                    return null;
            }
        }

        #endregion

        #region "Sales Setup"

        [HttpGet]
        public JsonNetResult GetSalesFeatures()
        {
            var dataColl = new Dynamic.DataAccess.Setup.SalesFeaturesDB(User.HostName, User.DBName).getFeatures();

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

        #region "Purchase Setup"

        [HttpGet]
        public JsonNetResult GetPurchaseFeatures()
        {
            var dataColl = new Dynamic.DataAccess.Setup.PurchaseFeaturesDB(User.HostName, User.DBName).getFeatures();

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

        #region "Inventory Configuration"

        [HttpGet]

        public JsonNetResult GetInventoryConfig()
        {
            var dataColl = new Dynamic.DataAccess.Setup.InventoryConfigurationDB(User.HostName, User.DBName).getInventoryConfiguration(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpGet]
        public JsonNetResult GetInvConfig()
        {
            var dataColl = new Dynamic.DataAccess.Setup.InventoryConfigurationDB(User.HostName, User.DBName).getInventoryConfiguration(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.InventoryConfiguration)]
        public JsonNetResult SaveInvConfig()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.InventoryConfiguration>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.DataAccess.Setup.InventoryConfigurationDB(User.HostName, User.DBName).SaveUpdate(0, beData);
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

        #endregion

        #region "Account Configuration"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.AccountingConfiguration)]
        public ActionResult AccountConfiguration()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetAccountConfig()
        {
            var dataColl = new Dynamic.DataAccess.Setup.AccountConfigurationDB(User.HostName, User.DBName).getAccountConfiguration(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AccountingConfiguration)]
        public JsonNetResult SaveAccountConfig()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.AccountConfiguration>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.DataAccess.Setup.AccountConfigurationDB(User.HostName, User.DBName).SaveUpdate(0, beData);
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

        #endregion

        #region "Confirmation MSG"

        [HttpGet]
        public JsonNetResult GetConfirmationMSG()
        {
            var dataColl = new Dynamic.DataAccess.Setup.ConfirmMessageDB(User.HostName, User.DBName).getGeneralConfiguration();

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion

        #region "Update Data"


        [HttpPost]
        public JsonResult GetUpdateByColumn()
        {
            List<SelectListItem> updateByColl = new List<SelectListItem>();
            updateByColl.Add(new SelectListItem() { Text = "Code", Value = "Code" });

            return Json(updateByColl, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region "Import Data And Update Data"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.GlobalAction)]
        public ActionResult GlobalAction()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetGlobalActionType()
        {
            List<CommonClass> entityColl = new List<CommonClass>();
            foreach (int ival in Enum.GetValues(typeof(GlobalActionTypes)))
            {
                entityColl.Add(new CommonClass() { id = ival, text = ((GlobalActionTypes)ival).ToString() });
            }
            return new JsonNetResult() { Data = entityColl, ResponseMSG = GLOBALMSG.SUCCESS, IsSuccess = true, TotalCount = entityColl.Count };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.GlobalAction)]
        public JsonResult GenerateOTP_GA(string EmailId, GlobalActionTypes ActionType)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (User.InBuilt && EmailId.Trim().ToLower().Contains("dynamic.net.np"))
                {
                    resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).generateOTP(User.UserId, "", EmailId, (int)FormsEntity.GlobalAction, ActionType.ToString());
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Access denied";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return Json(resVal, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.EntityProperties)]
        public JsonResult GenerateOTP_EDE(string EmailId)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (User.InBuilt && EmailId.Trim().ToLower().Contains("dynamic.net.np"))
                {
                    resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).generateOTP(User.UserId, "", EmailId, (int)FormsEntity.EntityProperties, GlobalActionTypes.EntityDisabledEnabled.ToString());
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Access denied";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return Json(resVal, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.GlobalAction)]
        public JsonResult SaveGlobalAction(int ActionType, string EmailId, string OTP, int? BranchId = null, int? CostClassId = null, string RefId="")
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (User.InBuilt)
                {
                    Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                    auditLog.TranId = 0;
                    auditLog.EntityId = FormsEntity.GlobalAction;
                    auditLog.Action = Actions.Save;
                    auditLog.LogText = ((GlobalActionTypes)ActionType).ToString();
                    auditLog.AutoManualNo = ((GlobalActionTypes)ActionType).ToString();
                    SaveAuditLog(auditLog);

                    var usr = User;
                    resVal = new Dynamic.DataAccess.Security.UserDB(usr.HostName, usr.DBName).IsValidOTP(usr.UserId, OTP, (int)FormsEntity.GlobalAction, RefId);
                    if (resVal.IsSuccess)
                        resVal = new Dynamic.DataAccess.Global.GlobalDB(usr.HostName, usr.DBName).GlobalAction(usr.UserId, ActionType, ((GlobalActionTypes)ActionType).ToString(), GetIp(), EmailId, OTP, CostClassId, BranchId);
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Access denied";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return Json(resVal, JsonRequestBehavior.AllowGet);

        }


        public ActionResult ImportData()
        {
            return View();
        }

        public ActionResult CashDeposite()
        {
            ViewBag.TranId = 0;
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Receipt);
            ViewBag.EntityId = Convert.ToInt32(FormsEntity.Receipt);
            return View();

        }



        #endregion

        #region "UserGroup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.UserGroup, false)]
        public ActionResult UserGroup()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.UserGroup)]
        public JsonNetResult SaveUserGroup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.UserGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    if (beData.GroupId > 0)
                        resVal = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllUserGroupList()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).getUserWiseGroup(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count(), IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult GetAllUserGroup()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).getAll(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count(), IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult GetUserGroupById(int GroupId)
        {
            var dataColl = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).getGroupById(GroupId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };


        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.UserGroup, false, 0, true)]
        public JsonNetResult DelUserGroup(int GroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (GroupId < 5)
                {
                    resVal.ResponseMSG = "can't delete default group name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Security.UserGroup(User.HostName, User.DBName).DeleteById(GroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "User"

        [HttpPost]
        public JsonNetResult GetWebUser()
        {

            Dynamic.BusinessEntity.Security.UserCollections dataColl = new Dynamic.BusinessEntity.Security.UserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GetWebUser(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.User, false)]
        public ActionResult NewUser()
        {
            return View();
        }

        [ValidateInput(false)]
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.User)]
        public JsonNetResult SaveUser()
        {
            string photoLocation = "/Attachments/others";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.User>(Request["jsonData"]);
                if (beData != null)
                {
                    if (string.IsNullOrEmpty(beData.PhotoPath))
                        beData.PhotoPath = "";

                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];

                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.Photo = photoDoc.Data;
                            beData.PhotoPath = photoDoc.DocPath;
                        }
                    }

                    if (!string.IsNullOrEmpty(beData.PhotoPath) && beData.Photo == null)
                    {
                        if (beData.PhotoPath.StartsWith(photoLocation))
                        {
                            beData.Photo = GetBytesFromFile(beData.PhotoPath);
                        }
                    }

                    beData.MacAddress = "school";
                    bool isModify = false;
                    if (beData.UserId > 0)
                    {
                        isModify = true;
                        resVal = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).ModifyFormData(beData);
                    }
                    else
                        resVal = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).SaveFormData(beData);


                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.UserId : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.User;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " : "New " + auditLog.EntityId.ToString());
                        auditLog.AutoManualNo = beData.UserName;
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




        [HttpPost]
        public JsonNetResult GetUserById(int UserId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).getUserById(User.UserId, UserId);

                dataColl.Password = "";
                dataColl.Photo = null;

                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.User, false, 0, true)]
        public JsonNetResult DelUser(int UserId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (UserId < 2)
                {
                    resVal.ResponseMSG = "can't delete default user name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).DeleteById(User.UserId, UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult ForceLogOutFromApp(Dynamic.BusinessEntity.Security.UserCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                foreach (var v in dataColl)
                {
                    Dynamic.BusinessEntity.Global.NotificationLog notification = new NotificationLog();
                    notification.Content = "Logout";
                    notification.EntityId = Convert.ToInt32(FormsEntity.Logoff);
                    notification.EntityName = FormsEntity.Logoff.ToString();
                    notification.Heading = "Logout";
                    notification.Subject = "Force Logout";
                    notification.UserId = v.UserId;
                    notification.UserName = v.UserName;
                    notification.UserIdColl = v.UserId.ToString();
                    resVal = new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).SendNotification(User.UserId, notification);
                }

                if (resVal.IsSuccess)
                    resVal.ResponseMSG = "Force logout has done successfully";
            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
            }


            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        public ActionResult AllUser()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetDealerAgentUsers()
        {

            Dynamic.ReportEntity.Setup.UserCollections dataColl = new Dynamic.ReportEntity.Setup.UserCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Setup.LoginLog(User.HostName, User.DBName).getAllUsers(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "Dealer User"

        public ActionResult DealerUser()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllDealerUser()
        {

            Dynamic.BusinessEntity.Security.DealerUserCollections dataColl = new Dynamic.BusinessEntity.Security.DealerUserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllDealerUser(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GenDealerUser(String Prefix, String Suffix, int GroupId, int AsPer)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GenerateDealerUser(User.UserId, GroupId, Prefix, Suffix, AsPer);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Agent User"

        public ActionResult AgentUser()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllAgentUser()
        {

            Dynamic.BusinessEntity.Security.DealerUserCollections dataColl = new Dynamic.BusinessEntity.Security.DealerUserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllAgentUser(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GenAgentUser(String Prefix, String Suffix, int GroupId, int AsPer)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GenerateAgentUser(User.UserId, GroupId, Prefix, Suffix, AsPer);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Employee User"

        public ActionResult EmployeeUser()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllEmployeeUser()
        {

            Dynamic.BusinessEntity.Security.DealerUserCollections dataColl = new Dynamic.BusinessEntity.Security.DealerUserCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllEmployeeUser(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GenEmployeeUser(String Prefix, String Suffix, int GroupId, int AsPer)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GenerateEmployeeUser(User.UserId, GroupId, Prefix, Suffix, AsPer);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        ///// <summary>
        ///// Method for update User wise Active/ Allow 
        ///// </summary>
        ///// <returns></returns>
        //[HttpPost]
        //public JsonNetResult UpdateUserWiseActive()
        //{

        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Security.User>(Request["jsonData"]);
        //        if (beData != null)
        //        {
        //            beData.CUserId = User.UserId;
        //            resVal = new Dynamic.BusinessLogic.Security.EmployeeUser(User.UserId,User.HostName, User.DBName).UpdateUserWiseActive(beData);
        //        }
        //        else
        //        {
        //            resVal.ResponseMSG = "Blank Data Can't be Accept";
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        #endregion

        #region "Allow Entity For Enabled Disable Button"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.EntityEnableDisabled)]
        public ActionResult AllowEntityEnableDisabled()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEntityButtonDisable(int EntityId)
        {

            var retVal = new Dynamic.DataAccess.Setup.EntityWiseDisableButtonDB(User.HostName, User.DBName).getEntityWiseDisableButtonConfiguration(User.UserId, EntityId);

            return new JsonNetResult() { Data = retVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        public JsonNetResult GetEntityEnableDisableButton()
        {

            var entityColl = new List<CommonClass>();
            int ind = 0;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Global.FormsEntity)))
            {
                entityColl.Add(new CommonClass()
                {
                    id = ind,
                    text = str
                });

                ind++;
            }

            var dataColl = new Dynamic.DataAccess.Setup.EntityWiseDisableButtonDB(User.HostName, User.DBName).getEntityWiseDisableButtonConfiguration();

            var retVal = new
            {
                EntityColl = entityColl,
                dataColl = dataColl,
                IsSuccess = true,
                ResponseMSG = GLOBALMSG.SUCCESS
            };

            return new JsonNetResult() { Data = retVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.EntityEnableDisabled)]
        public JsonNetResult SaveEntityEnableDisableButton()
        {
            Dynamic.DataAccess.Setup.EntityWiseDisableButtonDB entityDB = new Dynamic.DataAccess.Setup.EntityWiseDisableButtonDB(User.HostName, User.DBName);
            ResponeValues resVal = new ResponeValues();

            //resVal.IsSuccess = false;
            //resVal.ResponseMSG = "Access denied";

            try
            {
                string otp = Request["OTP"].ToString();
                string RefId = Request["RefId"].ToString();
                var usr = User;
                resVal = new Dynamic.DataAccess.Security.UserDB(usr.HostName, usr.DBName).IsValidOTP(usr.UserId, otp, (int)FormsEntity.EntityProperties, RefId);
                if (resVal.IsSuccess)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.EntityWiseDisableButtonCollections>(Request["jsonData"]);
                    resVal = entityDB.SaveUpdate(beData);
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = 0;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.EntityWiseLog;
            auditLog.Action = Actions.Modify;
            auditLog.LogText = "Update EntityWise Disabled Enabled Button Option";
            auditLog.AutoManualNo = "";
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Security Console"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.SecurityConsole, false)]
        public ActionResult SecurityConsole()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEntityView()
        {
            var dataColl = new Dynamic.DataAccess.Security.EntityDB(User.HostName, User.DBName).getEntityForWeb(User.UserId);
            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.SecurityConsole, false)]
        public JsonNetResult GetSecurityConsole(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.EntityDB(User.HostName, User.DBName).getUserSecurityCollForWeb(User.UserId, forUserId, forGroupId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.SecurityConsole, false)]
        public JsonNetResult SaveSecurityConsole()
        {
            Dynamic.DataAccess.Security.EntityDB entityDB = new Dynamic.DataAccess.Security.EntityDB(User.HostName, User.DBName);
            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);
                bool isSuccess = false;

                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.UserWiseSecurityEntityCollections>(Request["jsonData"]);
                    isSuccess = entityDB.SaveUserSecurityEntity(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.UserGroupWiseSecurityEntityCollections>(Request["jsonData"]);
                    isSuccess = entityDB.SaveUserGroupSecurityEntity(forId, beData);
                }

                resVal.IsSuccess = isSuccess;



                if (isSuccess)
                {
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    resVal.ResponseMSG = "Unable to update security access. pls try again ";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.SecurityConsole;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update Security Access Log Wise of " + forId.ToString();
            else
                auditLog.LogText = "Update Security Access Log GroupWise of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Allow Back Date Entry User and GroupWise"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowBackDateEntryUserWise, false)]
        public ActionResult AllowBackdateEntry()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowBackdateEntry(int? forUserId, int? forGroupId)
        {
            if (forUserId.HasValue && forUserId.Value > 0)
            {
                var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllowBackDateEntryUserWise(User.UserId, forUserId.Value);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            else
            {
                var dataColl = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName).getAllowBackDateEntryUserWise(User.UserId, forGroupId.Value);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }


        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowBackDateEntryUserWise, false)]
        public JsonNetResult SaveAllowBackdateEntry()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowBackDateEntryUserWiseCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUpdateAllowBackDate(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowBackDateEntryUserGroupWiseCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUpdateAllowBackDate(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowBackDateEntryUserWise;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise BackDate Entry Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise BackDate Entry  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "USER WISE VOUCHER"
        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseVoucher, false)]
        public ActionResult AllowVoucher()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowVoucher(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getVoucherForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseVoucher, false)]
        public JsonNetResult SaveAllowVoucher()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowBackDateEntryUserWiseCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUpdateAllowUserWiseVoucher(forId, beData);

                    var autoPostVoucherColl = new Dynamic.BusinessEntity.Account.VoucherModeCollections();
                    foreach (var v in beData)
                    {
                        if (v.ForAutoPost)
                        {
                            autoPostVoucherColl.Add(new Dynamic.BusinessEntity.Account.VoucherMode()
                            {
                                VoucherId = v.VoucherId
                            });
                        }
                    }
                    userDB.SaveUpdateAllowUserWiseAutoPostVoucher(forId, autoPostVoucherColl);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowBackDateEntryUserGroupWiseCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUpdateAllowGroupWise(forId, beData);

                    var autoPostVoucherColl = new Dynamic.BusinessEntity.Account.VoucherModeCollections();
                    foreach (var v in beData)
                    {
                        if (v.ForReporting)
                        {
                            autoPostVoucherColl.Add(new Dynamic.BusinessEntity.Account.VoucherMode()
                            {
                                VoucherId = v.VoucherId
                            });
                        }
                    }
                    groupDB.SaveUpdateAllowGroupWiseAutoPostVoucher(forId, autoPostVoucherColl);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseVoucher;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise Voucher Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise Voucher  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion
        #region "UserWise LedgerGroup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseLedgerGroup, false)]
        public ActionResult AllowLedgerGroup()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowLedgerGroup(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getLedgerGroupForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseLedgerGroup, false)]
        public JsonNetResult SaveAllowLedgerGroup()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroupCollections idColl = new Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroupCollections();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction || ae.ForReporting)
                        {
                            idColl.Add(new Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroup()
                            {
                                ForReporting = ae.ForReporting,
                                ForTransaction = ae.ForTransaction,
                                LedgerGroupId = ae.GodownId
                            });
                        }

                    }
                    resVal = userDB.SaveUserWiseLedgerGroup(forId, idColl);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroupCollections idColl = new Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroupCollections();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction || ae.ForReporting)
                        {
                            idColl.Add(new Dynamic.BusinessEntity.Security.AllowUserWiseLedgerGroup()
                            {
                                ForReporting = ae.ForReporting,
                                ForTransaction = ae.ForTransaction,
                                LedgerGroupId = ae.GodownId
                            });
                        }

                    }
                    resVal = groupDB.SaveUserGroupWiseLedgerGroup(forId, idColl);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseLedgerGroup;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise LedgerGroup Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise LedgerGroup  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion
        #region "UserWise CostClass"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseCostClass, false)]
        public ActionResult AllowCostClass()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowCostClass(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getCostClassForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseCostClass, false)]
        public JsonNetResult SaveAllowCostClass()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);

                var allowIdColl = new List<int>();
                var allowIdForEntryColl = new List<int>();
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseCostClassCollections>(Request["jsonData"]);
                foreach (var id in beData)
                {
                    if (id.IsAllow)
                    {
                        allowIdColl.Add(id.CostClassId);
                        if (id.ForEntry)
                            allowIdForEntryColl.Add(id.CostClassId);
                    }

                }

                if (forType == 1)
                {
                    userDB.SaveUserWiseCostClassForEntry(forId, allowIdForEntryColl);
                    resVal = userDB.SaveUserWiseCostClass(forId, allowIdColl);

                }
                else
                {
                    resVal = groupDB.SaveUserGroupWiseCostClass(forId, allowIdColl);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseCostClass;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise CostClass Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise CostClass  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "UserWise CostClass"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseCostClass, false)]
        public ActionResult UserWiseCostClass()
        {
            return View();
        }
        #endregion

        #region "UserWise ProductGroup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseProductGroup, false)]
        public ActionResult AllowProductGroup()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowProductGroup(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getProductGroupForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseProductGroup, false)]
        public JsonNetResult SaveAllowProductGroup()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    List<int> idColl = new List<int>();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction)
                            idColl.Add(ae.GodownId);
                    }
                    resVal = userDB.SaveUserWiseProductGroup(forId, idColl);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    List<int> idColl = new List<int>();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction)
                            idColl.Add(ae.GodownId);
                    }
                    resVal = groupDB.SaveUserGroupWiseProductGroup(forId, idColl);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseProductGroup;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise ProductGroup Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise ProductGroup  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "UserWise CostCategory"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseCostCategory, false)]
        public ActionResult AllowCostCategory()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowCostCategory(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getCostCategoryForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseCostCategory, false)]
        public JsonNetResult SaveAllowCostCategory()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    List<int> idColl = new List<int>();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction)
                            idColl.Add(ae.GodownId);
                    }
                    resVal = userDB.SaveUserWiseCostCategory(forId, idColl);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    List<int> idColl = new List<int>();
                    foreach (var ae in beData)
                    {
                        if (ae.ForTransaction)
                            idColl.Add(ae.GodownId);
                    }
                    resVal = groupDB.SaveUserGroupWiseCostCategory(forId, idColl);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseCostCategory;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise CostCategory Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise CostCategory  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "UserWise Godown"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseGodown, false)]
        public ActionResult UserWiseGodown()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetUserWiseGodown(int forUserId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllowUserWiseGodown(forUserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllowGodown(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getGodownForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseGodown, false)]
        public JsonNetResult SaveAllowGodown()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUserWiseGodown(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUserGroupWiseGodown(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseGodown;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise Godown Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise Godown  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "User GroupWise Voucher"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseVoucher, false)]
        public ActionResult UserGroupWiseVoucher()
        {
            return View();
        }
        #endregion
        #region "User GroupWise LedgerGroup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseLedgerGroup, false)]
        public ActionResult UserGroupWiseLedgerGroup()
        {
            return View();
        }
        #endregion
        #region "User GroupWise CostClass"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseCostClass, false)]
        public ActionResult UserGroupWiseCostClass()
        {
            return View();
        }
        #endregion
        #region "User GroupWise Godown"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseGodown, false)]
        public ActionResult UserGroupWiseGodown()
        {
            return View();
        }
        #endregion
        #region "User GroupWise ProductGroup"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseProductGroup, false)]
        public ActionResult UserGroupWiseProductGroup()
        {
            return View();
        }
        #endregion

        #region "CreditRules"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.CreditRules, false)]
        public ActionResult CreditRules()
        {
            return View()
;
        }

        [HttpPost]
        public JsonNetResult GetCRRulesFor(int UserId)
        {
            var dataColl = new Dynamic.DataAccess.Setup.CreditRulesDB(User.HostName, User.DBName).getCreditRules(UserId);

            if (dataColl == null)
            {
                dataColl = new Dynamic.BusinessEntity.Setup.CreditRules();
                dataColl.SalesOrder = 3;
                dataColl.DispatchOrder = 3;
                dataColl.DispatchSection = 3;
                dataColl.DeliveryNote = 3;
                dataColl.SalesInvoice = 3;
                dataColl.SalesAllotment = 3;
            }


            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.CreditRules, false)]
        public JsonNetResult SaveCRRulesFor()
        {
            Dynamic.DataAccess.Setup.CreditRulesDB userDB = new Dynamic.DataAccess.Setup.CreditRulesDB(User.HostName, User.DBName);
            var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.CreditRules>(Request["jsonData"]);
            var resVal = userDB.SaveUpdate(beData);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion
        #region "UserWise Branch"
        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseBranch, false)]
        public ActionResult UserWiseBranch()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetUserWiseBranch(int forUserId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getBranchWiseForAllow(User.UserId, forUserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseBranch, false)]
        public JsonNetResult SaveUserWiseBranch()
        {
            Dynamic.DataAccess.Security.UserDB entityDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);
            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            try
            {

                forId = Convert.ToInt32(Request["forId"]);

                var dataColl = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseBranchCollections>(Request["jsonData"]);
                List<int> branchIdColl = new List<int>();
                foreach (var v in dataColl)
                {
                    if (v.IsAllow)
                        branchIdColl.Add(v.BranchId);
                }
                entityDB.SaveUserWiseBranch(User.UserId, forId, branchIdColl);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseBranch;
            auditLog.Action = Actions.Modify;
            auditLog.LogText = "Update User Wise Branch " + forId.ToString();
            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion
        #region "UserWise Module"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseModule, false)]
        public ActionResult UserWiseModule()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetUserWiseModule()
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllowModules(User.UserId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllowModule(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getModuleForAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseModule, false)]
        public JsonNetResult SaveAllowModules()
        {
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseModuleCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUpdateAllowUserWiseModule(User.UserId, beData, forId, null);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseModuleCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUpdateAllowUserWiseModule(User.UserId, beData, null, forId);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseGodown;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise Module Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise Module  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion
        #region "UserWise AutoPost"

        [PermissionsAttribute(Actions.Save, (int)FormsEntity.UserWiseAutoPost, false)]
        public ActionResult UserWiseAutoPost()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetUserWiseAutoPost()
        {
            Dynamic.DataAccess.Global.GlobalDB glbDB = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);
            var dataColl = glbDB.GetUserWiseAutoPostTransaction();

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.UserWiseAutoPost, false)]
        public JsonNetResult SaveUserWiseAutoPost()
        {
            Dynamic.DataAccess.Global.GlobalDB glbDB = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);

            ResponeValue resVal = new ResponeValue();
            var beData = DeserializeObject<List<int>>(Request["jsonData"]);
            resVal = glbDB.SaveUserWiseAutoPostTransaction(beData);

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = 0;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.UserWiseAutoPost;
            auditLog.Action = Actions.Modify;
            auditLog.LogText = "Update User Wise Auto Post ";

            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "UserWise InventoryConfiguration"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.InventoryConfiguration, false)]
        public ActionResult InventoryConfiguration()
        {
            return View();
        }
        #endregion  
        #region " GeneralConfiguration"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.Configuration, false)]
        public ActionResult GeneralConfiguration()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetDateStyle()
        {
            var dataColl = new Dynamic.DataAccess.Setup.GeneralConfigurationDB(User.HostName, User.DBName).getDateStyle(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult GetGeneralConfiguration()
        {
            var dataColl = new Dynamic.DataAccess.Setup.GeneralConfigurationDB(User.HostName, User.DBName).getGeneralConfiguration(0);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }
        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.Configuration, false)]
        public JsonNetResult SaveUpdateGeneralConfiguration()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.GeneralConfiguration>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.DataAccess.Setup.GeneralConfigurationDB(User.HostName, User.DBName).SaveUpdate(0, beData);

                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = 0;
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Configuration;
                        auditLog.Action = Actions.Modify;
                        auditLog.LogText = "Update General Configuration Log ";
                        auditLog.AutoManualNo = User.UserName;
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
        #endregion

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseSalesman, false)]
        public ActionResult AllowUserWiseSalesMan()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseCostCategory, false)]
        public ActionResult AllowUserCostCategory()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserGroupWiseCostCategory, false)]
        public ActionResult AllowUserGroupWiseCostCategory()
        {
            return View();
        }

        public ActionResult AllowLedgerGroupForAdditionalCostPurchase()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.PurchaseFeatures, false)]
        public ActionResult PurchaseFeatures()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)FormsEntity.SalesFeatures, false)]
        public ActionResult SalesFeatures()
        {
            return View();
        }
        public ActionResult AdditionalCostDetails()
        {
            return View();
        }
        public ActionResult LedgerGroupForSalesParty()
        {
            return View();
        }
        public ActionResult LedgerGroupForPurchaseParty()
        {
            return View();
        }
        public ActionResult CostCategoryForSales()
        {
            return View();
        }
        public ActionResult CostCategoryForPurchase()
        {
            return View();
        }
        public ActionResult CostCategoryForInventory()
        {
            return View();
        }
        public ActionResult LedgerGroupForSalesAccount()
        {
            return View();
        }
        public ActionResult LedgerGroupForPurchaseAccount()
        {
            return View();
        }
        public ActionResult AllowLedgerGroupForAdditionalCostSales()
        {
            return View();
        }
        public ActionResult AllowLedgerForAdditionalCostSales()
        {
            return View();
        }
        public ActionResult AllowLedgerForAdditionalCostPurchase()
        {
            return View();
        }
        public ActionResult AllowVoucherWiseProductGroup()
        {
            return View();
        }
        public ActionResult VoucherWiseConfiguration()
        {
            return View();
        }
        public ActionResult ShowProductQtyPoint()
        {
            return View();
        }
        public ActionResult ShowProductDescription()
        {
            return View();
        }
        public ActionResult StockTransferConfiguration()
        {
            return View();
        }
        public ActionResult ShowMultipleUnit()
        {
            return View();
        }
        [PermissionsAttribute(Actions.View, (int)FormsEntity.ConfirmMessage, false)]
        public ActionResult Confirmmessage()
        {
            return View();
        }
        public ActionResult ActivePartyDetails()
        {
            return View();
        }
        public ActionResult PurchaseAdditionalLedgerTag()
        {
            return View();
        }
        public ActionResult SalesAdditionalLedgerTag()
        {
            return View();
        }

        #region "Change and Update Password"
        public ActionResult ChangePassword()
        {
            if (Request.QueryString.AllKeys.Contains("rd"))
            {
                ViewBag.RD = Convert.ToInt32(Request.QueryString.AllKeys.Contains("rd"));
            }
            else
                ViewBag.RD = 0;
            return View();
        }
        [HttpPost]
        //public JsonResult UpdatePwd(string oldPwd, string newPwd, int? rd)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    bool isStrong = Global.GlobalFunction.IsStrongPassword(newPwd);

        //    string uname = User.UserName.Trim().ToLower();
        //    string pwd = newPwd.Trim().ToLower();

        //    if (pwd.Contains(uname))
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = "Password must be different from your username.";
        //    }
        //    else
        //    {
        //        if (isStrong)
        //            resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).UpdatePassword(User.UserId, newPwd, oldPwd);
        //        else
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = "VeryWeak Password";
        //        }
        //    }

        //    return new JsonNetResult() { Data = resVal, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        [PermissionsAttribute(Actions.View, (int)FormsEntity.PasswordReset, false)]
        public ActionResult ResetPassword()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult UpdateUserPwd(int uId, string newPwd)
        {
            ResponeValues resVal = new ResponeValues();
            resVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).ResetPassword(uId, newPwd);

            return new JsonNetResult() { Data = resVal, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion



        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.CompanyAlternation, false)]
        public ActionResult CompanyDetail()
        {
            return View();
        }

        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.NewCompany, false)]
        public ActionResult NewCompany()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.NewCompany, false)]
        public JsonNetResult SaveNewCompanyDet()
        {
            var usr = User;
            string photoLocation = "/Attachments/account/ledger";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var noofCompany = NoOfCompany;
                if (AllowCompanyCreation && noofCompany > 0)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.CompanyDetail>(Request["jsonData"]);
                    if (beData != null)
                    {
                        if (Request.Files.Count > 0)
                        {
                            var filesColl = Request.Files;
                            var photo = filesColl["logo"];
                            if (photo != null)
                            {
                                var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                                beData.CompanyLogoPath = photoDoc.DocPath;
                            }
                        }

                        var filePath = GetPath("~/App_Data") + "\\NewAccounting.cto";
                        var newCompany = new PivotalERP.Global.NewCompany(usr.UserId, usr.HostName, usr.DBName);
                        string publicIP = GetIp();
                        resVal = newCompany.ExecuteQueryFromFile(CustomerCode, filePath, noofCompany, publicIP, "", beData);

                        if (resVal.IsSuccess)
                        {
                            try
                            {
                                System.Configuration.Configuration configFile = null;
                                System.Configuration.ExeConfigurationFileMap map = new System.Configuration.ExeConfigurationFileMap { ExeConfigFilename = System.AppDomain.CurrentDomain.BaseDirectory + "/Web.Config" };
                                configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                                var settings = configFile.AppSettings.Settings;
                                string key = "dbList";
                                string existsVal = settings[key].Value;
                                settings[key].Value = existsVal + "," + (beData.RegdNo + "=" + resVal.ResponseId);

                                configFile.Save(ConfigurationSaveMode.Modified);
                                ConfigurationManager.RefreshSection(configFile.AppSettings.SectionInformation.Name);

                                resVal.IsSuccess = true;
                                resVal.ResponseMSG = "New Company Created Done";

                            }
                            catch (Exception ee)
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = ee.Message;
                            }

                        }
                    }
                    else
                    {
                        resVal.ResponseMSG = "Blank Data Can't be Accept";
                    }

                }
                else
                {
                    resVal.ResponseMSG = "New Company Creation was blocked";
                    resVal.IsSuccess = false;
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
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.NewCompany, false)]
        public JsonNetResult SaveUpdateCompanyDet()
        {
            string photoLocation = "/Attachments/account/ledger";
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BusinessEntity.Setup.CompanyDetail>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["logo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.CompanyLogoPath = photoDoc.DocPath;
                        }
                    }

                    resVal = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).UpdateCompenyDet(User.UserId, beData);
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
        public JsonNetResult GetCompanyDet()
        {
            var dataColl = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetailsWithOutLogo(User.UserId,null);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #region "Branch"

        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.Branch, false)]
        public ActionResult Branch()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Branch)]
        public JsonNetResult SaveBranch()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.Branch>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.BranchId > 0)
                            resVal = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Security.Branch(User.HostName, User.DBName).SaveFormData(beData);
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
        #endregion


        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.IRDDetails, false)]
        public ActionResult IRDDetails()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.IRDDetails, false)]
        public JsonNetResult SaveIRDDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.IRD.IRDDetails>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.DataAccess.IRD.IRDDetailsDB(User.HostName, User.DBName).SaveUpdate(beData, false);
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
        public JsonNetResult GetIRDDetails()
        {
            var dataColl = new Dynamic.DataAccess.IRD.IRDDetailsDB(User.HostName, User.DBName).getIRDDetails(User.UserId, User.BranchId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult GetIRDDetailsForBranch(int BranchId)
        {
            var dataColl = new Dynamic.DataAccess.IRD.IRDDetailsDB(User.HostName, User.DBName).getIRDDetails(User.UserId, BranchId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost]
        public JsonNetResult PendingDataSynsIRD(DateTime? StartDate, DateTime? EndDate, int? FromVoucherNo, int? ToVoucherNo, Dynamic.BusinessEntity.Account.VoucherTypes VoucherType)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.IRD.IRDDetailsDB(User.HostName, User.DBName).PendingDataSyns(User.UserId, StartDate, EndDate, FromVoucherNo, ToVoucherNo, VoucherType);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        #region "ActiveSecurity"

        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.SecurityConsole, false)]
        public ActionResult ActiveSecurity()
        {
            return View();
        }

        [HttpPost]

        public JsonNetResult GetActiveSecurity()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getActiveSecurity(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.SecurityConsole, false)]
        public JsonNetResult SaveActiveSecurity()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.ActiveSecurity>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveUpdateActiveSecurity(beData);
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

        #endregion

        [HttpPost]
        public JsonNetResult ForLogOut(int UserId, string UserName)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                Dynamic.BusinessEntity.Security.LoginLog lLog = new Dynamic.BusinessEntity.Security.LoginLog();
                lLog.MacAddress = "Force";
                lLog.UserId = UserId;
                lLog.UserName = UserName;
                lLog.LogDateTime = DateTime.Now;
                lLog.LocalDateTime = DateTime.Now;
                lLog.AppVersion = System.Reflection.Assembly.GetExecutingAssembly().Location;
                lLog.InOut = 2;
                lLog.LastUpdated = DateTime.Now;
                lLog.PCName = System.Environment.MachineName;
                lLog.SystemUser = System.Environment.UserName;
                lLog.LocalIP = LocalIPAddress();
                lLog.PublicIP = User.PublicIP;

                var resVal1 = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveLoginLog(lLog);
                if (resVal1.IsSuccess)
                {
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Logout Done";
                }
                else
                    resVal = resVal1;

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #region "Module"

        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseModule, false)]
        public ActionResult Module()
        {

            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseModule, false)]
        public JsonNetResult SaveModule()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.Module>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.ModuleId.HasValue)
                        beData.ModuleId = 0;

                    resVal = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseModule, false)]
        public JsonNetResult SaveModuleMenu()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.ModuleMenuItemCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).SaveModuleMenu(beData);

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
        public JsonNetResult GetAllModule()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).GetAllModule(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetModuleById(int ModuleId)
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).GetModuleById(0, ModuleId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseModule, false)]
        public JsonNetResult DelModule(int ModuleId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).DeleteById(0, ModuleId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetModuleMenuById(int ModuleId)
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).getModuleMenuById(ModuleId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetModuleMenu()
        {
            var dataColl = new Dynamic.BusinessLogic.Security.Module(User.UserId, User.HostName, User.DBName).getModuleMenu();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "Payment Gateway"

        [PermissionsAttribute(Actions.View, (int)Dynamic.BusinessEntity.Global.FormsEntity.PaymentGateway, false)]
        public ActionResult PaymentGateway()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)Dynamic.BusinessEntity.Global.FormsEntity.PaymentGateway, false)]
        public JsonNetResult SavePaymentGateway()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                string iconPathLocation = "/Attachments/academic";
                var beData = DeserializeObject<Dynamic.BusinessEntity.Wallet.PaymentGateway>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(iconPathLocation, photo, true);
                            beData.IconPath = photoDoc.DocPath;
                        }
                    }


                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BusinessLogic.Wallet.PaymentGateway(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResultWithEnum GetAllPaymentGatewayList()
        {
            var dataColl = new Dynamic.BusinessLogic.Wallet.PaymentGateway(User.UserId, User.HostName, User.DBName).GetAllPaymentGateway(0);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)Dynamic.BusinessEntity.Global.FormsEntity.PaymentGateway, false)]
        public JsonNetResult DelPaymentGateway(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Wallet.PaymentGateway(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        #region "UserWise Godown For PartsDemand"

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseGodownForPartsDemand, false)]
        public ActionResult PartsDemandGodown()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetPartsDemandGodown(int forUserId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getAllowUserWiseGodown(forUserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllPartsDemandGodown(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getGodownForPartsDemandAllow_Web(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseGodownForPartsDemand, false)]
        public JsonNetResult SavePartsDemandGodown()
        {
            Dynamic.DataAccess.Security.UserGroupDB groupDB = new Dynamic.DataAccess.Security.UserGroupDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    resVal = userDB.SavePartsDemandGodown(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGodownCollections>(Request["jsonData"]);
                    resVal = groupDB.SavePartsDemandGodown(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseGodownForPartsDemand;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise PartsDemand Godown  Log  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup Wise PartsDemand Godown  Log of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        #region "Document Type"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DocumentType)]
        public ActionResult DocumentType()
        {

            return View();
        }
        [ValidateInput(false)]
        [HttpGet]
        public JsonNetResult GetVoucherWiseDocumentType(int voucherType)
        {
            List<string> dataColl = new Dynamic.DataAccess.Account.DocumentTypeDB(User.HostName, User.DBName).getDocumentTypeAsList(User.UserId, (Dynamic.BusinessEntity.Account.VoucherTypes)voucherType);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DocumentType)]
        public JsonNetResult SaveDocumentType()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.DocumentType>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.DocumentTypeId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.DocumentType(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.DocumentType(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.DocumentType)]
        public JsonNetResult GetDocumentTypeById(int DocumentTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.DocumentType(User.HostName, User.DBName).getDocumentTypeById(User.UserId, DocumentTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.DocumentType, false, 0, true)]
        public JsonNetResult DeleteDocumentType(int DocumentTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DocumentTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Document Type ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.DocumentType(User.HostName, User.DBName).DeleteById(DocumentTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllDocumentType()
        {
            Dynamic.BusinessEntity.Account.DocumentTypeCollections dataColl = new Dynamic.BusinessEntity.Account.DocumentTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.DocumentType(User.HostName, User.DBName).getAllAsList(User.UserId);
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


        #region "Copy User Security"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.FromUserToUser)]
        public ActionResult CopyUserSecurity()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.FromUserToUser)]
        [HttpPost]
        public JsonNetResult SaveFromUserToUser(int fromUserId, int toUserId)
        {
            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = 0;
            auditLog.EntityId = FormsEntity.FromUserToUser;
            auditLog.Action = Actions.Save;
            auditLog.LogText = "Copy User Security from " + fromUserId.ToString() + "  TO " + toUserId.ToString();
            auditLog.AutoManualNo = "Copy User Security ";
            SaveAuditLog(auditLog);

            var retVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).FromUserToUser(User.UserId, fromUserId, toUserId);

            return new JsonNetResult() { Data = retVal, TotalCount = 1, IsSuccess = retVal.IsSuccess, ResponseMSG = retVal.ResponseMSG };
        }



        #endregion


        [PermissionsAttribute(Actions.View, (int)FormsEntity.SubBranch)]
        public ActionResult SubBranch()
        {
            return View();
        }
        #region "SubBranch"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.IncomeSource)]

        [HttpPost]
        [PermissionsAttribute(Actions.View, (int)FormsEntity.SubBranch)]
        public JsonNetResult SaveSubBranch()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.SubBranch>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.SubBranchId.HasValue)
                        beData.SubBranchId = 0;

                    resVal = new Dynamic.BusinessLogic.Security.SubBranch(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.IncomeSource)]
        public JsonNetResult getSubBranchById(int SubBranchId)
        {
            Dynamic.BusinessEntity.Security.SubBranch resVal = new Dynamic.BusinessEntity.Security.SubBranch();
            try
            {
                resVal = new Dynamic.BusinessLogic.Security.SubBranch(User.UserId, User.HostName, User.DBName).GetSubBranchById(0, SubBranchId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)FormsEntity.SubBranch)]
        public JsonNetResult DeleteSubBranch(int SubBranchId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (SubBranchId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default SubBranch ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Security.SubBranch(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, SubBranchId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllSubBranch()
        {
            Dynamic.BusinessEntity.Security.SubBranchCollections dataColl = new Dynamic.BusinessEntity.Security.SubBranchCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Security.SubBranch(User.UserId, User.HostName, User.DBName).GetAllSubBranch(0);
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

        [PermissionsAttribute(Actions.View, (int)FormsEntity.IRDDetails, false)]
        public ActionResult SSFAPIUser()
        {
            return View();
        }

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveSSFAPIUser()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                bool isModify = false;
                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.SSFAPIUser>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.DataAccess.Security.SSFAPIUserDB(User.HostName, User.DBName).SaveUpdate(beData, isModify);
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
        //[PermissionsAttribute(PivotalERP.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.IncomeSource)]
        public JsonNetResult GetSSFAPIUser()
        {
            Dynamic.BusinessEntity.Security.SSFAPIUser resVal = new Dynamic.BusinessEntity.Security.SSFAPIUser();
            try
            {
                resVal = new Dynamic.DataAccess.Security.SSFAPIUserDB(User.HostName, User.DBName).getSSFAPIUser(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowVoucherForPost, false)]
        public ActionResult AllowVoucherForPost()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowVoucherForPost(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getVoucherForPost(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };


        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowVoucherForPost, false)]
        public JsonNetResult SaveAllowVoucherForPost()
        {
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);

                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowVoucherForPostCollections>(Request["jsonData"]);
                if (forType == 1)
                {
                    resVal = userDB.SaveUpdateVoucherForPost(User.UserId, forId, null, beData);
                }
                else
                {
                    resVal = userDB.SaveUpdateVoucherForPost(User.UserId, null, forId, beData);
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowVoucherForPost;
            auditLog.Action = Actions.Modify;

            if (forType == 1)
                auditLog.LogText = "Update User Wise Voucher For Post  of " + forId.ToString();
            else
                auditLog.LogText = "Update UserGroup WiseVoucher For Post of " + forId.ToString();

            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseGroup, false)]
        public ActionResult AllowUserWiseGroup()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetAllowUserWiseGroup(int forUserId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getUserWiseGroup(User.UserId, forUserId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };


        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseGroup, false)]
        public JsonNetResult SaveAllowUserWiseGroup()
        {
            Dynamic.DataAccess.Security.UserDB userDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            try
            {
                forId = Convert.ToInt32(Request["forId"]);

                var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseGroupCollections>(Request["jsonData"]);
                resVal = userDB.SaveAllowUserGroup(User.UserId, forId, beData);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseGroup;
            auditLog.Action = Actions.Modify;
            auditLog.LogText = "Update User Wise Group  of " + forId.ToString();
            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #region "UserWise Branch For Master Tran Report"
        [PermissionsAttribute(Actions.View, (int)FormsEntity.AllowUserWiseBranch, false)]
        public ActionResult UserBranch()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetUserBranch(int forUserId)
        {
            var dataColl = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getUserWiseBranch(User.UserId, forUserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AllowUserWiseBranch, false)]
        public JsonNetResult SaveUserBranch()
        {
            Dynamic.DataAccess.Security.UserDB entityDB = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName);
            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            try
            {

                forId = Convert.ToInt32(Request["forId"]);

                var dataColl = DeserializeObject<Dynamic.BusinessEntity.Security.UserWiseBranchCollections>(Request["jsonData"]);
                foreach (var v in dataColl)
                {
                    v.UserId = forId;
                }
                entityDB.SaveUserWiseBranch(User.UserId, forId, dataColl);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
            auditLog.TranId = forId;
            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AllowUserWiseBranch;
            auditLog.Action = Actions.Modify;
            auditLog.LogText = "Update User Branch " + forId.ToString();
            auditLog.AutoManualNo = forId.ToString();
            SaveAuditLog(auditLog);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        #region"AllowDepartment"
        public ActionResult AllowDepartment()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllowDepartment(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.AllowUserWiseDepartmentDB(User.HostName, User.DBName).getDepartmentForAllow(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        public JsonNetResult SaveAllowDepartment()
        {
            Dynamic.DataAccess.Security.AllowUserWiseDepartmentDB groupDB = new Dynamic.DataAccess.Security.AllowUserWiseDepartmentDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.AllowUserWiseDepartmentDB userDB = new Dynamic.DataAccess.Security.AllowUserWiseDepartmentDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseDepartmentCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUserWiseDepartment(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseDepartmentCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUserGroupWiseDepartment(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        #region"AllowLevel"
        public ActionResult AllowLevel()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllowLevel(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.AllowUserWiseLevelDB(User.HostName, User.DBName).getLevelForAllow(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        public JsonNetResult SaveAllowLevel()
        {
            Dynamic.DataAccess.Security.AllowUserWiseLevelDB groupDB = new Dynamic.DataAccess.Security.AllowUserWiseLevelDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.AllowUserWiseLevelDB userDB = new Dynamic.DataAccess.Security.AllowUserWiseLevelDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseLevelCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUserWiseLevel(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseLevelCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUserGroupWiseLevel(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        #endregion

        #region"AllowCategory"
        public ActionResult AllowCategory()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllowCategory(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.AllowUserWiseCategoryDB(User.HostName, User.DBName).getCategoryForAllow(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        public JsonNetResult SaveAllowCategory()
        {
            Dynamic.DataAccess.Security.AllowUserWiseCategoryDB groupDB = new Dynamic.DataAccess.Security.AllowUserWiseCategoryDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.AllowUserWiseCategoryDB userDB = new Dynamic.DataAccess.Security.AllowUserWiseCategoryDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseCategoryCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUserWiseCategory(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseCategoryCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUserGroupWiseCategory(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        #endregion


        #region"AllowServiceType"
        public ActionResult AllowServiceType()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetAllowServiceType(int? forUserId, int? forGroupId)
        {
            var dataColl = new Dynamic.DataAccess.Security.AllowUserWiseServiceTypeDB(User.HostName, User.DBName).getServiceTypeForAllow(User.UserId, forUserId, forGroupId);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

        }


        [HttpPost]
        public JsonNetResult SaveAllowServiceType()
        {
            Dynamic.DataAccess.Security.AllowUserWiseServiceTypeDB groupDB = new Dynamic.DataAccess.Security.AllowUserWiseServiceTypeDB(User.HostName, User.DBName);
            Dynamic.DataAccess.Security.AllowUserWiseServiceTypeDB userDB = new Dynamic.DataAccess.Security.AllowUserWiseServiceTypeDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();
            int forId = 0;
            int forType = 0;
            try
            {
                forType = Convert.ToInt32(Request["forType"]);
                forId = Convert.ToInt32(Request["forId"]);


                if (forType == 1)
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseServiceTypeCollections>(Request["jsonData"]);
                    resVal = userDB.SaveUserWiseServiceType(forId, beData);

                }
                else
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Security.AllowUserWiseServiceTypeCollections>(Request["jsonData"]);
                    resVal = groupDB.SaveUserGroupWiseServiceType(forId, beData);
                }


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        [HttpPost]
        public JsonNetResult GetEPByEntityId(int EntityId, int? EntityType)
        {
            Dynamic.BusinessEntity.Security.EntityPropertiesCollections dataColl = new Dynamic.BusinessEntity.Security.EntityPropertiesCollections();
            try
            {
                if (EntityType.HasValue && EntityType == 3)
                    dataColl = new Dynamic.BusinessLogic.Security.EntityProperties(User.UserId, User.HostName, User.DBName).getRptEPById(EntityId);
                else
                    dataColl = new Dynamic.BusinessLogic.Security.EntityProperties(User.UserId, User.HostName, User.DBName).getEPById(EntityId);

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        //added by yubaraj poudel


        #region "CustomAccess"
        public ActionResult CustomAccess()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveCustomAccess()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<List<Dynamic.BE.Security.CustomAccess>>(Request["jsonData"]);

                if (beData != null)
                {
                    resVal = new Dynamic.BL.Security.CustomAccess(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllCustomAccess()
        {
            var dataColl = new Dynamic.BL.Security.CustomAccess(User.UserId, User.HostName, User.DBName).GetAllCustomAccess(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetCustomAccessById(int ModuleId, int EntityIds)
        {
            var dataColl = new Dynamic.BL.Security.CustomAccess(User.UserId, User.HostName, User.DBName).GetCustomAccessById(0, ModuleId, EntityIds);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelCustomAccess(int ModuleId, int EntityIds)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Security.CustomAccess(User.UserId, User.HostName, User.DBName).DeleteById(0, ModuleId, EntityIds);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEntityForProperties(int ModuleId, int? EntityType)
        {
            var dataColl = new Dynamic.BL.Security.CustomAccess(User.UserId, User.HostName, User.DBName).GetEntityForProperties( ModuleId, EntityType);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion




    }
}