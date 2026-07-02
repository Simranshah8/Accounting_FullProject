using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class WorkingShift : ResponeValues
    {
        public int? WorkingShiftId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public DateTime? OnDutyTime { get; set; }
        public DateTime? OffDutyTime { get; set; }

        public string OnDurtyTimeStr { get; set; }
        public string OffDutyTimeStr { get; set; }

        public int ShiftDuration { get; set; }
        public bool EnableTwoShiftInADay { get; set; }
        public bool Break1 { get; set; }
        public DateTime? Break1StartTime { get; set; }
        public DateTime? Break1EndTime { get; set; }
        public int Break1Duration { get; set; }
        public bool Break2 { get; set; }
        public DateTime? Break2StartTime { get; set; }
        public DateTime? Break2EndTime { get; set; }
        public int Break2Duration { get; set; }
        public bool HalfDay { get; set; }
        public DateTime? HalfDayStartTime { get; set; }
        public DateTime? HalfDayEndTime { get; set; }
        public int HalfDayDuration { get; set; }
        public int? FirstWeeklyOff { get; set; }
        public int? SecondWeeklyOff { get; set; }
        public int? SecondWeeklyOffType { get; set; }
        public int RemoveDuplicatePunch { get; set; }
        public int? SinglePunchPolicy { get; set; }
        public int MaxEarlyMinutesAllow { get; set; }
        public int MaxOTAllow { get; set; }
        public int NoofPresentforWeeklyOff { get; set; }
        public bool WAWAbsent { get; set; }
        public bool LWLAbsent { get; set; }
        public int OTCalculation { get; set; }
        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        public double? PermittedLateArrival { get; set; }
        public double? PermittedEarlyDeparture { get; set; }
        public double? HalfDayLessThanHr { get; set; }
        public double? AbsentiLessThanHr { get; set; }
        public double? LateArrival { get; set; }
        public int? LateArrivalCut { get; set; }
        public double? EarlyDeparture { get; set; }
        public int? EarlyDepartureCut { get; set; }
        public bool LateIncoming { get; set; }
        public int? NoOfLateInAMonth { get; set; }
        public int? CutDays { get; set; }
        public double? IgnoreOTDLessthan { get; set; }
        //END / Prasahnt  Code 27 Katrik 

        private WorkingShiftDetailCollections _WorkingShiftDetailCollections = new WorkingShiftDetailCollections();
        public WorkingShiftDetailCollections WorkingShiftDetailsColl
        {
            get
            {
                return _WorkingShiftDetailCollections;
            }
            set
            {
                _WorkingShiftDetailCollections = value;
            }

        }

        public DateTime? AbsentNoticeTime { get; set; }

        public int? EmployeeId { get; set; }
        public string UserName { get; set; } = "";
        public bool? IsDefault { get; set; }
    }
    public class WorkingShiftCollections : System.Collections.Generic.List<WorkingShift> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class WorkingShiftDetail
    {
        public int WorkingShiftId { get; set; }
        public int AttendanceInOutModeId { get; set; }
        public DateTime InTime { get; set; }
        public DateTime InGrossMinute { get; set; }
        public DateTime OutTime { get; set; }
        public DateTime OutGrossMinute { get; set; }
        public string Remarks { get; set; }

    }
    public class WorkingShiftDetailCollections : System.Collections.Generic.List<WorkingShiftDetail> { }


    public class ImportWorkingShift
    {
        public string EmpCode { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string ShiftName { get; set; }

    }
}
