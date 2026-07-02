using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;

namespace PivotalERP.Areas.Inventory.Controllers
{
    public class ReportingController : PivotalERP.Controllers.BaseController
    {

        public ActionResult StockSummary()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.CreditLimitExpiredParty, true)]
        public ActionResult CRLimitExpiredParty()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetCRLimitExpiredParty(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.CreditLimitExpiredCollections dataColl = new Dynamic.ReportEntity.Inventory.CreditLimitExpiredCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PartyAgeingReport(User.HostName, User.DBName).getCreditLimitExpiredPartyList(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.PendingPurchaseOrder, true)]
        public ActionResult PendingPOSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetPendingPOSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingPurchaseOrderSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingPurchaseOrderSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PendingPurchaseOrder(User.HostName, User.DBName).getPendingPurchaseOrderSummary(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.PendingSalesOrder, true)]
        public ActionResult PendingSOSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetPendingSOSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.Dashboard.BE.PendingSalesOrderCollections dataColl = new Dynamic.Dashboard.BE.PendingSalesOrderCollections();
            try
            {
                dataColl = new Dynamic.Dashboard.DA.InventoryDB(User.HostName, User.DBName).getSalesDashBoardDetails21(User.UserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        // GET: Inventory/Reporting
        public ActionResult Product()
        {
            ViewBag.Title = "Product List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProduct);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllProduct()
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.Product(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult Godown()
        {
            ViewBag.Title = "Godown";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfGodown);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllGodown()
        {
            Dynamic.BusinessEntity.Inventory.GodownCollections dataColl = new Dynamic.BusinessEntity.Inventory.GodownCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult SalesMaterializedView()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetSalesMaterializedView(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesMaterializedViewCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesMaterializedViewCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.SalesMaterilizedView(User.HostName, User.DBName).getSalesMaterializedView(User.UserId, dateFrom.Value, dateTo.Value, true);



                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "ProductScheme" 
        public ActionResult ProductScheme()
        {
            ViewBag.Title = "Godown";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductScheme);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductScheme()
        {
            Dynamic.BusinessEntity.Inventory.ProductSchemeCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductSchemeCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.ProductScheme(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        #region "ProductCompany" 
        public ActionResult ProductCompany()
        {
            ViewBag.Title = "Godown";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductCompany);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductCompany()
        {
            Dynamic.BusinessEntity.Inventory.ProductCompanyCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCompanyCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Unit" 
        public ActionResult Unit()
        {
            ViewBag.Title = "Unit";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductUnit);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllUnit()
        {
            Dynamic.BusinessEntity.Inventory.UnitCollections dataColl = new Dynamic.BusinessEntity.Inventory.UnitCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Product Type" 
        public ActionResult ProductType()
        {
            ViewBag.Title = "Unit";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductType);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductType()
        {
            Dynamic.BusinessEntity.Inventory.ProductTypeCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductTypeCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.ProductType(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Product Group" 
        public ActionResult ProductGroup()
        {
            ViewBag.Title = "Unit";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductGroup);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductGroup()
        {
            Dynamic.BusinessEntity.Inventory.ProductGroupCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductGroupCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        #region "Product RackList" 
        public ActionResult ProductRackList()
        {
            ViewBag.Title = "Product Rack List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ProductRackList);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductRackList()
        {
            Dynamic.ReportEntity.Inventory.ProductRackListCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductRackListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.Product(User.HostName, User.DBName).getProductRackList(User.UserId, User.BranchId);
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
        #region "Product Categories" 
        public ActionResult ProductCategories()
        {
            ViewBag.Title = "Unit";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfProductProductCategories);
            return View();
        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllProductCategories()
        {
            Dynamic.BusinessEntity.Inventory.ProductCategoriesCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCategoriesCollections();
            try
            {

                dataColl = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public ActionResult ProductRateList()
        {
            ViewBag.Title = "Product Rate List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.CurrentProductRateList);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllProductRateList(int? PageNumber, int? RowsOfPage, string SearchBy, string SearchVal, out int? TotalRows)
        {
            Dynamic.ReportEntity.Inventory.ProductRateListCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductRateListCollections();
            TotalRows = 0;
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.Product(User.HostName, User.DBName).getProductRateList(User.UserId, User.BranchId, PageNumber, RowsOfPage, SearchBy, SearchVal, out TotalRows);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult PartyWiseProductRate()
        {
            ViewBag.Title = "Party Wise Product Rate";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PartyWiseProductRateList);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllPartywiseProductRate()
        {
            Dynamic.ReportEntity.Inventory.PartyWiseProductRateListCollections dataColl = new Dynamic.ReportEntity.Inventory.PartyWiseProductRateListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PartyWiseProductRateList(User.HostName, User.DBName).getPartyWiseProductRateList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult ProductAlternetUnitList()
        {
            ViewBag.Title = "Product Alternet Unit List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ProductAlternetUnitList);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllProductAlternetUnitList()
        {
            Dynamic.ReportEntity.Inventory.ProductAlternetUnitCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductAlternetUnitCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.Product(User.HostName, User.DBName).getProductAlternetUnit(User.UserId, User.BranchId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult PartyWiseProductList()
        {
            ViewBag.Title = "Party Wise Product List";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PartyWiseProductList);
            return View();
        }
        [HttpGet]
        public JsonNetResultWithEnum GetAllPartyWiseProductList()
        {
            Dynamic.ReportEntity.Inventory.PartyWiseProductListCollections dataColl = new Dynamic.ReportEntity.Inventory.PartyWiseProductListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PartyWiseProductList(User.HostName, User.DBName).getPartyWiseProductList(User.UserId);
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult SalesAllotmentDetails()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetSalesAllotmentDetails(TableFilter filter)
        {
            Dynamic.ReportEntity.Inventory.SalesAllotmentDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAllotmentDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.SalesAllotment(User.HostName, User.DBName).getAllotmentDetails(User.UserId, filter.DateFrom, filter.DateTo, filter);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult CalculateAllotment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.Reporting.Inventory.SalesAllotment(User.HostName, User.DBName).CalculateAllotment(User.UserId, DateTime.Today, DateTime.Today);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult UpdateIntCutOffDate(int ledgerId, DateTime? intCutOffDate)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).UpdateIntCutOffDate(User.UserId, ledgerId, intCutOffDate);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetLedgerFeedback(int ledgerId)
        {
            Dynamic.BusinessEntity.Account.LedgerFeedbackCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerFeedbackCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getLedgerFeedback(User.UserId, ledgerId);

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
        public JsonNetResult UpdateLedgerFeedback(int ledgerId, string remarks)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).AddLedgerFeedback(new Dynamic.BusinessEntity.Account.LedgerFeedback()
                {
                    LedgerId = ledgerId,
                    Remarks = remarks,
                    UserId = User.UserId
                });
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetLedgerDocumentAttachment(int ledgerId)
        {
            Dynamic.BusinessEntity.Account.LedgerDocumentAttachmentCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerDocumentAttachmentCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getDocumentAttachment(User.UserId, ledgerId, (int)Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        //[HttpPost]
        //public JsonNetResult UpdateLedgerDocAttachment()
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {

        //        JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
        //        {
        //            DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
        //        };
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Account.LedgerDocumentAttachment>(Request["jsonData"]);
        //        if (beData != null)
        //        {
        //            Dynamic.BusinessEntity.GeneralDocument document = null;
        //            if (Request.Files.Count > 0)
        //            {
        //                for (int fi = 0; fi < Request.Files.Count; fi++)
        //                {
        //                    HttpPostedFileBase file = Request.Files["file" + fi];
        //                    if (file != null)
        //                    {
        //                        document= GetAttachmentDocuments("/Attachments/account/ledger", file);
        //                        break;
        //                    }
        //                }
        //            }
        //            if (document != null)
        //            {
        //                beData.Path = document.DocPath;
        //                beData.Name = document.Name;
        //                beData.Extension = document.Extension;

        //                beData.UserId = User.UserId;
        //                beData.VoucherType = Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment;
        //                var ledDocCOll = new List<Dynamic.BusinessEntity.Account.LedgerDocumentAttachment>();
        //                ledDocCOll.Add(beData);
        //                resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).SaveUpdateDocumentAttachment(User.UserId, ledDocCOll);

        //            }
        //            else
        //            {
        //                resVal.IsSuccess = false;
        //                resVal.ResponseMSG = "Please ! Select Valid File";
        //            }


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

        [HttpPost]
        public JsonNetResult DelLedgerDocAttachment(int tranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).DelDocumentAttachment(User.UserId, tranId);

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
        public JsonNetResult GetAllotmentInterestDetails(int ledgerId, double interestRate, int creditDays, DateTime? intCutOffDate)
        {
            Dynamic.ReportEntity.Inventory.AllotmentInterestCollections dataColl = new Dynamic.ReportEntity.Inventory.AllotmentInterestCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.SalesAllotment(User.HostName, User.DBName).getAllotmentInterest(User.UserId, ledgerId, interestRate, creditDays, intCutOffDate.Value);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "MIS Reports"

        public ActionResult CompetitorSales()
        {
            return View();
        }

        public ActionResult RdlCompetitorSales()
        {
            return View();
        }

        public ActionResult WeeklySales()
        {
            return View();
        }
        public ActionResult RdlWeeklySales()
        {
            return View();
        }

        #endregion



        #region "Productwise Analysis 
        //public ActionResult SalesAnalysis()
        //{
        //    return View();
        //}
        //[HttpGet]
        //public JsonNetResultWithEnum GetAllSalesAnalysis()
        //{
        //    Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections();
        //    try
        //    {

        //        dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisProductWise(User.HostName, User.DBName).getSalesAnalysisProductWise();
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


        #region "ConsumptionList"

        public ActionResult ConsumptionList()
        {

            return View();
        }

        #endregion

        #region "SalesAnalysis"

        public ActionResult SalesAnalysis()
        {
            return View();
        }
        #endregion

        #region "ProductGroupDetails"

        public ActionResult ProductGroupDetails()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetAllGodownList()
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





        #endregion

        #region"ProductGroup Summary"

        public ActionResult ProductGroupSummary()
        {
            return View();
        }


        #endregion

        #region"ProductGroup SummaryAsList"

        public ActionResult ProductGroupSummaryAsList()
        {
            return View();
        }


        #endregion

        #region"ProductMonthlySummary"
        public ActionResult ProductMonthlySummary()
        {
            return View();
        }
        #endregion

        #region"ProductDailySummary"
        public ActionResult ProductDailySummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetProductDailySummary(int ProductId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningQty = 0; double OpeningAmt = 0;
            Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getProductDailySummary(User.UserId, ProductId, BaseDate.NepaliDate, dateFrom.Value, dateTo.Value, ref OpeningQty, ref OpeningAmt);


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
        public ActionResult PendingStockReceived()
        {
            return View();
        }


        //[HttpPost]
        //public JsonNetResultWithEnum GetPendingStockReceived(int ProductId, DateTime? dateFrom, DateTime? dateTo)
        //{
        //    double OpeningQty = 0; double OpeningAmt = 0;
        //    Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getProductDailySummary(User.UserId, ProductId, BaseDate.NepaliDate, dateFrom.Value, dateTo.Value, ref OpeningQty, ref OpeningAmt);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        #region"PurchaseCostingVoucherWise"
        public ActionResult PurchaseCostingVoucherWise()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseCostingVoucherWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PurchaseCostingVoucherWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.PurchaseCostingVoucherWiseCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PurchaseCostingVoucherWise(User.HostName, User.DBName).getPurchaseCostingVoucherWise(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region"ProductWiseAdditionalCost"
        public ActionResult ProductWiseAdditionalCost()
        {
            return View();
        }
        #endregion


        #region"GodownWiseSummary"
        public ActionResult GodownWiseSummary()
        {
            return View();
        }


        #endregion


        #region"GatePassDetails"
        public ActionResult GatePassDetails()
        {
            return View();
        }
        #endregion

        #region"OutStockBillWise"
        public ActionResult OutStockBillWise()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetOutStockBillWise(DateTime? dateFrom, DateTime? dateTo, string branchIdColl, string voucherIdColl, string ProductIdColl)
        //{
        //    Dynamic.ReportEntity.Inventory.OutStockBillWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.OutStockBillWiseCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.OutStockBillWise(User.HostName, User.DBName).getOutStockBillWise(User.UserId, dateFrom.Value, dateTo.Value, branchIdColl, voucherIdColl, ProductIdColl);


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
        public ActionResult PurchaseSalesBillAutoAdjust()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseSalesBillAutoAdjust(DateTime? dateFrom, DateTime? dateTo, int LedgerId)
        {
            Dynamic.ReportEntity.Inventory.PurchaseAndSalesBillAutoAdjustCollections dataColl = new Dynamic.ReportEntity.Inventory.PurchaseAndSalesBillAutoAdjustCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PurchaseAndSalesBillAutoAdjust(User.HostName, User.DBName).getPurchaseAndSalesBillAutoAdjustSummary(User.UserId, dateFrom.Value, dateTo.Value, LedgerId);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult ProductGroupVoucher()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetProductGroupVoucher(DateTime? dateFrom, DateTime? dateTo, int LedgerId)
        //{
        //    Dynamic.ReportEntity.Inventory.ProductGroupSummaryVoucherWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductGroupSummaryVoucherWiseCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummaryVoucherWise(User.HostName, User.DBName).getProductGroupSummaryVoucherWise(dateFrom.Value, dateTo.Value, LedgerId);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        public ActionResult PartyWiseProductSummary()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPartyWiseProductSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PartyWiseProductSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.PartyWiseProductSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PartyWiseProductSummary(User.HostName, User.DBName).getPartyWiseProductSummary(User.UserId, dateFrom.Value, dateTo.Value, true);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult ProductAgeing()
        {
            return View();
        }
        //[HttpPost]
        //public JsonNetResultWithEnum GetProductAgeing(int ProductGroupId, DateTime? dateFrom, DateTime? dateTo, int r1, int r2, int r3, int r4, int r5, int r6)
        //{
        //    Dynamic.ReportEntity.Inventory.ProductAgeingCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductAgeingCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.ProductAgeing(User.HostName, User.DBName).getProductAgeingReport(User.UserId, ProductGroupId, dateFrom.Value, dateTo.Value, r1, r2, r3, r4, r5, r6);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        #region"ProductVoucher"
        public ActionResult ProductVoucher()
        {
            return View();
        }
        #endregion

        #region "StockMovement"

        public ActionResult StockMovement()
        {
            return View();
        }

        #endregion

        #region "PendingPartsDemand"

        public ActionResult PendingPartsDemand()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingPartsDemand(int PendingType, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PartsDemandIssuesDetails(User.HostName, User.DBName).getPendingPartsDemand(User.UserId, PendingType, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult PendingPartsDemandAdditional()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingPartsDemandAdditional(int PendingType, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PartsDemandIssuesDetails(User.HostName, User.DBName).getPendingPartsDemand(User.UserId, PendingType, dateFrom.Value, dateTo.Value);


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

        #region "PendingCannibalizeIn"

        public ActionResult PendingCannibalizeIn()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetPendingCannibalizeIn(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PartsDemandIssuesDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PendingCannibalizeIn(User.HostName, User.DBName).getPendingCannibalizeIn(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetPendingDeliveryNote(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingDeliveryNoteDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingDeliveryNoteDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PendingDeliveryNoteDetails(User.HostName, User.DBName).getPendingDeliveryNoteDetails(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetReceiptNoteRegister(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.VatRegisterCollections dataColl = new Dynamic.ReportEntity.Inventory.VatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ReceiptNoteAnalysis(User.HostName, User.DBName).getReceiptNoteRegister(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetReceiptNoteAnalysisPartyWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisPartyWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisPartyWiseCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ReceiptNoteAnalysis(User.HostName, User.DBName).getReceiptNoteAnalysisPartWiseWise(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetReceiptNoteAnalysisProductWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ReceiptNoteAnalysis(User.HostName, User.DBName).getReceiptNoteAnalysisProductWise(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetPurchaseVatRegister(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getPurchaseVatRegister(User.UserId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult PurchaseReturnVatRegister()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseReturnVatRegister(DateTime? dateFrom, DateTime? dateTo, int VoucherId = 0, int BranchId = 0)
        {
            Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections dataColl = new Dynamic.ReportEntity.Account.NewPurchaseVatRegisterCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getPurchaseReturnVatRegister(User.UserId, dateFrom.Value, dateTo.Value, VoucherId, BranchId);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult PendingPurchaseOrder()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetPendingPurchaseOrder(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingPurchaseOrderSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingPurchaseOrderSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PendingPurchaseOrder(User.HostName, User.DBName).getPendingPurchaseOrderSummary(User.UserId, dateFrom.Value, dateTo.Value);


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
        //public JsonNetResultWithEnum GetDayBookSummary(DateTime? dateFrom, DateTime? dateTo)
        //{
        //    Dynamic.ReportEntity.Inventory.DayBookSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.DayBookSummaryCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.Summary(User.HostName, User.DBName).getPendingPurchaseOrderSummary(User.UserId, dateFrom.Value, dateTo.Value);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult PendingReceiptNote()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingReceiptNote(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingReceiptNoteDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingReceiptNoteDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.PendingReceiptNote(User.HostName, User.DBName).getPendingReceiptNoteDetails(User.UserId, dateFrom.Value, dateTo.Value);


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

      

        #region "ProductwiseAnalysis"

        public ActionResult ProductwiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "ProductGroupwiseAnalysis"

        public ActionResult ProductGroupwiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "ProductCompanywiseAnalysis"

        public ActionResult ProductCompanywiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "ProductTypewiseAnalysis"

        public ActionResult ProductTypewiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "ProductCategorywiseAnalysis"

        public ActionResult ProductCategorywiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "Register"

        public ActionResult Register()
        {
            return View();
        }

        #endregion


        #region "PartywiseAnalysis"

        public ActionResult PartywiseAnalysis()
        {
            return View();
        }

        #endregion
        #region "PendingDeliveryNote"

        public ActionResult PendingDeliveryNote()
        {
            return View();
        }

        #endregion



        [HttpPost]
        public JsonNetResultWithEnum GetStockMovement(DateTime? dateFrom, DateTime? dateTo, int GodownId, int R1, int R2, int R3, double safetyTIme, double leadTime, double timeInterval, int yearId, int monthId)
        {
            Dynamic.ReportEntity.Inventory.StockMovementCollections dataColl = new Dynamic.ReportEntity.Inventory.StockMovementCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.StockMovement(User.HostName, User.DBName).getStockMovement(dateFrom.Value, dateTo.Value, GodownId, User.UserId, R1, R2, R3, safetyTIme, leadTime, timeInterval, yearId, monthId, true);


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
        public JsonNetResultWithEnum GetConsumption(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ConsumptionCollections dataColl = new Dynamic.ReportEntity.Inventory.ConsumptionCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.Consumption(User.HostName, User.DBName).getConsumationList(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetGatePassDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.GatePassDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.GatePassDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.GatePass(User.HostName, User.DBName).getGatePassDetails(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetProductVoucher(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ProductVoucherDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductVoucherDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductVoucherDetails(User.HostName, User.DBName).getProductVoucherDetails(User.UserId, dateFrom.Value, dateTo.Value);


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
        public JsonNetResultWithEnum GetProductWiseAdditionalCost(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ProductWiseAditionalCostCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductWiseAditionalCostCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductWiseAditionalCost(User.HostName, User.DBName).getProductWiseAditionalCost(User.UserId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResultWithEnum GetProductGroupDetails(int ProductGroupId, DateTime? dateFrom, DateTime? dateTo, string GodownIdColl = "")
        {
            Dynamic.ReportEntity.Inventory.ProductGroupSummaryDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductGroupSummaryDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummary(User.HostName, User.DBName).getProductGroupSummaryDetails(User.UserId, ProductGroupId, dateFrom.Value, dateTo.Value, GodownIdColl);


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
        public JsonNetResultWithEnum GetProductGroupSummary(int ProductGroupId, DateTime? dateFrom, DateTime? dateTo, string VoucherIdColl = "", string GodownIdColl = "", string ProductTypeIdColl = "")
        {
            Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummary(User.HostName, User.DBName).getProductGroupSummary(User.UserId, ProductGroupId, dateFrom.Value, dateTo.Value, false, false, VoucherIdColl, GodownIdColl, ProductTypeIdColl);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "SalesReceiptDetails"


        [HttpPost]
        public JsonNetResultWithEnum GetProductGroupSummaryAsList(int ProductGroupId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummary(User.HostName, User.DBName).getProductGroupSummary(User.UserId, ProductGroupId, dateFrom.Value, dateTo.Value, false, false);


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
        public JsonNetResultWithEnum GetProductMonthlySummary(int ProductId, DateTime? dateFrom, DateTime? dateTo)
        {

            double OpeningQty = 0; double OpeningAmt = 0;

            Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductMonthlySummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getProductMonthlySummary(User.UserId, ProductId, BaseDate.NepaliDate, dateFrom.Value, dateTo.Value, ref OpeningQty, ref OpeningAmt);


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

        public ActionResult GodownVoucher()
        {
            return View();
        }
        public ActionResult PharmacyProductVoucher()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetGodownVoucher(int GodownId, DateTime? dateFrom, DateTime? dateTo, int ProductId)
        {
            Dynamic.ReportEntity.Inventory.GodownVoucherCollections dataColl = new Dynamic.ReportEntity.Inventory.GodownVoucherCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.GodownVoucher(User.HostName, User.DBName).getGodownVoucher(User.UserId, GodownId, dateFrom.Value, dateTo.Value, ProductId);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult FixedProductVoucher()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetFixedProductVoucher(int productId, DateTime? dateFrom, DateTime? dateTo)
        {
            double OpeningQty = 0; double OpeningAmt = 0;
            Dynamic.ReportEntity.Inventory.FixedProductVoucherCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductVoucherCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductVoucher(User.UserId, productId, dateFrom.Value, dateTo.Value, ref OpeningQty, ref OpeningAmt);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult FixedProductInOutDetails()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResultWithEnum GetFixedProductInOutDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.FixedProductInOutDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductInOutDetailsCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.FixedProductInOutDetails(User.HostName, User.DBName).getFixedProductInOutDetails(User.UserId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResultWithEnum GetGodownWiseProductSummary(int GodownId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductGroupSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummary(User.HostName, User.DBName).getGodownWiseProductSummary(User.UserId, GodownId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult MultipleProductVoucher()
        {
            return View();
        }

        public ActionResult PharmacyStockSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetMultipleProductVoucher(DateTime? dateFrom, DateTime? dateTo, string ProductIdColl, string GodownIdColl)
        {
            Dynamic.ReportEntity.Inventory.MultipleProductVoucherCollections dataColl = new Dynamic.ReportEntity.Inventory.MultipleProductVoucherCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.MultipleProductVoucher(User.HostName, User.DBName).getMultipleProductVoucher(User.UserId, dateFrom.Value, dateTo.Value, ProductIdColl, GodownIdColl);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult ProductABC()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetProductABC(int ProductGroupId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.ProductABCCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductABCCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductGroupSummary(User.HostName, User.DBName).getProductAbc(User.UserId, ProductGroupId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult FixedProductList()
        {
            return View();
        }

        //[HttpPost]
        //public JsonNetResultWithEnum GetFixedProductList(int ProductId, DateTime? dateFrom, DateTime? dateTo)
        //{
        //    Dynamic.ReportEntity.Inventory.FixedProductListCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductListCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductList(User.UserId, ProductId, dateFrom.Value, dateTo.Value);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        public ActionResult FixedVoucher()
        {
            return View();
        }
        public JsonNetResultWithEnum GetFixedVoucher(DateTime? dateFrom, DateTime? dateTo, int ProductId)
        {
            double OpeningQty = 0; double OpeningAmt = 0;
            Dynamic.ReportEntity.Inventory.FixedProductVoucherCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductVoucherCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductVoucher(User.UserId, ProductId, dateFrom.Value, dateTo.Value, ref OpeningQty, ref OpeningAmt);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult FixedProductSalesList()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetFixedProductSalesList(int ProductId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.FixedProductSalesListCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductSalesListCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductSalesList(User.UserId, ProductId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult FixedProductSalesSummary()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetFixedProductSalesSummary(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.FixedProductSalesSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductSalesSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductSalesSummary(User.UserId, dateFrom.Value, dateTo.Value);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult FixedProductOpeningList()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetFixedProductOpeningList()
        {

            Dynamic.ReportEntity.Inventory.FixedProductOpeningSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.FixedProductOpeningSummaryCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductMonthlySummary(User.HostName, User.DBName).getFixedProductOpeningSummary(User.UserId);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        public ActionResult ProductCurrentStatus()
        {
            return View();
        }

    

        //[HttpPost]
        //public JsonNetResultWithEnum GetProductCurrentStatus(ref Dynamic.BusinessEntity.Inventory.Product product)
        //{
        //    Dynamic.ReportEntity.Inventory.ProductCurrentStatusCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductCurrentStatusCollections();
        //    try
        //    {
        //        dataColl = new Dynamic.Reporting.Inventory.ProductCurrentStatus(User.HostName, User.DBName).getProductCurrentStatus(ref product);


        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        #region "PurchaseAnalysisProductWise"
        public ActionResult PurchaseAnalysisProductWise()
        {
            ViewBag.Title = "PurchaseAnalysisProductWise";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PurchaseAnalysisProductWise);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllPurchaseAnalysisProductWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisProductWise(User.HostName, User.DBName).getSalesAnalysisProductWise(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "PurchaseAnalysisProductCompanyWise"
        public ActionResult PurchaseProductCompanyWise()
        {
            ViewBag.Title = "PurchaseAnalysisProductCompanyWise";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PurchaseAnalysisProductCompanyWise);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllPurchaseAnalysisProductCompanyWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisProductWise(User.HostName, User.DBName).getSalesAnalysisProductCompanyWise(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "PurchaseAnalysisPartyWise"
        public ActionResult PurchaseAnalysisPartyWise()
        {
            ViewBag.Title = "PurchaseAnalysisPartyWise";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PurchaseAnalysisPartyWise);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllPurchaseAnalysisPartyWise()
        {
            Dynamic.ReportEntity.Inventory.PartyWiseProductListCollections dataColl = new Dynamic.ReportEntity.Inventory.PartyWiseProductListCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PartyWiseProductList(User.HostName, User.DBName).getPartyWiseProductList(User.UserId);
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
        public JsonNetResult GetAllLedgerGroupList()
        {
            Dynamic.BusinessEntity.Account.LedgerGroupCollections dataColl = new Dynamic.BusinessEntity.Account.LedgerGroupCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        #region "SALES BOOK"

        #region "SALES ANALYSIS PARTYWISE"
        public ActionResult SalesAnalysisPartyWise()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetSalesAnalysisPartyWise(DateTime? dateFrom, DateTime? dateTo, String procName)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisPartyWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisPartyWiseCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisPartyWise(User.HostName, User.DBName).getSalesAnalysisPartWiseWise(User.UserId, dateFrom.Value, dateTo.Value, procName);


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

        #region "SALES ANALYSIS PRODUCT WISE"
        public ActionResult SalesAnalysisProductWise()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetSalesAnalysisProductWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesAnalysisProductWiseCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisProductWise(User.HostName, User.DBName).getSalesAnalysisProductWise(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "SALES PRICE HISTORY PARTYWISE"
        public ActionResult SalesPriceHistoryPartyWise()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetSalesPriceHistoryPartyWise(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PriceHistoryCollections dataColl = new Dynamic.ReportEntity.Inventory.PriceHistoryCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesAnalysisPartyWise(User.HostName, User.DBName).getSalesPriceHistoryPartWiseWise(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "SALES VAT REGISTER"
        public ActionResult SalesVatRegister()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetSalesVatRegister(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.VatRegisterCollections dataColl = new Dynamic.ReportEntity.Inventory.VatRegisterCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getSalesVatRegister(User.UserId, BaseDate.NepaliDate, dateFrom.Value, dateTo.Value);


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

        #region "SALES RETURN VAT REGISTER"
        public ActionResult SalesReturnVatRegister()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetSalesReturnVatRegister(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.VatRegisterCollections dataColl = new Dynamic.ReportEntity.Inventory.VatRegisterCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.VatRegister(User.HostName, User.DBName).getSalesReturnVatRegister(User.UserId, BaseDate.NepaliDate, dateFrom.Value, dateTo.Value);


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

        #region "SALES INVOICE DETAILS"
        public ActionResult SalesInvoiceDetails()
        {
            ViewBag.Title = "SalesInvoiceDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.SalesInvoiceDetails);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetSalesInvoiceDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesInvoiceDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesInvoiceDetailsCollections();
            try
            {


                dataColl = new Dynamic.Reporting.Inventory.SalesRegister(User.HostName, User.DBName).getSalesInvoiceDetails(User.UserId, dateFrom.Value, dateTo.Value);
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

        #region "PENDING SALES PROJECTION"
        public ActionResult PendingSalesProjection()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingSalesProjection(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingSalesProjectionDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingSalesProjectionDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingSalesOrderDetails(User.HostName, User.DBName).getPendingSalesProjection(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "PENDING SALES QUOTATION"
        public ActionResult PendingSalesQuotation()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingSalesQuotation(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingSalesQuotationCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingSalesQuotationCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingSalesQuotation(User.HostName, User.DBName).getPendingSalesQuotationPartyAndProductWise(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "Pending Sales Order"
        public ActionResult PendingSalesOrder()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingSalesOrder(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingSalesOrderDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingSalesOrderDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingSalesOrderDetails(User.HostName, User.DBName).getPendingSalesDetails(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "SALES CREDIT LIMIT SUMMARY BILLWISE"
        public ActionResult SalesCreditLimitSummaryBillWise()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetSalesCreditLimitSummaryBillWise(int CreditLimitExpiredDays, int AfterDays)
        {
            Dynamic.ReportEntity.Inventory.SalesInvoiceCreditLimitSummaryCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesInvoiceCreditLimitSummaryCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesInvoiceCreditLimitSummary(User.HostName, User.DBName).getSalesInvoiceCreditLimitSummary(User.UserId, CreditLimitExpiredDays, AfterDays);


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

        #region "PENDING DISPATCH ORDER"
        public ActionResult PendingDispatchOrder()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingDispatchOrder(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingDispatchOrderDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingDispatchOrderDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingDispatchOrderDetails(User.HostName, User.DBName).getPendingDispatchOrderDetails(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "PENDING DISPATCH SECTION"
        public ActionResult PendingDispatchSection()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingDispatchSection(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingDispatchSectionDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingDispatchSectionDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingDispatchSectionDetails(User.HostName, User.DBName).getPendingDispatchSectionDetails(User.UserId, dateFrom.Value, dateTo.Value);


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

        #region "SALES RECIPET DETAILS"
        public ActionResult SalesReceiptDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetSalesReceiptDetails(int LedgerGroupId, DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesReceiptDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesReceiptDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.SalesReceiptDetails(User.HostName, User.DBName).getSalesReceiptDetails(User.UserId, LedgerGroupId, dateFrom.Value, dateTo.Value);


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

        #region "PENDING SALES ALLOTMENT"
        public ActionResult PendingSalesAllotment()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPendingSalesAllotment(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.PendingSalesOrderDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.PendingSalesOrderDetailsCollections();
            try
            {

                dataColl = new Dynamic.Reporting.Inventory.PendingSalesAllotment(User.HostName, User.DBName).getPendingSalesAllotment(User.UserId, dateFrom.Value, dateTo.Value);


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

        public ActionResult SalesReturnRefbySalesInvoive()
        {
            return View();
        }
        public ActionResult SalesDebitNoteRefBySalesInvoice()
        {
            return View();
        }
        public ActionResult SalesCreditNoteRefBySalesInvoice()
        {
            return View();
        }
        public ActionResult PurchaseReturnRefbyPurchaseInvoive()
        {
            return View();
        }       
        public ActionResult PurchaseDebitNoteRefByPurchaseInvoice()
        {
            return View();
        }
        public ActionResult PurchaseCreditNoteRefByPurchaseInvoice()
        {
            return View();
        }

        //[HttpGet]
        //public JsonNetResultWithEnum GetAllProductPriceList()
        //{
        //    Dynamic.ReportEntity.Inventory.ProductRateListCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductRateListCollections();
        //    try
        //    {

        //        dataColl = new Dynamic.Reporting.Inventory.Product(User.HostName, User.DBName).getProductRateList(User.UserId, User.BranchId);
        //        return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        public ActionResult StockTransfer()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResultWithEnum GetStocktransfer(DateTime? dateFrom, DateTime? dateTo, int GodownId)
        {
            Dynamic.ReportEntity.Inventory.StockTransferCollections dataColl = new Dynamic.ReportEntity.Inventory.StockTransferCollections();
            try
            {
                dataColl = new Dynamic.BL.Inventory.StockTransfer(User.UserId,User.HostName, User.DBName).GetAllStockTransfer(0,dateFrom.Value, dateTo.Value, GodownId);


                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult DairyPurchaseReport()
        {
            return View();
        }
        public ActionResult DairySalesReport()
        {
            return View();
        }

        public ActionResult MedicineStock()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetAllMStock()
        {
            PivotalERP.BE.Inventory.MStockCollections dataColl = new PivotalERP.BE.Inventory.MStockCollections();
            try
            {
                dataColl = new PivotalERP.BL.Inventory.MStock(User.UserId, User.HostName, User.DBName).GetAllMStock(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult NearExpiry()
        {
            return View();
        }

        public ActionResult ProductionOrder()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetProductionOrder(DateTime? DateFrom, DateTime? DateTo, string BranchIdColl)
        {
            Dynamic.ReportEntity.Inventory.ProductionOrderCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductionOrderCollections();
            try
            {
                dataColl = new Dynamic.DA.Inventory.ProductionOrderDB(User.HostName, User.DBName).getAllProductionOrder(User.UserId,DateFrom.Value, DateTo.Value, BranchIdColl);


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
        public JsonNetResultWithEnum GetProductAgeing()
        {
            DateTime dateFrom = DateTime.Today, dateTo = DateTime.Today;
            int ProductGroupId = 1;
            List<int> AgeList = new List<int>();
            int? GodownId = null;

            Newtonsoft.Json.Linq.JObject para = DeserializeObject<Newtonsoft.Json.Linq.JObject>(Request["jsonData"]);

            if (para != null)
            {

                if (para.ContainsKey("dateFrom") && para["dateFrom"] != null && !string.IsNullOrEmpty(para["dateFrom"].ToString()))
                    dateFrom = Convert.ToDateTime(para["dateFrom"]);

                if (para.ContainsKey("dateTo") && para["dateTo"] != null && !string.IsNullOrEmpty(para["dateTo"].ToString()))
                    dateTo = Convert.ToDateTime(para["dateTo"]);

                if (para.ContainsKey("ProductGroupId") && para["ProductGroupId"] != null)
                    ProductGroupId = Convert.ToInt32(para["ProductGroupId"]);

                if (para.ContainsKey("GodownId") && para["GodownId"] != null)
                    GodownId = Convert.ToInt32(para["GodownId"]);

                if (para.ContainsKey("AgeList") && para["AgeList"] != null)
                {
                    var strColl = para["AgeList"].ToString().Split(',');
                    foreach (var s in strColl)
                    {
                        int val = 0;
                        int.TryParse(s, out val);

                        if (val > 0)
                        {
                            AgeList.Add(val);
                        }
                    }
                }
                else
                {
                    AgeList = new List<int>();
                    AgeList.Add(15);
                    AgeList.Add(30);
                    AgeList.Add(60);
                    AgeList.Add(90);
                }
            }


            int r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0, r6 = 0, r7 = 0, r8 = 0, r9 = 0, r10 = 0;

            for (int ind = 0; ind < AgeList.Count; ind++)
            {
                switch (ind)
                {
                    case 0:
                        r1 = AgeList[ind];
                        break;
                    case 1:
                        r2 = AgeList[ind];
                        break;
                    case 2:
                        r3 = AgeList[ind];
                        break;
                    case 3:
                        r4 = AgeList[ind];
                        break;
                    case 4:
                        r5 = AgeList[ind];
                        break;
                    case 5:
                        r6 = AgeList[ind];
                        break;
                    case 6:
                        r7 = AgeList[ind];
                        break;
                    case 7:
                        r8 = AgeList[ind];
                        break;
                    case 8:
                        r9 = AgeList[ind];
                        break;
                    case 9:
                        r10 = AgeList[ind];
                        break;
                }
            }

            Dynamic.ReportEntity.Inventory.ProductAgeingCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductAgeingCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Inventory.ProductAgeing(User.HostName, User.DBName).getProductAgeingReport(User.UserId, ProductGroupId, dateFrom, dateTo, r1, r2, r3, r4, r5, r6, GodownId);

                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "PURCHASE INVOICE DETAILS"
        public ActionResult PurchaseInvoiceDetails()
        {
            ViewBag.Title = "PurchaseInvoiceDetails";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.PurchaseInvoiceDetails);
            return View();
        }
        [HttpPost]
        public JsonNetResultWithEnum GetPurchaseInvoiceDetails(DateTime? dateFrom, DateTime? dateTo)
        {
            Dynamic.ReportEntity.Inventory.SalesInvoiceDetailsCollections dataColl = new Dynamic.ReportEntity.Inventory.SalesInvoiceDetailsCollections();
            try
            {


                dataColl = new Dynamic.Reporting.Inventory.SalesRegister(User.HostName, User.DBName).getPurchaseInvoiceDetails(User.UserId, dateFrom.Value, dateTo.Value);
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


        public ActionResult PurchaseAnalysis()
        {
            return View();
        }
        public ActionResult PartyAgeing()
        {
            return View();
        }

    }
}