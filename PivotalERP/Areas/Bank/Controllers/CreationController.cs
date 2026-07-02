using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PivotalERP.BE;
using PivotalERP.BL;
using PivotalERP.DA;
namespace PivotalERP.Areas.Bank.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Bank/Creation
        public ActionResult Bank()
        {
            return View();
        }


        #region "Bank"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveBank()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.Bank>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.BankId.HasValue)
                        beData.BankId = 0;
                    resVal = new PivotalERP.BL.Bank(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getBankById(int BankId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.Bank(User.UserId, User.HostName, User.DBName).GetBankById(0, BankId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CompanyType)]
        public JsonNetResult DeleteBank(int BankId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (BankId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.Bank(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, BankId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllBank()
        {
            PivotalERP.BE.BankCollections dataColl = new PivotalERP.BE.BankCollections();
            try
            {
                dataColl = new PivotalERP.BL.Bank(User.UserId, User.HostName, User.DBName).GetAllBank(0);
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

        #region "BankGroup"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveBankGroup()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.BankGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.BankGroupId.HasValue)
                        beData.BankGroupId = 0;
                    resVal = new PivotalERP.BL.BankGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getBankGroupById(int BankGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.BankGroup(User.UserId, User.HostName, User.DBName).GetBankGroupById(0, BankGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CompanyType)]
        public JsonNetResult DeleteBankGroup(int BankGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (BankGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.BankGroup(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, BankGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllBankGroup()
        {
            PivotalERP.BE.BankGroupCollections dataColl = new PivotalERP.BE.BankGroupCollections();
            try
            {
                dataColl = new PivotalERP.BL.BankGroup(User.UserId, User.HostName, User.DBName).GetAllBankGroup(0);
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

        #region "BankAccount"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveBankAccount()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.BankAccount>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.BankAccountId.HasValue)
                        beData.BankAccountId = 0;
                    resVal = new PivotalERP.BL.BankAccount(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getBankAccountById(int BankAccountId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.BankAccount(User.UserId, User.HostName, User.DBName).GetBankAccountById(0, BankAccountId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CompanyType)]
        public JsonNetResult DeleteBankAccount(int BankAccountId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (BankAccountId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.BankAccount(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, BankAccountId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllBankAccount()
        {
            PivotalERP.BE.BankAccountCollections dataColl = new PivotalERP.BE.BankAccountCollections();
            try
            {
                dataColl = new PivotalERP.BL.BankAccount(User.UserId, User.HostName, User.DBName).GetAllBankAccount(0);
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

        #region "ChequeEntry"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveChequeEntry()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.ChequeEntry>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    resVal = new PivotalERP.BL.ChequeEntry(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getChequeEntryById(int ChequeEntryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.ChequeEntry(User.UserId, User.HostName, User.DBName).GetChequeEntryById(0, ChequeEntryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CompanyType)]
        public JsonNetResult DeleteChequeEntry(int ChequeEntryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ChequeEntryId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.ChequeEntry(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ChequeEntryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllChequeEntry()
        {
            PivotalERP.BE.ChequeEntryCollections dataColl = new PivotalERP.BE.ChequeEntryCollections();
            try
            {
                dataColl = new PivotalERP.BL.ChequeEntry(User.UserId, User.HostName, User.DBName).GetAllChequeEntry(0);
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