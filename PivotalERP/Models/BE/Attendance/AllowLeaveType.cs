using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Attendance
{
    public class EmployeeForAllowLeaveType : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public int? LeaveTypeId { get; set; }
        public string EmployeeCode { get; set; }
        public long? EnrollNo { get; set; }
        public int? SNo { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string LeaveType { get; set; }
        public bool IsAllow { get; set; }
        public int? TranId { get; set; }
        public int? UserId { get; set; }

    }
    public class EmployeeForAllowLeaveTypeCollections : System.Collections.Generic.List<EmployeeForAllowLeaveType>
    {
        public EmployeeForAllowLeaveTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class AllowLeaveType
    {
        public int? EmployeeId { get; set; }
        public int? UserId { get; set; }
        public int? LeaveTypeId { get; set; }
    }

    public class AllowLeaveTypeCollections : System.Collections.Generic.List<AllowLeaveType>
    {
        public AllowLeaveTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}