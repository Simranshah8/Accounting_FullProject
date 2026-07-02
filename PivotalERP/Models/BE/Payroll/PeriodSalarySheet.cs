using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.Payroll
{
    public class PeriodSalarySheet : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public int PayHeadingId { get; set; }
        public string PayHeading { get; set; }
        public double Amount { get; set; }
        public double Rate { get; set; }
        public string BranchName { get; set; }
        public string Category { get; set; }
        public int PayHeadingSNo { get; set; }
        public double Earning { get; set; }
        public double Deducation { get; set; }
        public double Tax { get; set; }
        public double Netpayable { get; set; }
        public string PayHeadType { get; set; }

    }
    public class PeriodSalarySheetCollections : System.Collections.Generic.List<PeriodSalarySheet>
    {
        public PeriodSalarySheetCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}