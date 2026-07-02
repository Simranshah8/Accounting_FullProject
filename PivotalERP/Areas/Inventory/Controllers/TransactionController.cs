using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;
using PivotalERP.Models;

namespace PivotalERP.Areas.Inventory.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
    {

        #region "Sales Quotation"

        [HttpGet]
        public JsonNetResult getPendingDeliveryNote(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getPendingDeliveryNote(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Sales Order"

        [HttpGet]
        public JsonNetResult getPendinSalesOrder(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getPendingOrder(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Sales Allotment"

        [HttpGet]
        public JsonNetResult getPendinSalesAllotment(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getPendingSalesAllotment(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult getSalesAllotmentPartyDetails(int tranId)
        {

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.SalesInvoiceDetails dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.SalesInvoiceDetails();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesAllotmentDB(User.HostName, User.DBName).getSalesAllotmentDetails(User.UserId, 0, "", tranId);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Delivery Note"


        [HttpGet]
        public JsonNetResult getDeliveryNotePartyDetails(int tranId)
        {

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.DeliveryNote dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.DeliveryNote();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.DeliveryNoteDB(User.HostName, User.DBName).getDeliveryNoteDetailsByRefNo(User.UserId, 0, "", tranId);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Dispatch Section"

        [HttpGet]
        public JsonNetResult getPendingDispatchSection(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getPendingDispatchSection(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion



        #region "Insurance"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Insurance, false)]
        public ActionResult Insurance()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult getVehicleDetailsByEngNo(string engineNo)
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.Transaction.Insurance(User.HostName, User.DBName).getVehicleDetails(User.UserId, engineNo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Insurance, false)]
        public JsonNetResult SaveUpdateInsurance()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.Insurance>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/insurance", file));
                            }
                        }
                    }

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.Insurance(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Bank Quotation"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.BankQuotation, false)]
        public ActionResult BankQuotation()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.BankQuotation);
            return View();
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.BankQuotation, false)]
        public JsonNetResult SaveUpdateBankQuotation()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.BankQuotation>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;
                    beData.BranchId = User.BranchId;
                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.BankQuotation(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Bank DO"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.BankDO, false)]
        public ActionResult BankDO()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.BankDO);
            return View();
        }

        [HttpGet]
        public JsonNetResult getBankQuotationByNo(string quotationNo)
        {
            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.BankQuotation dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.BankQuotation();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.BankDODB(User.HostName, User.DBName).getBankQuotationByNo(User.UserId, quotationNo);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.BankDO, false)]
        public JsonNetResult SaveUpdateBankDO()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.BankDO>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/insurance", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;
                    beData.BranchId = User.BranchId;
                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.BankDO(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Bank Allotment"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.BankAllotment, false)]
        public ActionResult BankAllotment()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.BankAllotment);
            return View();
        }

        [HttpGet]
        public JsonNetResult getBankDOByRef(string doRefNo)
        {
            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.BankDO dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.BankDO();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.BankAllotmentDB(User.HostName, User.DBName).getBankDOByDORefNo(User.UserId, doRefNo);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.BankQuotation, false)]
        public JsonNetResult SaveUpdateBankAllotment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.BankAllotment>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;
                    beData.BranchId = User.BranchId;
                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.BankAllotment(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Namsari"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Namsari, false)]
        public ActionResult Namsari()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Namsari);
            return View();
        }

        [HttpGet]
        public JsonNetResult getBankDOByEngNo(string engineNo)
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.Transaction.Namsari(User.UserId, User.HostName, User.DBName).getBankDOForByEngineNo(User.UserId, engineNo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Namsari, false)]
        public JsonNetResult SaveUpdateNamsari()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.Namsari>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;
                    beData.BranchId = User.BranchId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.Namsari(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Bank Pay Letter"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.BankPayLetter, false)]
        public ActionResult BankPayLetter()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.BankPayLetter);
            return View();
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.BankPayLetter, false)]
        public JsonNetResult SaveUpdateBankPayLetter()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.BankPayLetter>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/insurance", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;
                    beData.BranchId = User.BranchId;
                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.BankPayLetter(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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


        #region "Purchase Return"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.PurchaseReturn, false)]
        public ActionResult PurchaseReturn()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseReturn);
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PurchaseReturn, false)]
        public JsonNetResult SaveUpdatePurchaseReturn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PurchaseReturn>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PurchaseReturn(User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetTransactionLst(int? voucherId, int? costClassId, string TranIdColl, int voucherType, TableFilter filter)
        {
            Dynamic.BusinessEntity.Inventory.Transaction.TransactionLstCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.TransactionLstCollections();
            try
            {
                filter.UserId = User.UserId;
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.TransactionLstDB(User.HostName, User.DBName).getTransactionForPaging(voucherId, costClassId, TranIdColl, (Dynamic.BusinessEntity.Account.VoucherTypes)voucherType, filter);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "StockTransfor"

        public ActionResult StockTransfor()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockTransfor);
            return View();
        }
        [HttpGet]
        public JsonNetResult GetUserWiseGodown()
        {
            Dynamic.BusinessEntity.Inventory.GodownCollections dataColl = new Dynamic.BusinessEntity.Inventory.GodownCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetProductDetails()
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.Product(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetProductBrand()
        {
            Dynamic.BusinessEntity.Inventory.ProductBrandCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductBrandCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductBrand(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetCostCenter()
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
        [HttpPost]
        public JsonNetResult SaveUpdateStockTransfor()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockTransfor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.StockTransfor(User.HostName, User.DBName).SaveFormData(beData);
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
        //[HttpGet]
        //public JsonNetResult getPendinPartsDemand(int GodownId, int CostClassId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    Dynamic.BusinessEntity.Inventory.Transaction.PendingVoucherCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingVoucherCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.DataAccess.Inventory.Transaction.StockTransforDB(User.HostName, User.DBName).getAllPendingStockTransfer( GodownId, CostClassId);
        //        resVal.IsSuccess = true;
        //        resVal.ResponseMSG = GLOBALMSG.SUCCESS;
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }

        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        #endregion

        #region "PhysicalStock"

        public ActionResult PhysicalStock()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PhysicalStock);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PhysicalStock);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdatePhysicalStock()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PhysicalStock>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PhysicalStock(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Consumption"

        public ActionResult Consumption()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.Consumption);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Consumption);
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdateConsumption()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockTransfor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.Consumption(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Stock Demand"

        public ActionResult StockDemand()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemand);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PartsDemand);
            return View();

        }
        [HttpPost]
        public JsonNetResult SaveUpdateStockDemand()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockTransfor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PartsDemand(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Stock Demand"

        public ActionResult StockDemandCancel()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemandCancel);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PartsDemandCancel);
            return View();

        }
        [HttpPost]
        public JsonNetResult SaveUpdateStockDemandCancel()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockTransfor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PartsDemandCancel(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "ManufacturingStockJournal"
        public ActionResult ManufacturingStockJournal()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockJournal);
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdateManufacturingStockJournal()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockJournal>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/sales", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.StockJournal(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "CannibalizeIn"

        public ActionResult CannibalizeIn()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeIn);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.CannibalizeIn);
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdateCannibalizeIn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.CannibalizeIn>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.CannibalizeIn(User.HostName, User.DBName).SaveFormData(beData);
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
        #region "CannibalizeOut"

        public ActionResult CannibalizeOut()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeOut);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.CannibalizeOut);
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdateCannibalizeOut()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.CannibalizeIn>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/sales", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.CannibalizeOut(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "StockJournal"
        public ActionResult StockJournal()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockJournal);
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveUpdateStockJournal()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.StockJournal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.StockJournal(User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.StockJournal)]
        //public JsonNetResult GetStockJournalById(int TranId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        resVal = new Dynamic.BusinessLogic.Inventory.Transaction.StockJournal(User.HostName, User.DBName).getStockJournalByTranId(TranId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }

        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        //[HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.StockJournal)]
        //public JsonNetResult DelClassById(int TranId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        if (TranId < 0)
        //        {
        //            resVal.ResponseMSG = "can't delete default Debtor Creditor name";
        //            resVal.IsSuccess = false;
        //        }
        //        else
        //            resVal = new Dynamic.BusinessLogic.Inventory.Transaction.StockJournal(User.HostName, User.DBName).DeleteFormData(TranId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }

        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        #endregion


        [HttpPost]
        public JsonNetResult getPendingDemand(int FromGodownId, int ToGodownId, DateTime? dateFrom, DateTime? dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.StockTransforDB(User.HostName, User.DBName).getPendingDemand(User.UserId, FromGodownId, ToGodownId, dateFrom.Value, dateTo.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #region "Purchase Invoice"
        public ActionResult PurchaseInvoice()

        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PurchaseInvoice, false)]
        public JsonNetResult SaveUpdatePurchaseInvoice()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PurchaseInvoice>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/purchase", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PurchaseInvoice(User.HostName, User.DBName).SaveFormData(beData);
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
        #region "SalesTarget"

        public ActionResult SalesTarget()
        {
            return View();
        }
        #endregion

        #region "SalesProjection"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesProjection, false)]
        public ActionResult SalesProjection()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesProjection);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesProjection);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesProjection, false)]
        public JsonNetResult SaveUpdateSalesProjection()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesQuotation>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesProjection(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "SalesDeliveryNote"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DeliveryNote, false)]
        public ActionResult SalesDeliveryNote()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DeliveryNote);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DeliveryNote, false)]
        public JsonNetResult SaveSalesDeliveryNote()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.DeliveryNote>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.DeliveryNote(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "SalesDeliveryNoteReturn"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ReceivedChallan, false)]
        public ActionResult SalesDeliveryNoteReturn()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.ReceivedChallan);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReceivedChallan);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ReceivedChallan, false)]
        public JsonNetResult SaveSalesDeliveryNoteReturn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.ReceivedChallan>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.ReceivedChallan(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Sales Quotation"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesQuotation, false)]
        public ActionResult SalesQuotation()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesQuotation);
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesQuotation, false)]
        public JsonNetResult SaveUpdateSalesQuotation()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesQuotation>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesQuotation(User.HostName, User.DBName).SaveFormData(beData);
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


        [HttpGet]
        public JsonNetResult getPendinSalesQuotation(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getPendingQuotation(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Sales Order"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesOrder, false)]
        public ActionResult SalesOrder()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesOrder);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesQuotation, false)]
        public JsonNetResult SaveUpdateSalesOrder()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesOrder>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesOrder(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "SalesOrderCancel"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesOrderCancel, false)]
        public ActionResult SalesOrderCancel()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrderCancel);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesOrderCancel);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesQuotation, false)]
        public JsonNetResult SaveUpdateSalesOrderCancel()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesOrder>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesOrderCancel(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Sales Allotment"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesAllotment, false)]
        public ActionResult SalesAllotment()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesAllotment);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesAllotment, false)]
        public JsonNetResult SaveUpdateSalesAllotment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesInvoice>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/sales", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesAllotment(User.HostName, User.DBName).SaveFormData(beData);
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
        #region "Dispatch Section"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DispatchSection, false)]
        public ActionResult DispatchSection()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DispatchSection, false)]
        public JsonNetResult SaveUpdateDispatchSection()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.DispatchSection>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.DispatchSection(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Dispatch Order"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DispatchOrder, false)]
        public ActionResult DispatchOrder()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DispatchOrder, false)]
        public JsonNetResult SaveUpdateDispatchOrder()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.DispatchOrder>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.DispatchOrder(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Sales Invoice"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesInvoice, false)]
        public ActionResult SalesInvoice()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesInvoice);
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesInvoice, false)]
        public JsonNetResult SaveUpdateSalesInvoice()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesInvoice>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/sales", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesInvoice(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpGet]
        public JsonNetResult GetSalesVehilceListForAutoC()
        {
            var dataColl = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).getVehilceListForAutoComplete(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        #endregion
        #region "SalesReturn"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesReturn, false)]
        public ActionResult SalesReturn()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesReturn);
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalesReturn, false)]
        public JsonNetResult SaveUpdateSalesReturn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.SalesReturn>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/salesreturn", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.SalesReturn(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Purchase Indent"
        public ActionResult Indent()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.IndentForm);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.IndentForm);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IndentForm, false)]
        public JsonNetResult SaveUpdateIndent()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.IndentForm>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.IndentForm(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Purchase Quotation"
        public ActionResult PurchaseQuotation()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseQuotation);
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PurchaseQuotation, false)]
        public JsonNetResult SaveUpdatePurchaseQuotation()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PurchaseQuotation>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/purchasequotation", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PurchaseQuotation(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpGet]
        public JsonNetResult getPendinPurchaseQuotation(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.ReceiptNoteDB(User.HostName, User.DBName).getPendingOrder(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        #endregion
        #region "Purchase Order"
        public ActionResult PurchaseOrder()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseOrder);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PurchaseOrder, false)]
        public JsonNetResult SaveUpdatePurchaseOrder()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PurchaseOrder>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/purchaseorder", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.PurchaseOrder(User.HostName, User.DBName).SaveFormData(beData);
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
        [HttpGet]
        public JsonNetResult getPendinPurchaseOrder(int ledgerId, int? agentId, DateTime? voucherDate)
        {
            if (!agentId.HasValue)
                agentId = 0;

            if (!voucherDate.HasValue)
                voucherDate = DateTime.Today;

            ResponeValues resVal = new ResponeValues();
            Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections dataColl = new Dynamic.BusinessEntity.Inventory.Transaction.PendingDeliverNoteForRecChallanCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.Transaction.PurchaseInvoiceDB(User.HostName, User.DBName).getPendingOrder(User.UserId, ledgerId, agentId.Value, voucherDate.Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion
        #region "Receipt Note"
        public ActionResult ReceiptNote()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNote);

            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ReceiptNote, false)]
        public JsonNetResult SaveUpdateReceiptNote()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.ReceiptNote>(Request["jsonData"]);
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
                                beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/inventory/receiptnote", file));
                            }
                        }
                    }

                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.ReceiptNote(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Receipt Note Return"
        public ActionResult ReceiptNoteReturn()
        {
            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNoteReturn);
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ReceiptNoteReturn, false)]

        public JsonNetResult SaveUpdateReceiptNoteReturn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.ReceiptNote>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreatedBy = User.UserId;
                    beData.ModifyBy = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Inventory.Transaction.ReceiptNoteReturn(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "Purchse Addiional Invoice"
        public ActionResult PurchaseAdditionalInvoice()
        {
            return View();
        }

        public ActionResult PharmacySalesInvoice()
        {
            return View();
        }
        public ActionResult PurchaseDebitNote()
        {
            return View();
        }
        public ActionResult PurchaseCreditNote()
        {
            return View();
        }
        public ActionResult SalesDebitNote()
        {
            return View();
        }
        public ActionResult SalesCreditNote()
        {
            return View();
        }
        public ActionResult SalesAllotmentCancel()
        {
            return View();
        }

        public ActionResult SalesAllotmentReturn()
        {
            return View();
        }
        //[HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PurchaseAdditionalInvoice, false)]
        //public JsonNetResult SaveUpdatePurchaseAdditionalInvoice()
        //{
        //        ResponeValues resVal = new ResponeValues();
        //        try
        //        {

        //            JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
        //            {
        //                DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
        //            };
        //            var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.PurchaseListForAditionInvoice>(Request["jsonData"]);
        //            if (beData != null)
        //            {

        //            resVal = new Dynamic.BusinessLogic.Inventory.Transaction.(User.HostName, User.DBName).SaveFormData(beData);
        //            }
        //            else
        //            {
        //                resVal.ResponseMSG = "Blank Data Can't be Accept";
        //            }

        //        }
        //        catch (Exception ee)
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = ee.Message;
        //        }

        //        return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //    }
        #endregion


        public ActionResult BOM()
        {
            return View();
        }
        public ActionResult MafStockJournal()
        {
            return View();
        }
        public ActionResult PendingSalesOrder()
        {
            return View();
        }

        public ActionResult CounterSales()
        {
            return View();
        }

        #region Missing Purchase Request
        public ActionResult MissingPurchaseRequest()

        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetMissingPurchase()
        {
            Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections dataColl = new Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.MissingPurchase(User.UserId, User.HostName, User.DBName).GetMissingPurchase(0);
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


        public ActionResult PurchaseLandedCost()
        {
            return View();
        }
        public ActionResult PurchaseSauda()
        {
            return View();
        }
        public ActionResult DairyPurchaseSetup(int? tranId = null)
        {
            if (tranId.HasValue)
                ViewBag.TranId = tranId;
            else
                ViewBag.TranId = 0;

            ViewBag.VoucherType = Convert.ToInt32(Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice);
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice);
            ViewBag.DefaultKeyValues = getFilterKeyValue((int)ViewBag.EntityId);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllDairyPS()
        {
            var tranBL = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);
            var beData = tranBL.GetAllPartyDPS(User.UserId);

            return new JsonNetResult() { Data = beData, TotalCount = beData.Count, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetDairyPurchaseSetup(int ProductId, int? PartyId, bool ShowLog)
        {
            var tranBL = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);
            var beData = tranBL.GetDairyPurchaseSetup(User.UserId, ProductId, PartyId, ShowLog);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonNetResult SaveDairyPurchaseSetup(List<Dynamic.BusinessEntity.Setup.DairyPurchaseSetup> dataColl)
        {
            var tranBL = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);
            var beData = tranBL.SaveDairyPurchaseSetup(User.UserId, dataColl);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelDairyPurchaseSetup(int ProductId, int? PartyId)
        {
            var tranBL = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName);
            var beData = tranBL.DeleteDairyPurchaseSetup(User.UserId, ProductId, PartyId);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
        }

        //[HttpPost]
        //public JsonNetResult GetDairyPurchaseSetupById(int ProductId, int? PartyId)
        //{
        //    Dynamic.BE.Setup.DairyPurchaseSetup resVal = new Dynamic.BE.Setup.DairyPurchaseSetup();
        //    try
        //    {
        //        resVal = new Dynamic.BL.Setup.DairyPurchaseSetup(User.UserId, User.HostName, User.DBName).getDairyPurchaseSetupById(ProductId, PartyId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
    }
}