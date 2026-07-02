using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class EmployeeForAllowPayHeading : ResponeValues
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
        public bool IsAllow { get; set; }

    }
    public class EmployeeForAllowPayHeadingCollections : System.Collections.Generic.List<EmployeeForAllowPayHeading>
    {
        public EmployeeForAllowPayHeadingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class AllowPayHeading 
    {
        public int EmployeeId { get; set; }
        public int PayHeadingId { get; set; }
    }

    public class AllowPayHeadingCollections : System.Collections.Generic.List<AllowPayHeading>
    {
        public AllowPayHeadingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}