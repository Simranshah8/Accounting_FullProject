using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class EmployeeForExpenseRateSetup : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public int? ExpenseCategoryId { get; set; }
        public string EmployeeCode { get; set; }
        public long EnrollNo { get; set; }
        public int? SNo { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string ExpenseCategory { get; set; }
        public double? Amount { get; set; }
        public DateTime? ApplicableFrom { get; set; }

    }
    public class EmployeeForExpenseRateSetupCollections : System.Collections.Generic.List<EmployeeForExpenseRateSetup>
    {
        public EmployeeForExpenseRateSetupCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class ExpenseRateSetup
    {
        public int EmployeeId { get; set; }
        public int ExpenseCategoryId { get; set; }
        public double? Amount { get; set; }
        public DateTime? ApplicableFrom { get; set; }
    }

    public class ExpenseRateSetupCollections : System.Collections.Generic.List<ExpenseRateSetup>
    {
        public ExpenseRateSetupCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}