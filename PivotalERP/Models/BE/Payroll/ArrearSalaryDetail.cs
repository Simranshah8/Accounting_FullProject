using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.Payroll
{
    public class EmployeeForArrearSalaryDetail : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public int? PayHeadingId { get; set; }
        public string EmployeeCode { get; set; }
        public long EnrollNo { get; set; }
        public int? SNo { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string PayHeading { get; set; }
        public double? Amount { get; set; }
        public int? YearId { get; set; }
        public int? MonthId { get; set; }
        public bool IsAllow { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public int TaxRuleAs { get; set; } = 1;
        public bool Resident { get; set; } = true;
        public string Gender { get; set; }
        public int MaritalStatus { get; set; }
        public double Earning { get; set; }
        public double Deducation { get; set; }
        public double Tax { get; set; }
        public double Netpayable { get; set; }
        public int ELevelId { get; set; }
        public string LevelName { get; set; }
    }
    public class EmployeeForArrearSalaryDetailCollections : System.Collections.Generic.List<EmployeeForArrearSalaryDetail>
    {
        public EmployeeForArrearSalaryDetailCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class ArrearSalaryDetail
    {
        public int? EmployeeId { get; set; }
        public int? PayHeadingId { get; set; }
        public double? Amount { get; set; }
        public int? YearId { get; set; }
        public int? MonthId { get; set; }

        public double? Earning { get; set; }
        public double? Deducation { get; set; }
        public double? Tax { get; set; }
        public double? Netpayable { get; set; }
    }

    public class ArrearSalaryDetailCollections : System.Collections.Generic.List<ArrearSalaryDetail>
    {
        public ArrearSalaryDetailCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}