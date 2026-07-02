using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Attendance
{
    public class LeaveQuotaByEmp : ResponeValues
    {
        public int? TranId { get; set; }
        public int? EmployeeId { get; set; }
        public int? PeriodId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool IsBalance { get; set; }
        public double? OpeningQty { get; set; }

        public string Name { get; set; }
        public string Code { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string PeriodName { get; set; }
        public string DateFromBS { get; set; }
        public string DateToBS { get; set; }

        public int? LeaveTypeId { get; set; }
        public string EmployeeCode { get; set; }
        public long? EnrollNumber { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public int? NoOfLeave { get; set; }
        public string EmployeeName { get; set; }
        public string LeaveTypeName { get; set; }
        public int? UserId { get; set; }
        public int? EmployeeOrSalesman { get; set; }
        public string ForEmpOrSalesman { get; set; } = "";
        public LeaveQuotaByEmp()
        {
            LeaveQuotaByEmpDetailsColl = new LeaveQuotaByEmpDetailsCollections();
        }
        public LeaveQuotaByEmpDetailsCollections LeaveQuotaByEmpDetailsColl { get; set; }
        public string LeaveType { get; set; } = "";
        public double? NoOfLeaves { get; set; }
    }
    public class LeaveQuotaByEmpDetails
    {

        public int TranId { get; set; }
        public int LeaveTypeId { get; set; }
        public double? NoOfLeave { get; set; }
        public string Name { get; set; } = "";
    }

    public class LeaveQuotaByEmpDetailsCollections : System.Collections.Generic.List<LeaveQuotaByEmpDetails>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }
    public class LeaveQuotaByEmpCollections : System.Collections.Generic.List<LeaveQuotaByEmp>
    {
        public LeaveQuotaByEmpCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }


}

