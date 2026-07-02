using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Account;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.Account.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {

        #region "Ledger"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Ledger)]
        public ActionResult Ledger(int tranId = 0)
        {
            ViewBag.TranId = tranId;
            return View();
        }
        //[HttpGet]
        //public JsonNetResult GetSalesLedger()
        //{
        //    var dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getSalesLedger(User.UserId);

        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpGet]
        //public JsonNetResult GetPurchaseLedger()
        //{
        //    var dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getPurchaseLedger(User.UserId);

        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        [HttpPost]
        public JsonNetResult GetLedgerById(int ledgerId)
        {
            Dynamic.BusinessEntity.Account.Ledger dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getLedgerById(User.UserId, ledgerId);
            new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getLedgerDetailsByLedgerId(ref dataColl);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetBillWiseDues(int BranchId, int LedgerId, int CostClassId)
        {
            double openingAmt = 0;
            Dynamic.BusinessEntity.Account.BillWiseDuesCollections dataColl = new Dynamic.DataAccess.Account.BillWiseDuesDB(User.HostName, User.DBName).getBillWiseDues(LedgerId, BranchId, User.UserId, ref openingAmt);
            var retData = new
            {
                OpeningAmt = openingAmt,
                BillColl = dataColl
            };
            return new JsonNetResult() { Data = retData, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        //[HttpPost]
        //public JsonNetResult SaveBillWiseOpening()
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        string str = Request["jsonData"];
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Account.BillWiseDuesCollections>(str);
        //        var openData = DeserializeObject<Dynamic.BusinessEntity.Account.LedgerOpeningDetails>(Request["openingData"]);
        //        if (beData != null)
        //        {
        //            var first = beData.First();
        //            resVal = new Dynamic.DataAccess.Account.BillWiseDuesDB(User.HostName, User.DBName).SaveUpdate(first.LedgerId, first.BranchId, User.UserId, beData, openData);
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

        //[HttpPost]
        //public JsonNetResult GetLedgerOpeningforBranch(int BranchId, int LedgerId,int? ProjectId/*, DateTime voucherDate*/)
        //{
        //    Dynamic.BusinessEntity.Account.LedgerOpeningDetails dataColl = new Dynamic.DataAccess.Account.LedgerDB(User.HostName, User.DBName).getLedgerOpeningforBranch(BranchId, LedgerId, ProjectId /*voucherDate, */, User.UserId);

        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        [HttpPost]
        public JsonNetResult SaveUpdateLedgerOpeningforBranch(Dynamic.BusinessEntity.Account.LedgerOpeningDetailsCollections dataColl)
        {
            var resVal = new Dynamic.DataAccess.Account.LedgerDB(User.HostName, User.DBName).updateLedgerOpeningforBranch(User.UserId, dataColl);

            return new JsonNetResult() { Data = resVal, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetLedgerCode(string name, int? ledgerGroupId)
        {
            var dataColl = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).getLedgerCode(User.UserId, name, ledgerGroupId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Ledger)]
        public JsonNetResult SaveLedger()
        {
            string photoLocation = "/Attachments/account/ledger";
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Ledger>(str);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    var tmpAttachmentColl = beData.DocumentColl;

                    beData.DocumentColl = new Dynamic.BusinessEntity.Account.LedgerDocumentCollections();
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
                                beData.DocumentColl.Add
                                    (
                                     new Dynamic.BusinessEntity.Account.LedgerDocument()
                                     {
                                         Data = att.Data,
                                         DocPath = att.DocPath,
                                         DocumentTypeId = v.DocumentTypeId,
                                         Extension = att.Extension,
                                         Name = v.Name,
                                         Description = v.Description,
                                         LogDateTime = DateTime.Now
                                     }
                                    );
                            }
                            fInd++;
                        }
                    }

                    foreach (var v in tmpAttachmentColl)
                    {
                        if (!string.IsNullOrEmpty(v.DocPath) && v.Data == null)
                        {
                        }
                    }

                    if (beData.LedgerId > 0)
                        resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Ledger)]
        public JsonNetResult DelLedger(int LedgerId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.Ledger(User.HostName, User.DBName).DeleteById(User.UserId, LedgerId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAditionalCostTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            int id = 1;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Setup.AditionalCostOnTheBasisOf)))
            {
                Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                beData.Id = id;
                beData.Text = str;
                dataColl.Add(beData);
                id++;
            }
            dataColl.IsSuccess = true;
            dataColl.ResponseMSG = GLOBALMSG.SUCCESS;


            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        [HttpPost]
        public JsonNetResult GetTypeOfDutyTaxs()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            int id = 1;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.TypeOfDutyTaxs)))
            {
                Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                beData.Id = id;
                beData.Text = str;
                dataColl.Add(beData);
                id++;
            }
            dataColl.IsSuccess = true;
            dataColl.ResponseMSG = GLOBALMSG.SUCCESS;


            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetTypeOfIncomeExpenses()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            int id = 1;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.TypeOfIncomeExpenses)))
            {
                Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                beData.Id = id;
                beData.Text = str;
                dataColl.Add(beData);
                id++;
            }
            dataColl.IsSuccess = true;
            dataColl.ResponseMSG = GLOBALMSG.SUCCESS;


            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllDebtorTypeList()
        {
            Dynamic.BusinessEntity.Account.DebtorTypeCollections dataColl = new Dynamic.BusinessEntity.Account.DebtorTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetAllDebtorRouteList(int? Status)
        {
            Dynamic.BusinessEntity.Account.DebtorRouteCollections dataColl = new Dynamic.BusinessEntity.Account.DebtorRouteCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).getAllAsList(User.UserId, Status);
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
        public JsonNetResult GetAllCurrencyList()
        {
            Dynamic.BusinessEntity.Account.CurrencyCollections dataColl = new Dynamic.BusinessEntity.Account.CurrencyCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Currency(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetAllAreaMasterList()
        {
            Dynamic.BusinessEntity.Account.AreaMasterCollections dataColl = new Dynamic.BusinessEntity.Account.AreaMasterCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Narration"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.NarrationMaster)]
        public ActionResult NarrationMaster()
        {

            return View();
        }
        [ValidateInput(false)]
        [HttpGet]
        public JsonNetResult GetVoucherWiseNarration(int voucherType)
        {
            List<string> dataColl = new Dynamic.DataAccess.Account.NarrationMasterDB(User.HostName, User.DBName).getNarrationMasterAsList(User.UserId, (Dynamic.BusinessEntity.Account.VoucherTypes)voucherType);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.NarrationMaster)]
        public JsonNetResult SaveNarrationMaster()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.NarrationMaster>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.Name == null)
                            resVal = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.NarrationMaster)]
        public JsonNetResult GetNarrationMasterById(int NarrationMasterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).getNarrationMasterById(User.UserId, NarrationMasterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        //[HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.NarrationMaster)]
        //public JsonNetResult GetSalesManById(int AgentId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        resVal = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).getAgentById(AgentId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }

        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.NarrationMaster)]
        public JsonNetResult DeleteSalesMan(int AgentId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (AgentId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Narration Master name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).DeleteById(AgentId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.NarrationMaster)]
        public JsonNetResult DeleteNarrationMaster(int NarrationMasterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (NarrationMasterId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Narration Master name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).DeleteById(NarrationMasterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllNarrationMaster()
        {
            Dynamic.BusinessEntity.Account.NarrationMasterCollections dataColl = new Dynamic.BusinessEntity.Account.NarrationMasterCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.NarrationMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
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



        #region "SalesMan / Agent"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.SalesMan)]
        public ActionResult Salesman()
        {
            ViewBag.Title = "Salesman";
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.RptFormsEntity.ListOfSalesMan);
            return View();
        }
        [HttpGet]
        public JsonNetResult GetAllSalesMan()
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
        public JsonNetResult GetAreaMaster()
        {
            Dynamic.BusinessEntity.Account.AreaMasterCollections dataColl = new Dynamic.BusinessEntity.Account.AreaMasterCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        [HttpGet]
        public JsonNetResult GetCostCategories()
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




        [HttpPost]
        public JsonNetResult SaveSalesMan()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Agent>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.AgentId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.Agent(User.HostName, User.DBName).SaveFormData(beData);
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

        #region "CostClass"

        [HttpGet]
        public JsonNetResult GetCostClassForEntry()
        {
            var dataColl = new Dynamic.DataAccess.Account.CostClassDB(User.HostName, User.DBName).getAllCostClass(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        [HttpGet]

        public JsonNetResult GetSalesCostCenter()
        {
            var dataColl = new Dynamic.DataAccess.Common.CostCenterDB(User.HostName, User.DBName).getSalesCostCenter(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetPurchaseCostCenter()
        {
            var dataColl = new Dynamic.DataAccess.Common.CostCenterDB(User.HostName, User.DBName).getPurchaseCostCenter(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        #region "Currency"
        [HttpGet]
        public JsonNetResult GetAllCurrency()
        {
            var dataColl = new Dynamic.DataAccess.Account.CurrencyDB(User.HostName, User.DBName).getAllCurrency(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCurrencyRate(int CurrencyId)
        {
            try
            {
                var dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getCurrencyRate(CurrencyId, DateTime.Today);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = false, ResponseMSG = ee.Message };
            }
        }

        #endregion



        #region DebtorCreditorsType

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DebtorType)]
        public ActionResult DebtorsCreditorsType()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DebtorType)]
        public JsonNetResult SaveUpdateDebtorsCreditorsType()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.DebtorType>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.DebtorTypeId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.DebtorType)]
        public JsonNetResult getDebtorsCreditorsTypeById(int DebtorTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).getDebtorTypeById(User.UserId, DebtorTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.DebtorType)]
        public JsonNetResult DeleteDebtorsCreditorsType(int DebtorTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DebtorTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).DeleteById(DebtorTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllDebtorsCreditorsType()
        {
            Dynamic.BusinessEntity.Account.DebtorTypeCollections dataColl = new Dynamic.BusinessEntity.Account.DebtorTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.DebtorType(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        #region"DebtorCreditorsRoute"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DebtorRoute)]
        public ActionResult DebtorsCreditorsRoute()
        {

            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DebtorRoute)]
        public JsonNetResult SaveUpdateDebtorsCreditorsRoute()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.DebtorRoute>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.DebtorRouteId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).SaveFormData(beData);
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
        [HttpGet]
        public JsonNetResult GetAllDebtorsCreditorsRoute(int? Status)
        {
            Dynamic.BusinessEntity.Account.DebtorRouteCollections dataColl = new Dynamic.BusinessEntity.Account.DebtorRouteCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).getAllAsList(User.UserId, Status);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.DebtorRoute)]
        public JsonNetResult getDebtorsCreditorsRouteById(int DebtorRouteId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).getDebtorRouteById(User.UserId, DebtorRouteId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.DebtorRoute)]
        public JsonNetResult DeleteDebtorsRouteType(int DebtorRouteId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DebtorRouteId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.DebtorRoute(User.HostName, User.DBName).DeleteFormData(DebtorRouteId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
        #region "Area Master"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.AreaMaster)]
        public ActionResult AreaMaster()
        {

            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AreaMaster)]
        public JsonNetResult SaveAreaMaster()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.AreaMaster>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.AreaId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpGet]
        public JsonNetResult GetAllAreaType()
        {
            Dynamic.BusinessEntity.Account.AreaMasterCollections dataColl = new Dynamic.BusinessEntity.Account.AreaMasterCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetAreaTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.AreaTypes)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.AreaMaster)]
        public JsonNetResult getAreaMasterByIdd(int AreaId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).getAreaMasterById(AreaId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.AreaMaster)]
        public JsonNetResult deleteAreaMasterById(int AreaId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (AreaId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.AreaMaster(User.HostName, User.DBName).DeleteById(AreaId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region"Cost Center"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CostCenter)]
        public ActionResult CostCenter()
        {
            return View();
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CostCenter)]
        public JsonNetResult SaveUpdateCostCenter()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.CostCenter>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.CostCenterId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpGet]
        public JsonNetResult GetAllCostCenter()
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.CostCenter)]
        public JsonNetResult getCostCenterById(int CostCenterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).getCostCenterById(User.UserId, CostCenterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CostCenter)]
        public JsonNetResult deleteCostCenter(int CostCenterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (CostCenterId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.CostCenter(User.HostName, User.DBName).DeleteById(CostCenterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllCostCategoryLisst()
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

        [HttpGet]
        public JsonNetResult GetLedgerList()
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
        public JsonNetResult GetSalesManList()
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
        public JsonNetResult GetLedgerGroupList()
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
        public JsonNetResult GetPDC()
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
        [HttpGet]
        public JsonNetResult GetODC()
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
        #endregion

        #region "CostCategory"
        public ActionResult CostCategory()
        {

            return View();
        }

        [HttpPost]
        public JsonNetResult SaveCostCategory()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.CostCategory>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.CostCategoryId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).SaveFormData(beData);
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
        [HttpGet]
        public JsonNetResult GetAllParentCategoryList()
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
        [HttpGet]
        public JsonNetResult GetAllCostCategoryList()
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
        [HttpPost]
        public JsonNetResult getCostCategoryById(int CostCategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).getCostCategoryById(User.UserId, CostCategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult deleteCostCategory(int CostCategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (CostCategoryId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.CostCategory(User.HostName, User.DBName).DeleteById(CostCategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult deletePDC(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).DeleteById(TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult deleteODC(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).DeleteById(TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region"Bank Gaurantee"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.BGDetails)]
        public ActionResult BankGaurantee()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.BGDetails)]
        public JsonNetResult SaveBankGuarantee()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.BGDetails>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.TranId > 0)
                            resVal = new Dynamic.BusinessLogic.Account.BGDetails(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.BGDetails(User.HostName, User.DBName).SaveFormData(beData);
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
        [HttpGet]
        public JsonNetResult GetBankGuarantee()
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

        #endregion

        #region "CostClass"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CostClass)]
        public ActionResult CostClass()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveCostClass()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.CostClass>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.Name == null)
                            resVal = new Dynamic.BusinessLogic.Account.CostClass(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Account.CostClass(User.HostName, User.DBName).SaveFormData(beData);
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

        [HttpGet]
        public JsonNetResult GetAllCostClasss()
        {
            Dynamic.BusinessEntity.Account.CostClassCollections dataColl = new Dynamic.BusinessEntity.Account.CostClassCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.CostClass(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "PDC Cheque"
        public ActionResult PDCDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdatePDCDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.PDC>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                    {
                        resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).ModifyFormData(beData);
                        beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (Request.Files.Count > 0)
                        {
                            for (int fi = 0; fi < Request.Files.Count; fi++)
                            {
                                HttpPostedFileBase file = Request.Files["file" + fi];
                                if (file != null)
                                {
                                    beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/pdc", file));
                                }
                            }
                        }
                    }

                    else
                    {
                        resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).SaveFormData(beData);
                        beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (Request.Files.Count > 0)
                        {
                            for (int fi = 0; fi < Request.Files.Count; fi++)
                            {
                                HttpPostedFileBase file = Request.Files["file" + fi];
                                if (file != null)
                                {
                                    beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/pdc", file));
                                }
                            }
                        }
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
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }


        #endregion
        #region "ODC Cheque"
        public ActionResult ODCDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveUpdateODCDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.PDC>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                    {
                        resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).ModifyFormData(beData);
                        beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (Request.Files.Count > 0)
                        {
                            for (int fi = 0; fi < Request.Files.Count; fi++)
                            {
                                HttpPostedFileBase file = Request.Files["file" + fi];
                                if (file != null)
                                {
                                    beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/pdc", file));
                                }
                            }
                        }
                    }

                    else
                    {
                        resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).SaveFormData(beData);
                        beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (Request.Files.Count > 0)
                        {
                            for (int fi = 0; fi < Request.Files.Count; fi++)
                            {
                                HttpPostedFileBase file = Request.Files["file" + fi];
                                if (file != null)
                                {
                                    beData.DocumentColl.Add(GetAttachmentDocuments("/Attachments/account/pdc", file));
                                }
                            }
                        }
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
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }

        #endregion
        #region "VoucherMode"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.VoucherMode)]
        public ActionResult VoucherMode(int tranId = 0)
        {
            ViewBag.TranId = tranId;
            return View();
        }

        [HttpGet]
        public JsonNetResult GetVoucherList(int voucherType, int? branchId = null, bool? activeBranch = null)
        {
            System.Collections.Generic.Dictionary<string, string> filter = new Dictionary<string, string>();
            if (branchId.HasValue && branchId > 0)
            {
                filter.Add("BDId", branchId.Value.ToString());
            }
            if (activeBranch.HasValue)
            {
                filter.Add("ActiveBranch", activeBranch.Value.ToString());
            }
            var dataColl = new Dynamic.DataAccess.Account.VoucherModeDB(User.HostName, User.DBName).getAllVoucherShortDetails(User.UserId, voucherType, filter);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetVoucherList(int voucherType, System.Collections.Generic.Dictionary<string, string> filterPara)
        {

            var dataColl = new Dynamic.DataAccess.Account.VoucherModeDB(User.HostName, User.DBName).getAllVoucherShortDetails(User.UserId, voucherType, filterPara);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetVoucherModeById(int voucherId)
        {
            var dataColl = new Dynamic.DataAccess.Account.VoucherModeDB(User.HostName, User.DBName).getVoucherModeByVoucherId(User.UserId, voucherId);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpGet]
        public JsonNetResult GetAllVoucherData()
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

        [HttpPost]
        public JsonNetResult GetVoucherNo(int voucherId, int costClassId, DateTime? voucherDate)
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.Transaction.BankQuotation(User.UserId, User.HostName, User.DBName).getAutoNumber(voucherId, costClassId, voucherDate);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetVoucherMandetoryFields(int voucherType)
        {
            var dataColl = new Dynamic.DataAccess.Setup.AditionalInvoiceDetailsMandetoryDB(User.HostName, User.DBName).getMandetoryFields(voucherType);
            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VoucherMode)]
        public JsonNetResult SaveVoucherMode()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.VoucherMode>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.VoucherId > 0)
                        resVal = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetVoucherTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.VoucherTypes)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };

            }
            catch (Exception ee)
            {
                return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = false, ResponseMSG = ee.Message };
            }
        }

        #endregion
        #region "Ledger Group"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.LedgerGroup)]
        public ActionResult LedgerGroup()
        {
            return View();
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult SaveUpdateLedgerGroup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.LedgerGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.SNo > 0)
                        resVal = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult SaveUpdateODC()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.PDC>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult SaveUpdatePDC()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.PDC>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetBaseGroup()
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
        public JsonNetResult GetAllLedgerGroup()
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
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult GetLedgerGroupById(int LedgerGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).getLedgerGroupById(User.UserId, LedgerGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult GetPDCById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.PDCDetails(User.HostName, User.DBName).getPDCById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult GetBankGuaranteeById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.BGDetails(User.HostName, User.DBName).getBGDetailsById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult DeleteBankGuarantee(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.BGDetails(User.HostName, User.DBName).DeleteById(TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult GetODCById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.ODCDetails(User.HostName, User.DBName).getPDCById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.LedgerGroup)]
        public JsonNetResult DeleteLedgerGroup(int LedgerGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (LedgerGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete ledger group ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.LedgerGroup(User.HostName, User.DBName).DeleteById(User.UserId, LedgerGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        //[HttpGet]
        //public JsonNetResult GetAllLedgerGroup()
        //{
        //    var dataColl = new Dynamic.DataAccess.Account.LedgerGroupDB(User.HostName, User.DBName).getAllLedgerGroupOfBalanceSheet(User.UserId);

        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        #endregion

        public ActionResult DashBoard()
        {
            return View();
        }

        public ActionResult Customer()
        {
            return View();
        }

        public ActionResult PetrolPump()
        {
            return View();
        }

        public ActionResult BranchWiseLedgerOpening()
        {
            return View();
        }
        public ActionResult BillWiseLedgerOpening()
        {
            return View();
        }

        public ActionResult ResourceGroup()
        {
            return View();
        }

        public ActionResult Resource()
        {
            return View();
        }


        #region "ResourceGroup"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ResourceGroup)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ResourceGroup)]
        public JsonNetResult SaveResourceGroup()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.ResourceGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.ResourceGroupId.HasValue)
                        beData.ResourceGroupId = 0;

                    resVal = new PivotalERP.BL.ResourceGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.ResourceGroup)]
        public JsonNetResult getResourceGroupById(int ResourceGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.ResourceGroup(User.UserId, User.HostName, User.DBName).GetResourceGroupById(0, ResourceGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ResourceGroup)]
        public JsonNetResult DeleteResourceGroup(int ResourceGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ResourceGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Member FEe Heading";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.ResourceGroup(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ResourceGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllResourceGroup()
        {
            PivotalERP.BE.ResourceGroupCollections dataColl = new PivotalERP.BE.ResourceGroupCollections();
            try
            {
                dataColl = new PivotalERP.BL.ResourceGroup(User.UserId, User.HostName, User.DBName).GetAllResourceGroup(0);
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






        #region "Resource"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Resource)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Resource)]
        public JsonNetResult SaveResource()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.Resource>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.ResourceId.HasValue)
                        beData.ResourceId = 0;

                    resVal = new PivotalERP.BL.Resource(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.Resource)]
        public JsonNetResult getResourceById(int ResourceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.Resource(User.UserId, User.HostName, User.DBName).GetResourceById(0, ResourceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Resource)]
        public JsonNetResult DeleteResource(int ResourceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ResourceId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Member FEe Heading";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.Resource(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ResourceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllResource()
        {
            PivotalERP.BE.ResourceCollections dataColl = new PivotalERP.BE.ResourceCollections();
            try
            {
                dataColl = new PivotalERP.BL.Resource(User.UserId, User.HostName, User.DBName).GetAllResource(0);
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


        public ActionResult SalesmanTarget()
        {
            return View();
        }
        public ActionResult PendingCustomer()
        {
            return View();
        }

        public ActionResult PendingLocation()
        {
            return View();
        }

        public ActionResult PendingRoute()
        {
            return View();
        }

        public ActionResult Project()
        {
            return View();
        }


        #region "Project"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.IncomeSource)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveProject()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Account.Project>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.ProjectId.HasValue)
                        beData.ProjectId = 0;

                    resVal = new Dynamic.BusinessLogic.Account.Project(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getProjectById(int ProjectId)
        {
            Dynamic.BusinessEntity.Account.Project resVal = new Dynamic.BusinessEntity.Account.Project();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.Project(User.UserId, User.HostName, User.DBName).GetProjectById(0, ProjectId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.IncomeSource)]
        public JsonNetResult DeleteProject(int ProjectId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProjectId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Project ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.Project(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ProjectId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllProject()
        {
            Dynamic.BusinessEntity.Account.ProjectCollections dataColl = new Dynamic.BusinessEntity.Account.ProjectCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.Project(User.UserId, User.HostName, User.DBName).GetAllProject(0);
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

        #region "Department"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CostCenterDepartment)]
        public ActionResult Department()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CostCenterDepartment)]
        public JsonNetResult SaveUpdateCostCenterDepartment()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Account.CostCenterDepartment>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (BranchWiseMaster)
                        {
                            if (beData.BDId == 0)
                                beData.BDId = User.BranchId;
                        }

                        bool isModify = false;
                        if (beData.CostCenterDepartmentId > 0)
                        {
                            isModify = true;
                            resVal = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).ModifyFormData(beData);
                        }
                        else
                            resVal = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).SaveFormData(beData);

                        if (resVal.IsSuccess)
                        {
                            Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                            auditLog.TranId = (isModify ? beData.CostCenterDepartmentId : resVal.RId);
                            auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.CostCenterDepartment;
                            auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                            auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
                            auditLog.AutoManualNo = IsNullStr(beData.Code);
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
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.CostCenterDepartment)]
        public JsonNetResult getCostCenterDepartmentById(int CostCenterDepartmentId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).getCostCenterDepartmentById(User.UserId, CostCenterDepartmentId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.FreightType)]
        public JsonNetResult DeleteCostCenterDepartment(int CostCenterDepartmentId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (CostCenterDepartmentId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Department name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).DeleteById(User.UserId, CostCenterDepartmentId);

                if (resVal.IsSuccess)
                {
                    Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                    auditLog.TranId = CostCenterDepartmentId;
                    auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.CostCenterDepartment;
                    auditLog.Action = Actions.Delete;
                    auditLog.LogText = "Deleted " + CostCenterDepartmentId.ToString() + " By " + User.UserName;
                    auditLog.AutoManualNo = "Deleted";
                    SaveAuditLog(auditLog);
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
        public JsonNetResult GetAllDepartment()
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).getAllAsList(User.UserId);
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
        public JsonNetResult GetAllCostCenterDepartment()
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Account.CostCenterDepartment(User.HostName, User.DBName).getAllAsList(User.UserId);
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


        public ActionResult Price()
        {
            return View();
        }

        #region "Price"
        [HttpPost]
        public JsonNetResult SavePrice()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Account.Price>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.PriceId.HasValue)
                        beData.PriceId = 0;

                    resVal = new Dynamic.BL.Account.Price(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllPrice()
        {
            var dataColl = new Dynamic.BL.Account.Price(User.UserId, User.HostName, User.DBName).GetAllPrice(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetPriceById(int PriceId)
        {
            var dataColl = new Dynamic.BL.Account.Price(User.UserId, User.HostName, User.DBName).GetPriceById(0, PriceId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelPrice(int PriceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Account.Price(User.UserId, User.HostName, User.DBName).DeleteById(0, PriceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "LCDetails"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.LCDetails)]
        public ActionResult LCDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveLCDetails()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/account/LC";

                var beData = DeserializeObject<Dynamic.BE.LCDetails>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.DocumentColl;
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
                        string photoLocation1 = photoLocation.Replace("/", "\\");
                        foreach (var v in tmpAttachmentColl)
                        {
                            if (!string.IsNullOrEmpty(v.DocPath) && v.Data == null)
                            {
                                if (v.DocPath.StartsWith(photoLocation) || v.DocPath.StartsWith(photoLocation1))
                                {
                                    beData.DocumentColl.Add(v);
                                }
                            }
                        }
                    }
                    bool isModify = false;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    else
                    {
                        isModify = true;
                    }
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.LCDetails(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllLCDetails()
        {
            var dataColl = new Dynamic.BL.LCDetails(User.UserId, User.HostName, User.DBName).GetAllLCDetails(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]

        public JsonNetResult GetLCDetailsById(int TranId)
        {
            var dataColl = new Dynamic.BL.LCDetails(User.UserId, User.HostName, User.DBName).GetLCDetailsById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        //[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]
        public JsonNetResult DelLCDetails(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.LCDetails(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        public ActionResult UploadProductPhoto()
        {
            return View();
        }

        #region "LedgerCategory"
        public ActionResult LedgerCategory()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveLedgerCategory()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.LedgerCategory>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.CategoryId.HasValue)
                        beData.CategoryId = 0;

                    resVal = new Dynamic.BL.LedgerCategory(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllLedgerCategory()
        {
            var dataColl = new Dynamic.BL.LedgerCategory(User.UserId, User.HostName, User.DBName).GetAllLedgerCategory(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetLedgerCategoryById(int CategoryId)
        {
            var dataColl = new Dynamic.BL.LedgerCategory(User.UserId, User.HostName, User.DBName).GetLedgerCategoryById(0, CategoryId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelLedgerCategory(int CategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.LedgerCategory(User.UserId, User.HostName, User.DBName).DeleteById(0, CategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region "LedgerChannel"
        public ActionResult LedgerChannel()
        {
            return View();
        }

        [HttpPost]

        public JsonNetResult SaveLedgerChannel()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.LedgerChannel>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.ChannelId.HasValue)
                        beData.ChannelId = 0;

                    resVal = new Dynamic.BL.LedgerChannel(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllLedgerChannel()
        {
            var dataColl = new Dynamic.BL.LedgerChannel(User.UserId, User.HostName, User.DBName).GetAllLedgerChannel(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]

        public JsonNetResult GetLedgerChannelById(int ChannelId)
        {
            var dataColl = new Dynamic.BL.LedgerChannel(User.UserId, User.HostName, User.DBName).GetLedgerChannelById(0, ChannelId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]

        public JsonNetResult DelLedgerChannel(int ChannelId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.LedgerChannel(User.UserId, User.HostName, User.DBName).DeleteById(0, ChannelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        public ActionResult Vendor()
        {
            return View();
        }
        public ActionResult LedgerAuthorized()
        {
            return View();
        }

        #region "LedgerAuthorized"      
        

        public JsonNetResult SaveLedgerAuthorized()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.LedgerAuthorizedyCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.LedgerAuthorized(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetLedgerAuthorized(int? LedgerId)
        {
            Dynamic.BE.LedgerAuthorizedyCollections dataColl = new Dynamic.BE.LedgerAuthorizedyCollections();
            try
            {
                dataColl = new Dynamic.BL.LedgerAuthorized(User.UserId, User.HostName, User.DBName).GetLedgerAuthorized(0, LedgerId);
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


        public ActionResult Circle()
        {
            return View();
        }

        public ActionResult Cluster()
        {
            return View();
        }

        #region "Circle"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Circle)]
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Circle)]
        public JsonNetResult SaveCircle()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Account.Circle>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.CircleID.HasValue)
                        beData.CircleID = 0;
                    resVal = new Dynamic.BL.Account.Circle(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.Circle)]
        public JsonNetResult getCircleById(int CircleID)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Account.Circle(User.UserId, User.HostName, User.DBName).GetCircleById(0, CircleID);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Account)]
        public JsonNetResult DeleteCircle(int CircleID)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (CircleID < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Account.Circle(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, CircleID);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAllCircle()
        {
            Dynamic.BE.Account.CircleCollections dataColl = new Dynamic.BE.Account.CircleCollections();
            try
            {
                dataColl = new Dynamic.BL.Account.Circle(User.UserId, User.HostName, User.DBName).GetAllCircle(0);
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

        #region "Cluster"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Cluster)]
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Cluster)]
        public JsonNetResult SaveCluster()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Account.Cluster>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.ClusterID.HasValue)
                        beData.ClusterID = 0;
                    resVal = new Dynamic.BL.Account.Cluster(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.Cluster)]
        public JsonNetResult getClusterById(int ClusterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Account.Cluster(User.UserId, User.HostName, User.DBName).GetClusterById(0, ClusterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Account)]
        public JsonNetResult DeleteCluster(int ClusterId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ClusterId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Account.Cluster(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ClusterId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAllCluster()
        {
            Dynamic.BE.Account.ClusterCollections dataColl = new Dynamic.BE.Account.ClusterCollections();
            try
            {
                dataColl = new Dynamic.BL.Account.Cluster(User.UserId, User.HostName, User.DBName).GetAllCluster(0);
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
    }

}