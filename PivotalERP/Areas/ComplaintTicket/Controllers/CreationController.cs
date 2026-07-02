using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.ComplaintTicket.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: ComplaintTicket/Creation
        public ActionResult ComplaintTicket()
        {
            return View();
        }
        public ActionResult TicketFor()
        {
            return View();
        }
        public ActionResult Nature()
        {
            return View();
        }
        public ActionResult Source()
        {
            return View();
        }

        #region "Nature"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveNature()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.Nature>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.NatureId.HasValue)
                        beData.NatureId = 0;
                    resVal = new PivotalERP.BL.Nature(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getNatureById(int NatureId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.Nature(User.UserId, User.HostName, User.DBName).GetNatureById(0, NatureId);
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
        public JsonNetResult DeleteNature(int NatureId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (NatureId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.Nature(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, NatureId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllNature()
        {
            PivotalERP.BE.NatureCollections dataColl = new PivotalERP.BE.NatureCollections();
            try
            {
                dataColl = new PivotalERP.BL.Nature(User.UserId, User.HostName, User.DBName).GetAllNature(0);
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

        #region "Source"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveSource()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.Source>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.SourceId.HasValue)
                        beData.SourceId = 0;
                    resVal = new PivotalERP.BL.Source(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getSourceById(int SourceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.Source(User.UserId, User.HostName, User.DBName).GetSourceById(0, SourceId);
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
        public JsonNetResult DeleteSource(int SourceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (SourceId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.Source(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, SourceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllSource()
        {
            PivotalERP.BE.SourceCollections dataColl = new PivotalERP.BE.SourceCollections();
            try
            {
                dataColl = new PivotalERP.BL.Source(User.UserId, User.HostName, User.DBName).GetAllSource(0);
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

        #region "TicketFor"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveTicketFor()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.TicketFor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TicketForId.HasValue)
                        beData.TicketForId = 0;
                    resVal = new PivotalERP.BL.TicketFor(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getTicketForById(int TicketForId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.TicketFor(User.UserId, User.HostName, User.DBName).GetTicketForById(0, TicketForId);
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
        public JsonNetResult DeleteTicketFor(int TicketForId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TicketForId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.TicketFor(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TicketForId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllTicketFor()
        {
            PivotalERP.BE.TicketForCollections dataColl = new PivotalERP.BE.TicketForCollections();
            try
            {
                dataColl = new PivotalERP.BL.TicketFor(User.UserId, User.HostName, User.DBName).GetAllTicketFor(0);
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



        #region "TransactionComplain"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveTransactionComplain()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.TransactionComplain>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    resVal = new PivotalERP.BL.TransactionComplain(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getTransactionComplainById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.TransactionComplain(User.UserId, User.HostName, User.DBName).GetTransactionComplainById(0, TranId);
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
        public JsonNetResult DeleteTransactionComplain(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Company name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.TransactionComplain(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllTransactionComplain()
        {
            PivotalERP.BE.TransactionComplainCollections dataColl = new PivotalERP.BE.TransactionComplainCollections();
            try
            {
                dataColl = new PivotalERP.BL.TransactionComplain(User.UserId, User.HostName, User.DBName).GetAllTransactionComplain(0);
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


        [HttpPost]
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.TransactionComplain)]
        public JsonNetResult GetAutoVoucherNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.TransactionComplain(User.UserId, User.HostName, User.DBName).GetAutoVoucherNo(User.UserId);
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