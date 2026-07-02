using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.Payroll
{
    public class PaySlip : ResponeValues
    {
       
        public int? PaySlipId { get; set; } 
        public int? YearId { get; set; } 
        public int? MonthId { get; set; } 
        public int? BranchId { get; set; } 
        public int? DepartmentId { get; set; } 
        public int? ReportId { get; set; } 
        public int? SelectEmployee { get; set; } 
        public int? EmployeeId { get; set; } 



    }
    public class PaySlipCollections : System.Collections.Generic.List<PaySlip>
    {
        public PaySlipCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }


    public class ReportTemplate : ResponeValues
    {
        public int? RptTranId { get; set; }
        public string ReportName { get; set; } = "";
    }

    public class ReportTemplateCollections : System.Collections.Generic.List<ReportTemplate>
    {
        public ReportTemplateCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }



}