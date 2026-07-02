using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BE;
using Dynamic.BL;
using Dynamic.DA;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.HR.Controllers
{
    public class LeaveController : PivotalERP.Controllers.BaseController
    {
        // GET: HR/Leave
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LeaveType)]
        public ActionResult LeaveType()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveType)]
        public JsonNetResult SaveLeaveType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.LeaveTypeId.HasValue)
                        beData.LeaveTypeId = 0;

                    resVal = new Dynamic.BL.Attendance.LeaveType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResultWithEnum GetAllLeaveTypeList()
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveType(User.UserId, User.HostName, User.DBName).GetAllLeaveType(0);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_LeaveType)]
        public JsonNetResult GetLeaveTypeById(int LeaveTypeId)
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveType(User.UserId, User.HostName, User.DBName).GetLeaveTypeById(0, LeaveTypeId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_LeaveType)]
        public JsonNetResult DelLeaveType(int LeaveTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.LeaveType(User.UserId, User.HostName, User.DBName).DeleteById(0, LeaveTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public ActionResult LeaveQuote()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult SaveLeaveQuota()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveQuota>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.LeaveQuotaId.HasValue)
                        beData.LeaveQuotaId = 0;

                    resVal = new Dynamic.BL.Attendance.LeaveQuota(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult DelLeaveQuota(int LeaveQuotaId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.LeaveQuota(User.UserId, User.HostName, User.DBName).DeleteById(0, LeaveQuotaId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResultWithEnum GetAllLeaveQuotaList()
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveQuota(User.UserId, User.HostName, User.DBName).GetAllLeaveQuota(0);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult GetLeaveQuotaById(int LeaveQuotaId)
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveQuota(User.UserId, User.HostName, User.DBName).getLeaveQuotaById(LeaveQuotaId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LeaveEntry)]
        public ActionResult LeaveEntry()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveEntry)]
        public JsonNetResult SaveLeaveRequest()
        {
            string photoLocation = "/Attachments/Employee";
            ResponeValues resVal = new ResponeValues();

            try
            {
                var beData = DeserializeObject<Dynamic.API.Attendance.LeaveRequest>(Request["jsonData"]);

                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        for (int fi = 0; fi < Request.Files.Count; fi++)
                        {
                            HttpPostedFileBase file = Request.Files["file" + fi];
                            if (file != null)
                            {
                                beData.DocumentColl.Add(GetAttachmentDocuments(photoLocation, file));
                            }
                        }
                    }

                    beData.CUserId = User.UserId;

                    resVal = new Dynamic.BL.Attendance.LeaveRequest(User.UserId, User.HostName, User.DBName).SaveFromApp(beData);
                    //if (resVal.IsSuccess)
                    //{
                    //    Dynamic.BusinessEntity.Global.NotificationLog notification = new Dynamic.BusinessEntity.Global.NotificationLog();

                    //    notification.Content = resVal.JsonStr;
                    //    notification.ContentPath = "";
                    //    notification.EntityId = Convert.ToInt32(Dynamic.BE.Global.NOTIFICATION_ENTITY.LEAVE_REQUEST);
                    //    notification.EntityName = Dynamic.BE.Global.NOTIFICATION_ENTITY.LEAVE_REQUEST.ToString();
                    //    notification.Heading = "Leave Request";
                    //    notification.Subject = "Leave Request";
                    //    notification.UserId = User.UserId;
                    //    notification.UserName = User.Identity.Name;
                    //    notification.UserIdColl = resVal.CUserName.Trim();

                    //    resVal = new PivotalERP.Global.GlobalFunction(User.UserId, hostName, dbName).SendNotification(User.UserId, notification, true);

                    //    resVal.IsSuccess = true;
                    //    resVal.ResponseMSG = "New Leave Request Success";
                    //}
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

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_LeaveRequest,true)]
        public ActionResult LeaveRequest()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpLeaveReq(int LeaveStatus, DateTime? dateFrom, DateTime? dateTo, int? ForUserId, int EmployeeOrSalesman)
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveRequest(User.UserId, User.HostName, User.DBName).getEmpLeaveRequestLst(dateFrom, dateTo, LeaveStatus, ForUserId, EmployeeOrSalesman,false);

            var retData = new
            {
                LeaveColl = dataColl,
                BalanceColl = dataColl.LeaveBalanceColl
            };

            return new JsonNetResult() { Data = retData, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveEntry)]
        public JsonNetResult LeaveApprove(Dynamic.API.Attendance.LeaveApprove beData)
        {
            ResponeValues resVal = new ResponeValues();

            if (string.IsNullOrEmpty(beData.ApprovedRemarks))
                resVal.ResponseMSG = "Please ! Enter Remarks";
            else if (beData.ApprovedType <= 1)
                resVal.ResponseMSG = "Please ! Select Approved Status";
            else
            {
                beData.ApprovedBy = User.UserId;
                beData.ApprovedByUser = User.UserName;
                resVal = new Dynamic.BL.Attendance.LeaveRequest(User.UserId, User.HostName, User.DBName).LeaveApproved(beData);

                //if (retVal.IsSuccess && !string.IsNullOrEmpty(retVal.CUserName))
                //{
                //    Dynamic.BusinessEntity.Global.NotificationLog notification = new Dynamic.BusinessEntity.Global.NotificationLog();

                //    string approvedTypes = ((Dynamic.BE.Attendance.APPROVEDTYPES)beData.ApprovedType).ToString();
                //    notification.Content = retVal.JsonStr;
                //    notification.ContentPath = "";
                //    notification.EntityId = Convert.ToInt32(Dynamic.BE.Global.NOTIFICATION_ENTITY.LEAVE_APPROVED);
                //    notification.EntityName = Dynamic.BE.Global.NOTIFICATION_ENTITY.LEAVE_APPROVED.ToString();
                //    notification.Heading = "Leave " + approvedTypes;
                //    notification.Subject = "Leave " + approvedTypes;
                //    notification.UserId = User.UserId;
                //    notification.UserName = User.Identity.Name;
                //    notification.UserIdColl = retVal.CUserName.Trim();

                //    resVal = new PivotalERP.Global.GlobalFunction(User.UserId, hostName, dbName).SendNotification(User.UserId, notification, true);

                //    resVal.IsSuccess = true;
                //    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                //}
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public ActionResult LeaveOpening()
        {
            return View();
        }
        //Mangshir 05 Prashant code
        //change NoOfLeave in nullable

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public JsonNetResult SaveLeaveOpening()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveOpening>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    beData.OpeningQty = beData.LeaveQuotaDetail.Sum(p1 => p1.NoOfLeave ?? 0); //nullable
                    resVal = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResultWithEnum GetAllLeaveOpeningList()
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).GetAllLeaveOpening(0);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public JsonNetResult GetLeaveOpeningById(int UsersId, int PeriodId)
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).getLeaveOpeningById(UsersId, PeriodId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public JsonNetResult DelLeaveOpening(int? TranId, int? PeriodId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).DeleteById(TranId, PeriodId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_LeaveBalanceSummary,true)]
        public ActionResult LeaveBalanceSummary()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetLeaveBalanaceSummary(string BranchIdColl = "", string DepartmentIdColl = "", string CategoryIdColl = "", int? ForUserId = null, int? PeriodId = null, int EmployeeOrSalesman = 1, int? LeaveTypeId = null)
        {
            Dynamic.RE.Leave.LeaveQuotaSummaryCollections dataColl = new Dynamic.RE.Leave.LeaveQuotaSummaryCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.LeaveQuota(User.UserId, User.HostName, User.DBName).getLeaveBalanceSummary( BranchIdColl, DepartmentIdColl, CategoryIdColl,null,PeriodId,LeaveTypeId,ForUserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public ActionResult FinancialYrWiseLeaveOpening()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllEmpLeaveOpening(int? BranchId, int? DepartmentId, int? CategoryId, int PeriodId, int EmployeeOrSalesman)
        {
            Dynamic.BE.Attendance.LeaveOpeningCollections dataColl = new Dynamic.BE.Attendance.LeaveOpeningCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).getAllEmpLeaveOpening(BranchId, DepartmentId, CategoryId, PeriodId, EmployeeOrSalesman);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        //Mangshir 05 Prashant code
        //change NoOfLeave in nullable
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_FinancialYrWiseLeaveOpening)]
        public JsonNetResult SaveLeaveOpeningColl()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveOpeningCollections>(Request["jsonData"]);
                if (beData != null && beData.Count > 0)
                {
                    //beData.CUserId = User.UserId;
                    //beData.OpeningQty = beData.LeaveQuotaDetail.Sum(p1 => p1.NoOfLeave);
                    foreach (var empQuota in beData)
                    {
                        if (empQuota.LeaveQuotaDetail != null)
                        {
                            foreach (var detail in empQuota.LeaveQuotaDetail)
                            {
                                detail.NoOfLeave = detail.NoOfLeave;
                            }
                            empQuota.OpeningQty = empQuota.LeaveQuotaDetail.Sum(detail => detail.NoOfLeave ?? 0);//nullable
                        }
                    }
                    resVal = new Dynamic.BL.Attendance.LeaveOpening(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
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

        //Code by Prashant on 27Kartik
        //add LeaveQuota by Employee
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public ActionResult LeaveQuotaByEmployee()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult SaveLeaveQuotaByEmp()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveQuotaByEmp>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    beData.OpeningQty = beData.LeaveQuotaByEmpDetailsColl.Sum(p1 => p1.NoOfLeave);
                    resVal = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult GetLeaveQuotaByEmpById(int UsersId, int PeriodId)
        {
            var dataColl = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).GetLeaveQuotaByEmpById(UsersId, PeriodId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult getAllLeaveQuotaByEmp()
        {
            Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl = new Dynamic.BE.Attendance.LeaveQuotaByEmpCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).GetAllLeaveQuotaByEmp();
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_LeaveQuotaByEmployee)]
        public JsonNetResult DelLeaveQuotaByEmp(int? TranId, int? PeriodId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).DeleteById(TranId, PeriodId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LeaveQuotaByEmployeeColl)]
        public ActionResult LeaveQuotaByEmployeeColl()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllEmpLeaveQuota(int? BranchId, int? DepartmentId, int? CategoryId, int PeriodId, int EmployeeOrSalesman)
        {
            Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl = new Dynamic.BE.Attendance.LeaveQuotaByEmpCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).getAllEmpLeaveQuota(BranchId, DepartmentId, CategoryId, PeriodId, EmployeeOrSalesman);
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
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LeaveQuotaByEmployeeColl)]
        public JsonNetResult SaveLeaveQuotaColl()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.LeaveQuotaByEmpCollections>(Request["jsonData"]);

                if (beData != null && beData.Count > 0)
                {
                    // Loop through each LeaveQuotaByEmp object to calculate and set OpeningQty
                    foreach (var empQuota in beData)
                    {
                        if (empQuota.LeaveQuotaByEmpDetailsColl != null)
                        {
                            foreach (var detail in empQuota.LeaveQuotaByEmpDetailsColl)
                            {
                                detail.NoOfLeave = detail.NoOfLeave ?? 0;
                            }
                            empQuota.OpeningQty = empQuota.LeaveQuotaByEmpDetailsColl.Sum(detail => detail.NoOfLeave.Value);
                        }
                    }

                    // Call the SaveUpdate method with the updated beData
                    resVal = new Dynamic.BL.Attendance.LeaveQuotaByEmp(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
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

        #region"Allow Leave Type"
        public ActionResult AllowLeaveType()
        {
            return View();
        }
        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_AllowPayHeading)]
        public JsonNetResult GetAllEmployeeForAllowLeaveType(int? BranchId, int? DepartmentId, int? DesignationId, int? LevelId, int? EmployeeGroupId, int? CompanyRelationshipId = null)
        {
            Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections dataColl = new Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AllowLeaveType(User.UserId, User.HostName, User.DBName).getAllAllowLeaveType(0, BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId, CompanyRelationshipId);
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
        //[ValidateInput(false)]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_AllowPayHeading)]
        public JsonNetResult SaveAllowLeaveType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AllowLeaveTypeCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.Attendance.AllowLeaveType(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
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

        //Add by Prashant on Baishak 09

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_AllowPayHeading)]
        public JsonNetResult GetLeaveTypeByEmployee(int UsersId)
        {
            Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections dataColl = new Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AllowLeaveType(User.UserId, User.HostName, User.DBName).GetLeaveTypeByEmployee(UsersId);
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