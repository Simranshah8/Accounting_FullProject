using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

    public class LetterTemplate : ResponeValues
    {

        public int? LetterTemplateId { get; set; }
        public int? TemplateTypeId { get; set; }
        public string Description { get; set; } = "";
        public string TemplateType { get; set; } = "";
    }
    public class LetterTemplateCollections : List<LetterTemplate>
    {
        public LetterTemplateCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
    public class UserDetails : ResponeValues
    {

        public int? UserId { get; set; }
        public int? EmployeeId { get; set; }
        public string Name { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string Address { get; set; } = "";
        public DateTime? DOB_AD { get; set; }
        public string DOB_BS { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Department { get; set; } = "";
        public string Branch { get; set; } = "";
        public string ServiceType { get; set; } = "";
        public string Category { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public string CompanyAddress { get; set; } = "";
        public DateTime? DateofJoining { get; set; }
        public string DateofJoiningBS  { get; set; } = "";
        public double? TotalWorkingYear { get; set; }
        public double? GrossSalary { get; set; }
        public string BloodGroup { get; set; }= "";
        public string SubBranch { get; set; } = "";
        public string TransferFromDepartment { get; set; } = "";
        public string TransferToDepartment { get; set; } = "";
        public string TransferFromBranch { get; set; } = "";
        public string TransferToBranch { get; set; } = "";
        public string TransferFromCompany { get; set; } = "";
        public string TransferToCompany { get; set; } = "";
        public string TransferFromDesignation { get; set; } = "";
        public string TransferToDesination { get; set; } = "";
        public string PromotionFromBranch { get; set; } = "";
        public string PromotionToBranch { get; set; } = "";
        public string PromotionFromDesignation { get; set; } = "";
        public string PromotionToDesination { get; set; } = "";
        public string PromotionFromDepartment { get; set; } = "";
        public string PromotionToDepartment { get; set; } = "";
        public string Feedback { get; set; } = "";
        public string FeedBackRemarks { get; set; } = "";
        public double? FinalRating { get; set; }
        public UserDetails()
        {
            KeyResponsibilitiesColl = new List<KeyResponsibility>();
        }
        public List<KeyResponsibility> KeyResponsibilitiesColl { get; set; }
    }
    public class KeyResponsibility
    {
        public int? EmpJDId { get; set; }
        public int? EmployeeId { get; set; }
        public string Responsibility { get; set; } = "";
    }

}

