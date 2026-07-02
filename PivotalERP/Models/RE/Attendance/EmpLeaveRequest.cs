using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{
    public class EmpLeaveRequest : ResponeValues
    {
        public EmpLeaveRequest()
        {
            Remarks = "";
            //LeaveDuration = Dynamic.BE.Attendance.LEAVEDURATION.FULL_DAY.ToString();
            //LeavePeriod = Dynamic.BE.Attendance.LEAVEPERIOD.OTHERS.ToString();
            DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
            //ApprovedType = Dynamic.BE.Attendance.APPROVEDTYPES.NOT_APPROVED.ToString();

        }
        public int LeaveRequestId { get; set; }
        public string EmployeeCode { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string ContactNo { get; set; }
        public string LeaveType { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string MitiFrom { get; set; }
        public string MitiTo { get; set; }
        public double TotalDays { get; set; }
        public string LeaveDuration { get; set; }
        public string LeavePeriod { get; set; }
        public double LeaveHours { get; set; }
        public string Al_EmployeeCode { get; set; }
        public string AL_Name { get; set; }
        public string MessageToAllEmployee { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedType { get; set; }
        public string ApprovedRemarks { get; set; }
        public DateTime? AprovedLogDate { get; set; }
        public string ApprovedLogMiti { get; set; }
        public string Remarks { get; set; }
        public double Lan { get; set; }
        public double Lat { get; set; }
        public string Location { get; set; }
        public DateTime LogDateTime { get; set; }
        public string LogMiti { get; set; }
        public int? EmployeeId { get; set; }

        public int ApprovedTypeId { get; set; }

        public string BranchName { get; set; }
        public string BranchAddress { get; set; }
        public int UserId { get; set; }
        public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
        
        
    } 
    public class EmpLeaveRequestCollections : System.Collections.Generic.List<EmpLeaveRequest>
    {
        public EmpLeaveRequestCollections()
        {
            LeaveBalanceColl = new List<LeaveBalance>();
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }

        public List<LeaveBalance> LeaveBalanceColl { get; set; }
    }

    public class LeaveBalance
    {
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; }
        public double OpeningQty { get; set; }
        public double QuotaQty { get; set; }
        public double LeaveQty { get; set; } 
        public double BalanceQty { get; set; }
    }
}
