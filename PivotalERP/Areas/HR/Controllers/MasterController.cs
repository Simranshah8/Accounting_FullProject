using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.HR.Controllers
{
    public class MasterController : PivotalERP.Controllers.BaseController
    {
        string photoLocation = "/Attachments/GrievanceForm";

        // GET: Payroll/Master
        [HttpPost]
        public JsonNetResult GetAutoEmpNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).GetAutoEmpNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_Designation)]
        public ActionResult Designation()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_Level)]
        public ActionResult Level()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_Nationality)]
        public ActionResult Nationality()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_Disabilities)]
        public ActionResult Disabilities()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_ServiceType)]
        public ActionResult ServiceType()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_Category)]
        public ActionResult Category()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AttendanceType)]
        public ActionResult AttendanceType()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_EmployeeProfile)]
        public ActionResult EmployeeProfile()
        {
            return View();
        }



        #region "Designation"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.IncomeSource)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_Designation)]
        public JsonNetResult SaveDesignation()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.Designation>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.DesignationId.HasValue)
                        beData.DesignationId = 0;

                    resVal = new Dynamic.BL.Payroll.Designation(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_Designation)]
        public JsonNetResult getDesignationById(int DesignationId)
        {
            Dynamic.BE.Payroll.Designation resVal = new Dynamic.BE.Payroll.Designation();
            try
            {
                resVal = new Dynamic.BL.Payroll.Designation(User.UserId, User.HostName, User.DBName).GetDesignationById(0, DesignationId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_Designation)]
        public JsonNetResult DeleteDesignation(int DesignationId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DesignationId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Designation ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.Designation(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, DesignationId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllDesignation()
        {
            Dynamic.BE.Payroll.DesignationCollections dataColl = new Dynamic.BE.Payroll.DesignationCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.Designation(User.UserId, User.HostName, User.DBName).GetAllDesignation(0);
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

        #region "Level"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_Level)]
        public JsonNetResult SaveLevel()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.Level>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.LevelId.HasValue)
                        beData.LevelId = 0;

                    resVal = new Dynamic.BL.Payroll.Level(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_Level)]
        public JsonNetResult getLevelById(int LevelId)
        {
            Dynamic.BE.Payroll.Level resVal = new Dynamic.BE.Payroll.Level();
            try
            {
                resVal = new Dynamic.BL.Payroll.Level(User.UserId, User.HostName, User.DBName).GetLevelById(0, LevelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_Level)]
        public JsonNetResult DeleteLevel(int LevelId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (LevelId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Level ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.Level(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, LevelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllLevel()
        {
            Dynamic.BE.Payroll.LevelCollections dataColl = new Dynamic.BE.Payroll.LevelCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.Level(User.UserId, User.HostName, User.DBName).GetAllLevel(0);
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

        #region "Nationality"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_Nationality)]
        public JsonNetResult SaveNationality()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.Nationality>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.NationalityId.HasValue)
                        beData.NationalityId = 0;

                    resVal = new Dynamic.BL.Payroll.Nationality(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_Nationality)]
        public JsonNetResult getNationalityById(int NationalityId)
        {
            Dynamic.BE.Payroll.Nationality resVal = new Dynamic.BE.Payroll.Nationality();
            try
            {
                resVal = new Dynamic.BL.Payroll.Nationality(User.UserId, User.HostName, User.DBName).GetNationalityById(0, NationalityId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_Nationality)]
        public JsonNetResult DeleteNationality(int NationalityId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (NationalityId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Nationality ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.Nationality(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, NationalityId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllNationality()
        {
            Dynamic.BE.Payroll.NationalityCollections dataColl = new Dynamic.BE.Payroll.NationalityCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.Nationality(User.UserId, User.HostName, User.DBName).GetAllNationality(0);
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

        #region "Disabilities"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_Disabilities)]
        public JsonNetResult SaveDisabilities()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.Disabilities>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.DisabilitiesId.HasValue)
                        beData.DisabilitiesId = 0;

                    resVal = new Dynamic.BL.Payroll.Disabilities(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_Disabilities)]
        public JsonNetResult getDisabilitiesById(int DisabilitiesId)
        {
            Dynamic.BE.Payroll.Disabilities resVal = new Dynamic.BE.Payroll.Disabilities();
            try
            {
                resVal = new Dynamic.BL.Payroll.Disabilities(User.UserId, User.HostName, User.DBName).GetDisabilitiesById(0, DisabilitiesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_Disabilities)]
        public JsonNetResult DeleteDisabilities(int DisabilitiesId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DisabilitiesId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Disabilities ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.Disabilities(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, DisabilitiesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllDisabilities()
        {
            Dynamic.BE.Payroll.DisabilitiesCollections dataColl = new Dynamic.BE.Payroll.DisabilitiesCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.Disabilities(User.UserId, User.HostName, User.DBName).GetAllDisabilities(0);
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


        #region "ServiceType"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_ServiceType)]
        public JsonNetResult SaveServiceType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.ServiceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.ServiceTypeId.HasValue)
                        beData.ServiceTypeId = 0;

                    resVal = new Dynamic.BL.Payroll.ServiceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_ServiceType)]
        public JsonNetResult getServiceTypeById(int ServiceTypeId)
        {
            Dynamic.BE.Payroll.ServiceType resVal = new Dynamic.BE.Payroll.ServiceType();
            try
            {
                resVal = new Dynamic.BL.Payroll.ServiceType(User.UserId, User.HostName, User.DBName).GetServiceTypeById(0, ServiceTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_ServiceType)]

        public JsonNetResult DeleteServiceType(int ServiceTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ServiceTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default ServiceType ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.ServiceType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, ServiceTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllServiceType()
        {
            Dynamic.BE.Payroll.ServiceTypeCollections dataColl = new Dynamic.BE.Payroll.ServiceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.ServiceType(User.UserId, User.HostName, User.DBName).GetAllServiceType(0);
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


        #region "Category"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_Category)]
        public JsonNetResult SaveCategory()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.Category>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.CategoryId.HasValue)
                        beData.CategoryId = 0;

                    resVal = new Dynamic.BL.Payroll.Category(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_Category)]
        public JsonNetResult getCategoryById(int CategoryId)
        {
            Dynamic.BE.Payroll.Category resVal = new Dynamic.BE.Payroll.Category();
            try
            {
                resVal = new Dynamic.BL.Payroll.Category(User.UserId, User.HostName, User.DBName).GetCategoryById(0, CategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_Category)]
        public JsonNetResult DeleteCategory(int CategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (CategoryId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Category ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.Category(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, CategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllCategory()
        {
            Dynamic.BE.Payroll.CategoryCollections dataColl = new Dynamic.BE.Payroll.CategoryCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.Category(User.UserId, User.HostName, User.DBName).GetAllCategory(0);
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


        #region "AttendanceType"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.AttendanceType)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AttendanceType)]
        public JsonNetResult SaveAttendanceType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.AttendanceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.AttendanceTypeId.HasValue)
                        beData.AttendanceTypeId = 0;

                    resVal = new Dynamic.BL.NPayroll.AttendanceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_AttendanceType)]
        public JsonNetResult getAttendanceTypeById(int AttendanceTypeId)
        {
            Dynamic.BE.NPayroll.AttendanceType resVal = new Dynamic.BE.NPayroll.AttendanceType();
            try
            {
                resVal = new Dynamic.BL.NPayroll.AttendanceType(User.UserId, User.HostName, User.DBName).GetAttendanceTypeById(0, AttendanceTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_AttendanceType)]
        public JsonNetResult DeleteAttendanceType(int AttendanceTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (AttendanceTypeId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.AttendanceType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, AttendanceTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllAttendanceType()
        {
            Dynamic.BE.NPayroll.AttendanceTypeCollections dataColl = new Dynamic.BE.NPayroll.AttendanceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.AttendanceType(User.UserId, User.HostName, User.DBName).GetAllAttendanceType(0);
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


        [HttpGet]
        public JsonNetResult GetAllDepartment()
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Account.CostCenterDepartmentDB(User.HostName, User.DBName).getAllCostCenterDepartment(User.UserId);
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
        public JsonNetResult GetAllBank()
        {
            Dynamic.BusinessEntity.Bank.BankCollections dataColl = new Dynamic.BusinessEntity.Bank.BankCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Bank.Bank(User.UserId, User.HostName, User.DBName).GetAllBank(0);
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
        public JsonNetResult GetAllArea()
        {
            Dynamic.BusinessEntity.Account.AreaMasterCollections dataColl = new Dynamic.BusinessEntity.Account.AreaMasterCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Account.AreaMasterDB(User.HostName, User.DBName).getAllAreaMaster(User.UserId);
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
        public JsonNetResult GetAllDocument()
        {
            Dynamic.BusinessEntity.Account.DocumentTypeCollections dataColl = new Dynamic.BusinessEntity.Account.DocumentTypeCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Account.DocumentTypeDB(User.HostName, User.DBName).getAllDocumentType(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_SeparationType)]
        public ActionResult LeftType()
        {
            return View();
        }

        #region "LeftType"
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_SeparationType)]

        public JsonNetResult SaveUpdateLeftType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.LeftType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.LeftTypeId.HasValue)
                        beData.LeftTypeId = 0;

                    resVal = new Dynamic.BL.Payroll.LeftType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_SeparationType)]
        public JsonNetResult getLeftTypeById(int LeftTypeId)
        {
            Dynamic.BE.Payroll.LeftType resVal = new Dynamic.BE.Payroll.LeftType();
            try
            {
                resVal = new Dynamic.BL.Payroll.LeftType(User.UserId, User.HostName, User.DBName).GetLeftTypeById(0, LeftTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_SeparationType)]
        public JsonNetResult DeleteLeftTypeById(int LeftTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (LeftTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.LeftType(User.UserId, User.HostName, User.DBName).DeleteLeftTypeById(User.UserId, LeftTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllLeftType()
        {
            Dynamic.BE.Payroll.LeftTypeCollections dataColl = new Dynamic.BE.Payroll.LeftTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.LeftType(User.UserId, User.HostName, User.DBName).GetAllLeftType(0);
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


        

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_UnitOfWork)]
        public ActionResult UnitOfWork()
        {
            return View();
        }

        #region "UnitOfWork"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_UnitOfWork)]
        public JsonNetResult SaveUpdateUnitsOfWork()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.UnitsOfWork>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.UnitsOfWorkId.HasValue)
                        beData.UnitsOfWorkId = 0;

                    resVal = new Dynamic.BL.NPayroll.UnitsOfWork(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_UnitOfWork)]
        public JsonNetResult getUnitsOfWorkById(int UnitsOfWorkId)
        {
            Dynamic.BE.NPayroll.UnitsOfWork resVal = new Dynamic.BE.NPayroll.UnitsOfWork();
            try
            {
                resVal = new Dynamic.BL.NPayroll.UnitsOfWork(User.UserId, User.HostName, User.DBName).GetUnitsOfWorkById(0, UnitsOfWorkId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_UnitOfWork)]
        public JsonNetResult DeleteUnitsOfWorkById(int UnitsOfWorkId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (UnitsOfWorkId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.UnitsOfWork(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, UnitsOfWorkId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllUnitsOfWork()
        {
            Dynamic.BE.NPayroll.UnitsOfWorkCollections dataColl = new Dynamic.BE.NPayroll.UnitsOfWorkCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.UnitsOfWork(User.UserId, User.HostName, User.DBName).GetAllUnitsOfWork(0);
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



        #region"EmployeLeftType"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_EmployeeLeftType)]
        public ActionResult EmployeeLeftType()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_EmployeeLeftType)]
        public JsonNetResult SaveEmployeeLeftType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/Employee";

                var beData = DeserializeObject<Dynamic.BE.HR.EmployeeLeftType>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.AttachmentColl;
                    beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);

                                if (att != null)
                                {
                                    beData.AttachmentColl.Add
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
                    }
                    bool isModify = false;

                    if (!beData.EmpLeftTypeId.HasValue)
                        beData.EmpLeftTypeId = 0;
                    else
                        isModify = true;
                    //else if (beData.EmpLeftTypeId > 0 && beData.ApprovedRemarks != null)
                    //{
                    //    isModify = true;
                    //    beData.ApprovedBy = User.UserId;
                    //}
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllEmployeeLeftType()
        {
            Dynamic.BE.HR.EmployeeLeftTypeCollections dataColl = new Dynamic.BE.HR.EmployeeLeftTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).GetAllEmployeeLeftType(0);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_EmployeeLeftType)]
        public JsonNetResult getEmployeeLeftTypeId(int EmpLeftTypeId)
        {
            Dynamic.BE.HR.EmployeeLeftType resVal = new Dynamic.BE.HR.EmployeeLeftType();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).GetEmployeeLeftTypeById(0, EmpLeftTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_EmployeeLeftType)]
        public JsonNetResult DeleteEmployeeLeftType(int EmpLeftTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).DeleteById(0, EmpLeftTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_EmployeeLeftType)]
        public JsonNetResult UpdateEmpLeftVerify(int EmpLeftTypeId, string VerifiedRemarks)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).UpdateEmpLeftVerify(EmpLeftTypeId, VerifiedRemarks);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_EmployeeLeftType)]
        public JsonNetResult UpdateEmpLeftApproved(int EmpLeftTypeId, string ApprovedRemarks)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeeLeftType(User.UserId, User.HostName, User.DBName).UpdateEmpLeftApproved(EmpLeftTypeId, ApprovedRemarks);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_EmployeeGroup)]
        public ActionResult EmployeeGroup()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_EmployeeGroup)]
        public JsonNetResult SaveUpdateEmployeeGroup()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.EmployeeGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.EmployeeGroupId.HasValue)
                        beData.EmployeeGroupId = 0;

                    resVal = new Dynamic.BL.NPayroll.EmployeeGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_EmployeeGroup)]
        public JsonNetResult getEmployeeGroupById(int EmployeeGroupId)
        {
            Dynamic.BE.NPayroll.EmployeeGroup resVal = new Dynamic.BE.NPayroll.EmployeeGroup();
            try
            {
                resVal = new Dynamic.BL.NPayroll.EmployeeGroup(User.UserId, User.HostName, User.DBName).GetEmployeeGroupById(0, EmployeeGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_EmployeeGroup)]
        public JsonNetResult DeleteEmployeeGroupById(int EmployeeGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (EmployeeGroupId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.EmployeeGroup(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, EmployeeGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllEmployeeGroup()
        {
            Dynamic.BE.NPayroll.EmployeeGroupCollections dataColl = new Dynamic.BE.NPayroll.EmployeeGroupCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.EmployeeGroup(User.UserId, User.HostName, User.DBName).GetAllEmployeeGroup(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        //NEw Controller Upated by Prashant

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_EmployeeProfile)]
        public ActionResult Employee()
        {
            var EmpDet = Request.QueryString.Get("EmployeeId");
            ViewBag.EmployeeID = EmpDet;

            return View();
        }
        public ActionResult EmpPrint()
        {
            var EmpPrint = Request.QueryString.Get("EmployeeId");
            ViewBag.EmployeeID = EmpPrint;
            return View();
        }

        #region"Employee Profile"
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_EmployeeProfile)]
        public JsonNetResult SaveEmployee()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/Employee";

                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.AttachmentColl;
                    beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        var CitiFront = filesColl["citiFront"];
                        var CitiBack = filesColl["citiBack"];
                        var pfAtt = filesColl["pfAttach"];
                        var sfAtt = filesColl["sfAttach"];
                        var citAtt = filesColl["citAttach"];
                        var graAtt = filesColl["gratAttach"];
                        var liAtt = filesColl["liAttach"];
                        var hiAtt = filesColl["hiAttach"];
                        if (empPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, empPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                        if (CitiFront != null)
                        {
                            var Citiphoto = GetAttachmentDocuments(photoLocation, CitiFront, true);
                            beData.PhotoB = Citiphoto.Data;
                            beData.CitiFrontImg = Citiphoto.DocPath;
                        }
                        if (CitiBack != null)
                        {
                            var CitiBphoto = GetAttachmentDocuments(photoLocation, CitiBack, true);
                            beData.PhotoB = CitiBphoto.Data;
                            beData.CitiBackImg = CitiBphoto.DocPath;
                        }
                        if (pfAtt != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, pfAtt, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.PfAtt = photoDoc.DocPath;
                        }
                        if (sfAtt != null)
                        {
                            var Citiphoto = GetAttachmentDocuments(photoLocation, sfAtt, true);
                            beData.PhotoB = Citiphoto.Data;
                            beData.SsfAtt = Citiphoto.DocPath;
                        }
                        if (citAtt != null)
                        {
                            var CitiBphoto = GetAttachmentDocuments(photoLocation, citAtt, true);
                            beData.PhotoB = CitiBphoto.Data;
                            beData.CitAtt = CitiBphoto.DocPath;
                        }
                        if (graAtt != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, graAtt, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.GratAtt = photoDoc.DocPath;
                        }
                        if (liAtt != null)
                        {
                            var Citiphoto = GetAttachmentDocuments(photoLocation, liAtt, true);
                            beData.PhotoB = Citiphoto.Data;
                            beData.LiAtt = Citiphoto.DocPath;
                        }
                        if (hiAtt != null)
                        {
                            var CitiBphoto = GetAttachmentDocuments(photoLocation, hiAtt, true);
                            beData.PhotoB = CitiBphoto.Data;
                            beData.HiAtt = CitiBphoto.DocPath;
                        }
                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);

                                if (att != null)
                                {
                                    beData.AttachmentColl.Add
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
                    }
                    bool isModify = false;

                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)
                        isModify = true;

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllEmployee()
        {
            Dynamic.BE.HR.EmployeeCollections dataColl = new Dynamic.BE.HR.EmployeeCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).GetAllEmployee(0,null);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_EmployeeProfile)]
        public JsonNetResult getEmployeeById(int EmployeeId)
        {
            Dynamic.BE.HR.Employee resVal = new Dynamic.BE.HR.Employee();
            try
            {
                resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).GetEmployeeById(0, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_EmployeeProfile)]
        public JsonNetResult DeleteEmployee(int EmployeeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).DeleteById(0, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion


        //------------Update Till Now------------

        #region"Employee Print"

        [HttpPost]
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.IncomeSource)]
        public JsonNetResult getEmployeePrintbyId(int EmployeeId)
        {
            Dynamic.BE.HR.EmployeePrint resVal = new Dynamic.BE.HR.EmployeePrint();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeePrint(User.UserId, User.HostName, User.DBName).GetEmployeePrintById(0, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region"DocView"
        public JsonNetResult GetDocViewById(int EmployeeId)
        {
            Dynamic.BE.HR.Employee resVal = new Dynamic.BE.HR.Employee();
            try
            {
                resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).GetDocViewById(0, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }
        #endregion

        #region"EmployeeDetails"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveEmployeeDetails()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/Employee";

                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.AttachmentColl;
                    beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        var CitiFront = filesColl["citiFront"];
                        var CitiBack = filesColl["citiBack"];
                        if (empPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, empPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                        if (CitiFront != null)
                        {
                            var Citiphoto = GetAttachmentDocuments(photoLocation, CitiFront, true);
                            beData.PhotoB = Citiphoto.Data;
                            beData.CitiFrontImg = Citiphoto.DocPath;
                        }
                        if (CitiBack != null)
                        {
                            var CitiBphoto = GetAttachmentDocuments(photoLocation, CitiBack, true);
                            beData.PhotoB = CitiBphoto.Data;
                            beData.CitiBackImg = CitiBphoto.DocPath;
                        }

                    }

                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateEmpDetail(beData);
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

        #region"EmployeeAdd"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveEmployeeAdd()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateEmpAdd(beData);

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

        #region"EmpEmergency"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveEmpEmergency()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateEmergency(beData);

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


        #region"Office Details"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveOfficeDetails()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateOffDet(beData);

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


        #region"PfSsfCit"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult ModifyPfSsfCit()
        {
            string photoLocation = "/Attachments/Employee";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    var filesColl = Request.Files;
                    var pfAtt = filesColl["pfAttach"];
                    var sfAtt = filesColl["sfAttach"];
                    var citAtt = filesColl["citAttach"];
                    var graAtt = filesColl["gratAttach"];
                    if (pfAtt != null)
                    {
                        var photoDoc = GetAttachmentDocuments(photoLocation, pfAtt, true);
                        beData.PhotoB = photoDoc.Data;
                        beData.PfAtt = photoDoc.DocPath;
                    }
                    if (sfAtt != null)
                    {
                        var Citiphoto = GetAttachmentDocuments(photoLocation, sfAtt, true);
                        beData.PhotoB = Citiphoto.Data;
                        beData.SsfAtt = Citiphoto.DocPath;
                    }
                    if (citAtt != null)
                    {
                        var CitiBphoto = GetAttachmentDocuments(photoLocation, citAtt, true);
                        beData.PhotoB = CitiBphoto.Data;
                        beData.CitAtt = CitiBphoto.DocPath;
                    }
                    if (graAtt != null)
                    {
                        var photoDoc = GetAttachmentDocuments(photoLocation, graAtt, true);
                        beData.PhotoB = photoDoc.Data;
                        beData.GratAtt = photoDoc.DocPath;
                    }

                    bool isModify = false;
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)
                        isModify = true;

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).UpdatePfSsfCit(beData);

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

        #region"BankDetails"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateBankDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)


                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateBankDetails(beData);

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

        #region"Insurance"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateInsurance()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/Employee";
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    var filesColl = Request.Files;
                    var liAtt = filesColl["liAttach"];
                    var hiAtt = filesColl["hiAttach"];
                    if (liAtt != null)
                    {
                        var Citiphoto = GetAttachmentDocuments(photoLocation, liAtt, true);
                        beData.PhotoB = Citiphoto.Data;
                        beData.LiAtt = Citiphoto.DocPath;
                    }
                    if (hiAtt != null)
                    {
                        var CitiBphoto = GetAttachmentDocuments(photoLocation, hiAtt, true);
                        beData.PhotoB = CitiBphoto.Data;
                        beData.HiAtt = CitiBphoto.DocPath;
                    }
                    bool isModify = false;
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)
                        isModify = true;

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateInsurance(beData);

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

        #region"AccountDet"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateAccountDet()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateAccountDet(beData);

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

        #region"Academic"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateQualification()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateQualification(beData);

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


        #region"Experience"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateExperience()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateExperience(beData);
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

        #region"Supervisor"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateSupervisor()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateSupervisor(beData);
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

        #region"SaveUpdateDocument"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncomeSource)]
        public JsonNetResult SaveUpdateDocument()
        {
            string photoLocation = "/Attachments/Employee";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Employee>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.AttachmentColl;
                    //beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
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

                                    v.DocumentTypeId = v.DocumentTypeId;
                                    v.Name = att.Name;
                                    v.DocPath = att.DocPath;
                                    v.Extension = att.Extension;
                                    v.ParaName = att.ParaName;
                                }

                            }
                            fInd++;
                        }
                    }
                    if (!beData.EmployeeId.HasValue)
                        beData.EmployeeId = 0;
                    else if (beData.EmployeeId > 0)

                        beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).SaveUpdateDocumnet(beData);
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


        [HttpGet]
        public JsonNetResult GetAllCompanyList()
        {
            List<Dynamic.BusinessEntity.Setup.CompanyDetail> dataColl = new List<Dynamic.BusinessEntity.Setup.CompanyDetail>();

            var comDet = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetails();
            dataColl.Add(comDet);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Sucessfull" };
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

        [HttpGet]
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.IncomeSource)]
        public JsonNetResult GetCompanyDetail()
        {
            Dynamic.BusinessEntity.Setup.CompanyDetail resVal = new Dynamic.BusinessEntity.Setup.CompanyDetail();
            resVal = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetailsForWeb(User.UserId);

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = true, ResponseMSG = "sucess" };
        }

        // GET: HR/Master
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_InsuranceType)]
        public ActionResult InsuranceType()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_TravelType)]
        public ActionResult TravelType()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.HR_TravelFunding)]
        public ActionResult TravelFunding()
        {
            return View();
        }

        #region "InsuranceType"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.InsuranceType)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_InsuranceType)]
        public JsonNetResult SaveUpdateInsuranceType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.InsuranceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.InsuranceId.HasValue)
                        beData.InsuranceId = 0;

                    resVal = new Dynamic.BL.Payroll.InsuranceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_InsuranceType)]
        public JsonNetResult getInsuranceTypeById(int InsuranceId)
        {
            Dynamic.BE.Payroll.InsuranceType resVal = new Dynamic.BE.Payroll.InsuranceType();
            try
            {
                resVal = new Dynamic.BL.Payroll.InsuranceType(User.UserId, User.HostName, User.DBName).GetInsuranceTypeById(0, InsuranceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_InsuranceType)]
        public JsonNetResult DeleteInsuranceTypeById(int InsuranceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (InsuranceId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.InsuranceType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, InsuranceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllInsuranceType()
        {
            Dynamic.BE.Payroll.InsuranceTypeCollections dataColl = new Dynamic.BE.Payroll.InsuranceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.InsuranceType(User.UserId, User.HostName, User.DBName).GetAllInsuranceType(0);
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

        #region "TravelType"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_TravelType)]
        public JsonNetResult SaveUpdateTravelType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.TravelType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TravelTypeId.HasValue)
                        beData.TravelTypeId = 0;

                    resVal = new Dynamic.BL.Payroll.TravelType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.TravelType)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_TravelType)]
        public JsonNetResult getTravelTypeById(int TravelTypeId)
        {
            Dynamic.BE.Payroll.TravelType resVal = new Dynamic.BE.Payroll.TravelType();
            try
            {
                resVal = new Dynamic.BL.Payroll.TravelType(User.UserId, User.HostName, User.DBName).GetTravelTypeById(0, TravelTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_TravelType)]
        public JsonNetResult DeleteTravelTypeById(int TravelTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TravelTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.TravelType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TravelTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllTravelType()
        {
            Dynamic.BE.Payroll.TravelTypeCollections dataColl = new Dynamic.BE.Payroll.TravelTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.TravelType(User.UserId, User.HostName, User.DBName).GetAllTravelType(0);
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

        #region "TravelFunding"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_TravelFunding)]
        public JsonNetResult SaveUpdateTravelFunding()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.TravelFunding>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TravelFundingId.HasValue)
                        beData.TravelFundingId = 0;

                    resVal = new Dynamic.BL.Payroll.TravelFunding(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_TravelFunding)]
        public JsonNetResult getTravelFundingById(int TravelFundingId)
        {
            Dynamic.BE.Payroll.TravelFunding resVal = new Dynamic.BE.Payroll.TravelFunding();
            try
            {
                resVal = new Dynamic.BL.Payroll.TravelFunding(User.UserId, User.HostName, User.DBName).GetTravelFundingById(0, TravelFundingId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_TravelFunding)]
        public JsonNetResult DeleteTravelFundingById(int TravelFundingId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TravelFundingId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.TravelFunding(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TravelFundingId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllTravelFunding()
        {
            Dynamic.BE.Payroll.TravelFundingCollections dataColl = new Dynamic.BE.Payroll.TravelFundingCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.TravelFunding(User.UserId, User.HostName, User.DBName).GetAllTravelFunding(0);
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

        #region "AttendanceInOUtMode"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AttendanceMode)]
        public ActionResult AttendanceMode()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AttendanceMode)]
        public JsonNetResult SaveUpdateAttendanceMode()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceInOutMode>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Attendance.AttendanceInOutMode(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAttendanceMode()
        {
            Dynamic.BE.Attendance.AttendanceInOutModeCollections dataColl = new Dynamic.BE.Attendance.AttendanceInOutModeCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AttendanceInOutMode(User.UserId, User.HostName, User.DBName).GetAllAttendanceInOutMode(0);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_AttendanceMode)]
        public JsonNetResult getAttendanceModeById(int TranId)
        {
            Dynamic.BE.Attendance.AttendanceInOutMode resVal = new Dynamic.BE.Attendance.AttendanceInOutMode();
            try
            {
                resVal = new Dynamic.BL.Attendance.AttendanceInOutMode(User.UserId, User.HostName, User.DBName).GetAttendanceInOutModeById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_AttendanceMode)]
        public JsonNetResult DeleteAttendanceModeById(int TranId)
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
                    resVal = new Dynamic.BL.Attendance.AttendanceInOutMode(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AttendanceAppealEntry)]
        public ActionResult AttendanceAppealEntry()
        {
            return View();
        }
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ManualAttendance)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AttendanceAppealEntry)]
        public JsonNetResult SaveUpdateAttendanceAppeal()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceAppeals>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Attendance.AttendanceAppeals(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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


        #region "AddDevices"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AddDevices)]
        public ActionResult AddDevices()
        {
            return View();
        }

        public ActionResult ViewDevices()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AddDevices)]
        public JsonNetResult SaveDevices()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AddDevices>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.DeviceId.HasValue)
                        beData.DeviceId = 0;

                    resVal = new Dynamic.BL.Attendance.AddDevices(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_AddDevices)]
        public JsonNetResult getDevicesById(int DeviceId)
        {
            Dynamic.BE.Attendance.AddDevices resVal = new Dynamic.BE.Attendance.AddDevices();
            try
            {
                resVal = new Dynamic.BL.Attendance.AddDevices(User.UserId, User.HostName, User.DBName).GetAddDevicesById(0, DeviceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_AddDevices)]
        public JsonNetResult DeleteDevices(int DeviceId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (DeviceId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default AddDevices ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Attendance.AddDevices(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, DeviceId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllDevices()
        {
            Dynamic.BE.Attendance.AddDevicesCollections dataColl = new Dynamic.BE.Attendance.AddDevicesCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AddDevices(User.UserId, User.HostName, User.DBName).GetAllAddDevices(0);
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

        //Code add by Prashant on 30 Kartik
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_ShiftMappingByEmp)]
        public ActionResult ShiftMappingByEmp()
        {
            return View();
        }


        
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_ShiftMapping)]
        public ActionResult ShiftMapping()
        {
            return View();
        }

        
        [HttpPost]
        public JsonNetResult GetAllShiftMapping()
        {
            var dataColl = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).getAllWorkingShift();

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelDuplicateWorkingShift()
        {
            var dataColl = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).DelDuplicate();

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_ShiftMapping)]
        public JsonNetResult DelShiftMapping(int ShiftMappingId,int EmployeeId,DateTime DateFrom,DateTime DateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).DeleteById(ShiftMappingId,EmployeeId,DateFrom,DateTo);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_WorkingShift)]
        public ActionResult WorkingShift()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult SaveWorkingShift()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WorkingShift>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.WorkingShiftId.HasValue)
                        beData.WorkingShiftId = 0;


                    resVal = new Dynamic.BL.Attendance.WorkingShift(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllWorkingShift()
        {
            var dataColl = new Dynamic.BL.Attendance.WorkingShift(User.UserId, User.HostName, User.DBName).getAllWorkingShift();

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult GetWorkingShiftById(int WorkingShiftId)
        {
            var dataColl = new Dynamic.BL.Attendance.WorkingShift(User.UserId, User.HostName, User.DBName).getWorkingShiftById(WorkingShiftId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult DelWorkingShift(int WorkingShiftId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.WorkingShift(User.UserId, User.HostName, User.DBName).DeleteById(0, WorkingShiftId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #region " Employee Working Shift"


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_WorkingShift)]
        public ActionResult EmpWorkingShift()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult SaveEmpWorkingShift()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WorkingShift>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.WorkingShiftId.HasValue)
                        beData.WorkingShiftId = 0;


                    resVal = new Dynamic.BL.Attendance.EmployeeWorkingShift(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllEmpWorkingShift()
        {
            var dataColl = new Dynamic.BL.Attendance.EmployeeWorkingShift(User.UserId, User.HostName, User.DBName).getAllWorkingShift();

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult GetEmpWorkingShiftById(int EmployeeId)
        {
            var dataColl = new Dynamic.BL.Attendance.EmployeeWorkingShift(User.UserId, User.HostName, User.DBName).getWorkingShiftById(EmployeeId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_WorkingShift)]
        public JsonNetResult DelEmpWorkingShift(int EmployeeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.EmployeeWorkingShift(User.UserId, User.HostName, User.DBName).DeleteById(0, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_EnrollNumber)]
        public ActionResult EnrollNumber()
        {
            return View();
        }

        #region "EnrollNumberEmployee"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_EnrollNumber)]
        public JsonNetResult SaveEnrollNumberEmployee()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.RE.HR.EmployeeSummaryCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).UpdateEnrollCardNo(beData);
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

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AddAttendance)]
        public ActionResult AddAttendance()
        {
            return View();
        }

        #region "AddAttendanceEmployee"
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AddAttendance)]
        public JsonNetResult SaveEmployeeDailyAttendance()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceEmployeewiseCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.Attendance.AttendanceEmployeewise(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetEmployeeDailyAttendance(int DepartmentId, DateTime forDate, int InOutMode)
        {
            var dataColl = new Dynamic.BL.Attendance.AttendanceEmployeewise(User.UserId, User.HostName, User.DBName).getDepartmentWiseAttendance(DepartmentId, forDate, InOutMode);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        public ActionResult AttendanceRule()
        {
            return View();
        }

        #region "WorkingShift"


        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_ShiftMapping)]
        public JsonNetResult SaveWSM()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WorkingShiftMapping>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.ShiftMappingId.HasValue)
                        beData.ShiftMappingId = 0;
                    resVal = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).SaveWSM(beData);
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

        #region"Attendance Rule"
        [HttpPost]
        public JsonNetResult SaveAttendanceRule()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceRule>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;


                    resVal = new Dynamic.BL.Attendance.AttendanceRule(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.UnitOfWork)]
        public JsonNetResult GetAttendanceRuleById()
        {
            Dynamic.BE.Attendance.AttendanceRule resVal = new Dynamic.BE.Attendance.AttendanceRule();
            try
            {
                resVal = new Dynamic.BL.Attendance.AttendanceRule(User.UserId, User.HostName, User.DBName).GetAttendanceRuleById();
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.UnitOfWork)]
        public JsonNetResult DeleteAttendanceRuleById(int TranId)
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
                    resVal = new Dynamic.BL.Attendance.AttendanceRule(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAllAttendanRule()
        {
            Dynamic.BE.Attendance.AttendanceRuleCollections dataColl = new Dynamic.BE.Attendance.AttendanceRuleCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AttendanceRule(User.UserId, User.HostName, User.DBName).GetAllAttendanceRule(0);
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
        public JsonNetResult GetMappingEmployee(int? WorkingShiftId, DateTime? DateFrom, DateTime? DateTo, int? BranchId, int? DepartmentId, int? CategoryId, int? DesignationId,int? CompanyId=null)
        {
            Dynamic.BE.Attendance.WorkingShiftMappingCollections dataColl = new Dynamic.BE.Attendance.WorkingShiftMappingCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).GetMappingEmployee(WorkingShiftId, DateFrom, DateTo, BranchId, DepartmentId, CategoryId, DesignationId,CompanyId);
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
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_ShiftMapping)]
        public JsonNetResult SaveShiftMapping()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WorkingShiftMappingCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).SaveshiftMapping(beData);
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
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_ShiftMapping)]
        public JsonNetResult SaveShiftMappingColl()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WorkingShiftMappingCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).SaveshiftMappingColl(beData);
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
         

        //code from Prashant on Mangsir 06

        [HttpPost]
        public JsonNetResult GetShiftMappingByEmp(int EmployeeId)
        {
            Dynamic.BE.Attendance.WorkingShiftMappingCollections dataColl = new Dynamic.BE.Attendance.WorkingShiftMappingCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.WokringShiftMapping(User.UserId, User.HostName, User.DBName).GetShiftMappingByEmp(EmployeeId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        #region"Holiday"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_Holiday)]
        public ActionResult Holiday()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_Holiday)]
        public JsonNetResult SaveHoliday()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.Holiday>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.HolidayId.HasValue)
                        beData.HolidayId = 0;

                    resVal = new Dynamic.BL.Attendance.Holiday(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_Holiday)]
        public JsonNetResult DelHoliday(int HolidayId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.Holiday(User.UserId, User.HostName, User.DBName).DeleteById(0, HolidayId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllHolidayList()
        {
            var dataColl = new Dynamic.BL.Attendance.Holiday(User.UserId, User.HostName, User.DBName).GetAllHoliday();

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_Holiday)]
        public JsonNetResult GetHolidayById(int HolidayId)
        {
            var dataColl = new Dynamic.BL.Attendance.Holiday(User.UserId, User.HostName, User.DBName).getHolidayById(HolidayId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }



        #endregion

        #region"HOD"

        public ActionResult HOD()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.HR_HOD)]
        public JsonNetResult SaveHeadOfDepartment()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.HeadOfDepartment>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.HR.HeadOfDepartment(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.HR_HOD)]
        public JsonNetResult GetHeadOfDepartmentById(int TranId)
        {
            Dynamic.BE.HR.HeadOfDepartment resVal = new Dynamic.BE.HR.HeadOfDepartment();
            try
            {
                resVal = new Dynamic.BL.HR.HeadOfDepartment(User.UserId, User.HostName, User.DBName).GetHeadOfDepartmentById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.HR_HOD)]
        public JsonNetResult DeleteHeadOfDepartment(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default HeadOfDepartment ";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.HR.HeadOfDepartment(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllHeadOfDepartment()
        {
            Dynamic.BE.HR.HeadOfDepartmentCollections dataColl = new Dynamic.BE.HR.HeadOfDepartmentCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.HeadOfDepartment(User.UserId, User.HostName, User.DBName).GetAllHeadOfDepartment(0);
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


        #region"CompanyRelationship"
        public ActionResult CompanyRelationship()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveCompanyRelationship()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string photoLocation = "/Attachments/Employee";
                var beData = DeserializeObject<Dynamic.BE.HR.CompanyRelationship>(Request["jsonData"]);
                if (beData != null)
                {
                    var filesColl = Request.Files;

                    var Logo = filesColl["LogoPhoto"];
                    if (Logo != null && Logo.ContentLength > 0)
                    {
                        var photoDoc = GetAttachmentDocuments(photoLocation, Logo, true);
                        beData.LogoB = photoDoc.Data;
                        beData.LogoPath = photoDoc.DocPath;
                    }

                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.HR.CompanyRelationship(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllCompanyRelationship()
        {
            var dataColl = new Dynamic.BL.HR.CompanyRelationship(User.UserId, User.HostName, User.DBName).GetAllCompanyRelationship(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetCompanyRelationshipById(int TranId)
        {
            var dataColl = new Dynamic.BL.HR.CompanyRelationship(User.UserId, User.HostName, User.DBName).GetCompanyRelationshipById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelCompanyRelationship(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.CompanyRelationship(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Update Employee"
        public ActionResult UpdateEmployee()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetEmployeeForUpdate(int? BranchId, int? CompanyRelationId, int PageNumber = 0, int RowsOfPage = 10, string SearchBy = "")
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                int TotalRows = 0;
                var dataColl = new Dynamic.BL.HR.UpdateEmployee(User.UserId, User.HostName, User.DBName).getEmployeeListForupdate(BranchId, CompanyRelationId, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
                return new JsonNetResult() { Data = dataColl, TotalCount = TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEmployeeWithPag(int PageNumber = 0, int RowsOfPage = 10, string SearchBy = "")
        {
            Dynamic.BE.HR.EmployeeCollections dataColl = new Dynamic.BE.HR.EmployeeCollections();
            try
            {
                int TotalRows = 0;
                dataColl = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).GetEmployeeWithPag(0, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
                return new JsonNetResult() { Data = dataColl, TotalCount = TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult UpdateEmployeeData(List<Dynamic.RE.HR.UpdateEmployee> employeeColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.UpdateEmployee(User.UserId, User.HostName, User.DBName).UpdateEmployeeData(employeeColl);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Religion"
        public ActionResult Religion()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveReligion()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Master.Religion>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.ReligionId.HasValue)
                        beData.ReligionId = 0;

                    resVal = new Dynamic.BL.Master.Religion(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllReligion()
        {
            var dataColl = new Dynamic.BL.Master.Religion(User.UserId, User.HostName, User.DBName).GetAllReligion(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetReligionById(int ReligionId)
        {
            var dataColl = new Dynamic.BL.Master.Religion(User.UserId, User.HostName, User.DBName).GetReligionById(0, ReligionId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelReligion(int ReligionId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Master.Religion(User.UserId, User.HostName, User.DBName).DeleteById(0, ReligionId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "EmployeePromotion"
        public ActionResult EmployeePromotion()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveEmployeePromotion()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.EmployeePromotion>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.DocumentColl;
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments("/Attachments/EmployeePromotion", file);
                                if (att != null)
                                {
                                    v.DocumentTypeId = v.DocumentTypeId;
                                    v.Name = att.Name;
                                    v.DocPath = att.DocPath;
                                    v.Extension = att.Extension;
                                    v.ParaName = att.ParaName;
                                }
                            }
                            fInd++;
                        }
                    }

                    beData.CUserId = User.UserId;
                    if (!beData.PromotionId.HasValue)
                        beData.PromotionId = 0;

                    resVal = new Dynamic.BL.EmployeePromotion(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllEmployeePromotion()
        {
            var dataColl = new Dynamic.BL.EmployeePromotion(User.UserId, User.HostName, User.DBName).GetAllEmployeePromotion(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetEmployeePromotionById(int PromotionId)
        {
            var dataColl = new Dynamic.BL.EmployeePromotion(User.UserId, User.HostName, User.DBName).GetEmployeePromotionById(0, PromotionId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelEmployeePromotion(int PromotionId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.EmployeePromotion(User.UserId, User.HostName, User.DBName).DeleteById(0, PromotionId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "EmployeeTransfer"
        public ActionResult EmployeeTransfer()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveEmployeeTransfer()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.EmployeeTransfer>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.DocumentColl;
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments("/Attachments/EmployeePromotion", file);
                                if (att != null)
                                {
                                    v.DocumentTypeId = v.DocumentTypeId;
                                    v.Name = att.Name;
                                    v.DocPath = att.DocPath;
                                    v.Extension = att.Extension;
                                    v.ParaName = att.ParaName;
                                }
                            }
                            fInd++;
                        }
                    }
                    beData.CUserId = User.UserId;
                    if (!beData.TransferId.HasValue)
                        beData.TransferId = 0;

                    resVal = new Dynamic.BL.EmployeeTransfer(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllEmployeeTransfer()
        {
            var dataColl = new Dynamic.BL.EmployeeTransfer(User.UserId, User.HostName, User.DBName).GetAllEmployeeTransfer(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetEmployeeTransferById(int TransferId)
        {
            var dataColl = new Dynamic.BL.EmployeeTransfer(User.UserId, User.HostName, User.DBName).GetEmployeeTransferById(0, TransferId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelEmployeeTransfer(int TransferId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.EmployeeTransfer(User.UserId, User.HostName, User.DBName).DeleteById(0, TransferId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region "EmployeeJD"
        public ActionResult EmployeeJD()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveEmployeeJD()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.EmployeeJD>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.EmpJDId.HasValue)
                        beData.EmpJDId = 0;

                    resVal = new Dynamic.BL.HR.EmployeeJD(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllEmployeeJD()
        {
            var dataColl = new Dynamic.BL.HR.EmployeeJD(User.UserId, User.HostName, User.DBName).GetAllEmployeeJD(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEmployeeJDById(int EmpJDId)
        {
            var dataColl = new Dynamic.BL.HR.EmployeeJD(User.UserId, User.HostName, User.DBName).GetEmployeeJDById(0, EmpJDId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelEmployeeJD(int EmpJDId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.EmployeeJD(User.UserId, User.HostName, User.DBName).DeleteById(0, EmpJDId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "GrievanceType"
        public ActionResult GrievanceType()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveGrievanceType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.GrievanceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.HR.GrievanceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllGrievanceType()
        {
            var dataColl = new Dynamic.BL.HR.GrievanceType(User.UserId, User.HostName, User.DBName).GetAllGrievanceType(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetGrievanceTypeById(int TranId)
        {
            var dataColl = new Dynamic.BL.HR.GrievanceType(User.UserId, User.HostName, User.DBName).GetGrievanceTypeById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelGrievanceType(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.HR.GrievanceType(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region "GrievanceForm"
        public ActionResult GrievanceForm()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveGrievanceForm()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.GrievanceForm>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        if (empPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, empPhoto, true);
                            beData.AttachmentB = photoDoc.Data;
                            beData.Attachment = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.HR.GrievanceForm(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetGrievanceDetailsById(int TranId)
        {
            var dataColl = new Dynamic.BL.HR.GrievanceForm(User.UserId, User.HostName, User.DBName).GetGrievanceDetailsById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEmployeeDetByUserId(int? EmpUserId, int EmployeeOrSalesman)
        {
            var dataColl = new Dynamic.BL.HR.GrievanceForm(User.UserId, User.HostName, User.DBName).GetEmployeeDetByUserId(0, EmpUserId, EmployeeOrSalesman);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "TemplateType"
        public ActionResult TemplateType()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult SaveTemplateType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.TemplateType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TemplateTypeId.HasValue)
                        beData.TemplateTypeId = 0;

                    resVal = new Dynamic.BL.TemplateType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllTemplateType()
        {
            var dataColl = new Dynamic.BL.TemplateType(User.UserId, User.HostName, User.DBName).GetAllTemplateType(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetTemplateTypeById(int TemplateTypeId)
        {
            var dataColl = new Dynamic.BL.TemplateType(User.UserId, User.HostName, User.DBName).GetTemplateTypeById(0, TemplateTypeId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelTemplateType(int TemplateTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.TemplateType(User.UserId, User.HostName, User.DBName).DeleteById(0, TemplateTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion


        #region "LetterTemplate"
        public ActionResult LetterTemplate()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        public JsonNetResult SaveLetterTemplate()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.LetterTemplate>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.LetterTemplateId.HasValue)
                        beData.LetterTemplateId = 0;

                    resVal = new Dynamic.BL.LetterTemplate(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllLetterTemplate()
        {
            var dataColl = new Dynamic.BL.LetterTemplate(User.UserId, User.HostName, User.DBName).GetAllLetterTemplate(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetLetterTemplateById(int TemplateTypeId)
        {
            var dataColl = new Dynamic.BL.LetterTemplate(User.UserId, User.HostName, User.DBName).GetLetterTemplateById(0, TemplateTypeId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelLetterTemplate(int LetterTemplateId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.LetterTemplate(User.UserId, User.HostName, User.DBName).DeleteById(0, LetterTemplateId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetUserDetailsById(int UsersId)
        {
            var dataColl = new Dynamic.BL.LetterTemplate(User.UserId, User.HostName, User.DBName).GetUserDetailsById(0, UsersId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "PrintLetterTemplate"
        public ActionResult PrintLetterTemplate()
        {
            return View();
        }

        #endregion


    }
}