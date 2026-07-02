using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class Device
    {
        DA.Attendance.DeviceDB db = null;
        int _UserId = 0;
        public Device(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.DeviceDB(hostName, dbName);
        }
        public ResponeValues SaveUpdateOfflineAttendanceLog(API.Attendance.AttendanceLogCollections dataColl)
        {
            return db.SaveUpdateOfflineAttendanceLog(_UserId, dataColl);
        }
            public ResponeValues SaveFormData(BE.Attendance.Device beData)
        {
            bool isModify = beData.DeviceId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public ResponeValues QrAttendance(string qrCode)
        {
            return db.QrAttendance(_UserId, qrCode);
        }
        public ResponeValues SaveLog(BE.Attendance.DeviceLog beData)
        {
            return db.SaveLog(beData);
        }
            public BE.Attendance.DeviceCollections GetAllDevice(int EntityId)
        {
            return db.getAllDevice(_UserId, EntityId);
        }
        public BE.Attendance.Device GetDeviceById(int EntityId, int DeviceId)
        {
            return db.getDeviceById(_UserId, EntityId, DeviceId);
        }
        public ResponeValues DeleteById(int EntityId, int DeviceId)
        {
            return db.DeleteById(_UserId, EntityId, DeviceId);
        }
        public RE.Attendance.MissingEmployeeAsEnrollNoCollections getMissingEmployeeAsEnrollNo()
        {
            return db.getMissingEmployeeAsEnrollNo(_UserId);
        }
        public RE.Attendance.EmployeeDailyAttendanceCollections getEmpAbsentList(DateTime forDate, string branchIdColl = "",int? companyId=null, int? DepartmentId = null, int? DesignationId = null)
        {
            return db.getEmpAbsentList(_UserId, forDate, branchIdColl,companyId, DepartmentId, DesignationId);
        }
         public RE.Attendance.EmployeeDailyAttendanceCollections getEmpDailyAttendance(DateTime forDate, string branchIdColl = "",bool isManualOnly = false,int empType=1, string DepartmentIdColl = "", string GroupIdColl = "",int? CompanyId=null, bool ApproveOnly = true)
        {
            return db.getEmpDailyAttendance(_UserId, forDate, branchIdColl,isManualOnly,empType, DepartmentIdColl, GroupIdColl,CompanyId,ApproveOnly);
        }
        public RE.Attendance.EmpMonthlyAttendanceLogCollections getEmpMonthlyAttendance(int YearId, int MonthId, string BranchIdColl, int empType, int? CompanyRelationshipId, string DepartmentIdColl = "", string GroupIdColl = "")
        {
            return db.getEmpMonthlyAttendance(_UserId, YearId, MonthId, BranchIdColl, empType, CompanyRelationshipId, DepartmentIdColl, GroupIdColl);
        }
        public RE.Attendance.EmployeeWiseAttendanceCollections getEmployeeWiseAttendance(int? EmployeeId, DateTime? dateFrom, DateTime? dateTo, int? YearId, int? MonthId, string BranchIdColl, string DepartmentIdColl, string DesignationIdColl, string LevelIdColl,string CompanyIdColl,bool approveOnly, ref int totalAbsent, ref double TotalWorkingHour)
        {
            return db.getEmployeeWiseAttendance(_UserId, EmployeeId, dateFrom, dateTo,YearId,MonthId,BranchIdColl,DepartmentIdColl,DesignationIdColl,LevelIdColl,CompanyIdColl,approveOnly, ref totalAbsent,ref TotalWorkingHour);
        }
        public API.Attendance.AttendanceSummaryCollections getClassWiseAttendanceSummary(int UserId, int? ClassId, int? SectionId, DateTime? DateFrom, DateTime? DateTo, int? AcademicYearId, int? YearId, int? MonthId,int? SubjectId,int? StudentId)
        {
            return db.getClassWiseAttendanceSummary(_UserId, ClassId, SectionId, DateFrom, DateTo, AcademicYearId, YearId, MonthId,SubjectId,StudentId);
        }
        public RE.Attendance.EmpMonthlyAttendanceLogCollections getEmpYearAttendanceLog( int EmployeeId, int? YearId, int? CostClassId, bool ShowShiftWise = false)
        {
            return db.getEmpYearAttendanceLog(_UserId, EmployeeId, YearId, CostClassId, ShowShiftWise);
        }
            public ResponeValues IsValidData(ref BE.Attendance.Device beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.DeviceId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.DeviceId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = "Please ! Enter Device Name";
                }
                else if (string.IsNullOrEmpty(beData.MachineSerialNo))
                {
                    resVal.ResponseMSG = "Please ! Enter Device Serial No.";
                }
                else if (string.IsNullOrEmpty(beData.Location))
                {
                    resVal.ResponseMSG = "Please ! Enter Device Location Name";
                }
                else
                {
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Valid";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }
    }
}
