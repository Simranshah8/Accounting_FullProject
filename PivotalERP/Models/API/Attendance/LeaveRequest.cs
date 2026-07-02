using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Dynamic.API.Attendance
{
    public class LeaveRequest : ResponeValues
    {
        public LeaveRequest()
        {
            Remarks = "";
            LeaveDuration = Dynamic.BE.Attendance.LEAVEDURATION.FULL_DAY;
            LeavePeriod = Dynamic.BE.Attendance.LEAVEPERIOD.OTHERS;
            DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
        }
                  
        public int? EmployeeId { get; set; }
        public int? LeaveTypeId { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string MessageToEmployee { get; set; }
        public string Remarks { get; set; }
        public int RequestId { get; set; }
        public Dynamic.BE.Attendance.LEAVEDURATION LeaveDuration { get; set; }
        public Dynamic.BE.Attendance.LEAVEPERIOD LeavePeriod { get; set; }
        public double LeaveHours { get; set; }
        public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

        public double Lat { get; set; }
        public double Lan { get; set; }
        public string Location { get; set; }
        public int? AlternativeUserId { get; set; }
        public int UserId { get; set; }
        public int EmployeeOrSalesman { get; set; }
    }

    public class LeaveApprove
    {
        public int LeaveRequestId { get; set; }
        public int ApprovedBy { get; set; }
        public string ApprovedByUser { get; set; }
        public string ApprovedRemarks { get; set; }
        public int ApprovedType { get; set; }

    }

}
