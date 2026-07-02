using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class LeaveRequest : ResponeValues
    {
        public LeaveRequest()
        {
            LeavePeriod = LEAVEPERIOD.OTHERS;
            LeaveDuration = LEAVEDURATION.FULL_DAY;
            Remarks = "";
        }
        public int? LeaveRequestId { get; set; }
        public int? BranchId { get; set; }
        public int? DepartmentId { get; set; }
        public int? DesignationId { get; set; }
        public int? ServiceTypeId { get; set; }
        public int? EmployeeId { get; set; }
        public int? StudentId { get; set; }
        public int? LeaveTypeId { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public double TotalDays { get; set; }
        public int? AlternativeEmployeeId { get; set; }
        public string MessagetoAllEmployee { get; set; }
        public int ApprovedBy { get; set; }
        public string Remarks { get; set; }

        public string ApprovedByUser { get; set; }
        public string ApprovedRemarks { get; set; }
        public APPROVEDTYPES ApprovedType { get; set; }

        private Dynamic.BusinessEntity.GeneralDocumentCollections _LeaveRequestDocumentCollections = new Dynamic.BusinessEntity.GeneralDocumentCollections();
        public Dynamic.BusinessEntity.GeneralDocumentCollections LeaveRequestDocumentColl
        {
            get
            {
                return _LeaveRequestDocumentCollections;
            }
            set
            {
                _LeaveRequestDocumentCollections = value;
            }

        }

        public string BranchName { get; set; }
        public string DepartmentName { get; set; }

        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }

        public string LeaveTypeName { get; set; }

        public string DateFromBS { get; set; }
        public string DateToBS { get; set; }

        public string RequestFrom { get; set; }

        public LEAVEDURATION LeaveDuration { get; set; }
        public LEAVEPERIOD LeavePeriod { get; set; }
        public double LeaveHours { get; set; }
        public string UserName { get; set; }

    }
    public class LeaveRequestCollections : System.Collections.Generic.List<LeaveRequest> {

        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
   
    public enum APPROVEDTYPES
    {
        ALL=0,
        NOT_APPROVED = 1,
        APPROVED = 2,
        CANCEL = 3,
        REJECTED = 4
    }

    public enum LEAVEDURATION
    {
        FULL_DAY = 1,
        HALF_DAY = 2,
        HOURLY = 3
    }

    public enum LEAVEPERIOD
    {
        FIRST_HALF = 1,
        SECOND_HALF = 2,
        OTHERS = 3
    }

}
