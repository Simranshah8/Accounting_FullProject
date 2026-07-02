using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.Service.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        public ActionResult JobType()
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

        #region "JobType"
     
        [HttpPost]
        
        public JsonNetResult SaveJobType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.JobTypeId.HasValue)
                        beData.JobTypeId = 0;

                    resVal = new Dynamic.BusinessLogic.Service.JobType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getJobTypeById(int JobTypeId)
        {
            Dynamic.BusinessEntity.Service.JobType resVal = new Dynamic.BusinessEntity.Service.JobType();
            try
            {
                resVal = new Dynamic.BusinessLogic.Service.JobType(User.UserId, User.HostName, User.DBName).GetJobTypeById(0, JobTypeId);
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
        public JsonNetResult DeleteJobType(int JobTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (JobTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default JobType ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Service.JobType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, JobTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllJobType()
        {
            Dynamic.BusinessEntity.Service.JobTypeCollections dataColl = new Dynamic.BusinessEntity.Service.JobTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.JobType(User.UserId, User.HostName, User.DBName).GetAllJobType(0);
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

        #region "JobTypeMapping"

        public ActionResult JobTypeMapping()
        {
            return View();
        }

        [HttpPost]        
        public JsonNetResult SaveJobTypeMapping()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobTypeMapping>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.JobTypeMappingId.HasValue)
                        beData.JobTypeMappingId = 0;

                    resVal = new Dynamic.BusinessLogic.Service.JobTypeMapping(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getJobTypeMappingById(int JobTypeMappingId)
        {
            Dynamic.BusinessEntity.Service.JobTypeMapping resVal = new Dynamic.BusinessEntity.Service.JobTypeMapping();
            try
            {
                resVal = new Dynamic.BusinessLogic.Service.JobTypeMapping(User.UserId, User.HostName, User.DBName).GetJobTypeMappingById(0, JobTypeMappingId);
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
        public JsonNetResult DeleteJobTypeMapping(int JobTypeMappingId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (JobTypeMappingId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default JobTypeMapping ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Service.JobTypeMapping(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, JobTypeMappingId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllJobTypeMapping()
        {
            Dynamic.BusinessEntity.Service.JobTypeMappingCollections dataColl = new Dynamic.BusinessEntity.Service.JobTypeMappingCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.JobTypeMapping(User.UserId, User.HostName, User.DBName).GetAllJobTypeMapping(0);
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

        #region "Nature"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.CompanyType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.CompanyType)]
        public JsonNetResult SaveNature()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Complain.Nature>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.NatureId.HasValue)
                        beData.NatureId = 0;
                    resVal = new Dynamic.BusinessLogic.Complain.Nature(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(Dynamic.BusinessEntity.Complain.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getNatureById(int NatureId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Complain.Nature(User.UserId, User.HostName, User.DBName).GetNatureById(0, NatureId);
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
                    resVal = new Dynamic.BusinessLogic.Complain.Nature(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, NatureId);
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
            Dynamic.BusinessEntity.Complain.NatureCollections dataColl = new Dynamic.BusinessEntity.Complain.NatureCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Complain.Nature(User.UserId, User.HostName, User.DBName).GetAllNature(0);
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
                var beData = DeserializeObject<Dynamic.BusinessEntity.Complain.Source>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.SourceId.HasValue)
                        beData.SourceId = 0;
                    resVal = new Dynamic.BusinessLogic.Complain.Source(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(Dynamic.BusinessEntity.Complain.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getSourceById(int SourceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Complain.Source(User.UserId, User.HostName, User.DBName).GetSourceById(0, SourceId);
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
                    resVal = new Dynamic.BusinessLogic.Complain.Source(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, SourceId);
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
            Dynamic.BusinessEntity.Complain.SourceCollections dataColl = new Dynamic.BusinessEntity.Complain.SourceCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Complain.Source(User.UserId, User.HostName, User.DBName).GetAllSource(0);
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
                var beData = DeserializeObject<Dynamic.BusinessEntity.Complain.TicketFor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TicketForId.HasValue)
                        beData.TicketForId = 0;
                    resVal = new Dynamic.BusinessLogic.Complain.TicketFor(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(Dynamic.BusinessEntity.Complain.Global.Actions.Modify, (int)FormsEntity.CompanyType)]
        public JsonNetResult getTicketForById(int TicketForId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Complain.TicketFor(User.UserId, User.HostName, User.DBName).GetTicketForById(0, TicketForId);
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
                    resVal = new Dynamic.BusinessLogic.Complain.TicketFor(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TicketForId);
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
            Dynamic.BusinessEntity.Complain.TicketForCollections dataColl = new Dynamic.BusinessEntity.Complain.TicketForCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Complain.TicketFor(User.UserId, User.HostName, User.DBName).GetAllTicketFor(0);
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


        public ActionResult Appointment()
        {
            return View();
        }

        [HttpPost] 
        public JsonNetResult SaveAppointment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string str = Request["jsonData"];
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.ServiceTicket>(str);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    
                    resVal = new Dynamic.BusinessLogic.Service.ServiceTicket(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetVehicleForAppointment()
        {
            Dynamic.ReportEntity.Service.VehicleForAppoitmentCollections dataColl = new Dynamic.ReportEntity.Service.VehicleForAppoitmentCollections();
            try
            {
                dataColl = new Dynamic.Reporting.Service.JobCardList(User.HostName, User.DBName).getVehicleForAppoitment(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpGet]
        public JsonNetResult GetInspectionType()
        {
            Dynamic.BusinessEntity.Service.InspectionTypeCollections dataColl = new Dynamic.BusinessEntity.Service.InspectionTypeCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.InspectionTypeDB(User.HostName, User.DBName).getAllInspectionType(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }


        [HttpGet]
        public JsonNetResult GetAppointType()
        {
            Dynamic.BusinessEntity.Service.AppointmentTypeCollections dataColl = new Dynamic.BusinessEntity.Service.AppointmentTypeCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.AppointmentTypeDB(User.HostName, User.DBName).getAllAppointmentType(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpGet]
        public JsonNetResult GetVehicleModelList()
        {
            Dynamic.BusinessEntity.Enquiry.VehicleModelCollections dataColl = new Dynamic.BusinessEntity.Enquiry.VehicleModelCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Enquiry.VehicleModelDB(User.HostName, User.DBName).getAllVehicleModel(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpGet]
        public JsonNetResult GetCallFailedReasonList()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getCallFailedReason(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetVehicleImplementsList()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getVehicleImplements(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCallComplainTypeList()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getCallComplainType(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCallTypeList()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getCallType(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetReasonForNotUsingJDService()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getReasonForNotUsingJDService(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetReasonForNotUsingJDVehicle()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardDB(User.HostName, User.DBName).getReasonForNotUsingJDVehicle(User.UserId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "JobCard Type"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ENQVehicleType)]
        public ActionResult JobCardType()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult SaveUpdateJobCardType()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobCardType>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.JobCardTypeId > 0)
                            resVal = new Dynamic.DataAccess.Service.JobCardTypeDB(User.HostName, User.DBName).SaveUpdate(beData,true);
                        else
                            resVal = new Dynamic.DataAccess.Service.JobCardTypeDB(User.HostName, User.DBName).SaveUpdate(beData,false);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult getJobCardTypeById(int JobCardTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.DataAccess.Service.JobCardTypeDB(User.HostName, User.DBName).getJobCardTypeById(User.UserId, JobCardTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult DeleteJobCardType(int JobCardTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (JobCardTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default JobCard name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.DataAccess.Service.JobCardTypeDB(User.HostName, User.DBName).Delete(JobCardTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllJobCardType()
        {
            Dynamic.BusinessEntity.Service.JobCardTypeCollections dataColl = new Dynamic.BusinessEntity.Service.JobCardTypeCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Service.JobCardTypeDB(User.HostName, User.DBName).getAllJobCardType(User.UserId);
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

        #region "Vehicle Type"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ENQVehicleType)]
        public ActionResult VehicleType()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult SaveUpdateVehicleType()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject < Dynamic.BusinessEntity.Enquiry.VehicleType>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.VehicleTypeId > 0)
                            resVal = new Dynamic.BusinessLogic.Enquiry.VehicleType(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Enquiry.VehicleType(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult getVehicleTypeById(int VehicleTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Enquiry.VehicleType(User.HostName, User.DBName).getVehicleTypeById(User.UserId, VehicleTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ENQVehicleType)]
        public JsonNetResult DeleteVehicleType(int VehicleTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (VehicleTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default VehicleType name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Enquiry.VehicleType(User.HostName, User.DBName).DeleteById(User.UserId, VehicleTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllVehicleType()
        {
            Dynamic.BusinessEntity.Enquiry.VehicleTypeCollections dataColl = new Dynamic.BusinessEntity.Enquiry.VehicleTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Enquiry.VehicleType(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "Vehicle Model"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ENQVehicleModel)]
        public ActionResult VehicleModel()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ENQVehicleModel)]
        public JsonNetResult SaveUpdateVehicleModel()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Enquiry.VehicleModel>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.VehicleModelId > 0)
                            resVal = new Dynamic.BusinessLogic.Enquiry.VehicleModel(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Enquiry.VehicleModel(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ENQVehicleModel)]
        public JsonNetResult getVehicleModelById(int VehicleModelId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Enquiry.VehicleModel(User.HostName, User.DBName).getVehicleModelById(User.UserId, VehicleModelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ENQVehicleModel)]
        public JsonNetResult DeleteVehicleModel(int VehicleModelId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (VehicleModelId < 0)
                {
                    resVal.ResponseMSG = "can't delete default VehicleModel name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Enquiry.VehicleModel(User.HostName, User.DBName).DeleteById(User.UserId, VehicleModelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllVehicleModel()
        {
            Dynamic.BusinessEntity.Enquiry.VehicleModelCollections dataColl = new Dynamic.BusinessEntity.Enquiry.VehicleModelCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Enquiry.VehicleModel(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "InspectionTypeGroup"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.InsepctionType)]
        public ActionResult InspectionTypeGroup()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.InsepctionType)]
        public JsonNetResult SaveUpdateInspectionTypeGroup()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.InspectionTypeGroup>(Request["jsonData"]);
                    if (beData != null)
                    {
                        beData.CUserId = User.UserId;

                        if (beData.InspectionTypeGroupId > 0)
                            resVal = new Dynamic.BusinessLogic.Service.InspectionTypeGroup(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Service.InspectionTypeGroup(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.InsepctionType)]
        public JsonNetResult getInspectionTypeGroupById(int InspectionTypeGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                //resVal = new Dynamic.BusinessLogic.Service.InspectionTypeGroup(User.HostName, User.DBName).getInspectionTypeGroupById(User.UserId, InspectionTypeGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.InsepctionType)]
        public JsonNetResult DeleteInspectionTypeGroup(int InspectionTypeGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (InspectionTypeGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete default InspectionTypeGroup name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Service.InspectionTypeGroup(User.HostName, User.DBName).DeleteById(User.UserId, InspectionTypeGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllInspectionTypeGroup()
        {
            Dynamic.BusinessEntity.Service.InspectionTypeGroupCollections dataColl = new Dynamic.BusinessEntity.Service.InspectionTypeGroupCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.InspectionTypeGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        #region "InspectionType"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.InsepctionType)]
        public ActionResult InspectionType()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.InsepctionType)]
        public JsonNetResult SaveUpdateInspectionType()
        {

            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Service.InspectionType>(Request["jsonData"]);
                    if (beData != null)
                    {
                        if(beData.GroupId==0)
                        {
                            resVal.ResponseMSG = "Please ! Select Group";
                        }
                        else if (string.IsNullOrEmpty(beData.Name))
                        {
                            resVal.ResponseMSG = "Please ! Enter Name";
                        }
                        else
                        {
                            beData.CUserId = User.UserId;

                            if (beData.InspectionTypeId > 0)
                                resVal = new Dynamic.BusinessLogic.Service.InspectionType(User.HostName, User.DBName).ModifyFormData(beData);
                            else
                                resVal = new Dynamic.BusinessLogic.Service.InspectionType(User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.InsepctionType)]
        public JsonNetResult getInspectionTypeById(int InspectionTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
             //   resVal = new Dynamic.BusinessLogic.Service.InspectionType(User.HostName, User.DBName).getInspectionTypeById(User.UserId, InspectionTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.InsepctionType)]
        public JsonNetResult DeleteInspectionType(int InspectionTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (InspectionTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default InspectionType name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Service.InspectionType(User.HostName, User.DBName).DeleteById(User.UserId, InspectionTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllInspectionType()
        {
            Dynamic.BusinessEntity.Service.InspectionTypeCollections dataColl = new Dynamic.BusinessEntity.Service.InspectionTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.InspectionType(User.HostName, User.DBName).getAllAsList(User.UserId);
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

        public ActionResult JobServiceType()
        {
            return View();
        }

        #region "JobServiceType"

        [HttpPost]

        public JsonNetResult SaveJobServiceType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Service.JobServiceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.ServiceTypeId.HasValue)
                        beData.ServiceTypeId = 0;

                    resVal = new Dynamic.BusinessLogic.Service.JobServiceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult getJobServiceTypeById(int ServiceTypeId)
        {
            Dynamic.BusinessEntity.Service.JobServiceType resVal = new Dynamic.BusinessEntity.Service.JobServiceType();
            try
            {
                resVal = new Dynamic.BusinessLogic.Service.JobServiceType(User.UserId, User.HostName, User.DBName).GetJobServiceTypeById(0, ServiceTypeId);
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
        public JsonNetResult DeleteJobServiceType(int ServiceTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ServiceTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default JobServiceType ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Service.JobServiceType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ServiceTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllJobServiceType()
        {
            Dynamic.BusinessEntity.Service.JobServiceTypeCollections dataColl = new Dynamic.BusinessEntity.Service.JobServiceTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Service.JobServiceType(User.UserId, User.HostName, User.DBName).GetAllJobServiceType(0);
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