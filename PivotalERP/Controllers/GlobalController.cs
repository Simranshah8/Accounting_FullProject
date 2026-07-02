using Dynamic.DataAccess.Account;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Controllers
{
    public class GlobalController : BaseController
    {
        public ActionResult MultipleSelect()
        {
            return View();
        }

        [HttpGet]
        public JsonNetResult GetAllLedger(int Top, string ColName, string Operator, bool ForTransaction, string OrderByCol, string ColValue, int LedgerType = 0)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
                    para.Top = Top;
                    para.ColName = ColName;
                    para.Operator = Operator;
                    para.ForTransaction = ForTransaction;
                    para.OrderByCol = OrderByCol;
                    para.ColValue = ColValue;
                    para.UserId = User.UserId;
                    Dynamic.BusinessEntity.Common.LedgerCollections dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getAllLedger(para, (Dynamic.APIEnitity.Account.LEDGERTYPES)LedgerType);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetLedgerDetail(int LedgerId, int? VoucherType, DateTime? DateFrom, DateTime? DateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (LedgerId == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Ledger Not Found. Pls Select Valid Ledger";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.LedgerDetails dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getLedgerDetails(User.UserId, LedgerId, DateFrom, DateTo, VoucherType);

                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetAllProduct(int Top, string ColName, string Operator, string OrderByCol, string ColValue)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {


                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
                    para.Top = Top;
                    para.ColName = ColName;
                    para.Operator = Operator;
                    para.OrderByCol = OrderByCol;
                    para.ColValue = ColValue;

                    para.UserId = User.UserId;
                    Dynamic.BusinessEntity.Common.ProductCollections dataColl = new Dynamic.DataAccess.Common.ProductDB(User.HostName, User.DBName).getAllProduct(para);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        //[HttpGet]
        //public JsonNetResult GetProductDetail(int ProductId, int? LedgerId, int? VoucherType, DateTime? VoucherDate, DateTime? DateFrom, DateTime? DateTo)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {

        //        if (ProductId == 0)
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = "Product Not Found. Pls Select Valid Product";
        //        }
        //        else
        //        {
        //            Dynamic.BusinessEntity.Common.ProductDetails dataColl = new Dynamic.DataAccess.Common.ProductDB(User.HostName, User.DBName).getProductDetails(User.UserId, ProductId, LedgerId, VoucherDate, DateFrom, DateTo, VoucherType, User.BranchId);

        //            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        //[HttpGet]
        //public JsonNetResult GetAllCostCenter(int Top, string ColName, string Operator, bool ForTransaction, string OrderByCol, string ColValue, int LedgerType = 0)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {

        //        if (string.IsNullOrEmpty(ColName))
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = "Column Name Not Define";
        //        }
        //        else if (string.IsNullOrEmpty(ColName))
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = "Column Value Not Define";
        //        }
        //        else
        //        {
        //            Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
        //            para.Top = Top;
        //            para.ColName = ColName;
        //            para.Operator = Operator;
        //            para.ForTransaction = ForTransaction;
        //            para.OrderByCol = OrderByCol;
        //            para.ColValue = ColValue;
        //            para.UserId = User.UserId;
        //            Dynamic.BusinessEntity.Common.CostCenterCollections dataColl = new Dynamic.DataAccess.Common.CostCenterDB(User.HostName, User.DBName).getAllCostCenter(para);

        //            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;

        //    }
        //    return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        [HttpGet]
        public JsonNetResult GetCompanyDetail()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                Dynamic.BusinessEntity.Setup.CompanyDetail dataColl = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetailsForWeb(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetMonthDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                MonthDetailsCollections dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getMonthDetails(User.UserId, null, null);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveListState()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = Request["jsonData"].ToString();
                byte[] bytes = System.Text.Encoding.ASCII.GetBytes(beData);
                int entityId = Convert.ToInt32(Request["entityId"].ToString());
                bool isReport = Convert.ToBoolean(Request["isReport"].ToString());
                if (beData != null)
                {

                    new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveListStateWeb(User.UserId, entityId, bytes, isReport);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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
        public JsonNetResult GetListState(int entityId, bool isReport)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string state = "";
                var dataResult = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getListStateWeb(User.UserId, entityId, isReport);
                if (dataResult != null)
                {
                    state = System.Text.Encoding.UTF8.GetString(dataResult);
                }

                return new JsonNetResult() { Data = state, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEntityByVoucherType(int VoucherType)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var vt = (Dynamic.BusinessEntity.Account.VoucherTypes)VoucherType;
                switch (vt)
                {
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Receipt);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Payment);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Journal);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Contra);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseQuotation);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNote);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseReturn);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesQuotation);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DeliveryNote);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesInvoice);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesReturn);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockJournal);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockTransfor);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesAllotment);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection);
                        break;
                }

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;


            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetVatTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.Transaction.TDSVATTYPES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetChequeTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.Transaction.CheckTypes)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductMarketValuation()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.MarketValuationMethods)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        private Dynamic.BusinessEntity.Global.FormsEntity GetEntityFromVoucherType(Dynamic.BusinessEntity.Account.VoucherTypes voucher)
        {
            switch (voucher)
            {
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Receipt;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Payment;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Journal;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Contra;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNote;
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNoteReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DeliveryNote;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DispatchOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemand:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PartsDemand;
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                    return Dynamic.BusinessEntity.Global.FormsEntity.StockTransfor;
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                    return Dynamic.BusinessEntity.Global.FormsEntity.StockJournal;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesAllotment;


            }
            return Dynamic.BusinessEntity.Global.FormsEntity.CompanyAlternation;
        }

        //[HttpPost]
        //public JsonNetResult DelAccInvTransaction(Dynamic.BusinessEntity.Account.VoucherTypes voucherType, int voucherId, int tranId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {

        //        Dynamic.BusinessEntity.Global.FormsEntity entity = GetEntityFromVoucherType(voucherType);
        //        Dynamic.BusinessEntity.Global.VoucherDefaultValues voucherDefault = new Dynamic.DataAccess.Global.GlobalDB(hostName, dbName).IsValidVoucher(User.UserId, Convert.ToInt32(entity), voucherId, DateTime.Today, 3, false);
        //        if (voucherDefault.IsSuccess)
        //        {
        //            switch (voucherType)
        //            {
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
        //                    resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(hostName, dbName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra).Delete(tranId); break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.DeliveryNoteDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
        //                    resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(hostName, dbName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemand:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PartsDemandDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
        //                    resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(hostName, dbName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PhysicalStock:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PhysicalStockDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseAdditionalInvoice:
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseInvoiceDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseOrderDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseQuotationDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseReturnDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
        //                    resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(hostName, dbName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.ReceiptNoteDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAdditionalInvoice:
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesOrderDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesQuotationDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesReturnDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.StockJournalDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.StockTransforDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeIn:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.CannibalizeInDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeOut:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.CannibalizeOutDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.ManufacturingStockJournal:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.ManufacturingStockJournalDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.ReceiptNoteReturnDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.DispatchOrderDB(hostName, dbName).Delete(tranId);
        //                    break;
        //                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
        //                    resVal = new Dynamic.DataAccess.Inventory.Transaction.DispatchSectionDB(hostName, dbName).Delete(tranId);
        //                    break;
        //            }

        //            if (resVal.IsSuccess)
        //            {
        //                Dynamic.BusinessEntity.Global.AuditLog auditLog = new Dynamic.BusinessEntity.Global.AuditLog();
        //                auditLog.TranId = tranId;
        //                auditLog.EntityId = entity;
        //                auditLog.Action = Dynamic.BusinessEntity.Global.Actions.Delete;
        //                auditLog.LogText = "Delete " + entity.ToString();
        //                auditLog.AutoManualNo = tranId.ToString();
        //                SaveAuditLog(auditLog);
        //            }

        //            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        //        }
        //        else
        //        {
        //            resVal.IsSuccess = false;
        //            resVal.ResponseMSG = voucherDefault.ResponseMSG;
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }

        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        //Added By Suresh on 17 Ashwin starts

        [HttpPost]
        public JsonNetResult GetDate(DateTime? forDate)
        {
            Dynamic.BusinessEntity.Global.CurrentDate resVal = new Dynamic.BusinessEntity.Global.CurrentDate();
            try
            {
                resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).GetDateDetail(User.UserId, forDate);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal = null;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };
        }


        [HttpGet]
        public JsonNetResult GetAllEmployee(int Top, string ColName, string Operator, string OrderByCol, string ColValue)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColValue))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {

                    Dynamic.BE.HR.EmployeeAutoCompleteCollections dataColl = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).getAllEmployeeAutoComplete(ColName, Operator, ColValue);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetDocumentTypes()
        {
            Dynamic.BusinessEntity.Account.DocumentTypeCollections resVal = new Dynamic.BusinessEntity.Account.DocumentTypeCollections();
            try
            {
                resVal = new Dynamic.DataAccess.Account.DocumentTypeDB(User.HostName, User.DBName).getAllDocumentType(User.UserId);

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal = null;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };
        }


        [HttpGet]
        public JsonNetResult GetNotificationIdKey()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var newObj = new
                {
                    IsSuccess = true,
                    ResponseMSG = "Success",
                    Id = OnesignalId,
                    UserId = User.UserId,
                    CustomerCode = CustomerCode
                };
                return new JsonNetResult() { Data = newObj, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetGPSLog(int forUserId, DateTime dateFrom,DateTime dateTo)
        {
            Dynamic.APIEnitity.GPS.GPSLogCollections dataColl = new Dynamic.APIEnitity.GPS.GPSLogCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.GPS.GPSLogDB(User.HostName, User.DBName).getGPSLog(User.UserId, forUserId, dateFrom, dateTo);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };
        }

    }
}