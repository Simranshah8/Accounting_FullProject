using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class IncentiveSheet : ResponeValues
    {
        public int? ProductBrandId { get; set; }
        public int? UserId { get; set; }
        public int? EmployeeId { get; set; }
        public int? PayHeadingId { get; set; }
        public string EmployeeCode { get; set; }
        public long? EnrollNo { get; set; }
        public int? SNo { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string PayHeading { get; set; }
        public double? Amount { get; set; }
        public DateTime? IncentiveDate { get; set; }
        public bool IsAllow { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public int TaxRuleAs { get; set; } = 1;
        public bool Resident { get; set; } = true;
        public string Gender { get; set; } = "";
        public string Remark { get; set; } = "";
        public int GenderId
        {
            get
            {
                switch (Gender.Trim().ToLower())
                {
                    case "male": return 1;
                    case "female": return 2;
                    case "other": return 3;
                    default: return 1;
                }
            }
        }
        public int MaritalStatus { get; set; }
        public double? Netpayable { get; set; }
        public int? DepartmentId { get; set; }
        public int? CompanyRelationshipId { get; set; }
        public string CompanyName { get; set; }
        public string IncentiveMitti { get; set; }
        public string ProductBrand { get; set; }
        public int? LevelId { get; set; }
        public string LevelName { get; set; }
    }
    public class IncentiveSheetCollections : List<IncentiveSheet>
    {
        public IncentiveSheetCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }

    }
}