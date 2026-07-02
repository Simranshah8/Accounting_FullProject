using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class LeaveOpening :  ResponeValues
    {
        public LeaveOpening()
        {
            DateFromBS = "";
            DateToBS = "";
            IsBalance = false;
        }
        public int? TranId { get; set; }

        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public bool IsBalance { get; set; }
        public string DateFromBS { get; set; }
        public string DateToBS { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int EmployeeId { get; set; }
        public int? UserId { get; set; } //Make it nullable
        public double OpeningQty { get; set; }
        public int? LeaveTypeId { get; set; }
        public string EmployeeCode { get; set; }
        public long? EnrollNumber { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public double? NoOfLeave { get; set; }
        public string EmployeeName { get; set; }
        public string LeaveTypeName { get; set; }
        //magh 4 Prshant Code
        public int? EmployeeOrSalesman { get; set; }
        public string ForEmpOrSalesman { get; set; }

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

        public string Name { get; set; }
        public string Code { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }

    }
    public class LeaveOpeningCollections : System.Collections.Generic.List<LeaveOpening> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
