using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class EmployeeForAllowExpenseCategory : ResponeValues
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
        public bool IsAllow { get; set; }

    }
    public class EmployeeForAllowExpenseCategoryCollections : System.Collections.Generic.List<EmployeeForAllowExpenseCategory>
    {
        public EmployeeForAllowExpenseCategoryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class AllowExpenseCategory
    {
        public int EmployeeId { get; set; }
        public int ExpenseCategoryId { get; set; }
    }

    public class AllowExpenseCategoryCollections : System.Collections.Generic.List<AllowExpenseCategory>
    {
        public AllowExpenseCategoryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}