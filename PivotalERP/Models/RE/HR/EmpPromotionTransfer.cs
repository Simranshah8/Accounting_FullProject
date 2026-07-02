using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE
{
    public class EmpPromotionTransfer : ResponeValues
    {
        public int? TranId { get; set; }
        public int? EmployeeId { get; set; }
        public int? UserId { get; set; }
        public string EmployeeName { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string EmailId { get; set; } = "";
        public string ContactNo { get; set; } = "";
        public int? BranchId { get; set; }
        public int? DepartmentId { get; set; }
        public int? CategoryId { get; set; }
        public string FromJobTitle { get; set; } = "";
        public int? LevelId { get; set; }
        public int? ServiceTypeId { get; set; }
        public int? DesignationId { get; set; }
        public string FromBranch { get; set; } = "";
        public string FromDepartment { get; set; } = "";
        public string FromCategory { get; set; } = "";
        public string FromGrade { get; set; } = "";
        public string FromServiceType { get; set; } = "";
        public string FromDesignation { get; set; } = "";
        public int? NewBranchId { get; set; }
        public int? NewDepartmentId { get; set; }
        public int? NewCategoryId { get; set; }
        public string ToJobTitle { get; set; } = "";
        public int? NewLevelId { get; set; }
        public int? NewServiceTypeId { get; set; }
        public int? NewDesignationId { get; set; }
        public string ToBranch { get; set; } = "";
        public string ToDepartment { get; set; } = "";
        public string ToCategory { get; set; } = "";
        public string ToGrade { get; set; } = "";
        public string ToServiceType { get; set; } = "";
        public string ToDesignation { get; set; } = "";
        public int? RecommendedById { get; set; }
        public string RecommendedBy { get; set; } = "";
        public string RecommendedRemarks { get; set; } = "";
        public int? VerifiedById { get; set; }
        public string VerifiedBy { get; set; } = "";
        public string VerifiedRemarks { get; set; } = "";
        public string Remarks { get; set; } = "";
        public DateTime? PromotionDate { get; set; }
        public string PromotionMitti { get; set; } = "";
        public DateTime? EffectiveDate { get; set; }
        public string EffectiveMitti { get; set; } = "";
        public string CreateBy { get; set; } = "";
        public string LogMitti { get; set; } = "";
        public string ModifyBy { get; set; } = "";
        public string UpdateMitti { get; set; } = "";
    }
    public class EmpPromotionTransferCollections : List<EmpPromotionTransfer>
    {
        public EmpPromotionTransferCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}