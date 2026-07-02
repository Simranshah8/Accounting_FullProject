using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Dynamic.BusinessEntity.Service;

namespace PivotalERP.Areas.Setup.Controllers
{
    public class JobCardController : PivotalERP.Controllers.BaseController
    {
        // GET: Setup/JobCard
        public ActionResult NewJobCard()
        {
            return View();
        }
        #region 'JobCard'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveJobCard()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCard>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Service.JobCard(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Service.JobCard(User.HostName, User.DBName).SaveFormData(beData);
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

        public ActionResult VehicleEntry()
        {
            return View();
        }

        #region 'VechicleEntry'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VehilceEntry)]
        public JsonNetResult SaveVechicleEntry()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.VehicleEntry>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Service.VehicleEntry(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Service.VehicleEntry(User.HostName, User.DBName).SaveFormData(beData);
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

        public ActionResult ServiceMembers()
        {
            return View();
        }

        #region 'ServiceMembers'
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ServiceTechnician)]
        public JsonNetResult SaveServiceTechnician()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.ServiceTechnician>(Request["jsonData"]);
                    if (beData != null)
                    {

                        beData.CUserId = User.UserId;
                        resVal = new Dynamic.BusinessLogic.Service.ServiceTechnician(User.HostName, User.DBName, User.UserId).SaveFormData(beData);

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
        public ActionResult PartyTransfer()
        {
            return View();
        }

        #region 'PartyTransfer'
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VehiclePartyTransfor)]
        public JsonNetResult SaveVehiclePartyTransfor()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.VehiclePartyTransfor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Service.VehiclePartyTransfor(User.HostName, User.DBName).SaveFormData(beData);

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

        public ActionResult SparePartsReturn()
        {
            return View();
        }

        #region 'SparePartsReturn'
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VehiclePartyTransfor)]
        public JsonNetResult SaveSparePartsReturn()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardSparePartsDemand>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsDemand(User.HostName, User.DBName).SaveFormData(beData);

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


        public ActionResult PartsDemandList()
        {
            return View();
        }

        #region 'PartsDemandList'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.PartsDemandList)]
        public JsonNetResult SavePartsDemandList()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardSparePartsDemand>(Request["jsonData"]);
                    if (beData != null)
                    {
                            beData.CUserId = User.UserId;
                            resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsDemand(User.HostName, User.DBName).SaveFormData(beData);
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

        public ActionResult SparePartsIssue()
        {
            return View();
        }

        //#region 'JobCardSparePartsIssue'

        //[HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCardSparePartsIssue)]
        //public JsonNetResult SaveJobCardComplainInspection()
        //{


        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardSparePartsIssue>(Request["jsonData"]);
        //        if (beData != null)
        //        {
        //            beData.CUserId = User.UserId;

        //            if (beData.TranId > 0)
        //                resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsIssue(User.HostName, User.DBName).ModifyFormData(beData);
        //            else
        //                resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsIssue(User.HostName, User.DBName).SaveFormData(beData);
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

        //#endregion

        public ActionResult CloseJobCard()
        {
            return View();
        }

        #region 'CloseJobCard'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCard)]
        public JsonNetResult SaveCloseJobCard()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCard>(Request["jsonData"]);
                    if (beData != null)
                    {

                        beData.CUserId = User.UserId;
                        resVal = new Dynamic.BusinessLogic.Service.ClosedJobCard(User.HostName, User.DBName).SaveFormData(beData);
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


        public ActionResult SparePartsDemand()
        {
            return View();
        }

        #region 'JobCardSparePartsDemand'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCardSparePartsDemand)]
        public JsonNetResult SaveJobCardSparePartsDemand()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardSparePartsDemand>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsDemand(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Service.JobCardSparePartsDemand(User.HostName, User.DBName).SaveFormData(beData);
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


        public ActionResult ComplainInspection()
        {
            return View();
        }

        #region 'JobCardComplainInspection'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobCardComplainInspection)]
        public JsonNetResult SaveJobCardComplainInspection()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardComplainInspection>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.TranId > 0)
                        resVal = new Dynamic.BusinessLogic.Service.JobCardComplainInspection(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Service.JobCardComplainInspection(User.HostName, User.DBName).SaveFormData(beData);
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
        public ActionResult JobAssign()
        {
            return View();
        }

        #region 'JobAsign'

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.JobAsign)]
        public JsonNetResult SaveJobAsign()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobAsign>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).JobAsign(beData);

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
    }
}