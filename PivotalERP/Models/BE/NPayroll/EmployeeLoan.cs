using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class EmployeeLoan : ResponeValues
    {
        public int? TranId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? LoanDate { get; set; }
        public int? LoanTypeId { get; set; }
        public double? PrincipleAmount { get; set; }
        public double? InterestRate { get; set; }
        public string Period { get; set; }
        public double? EMIAmount { get; set; }
        public DateTime? EffDate { get; set; }
        public string Remarks { get; set; }
        public string LoanTypeName { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public string EffMiti { get; set; }
        public int? UserId { get; set; }
        public string CompanyName { get; set; }  //Added by Simran
        public string BranchName { get; set; }  //Added by Simran
        public int? CompanyId { get; set; }  //Added by Simran

    }

    public class EmployeeLoanCollections : System.Collections.Generic.List<EmployeeLoan>
    {
        public EmployeeLoanCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}