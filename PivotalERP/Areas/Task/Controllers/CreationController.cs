using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Task.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Task/Creation
        string photoLocation = "/Attachments/Task";
        public ActionResult CreateTask()
        {
            return View();
        }

        public ActionResult ViewTask()
        {
            return View();
        }
        public ActionResult MonthlyTask()
        {
            return View();
        }

        public ActionResult TaskType()
        {
            return View();
        }
        #region "TaskType"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.TaskType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.TaskType)]
        public JsonNetResult SaveUpdateTaskType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.TaskType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TaskTypeId.HasValue)
                        beData.TaskTypeId = 0;

                    resVal = new Dynamic.BL.Task.TaskType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        //[PermissionsAttribute(PivotalERP.BE.Global.Actions.Modify, (int)FormsEntity.TaskType)]
        public JsonNetResult getTaskTypeById(int TaskTypeId)
        {
            Dynamic.BE.Task.TaskType resVal = new Dynamic.BE.Task.TaskType();
            try
            {
                resVal = new Dynamic.BL.Task.TaskType(User.UserId, User.HostName, User.DBName).GetTaskTypeById(0, TaskTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.TaskType)]
        public JsonNetResult DeleteTaskTypeById(int TaskTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TaskTypeId < 0)
                {
                    resVal.ResponseMSG = "Can't delete default Income Source";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Task.TaskType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TaskTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllTaskType()
        {
            Dynamic.BE.Task.TaskTypeCollections dataColl = new Dynamic.BE.Task.TaskTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.TaskType(User.UserId, User.HostName, User.DBName).GetAllTaskType(0);
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
        [ValidateInput(false)]
        public JsonNetResult SaveAssignTask()
        {
            string photoLocation = "/Attachments/Task";
            ResponeValues resVal = new ResponeValues();

            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.AssignTask>(Request["jsonData"]);

                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var UserPhoto = filesColl["UserPhoto"];

                        if (UserPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, UserPhoto, true);
                            beData.Photo = photoDoc.Data;
                            beData.attachFile = photoDoc.DocPath;
                        }

                        // Additional code for processing photos can go here if needed.
                    }

                    bool isModify = false;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    else if (beData.TranId > 0)
                        isModify = true;

                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accepted";
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
        public JsonNetResult GetAllTask(bool FilterDate = false, DateTime? DateFrom = null, DateTime? DateTo = null, int? StatusId = null, int? CustomerId = null, int? AssignToId = null, int? RequirementTypeId = null, int? PriorityId = null, int? ApprovedId = null, int? ProductNameId = null, int PageNumber = 0, int RowsOfPage = 10, int FilterDateAs = 0)
        {
            Dynamic.RE.Task.AssignTaskCollections dataColl = new Dynamic.RE.Task.AssignTaskCollections();
            try
            {
                int TotalRows = 0;
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).getAllTask(ref TotalRows, FilterDate, DateFrom, DateTo, StatusId, CustomerId, AssignToId, RequirementTypeId, PriorityId, "", "", ApprovedId, ProductNameId, PageNumber, RowsOfPage, FilterDateAs);
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
        public JsonNetResult SaveStatus()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.TicketStatus>(Request["jsonData"]);
                if (beData != null)
                {

                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var attDoc = GetAttachmentDocuments(photoLocation, filesColl[0], true);
                        if (attDoc != null)
                            beData.attachFile = attDoc.DocPath;
                    }

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).SaveStatus(beData);
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
        public JsonNetResult SaveComment()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.TicketComment>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var attDoc = GetAttachmentDocuments(photoLocation, filesColl[0], true);
                        if (attDoc != null)
                            beData.attachFile = attDoc.DocPath;
                    }

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).SaveComment(beData);
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
        public JsonNetResult SaveAssign()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.TicketAssign>(Request["jsonData"]);
                if (beData != null)
                {

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).SaveAssign(beData);
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
        public JsonNetResult GetCommentsbyId(int TranId)
        {
            Dynamic.BE.Task.TicketCommentCollections dataColl = new Dynamic.BE.Task.TicketCommentCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).GetCommentsById(TranId);
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
        public JsonNetResult GetHisbyId(int TranId)
        {
            Dynamic.BE.Task.TicketHisCollections dataColl = new Dynamic.BE.Task.TicketHisCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).GettHisById(TranId);
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
        public JsonNetResult SaveCloseFeedback()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Task.TicketApproved>(Request["jsonData"]);
                if (beData != null)
                {

                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).SaveApproved(beData);
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
        public JsonNetResult GetAllTaskAttachment(int TicketId)
        {
            Dynamic.BE.Task.TicketCommentCollections dataColl = new Dynamic.BE.Task.TicketCommentCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).getAllAttachment(TicketId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        //[PermissionsAttribute(Actions.View, (int)CrmFormEntity.Monthly_Task, false)]
        //public ActionResult MonthlyTask()
        //{
        //    return View();
        //}

        [HttpPost]
        public JsonNetResult GetMonthlyTask(int YearId, int MonthId)
        {
            Dynamic.RE.Task.MonthlyTaskSummaryCollections dataColl = new Dynamic.RE.Task.MonthlyTaskSummaryCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).getMonthlyTask(YearId, MonthId);
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
        public JsonNetResult GetDayTask(int YearId, int MonthId, int DayId, int EmployeeId, int ForUserId)
        {
            Dynamic.BE.Task.DayTaskCollections dataColl = new Dynamic.BE.Task.DayTaskCollections();
            try
            {
                dataColl = new Dynamic.BL.Task.AssignTask(User.UserId, User.HostName, User.DBName).getDayTask(EmployeeId, ForUserId, YearId, MonthId, DayId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
    }
}