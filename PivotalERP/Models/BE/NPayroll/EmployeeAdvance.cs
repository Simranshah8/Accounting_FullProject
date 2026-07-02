using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class EmployeeAdvance : ResponeValues
    {
        public int? TranId { get; set; }
        public int? BranchId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? AdvanceDate { get; set; }
        public int AdvanceTypeId { get; set; }
        public double AdvanceAmount { get; set; }
        public string Installment { get; set; } = "";
        public double DeductionAmount { get; set; }
        public DateTime? EffDate { get; set; }
        public string Remarks { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string AdvanceType { get; set; } = "";
        public string EffMiti { get; set; }
        public int? UserId { get; set; }
        public string CompanyName { get; set; }  //Added by Simran
        public int? CompanyId { get; set; }  //Added by Simran

    }

    public class EmployeeAdvanceCollections : System.Collections.Generic.List<EmployeeAdvance>
    {
        public EmployeeAdvanceCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}