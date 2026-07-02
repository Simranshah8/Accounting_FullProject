using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.HR.Controllers
{
    public class ReportController : PivotalERP.Controllers.BaseController
    {
        // GET: HR/Report

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_DailyAppAttendance, true)]
        public ActionResult DailyAppAttendance()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetDailyAppAttendance(DateTime? forDate,int? CompanyId=null,int? BranchId=null)
        {
            if (!forDate.HasValue)
                forDate = DateTime.Today;

            var dataColl = new Dynamic.Reporting.HR.Attendance(  User.HostName, User.DBName).getDailyAppAttendance(User.UserId, forDate,CompanyId,BranchId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_DailyAppAttendance, true)]
        public ActionResult MonthlyAppAttendance()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetMonthlyAppAttendance(int YearId, int MonthId, bool ShowInOutDetails, DateTime? startDate, DateTime? endDate, int DateStyle,string BranchIdColl,string DepartmentIdColl,string CompanyRelationshipColl)
        {
 
            var dataColl = new Dynamic.Reporting.HR.Attendance(User.HostName, User.DBName).getMonthlyAppAttendance(User.UserId, YearId,MonthId,ShowInOutDetails,startDate,endDate,DateStyle, BranchIdColl, DepartmentIdColl, CompanyRelationshipColl);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult SalesmanAppAttendance()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAppAttendance(int AgentId,DateTime DateFrom,DateTime DateTo)
        {
            var dataColl = new Dynamic.Reporting.HR.Attendance(User.HostName, User.DBName).getAppAttendance(User.UserId, AgentId, DateFrom, DateTo);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult EmployeeAttendance()
        {
            return View();
        }

      


        public ActionResult RdlEmpDateWiseInOut()
        {
            return View();
        }



        #region Period Salary Sheet
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Payroll_PeriodSalarySheet, true)]
        public ActionResult PeriodSalarySheet()
        {
            return View();
        }
        /// <summary>
        /// Add para Branch, Department, Category, CompanyRelation
        /// </summary>
        /// <param name="FromYearId"></param>
        /// <param name="FromMonthId"></param>
        /// <param name="ToYearId"></param>
        /// <param name="ToMonthId"></param>
        /// <param name="ForEmployee"></param>
        /// <param name="BranchId"></param>
        /// <param name="DepartmentId"></param>
        /// <param name="CategoryId"></param>
        /// <param name="CompanyRelationshipId"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonNetResult GetAllPeriodSalarySheet(int FromYearId, int FromMonthId, int ToYearId, int ToMonthId, int? ForEmployee = null, int? BranchId = null, int? DepartmentId = null, int? CategoryId = null, int? CompanyRelationshipId = null)
        {
            Dynamic.BE.Payroll.PeriodSalarySheetCollections dataColl = new Dynamic.BE.Payroll.PeriodSalarySheetCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.PeriodSalarySheet(User.UserId, User.HostName, User.DBName).GetAllPeriodSalarySheet(0, FromYearId, FromMonthId, ToYearId, ToMonthId, ForEmployee, BranchId, DepartmentId, CategoryId, CompanyRelationshipId);
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

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Payroll_PaySlip, true)]
        public ActionResult PaySlip()
        {
            return View();
        }



        [HttpPost]
        public JsonNetResult GetAllReportTemplateSlip()
        {
            Dynamic.BE.Payroll.ReportTemplateCollections dataColl = new Dynamic.BE.Payroll.ReportTemplateCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.PaySlip(User.UserId, User.HostName, User.DBName).GetAllReportTemplateSlip(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Payroll_Salarysheet, true)]
        public ActionResult Salarysheet()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetEmpSummary(string DepartmentIdColl = "")
        {
            //var dataColl = new Dynamic.BL.HR.Employee(User.UserId, User.HostName, User.DBName).getEmployeeSummaryList(DepartmentIdColl);
            //
            //return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

            return null;
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_MachineLog, true)]
        public ActionResult MachineLog()
        {
            ViewBag.Title = "MachineLog";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_MachineLog);
            return View();
        }


        [HttpPost]
        public JsonNetResult GetMachineLog(DateTime? DateFrom, DateTime? DateTo)
        {
            Dynamic.BE.Attendance.MachineLogCollections dataColl = new Dynamic.BE.Attendance.MachineLogCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.MachineLog(User.UserId, User.HostName, User.DBName).getMachineLog( DateFrom, DateTo);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult AttendanceAppeals()
        {
            return View();
        }

        #region"Daily Biometric attendance"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_DailyBiometricAttendance,true)]
        public ActionResult DailyBiometricAttendance()
        {
            ViewBag.Title = "DailyBiometricAttendance";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_DailyBiometricAttendance);
            return View();
        }
        [HttpPost]
        public JsonNetResult GetEmpDailyAttendance(DateTime forDate, string branchIdColl,string departmentIdColl,string groupIdColl,int? companyId=null)
        {
            if (!string.IsNullOrEmpty(branchIdColl))
            {
                if (branchIdColl == "0")
                    branchIdColl = "";
            }
            else
                branchIdColl = "";

            if (!string.IsNullOrEmpty(departmentIdColl))
            {
                if (departmentIdColl == "0")
                    departmentIdColl = "";
            }
            else
                departmentIdColl = "";


            if (!string.IsNullOrEmpty(groupIdColl))
            {
                if (groupIdColl == "0")
                    groupIdColl = "";
            }
            else
                groupIdColl = "";

            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmpDailyAttendance(forDate, branchIdColl, false,1,departmentIdColl,groupIdColl,companyId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region"Attendance Summary"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_AttendanceSummary, true)]
        public ActionResult AttendanceSummary()
        {
            ViewBag.Title = "AttendanceSummary";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_AttendanceSummary);
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpMonthlyBIOAttendance(int YearId, int MonthId, string branchIdColl, int? CompanyRelationshipId, string DepartmentIdColl)
        {
            if (!string.IsNullOrEmpty(branchIdColl))
            {
                if (branchIdColl == "0")
                    branchIdColl = "";
            }
            else
                branchIdColl = "";

            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmpMonthlyAttendance(YearId, MonthId, branchIdColl, 1, CompanyRelationshipId, DepartmentIdColl);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonNetResult DownloadXlsAttDet()
        {
            var empColl = DeserializeObjectIgnoreNull<Dynamic.RE.Attendance.EmpMonthlyAttendanceLogCollections>(Request["jsonData"]);

            ResponeValues resVal = new ResponeValues();
            try
            {
                if(empColl==null || empColl.Count == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No data found";                    
                }
                else
                {                    
                    var user = User;
                    var fst = empColl.First();
                    var key =fst.NY.ToString()+"_"+fst.NM.ToString()+"_"+GuiId.ToString().Replace("-", "");
                    var urlPath = "print-tran-log\\" + key + ".xlsx";
                    string outputFile = Server.MapPath("~") + urlPath;

                    var wb = new ClosedXML.Excel.XLWorkbook();

                    var attendanceColor = new Dynamic.BL.Attendance.AttendanceColorConfig(user.UserId, user.HostName, user.DBName).GetAllAttendanceColorConfig(0);

                    var attendanceBL = new Dynamic.BL.Attendance.Device(user.UserId, user.HostName, user.DBName);
                    foreach (var emp in empColl)
                    {
                        int totalAbsent = 0;
                        double totalWorkingHour = 0;
                        var dataColl = attendanceBL.getEmployeeWiseAttendance(emp.EmployeeId, emp.DateFrom, emp.DateTo, null, null, "", "", "", "","",false, ref totalAbsent, ref totalWorkingHour);
                        if (dataColl != null && dataColl.Count > 0)
                        {
                            dataColl[0].TotalAbsent = totalAbsent;
                            dataColl[0].TotalWorkingHour = totalWorkingHour;

                            string sheetName = emp.Name + "(" + emp.EmpCode + ")";
                            var ws = wb.Worksheets.Add(sheetName);
                            ws.Cell(1, 1).Value = "S.No.";
                            ws.Cell(1, 2).Value = "Date(A.D.)";
                            ws.Cell(1, 3).Value = "Date(B.S.)";
                            ws.Cell(1, 4).Value = "In Time";
                            ws.Cell(1, 5).Value = "In Location";
                            ws.Cell(1, 6).Value = "Out Time";
                            ws.Cell(1, 7).Value = "Out Location";
                            ws.Cell(1, 8).Value = "Attendance";
                            ws.Cell(1, 9).Value = "Working hour";
                            ws.Cell(1, 10).Value = "Remarks";
                            ws.Cell(1, 11).Value = "Late In";
                            ws.Cell(1, 12).Value = "Before Out";
                            ws.Cell(1, 13).Value = "OT Hour";

                            for (int c = 1; c < 14; c++)
                                ws.Cell(1, c).Style.Font.SetBold();

                            int row = 2;
                            foreach (var rec in dataColl)
                            {
                                ws.Cell(row, 1).Value = (row - 1);
                                ws.Cell(row, 2).Value = rec.DateAD;
                                ws.Cell(row, 3).Value = rec.DateBS;
                                ws.Cell(row, 4).Value = (rec.InTime.HasValue ? rec.InTime.Value.ToString("HH:mm") : "");
                                ws.Cell(row, 5).Value = rec.InLocation;
                                ws.Cell(row, 6).Value = (rec.OutTime.HasValue ? rec.OutTime.Value.ToString("HH:mm") : "");
                                ws.Cell(row, 7).Value = rec.OutLocation;
                                ws.Cell(row, 8).Value = rec.Attendance;
                                ws.Cell(row, 9).Value = rec.WorkingHour;
                                ws.Cell(row, 10).Value = rec.Remarks;
                                ws.Cell(row, 11).Value = rec.LateInMinutes;
                                ws.Cell(row, 12).Value = rec.EarlyOutMinutes;
                                ws.Cell(row, 13).Value = rec.OTDuration;

                                if (attendanceColor != null)
                                {
                                    if(!string.IsNullOrEmpty(attendanceColor.ACellColor) && !rec.IsPresent && !rec.IsWeekEnd && !rec.IsHoliday && !rec.IsLeave)
                                        ws.Row(row).CellsUsed().Style.Font.FontColor = ClosedXML.Excel.XLColor.FromHtml(attendanceColor.ACellColor);
                                    else if (!string.IsNullOrEmpty(attendanceColor.WCellColor) && rec.IsWeekEnd)
                                        ws.Row(row).CellsUsed().Style.Font.FontColor = ClosedXML.Excel.XLColor.FromHtml(attendanceColor.WCellColor);
                                    else if (!string.IsNullOrEmpty(attendanceColor.HCellColor) && rec.IsHoliday)
                                        ws.Row(row).CellsUsed().Style.Font.FontColor = ClosedXML.Excel.XLColor.FromHtml(attendanceColor.HCellColor);
                                    else if (!string.IsNullOrEmpty(attendanceColor.LCellColor) && rec.IsLeave)
                                        ws.Row(row).CellsUsed().Style.Font.FontColor = ClosedXML.Excel.XLColor.FromHtml(attendanceColor.LCellColor);
                                    else if (!string.IsNullOrEmpty(attendanceColor.PCellColor) && rec.IsPresent)
                                        ws.Row(row).CellsUsed().Style.Font.FontColor = ClosedXML.Excel.XLColor.FromHtml(attendanceColor.PCellColor);
                                }                                
                                row++;
                            }

                            var fstAT = dataColl.First();
                            ws.Cell(2, 14).Value = "Total Working Hour: "+ fstAT.TotalWorkingHour.ToString("N")+" Hours";
                            ws.Cell(3, 14).Value = "WORKING DAYS : "+(fstAT.TotalDays- fstAT.TotalHoliday- fstAT.TotalWeekEnd).ToString()+" DAYS ";
                            ws.Cell(4, 14).Value = "PRESENT DAYS : "+ fstAT.TotalPresent.ToString("N") +" DAYS ";
                            ws.Cell(5, 14).Value = "ABSENT DAYS: " + fstAT.TotalAbsent.ToString() + " DAYS ";
                            ws.Cell(6, 14).Value = "LEAVE : "+ fstAT.TotalLeave.ToString()+" DAY";
                            ws.Cell(7, 14).Value = "OT : "+ fstAT.OTDuration.ToString();

                            ws.Cell(2, 14).Style.Font.SetBold();
                            ws.Cell(3, 14).Style.Font.SetBold();
                            ws.Cell(4, 14).Style.Font.SetBold();
                            ws.Cell(5, 14).Style.Font.SetBold();
                            ws.Cell(6, 14).Style.Font.SetBold();
                            ws.Cell(7, 14).Style.Font.SetBold();

                            ws.Columns().AdjustToContents();
                        }
                    }

                    wb.SaveAs(outputFile);

                    resVal.ResponseId = urlPath;
                    resVal.IsSuccess = true;

                }


                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region"Employee Wise Attendance"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_EmployeeWiseEmpAttendance, true)]
        public ActionResult EmployeeWiseEmpAttendance()
        {
            ViewBag.Title = "EmployeeWiseEmpAttendance";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_EmployeeWiseEmpAttendance);
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpWiseAttendance(int employeeId, DateTime fromDate, DateTime toDate)
        {
            int totalAbsent = 0;
            double totalWorkingHour = 0;
            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmployeeWiseAttendance(employeeId, fromDate, toDate, null, null,"","","","","",false, ref totalAbsent, ref totalWorkingHour);
            if (dataColl != null && dataColl.Count > 0)
            {
                dataColl[0].TotalAbsent = totalAbsent;
                dataColl[0].TotalWorkingHour = totalWorkingHour;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region"Manual Attendance"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_ManualAttendance, true)]
        public ActionResult ManualAttendance()
        {
           // ViewBag.Title = "ManualAttendance";
           // ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_ManualAttendance);
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpManualDailyAttendance(DateTime forDate, string branchIdColl,int? companyId)
        {
            if (!string.IsNullOrEmpty(branchIdColl))
            {
                if (branchIdColl == "0")
                    branchIdColl = "";
            }
            else
                branchIdColl = "";

            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmpDailyAttendance(forDate, branchIdColl, true,1,"","",companyId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region"Absent Only"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_AbsentOnly, true)]
        public ActionResult AbsentOnly()
        {
            ViewBag.Title = "AbsentOnly";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_AbsentOnly);
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpAbsentList(DateTime forDate,string branchIdColl,int? CompanyId, int? DepartmentId = null, int? DesignationId = null)
        {

            if (branchIdColl == "")
                branchIdColl = "";

            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmpAbsentList(forDate, branchIdColl, CompanyId, DepartmentId, DesignationId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region"InOutDetails"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_InOutDetails, true)]
        public ActionResult InOutDetails()
        {
            ViewBag.Title = "InOutDetails";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_InOutDetails);
            return View();
        }

        #endregion


        #region"Employee Missing as Enroll Number"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)RptFormsEntity.Att_EmployeeWiseEmpAttendance, true)]
        public ActionResult EmpMissingAsEnrollNo()
        {
            ViewBag.Title = "Employee Missing As Enroll Number";
            ViewBag.EntityId = Convert.ToInt32(RptFormsEntity.Att_EmployeeWiseEmpAttendance);
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmpMissingAsEnrollNo()
        {          
            var dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getMissingEmployeeAsEnrollNo();          
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        public ActionResult EmployeeSummary()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult GetEmployeeSummary(DateTime? JoinDateFrom, DateTime? JoinDateTo, DateTime? PermanentDateFrom, DateTime? PermanentDateTo, DateTime? RetireDateFrom, DateTime? RetireDateTo, string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId="")
        {
            Dynamic.RE.HR.Report.EmployeeSummaryCollections dataColl = new Dynamic.RE.HR.Report.EmployeeSummaryCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.Report.EmployeeSummary(User.UserId, User.HostName, User.DBName).getEmployeeSummary(JoinDateFrom, JoinDateTo, PermanentDateFrom, PermanentDateTo, RetireDateFrom, RetireDateTo, BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId,CompanyId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult BankAccountDetails()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetBankAccountDetails(string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId)
        {
            Dynamic.RE.HR.Report.BankAccountDetailsCollections dataColl = new Dynamic.RE.HR.Report.BankAccountDetailsCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.Report.BankAccountDetails(User.UserId, User.HostName, User.DBName).GetBankAccountDetails(BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId,CompanyId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult ServiceTenureReport()
        {
            return View();
        }
        public ActionResult AuditLogReport()
        {
            return View();
        }

        public ActionResult EmployeeYearlyAttendance()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult getEmpYearAttendanceLog(int EmployeeId, int? YearId, int? CostClassId)
        {
            Dynamic.RE.Attendance.EmpMonthlyAttendanceLogCollections dataColl = new Dynamic.RE.Attendance.EmpMonthlyAttendanceLogCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.Device(User.UserId, User.HostName, User.DBName).getEmpYearAttendanceLog(EmployeeId, YearId, CostClassId, false);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
         
        public ActionResult RdlSalarySheet()
        {
            return View();
        }

        #region "EmployeeJD's Key Responsibility History"
        [HttpPost]
        public JsonNetResult GetAllEmpResponsibilityHistory(int? EmployeeId)
        {
            var dataColl = new Dynamic.BL.HR.Report.EmpResponsibilityHistory(User.UserId, User.HostName, User.DBName).GetAllEmpResponsibilityHistory(0, EmployeeId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion


        #region "GrievanceList"
        public ActionResult GrievanceList()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllGrievanceList(DateTime? DateFrom, DateTime? DateTo, int? DepartmentId, int? ForUserId, int? GrievanceTypeId, int? StatusId)
        {
            var dataColl = new Dynamic.BL.HR.Report.GrievanceList(User.UserId, User.HostName, User.DBName).GetGrievanceList(0, DateFrom, DateTo, DepartmentId, ForUserId, GrievanceTypeId, StatusId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "Attendance Appeals"
        [HttpPost]
        public JsonNetResult GetAttendanceAppealDetails(DateTime? DateFrom, DateTime? DateTo, string ApprovedType, int? EmployeeId, int? BranchId, bool? ShowSelfOnly)
        {
            Dynamic.BE.Attendance.AttendanceAppealsCollections dataColl = new Dynamic.BE.Attendance.AttendanceAppealsCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.AttendanceAppeals(User.UserId, User.HostName, User.DBName).GetAttendanceAppealDetails(DateFrom, DateTo, ApprovedType, EmployeeId, BranchId, ShowSelfOnly);
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
        public JsonNetResult DelAttendanceById(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.AttendanceAppeals(User.UserId, User.HostName, User.DBName).DeleteById(0,TranId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult UpdateAttendanceAppeals()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceAppeals>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Attendance.AttendanceAppeals(User.UserId, User.HostName, User.DBName).UpdateAttendanceAppeals(beData);
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

        #region "Employee Promotion and Transfer"
        public ActionResult EmpPromotionTransfer()
        {
            return View();
        }

       [HttpPost]
        public JsonNetResult GetEmpPromotionTransfer(int IsEmpPT)
        {
            Dynamic.RE.EmpPromotionTransferCollections dataColl = new Dynamic.RE.EmpPromotionTransferCollections();
            try
            {
                dataColl = new Dynamic.BL.EmployeePromotion(User.UserId, User.HostName, User.DBName).GetEmpPromotionTransfer(IsEmpPT);
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

        #region"EmployeeWise GPS Log"
        public ActionResult EmployeeWiseGPSLog()
        {
            return View();
        }
        #endregion

        #region"HRDashboard"
        public ActionResult HRDashboard()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetHRDashboard(int? ViewDetailsId)
        {
            Dynamic.RE.HRDashboard dataColl = new Dynamic.RE.HRDashboard();
            try
            {
                dataColl = new Dynamic.BL.HRDashboard(User.UserId, User.HostName, User.DBName).GetHRDashboard(ViewDetailsId);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
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