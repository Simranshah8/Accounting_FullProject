using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Services.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Services/Creation
        public ActionResult ServiceAppointment()
        {
            return View();
        }
        public ActionResult ServiceTicketList()
        {
            return View();
        }

        public ActionResult ssfClaim()
        {
            return View();
        }
        public ActionResult DataImportExport()
        {
            return View();
        }
        public ActionResult DischargeSlip()
        {
            return View();
        }
        public ActionResult DischargeSlipPrint()
        {
            var DisSlipPrint = Request.QueryString.Get("TranId");
            ViewBag.TranID = DisSlipPrint;
            return View();
        }
        public ActionResult DailyAttendance()
        {
            return View();
        }

        //added by bibek dischargeSLip
        #region "DischargeSlip"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.DischargeSlip)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.DischargeSlip)]
        public JsonNetResult SaveUpdateDischargeSlip()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.DischargeSlip>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.DischargeSlip)]
        public JsonNetResult getDischargeSlipById(int TranId)
        {
            BE.DischargeSlip resVal = new BE.DischargeSlip();
            try
            {
                resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).GetDischargeSlipById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.DischargeSlip)]
        public JsonNetResult DeleteById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllDischargeSlip()
        {
            PivotalERP.BE.DischargeSlipCollections dataColl = new PivotalERP.BE.DischargeSlipCollections();
            try
            {
                dataColl = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).GetAllDischargeSlip(0);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.DischargeSlip)]
        public JsonNetResult GetAutoDischargeNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).GetAutoDischargeNo(User.UserId);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.LeftType)]
        public JsonNetResult getPatientDetailById(int PatientId)
        {
            PivotalERP.BE.PatientDetails resVal = new PivotalERP.BE.PatientDetails();
            try
            {
                resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).GetPatientDetailById(PatientId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.LeftType)]
        public JsonNetResult getDischargeSlipPrint(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new PivotalERP.BL.DischargeSlip(User.UserId, User.HostName, User.DBName).GetDischargeSlipPrint(0, TranId);
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