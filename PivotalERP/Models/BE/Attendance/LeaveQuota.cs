using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class LeaveQuota :  ResponeValues
    {
        public LeaveQuota()
        {
            Name = "";
        }
        public int? LeaveQuotaId { get; set; }

        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string DateFromBS { get; set; }
        public string DateToBS { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string Name { get; set; }

        //public LeaveQuotaDetailsCollections LeaveDetails { get; set; }
        private LeaveQuotaDetailsCollections _LeaveQuotaDetails = new LeaveQuotaDetailsCollections();
        public LeaveQuotaDetailsCollections LeaveQuotaDetail
        {
            get
            {
                return _LeaveQuotaDetails;
            }
            set
            {
                _LeaveQuotaDetails = value;
            }

        }
        public List<int> CompanyId { get; set; }
        public List<int> BranchId { get; set; }
        public List<int> DepartmentId { get; set; }
        public List<int> DesignationId { get; set; }
        public List<int> ServiceTypeId { get; set; }
        public List<int> EmployeeId { get; set; }
        public int Gender { get; set; }

        //for display

        public string LeaveName { get; set; }
        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        public string DesignationName { get; set; }
        public string ServiceTypeName { get; set; }
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public long EmpEnrollNumber { get; set; }
        public string UserName { get; set; }

    }
    public class LeaveQuotaCollections : System.Collections.Generic.List<LeaveQuota> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class LeaveQuotaDetails
    {
        public int? LeaveQuotaId { get; set; }
        public int? LeaveTypeId { get; set; }
        public double? NoOfLeave { get; set; }
        public string Name { get; set; }
    }
    public class LeaveQuotaDetailsCollections : System.Collections.Generic.List<LeaveQuotaDetails> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}