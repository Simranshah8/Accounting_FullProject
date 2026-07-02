using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR
{
    public class UpdateEmployee : ResponeValue
        {
            public int EmployeeId { get; set; }
            public string EmployeeCode { get; set; } = "";
            public string Name { get; set; } = "";
            public string FirstName { get; set; } = "";
            public string MiddleName { get; set; } = "";
            public string LastName { get; set; } = "";
            public string Gender { get; set; } = "";
            public long? EnrollNumber { get; set; }
        public string CardNo { get; set; } = "";
            public DateTime? DateOfJoining { get; set; }
            public string EMSId { get; set; } = "";
            public string OfficeContactNo { get; set; } = "";
            public string OfficeEmailId { get; set; } = "";
            public string TA_FullAddress { get; set; } = "";
            public int? NationalityId { get; set; }
            public string PanId { get; set; } = "";
            public string MaritalStatus { get; set; } = "";
            public int? DepartmentId { get; set; }
            public int? DesignationId { get; set; }
            public int? CategoryId { get; set; }
            public int? CompanyRelationshipId { get; set; }
            public string Qualification { get; set; } = "";
            public DateTime? DOB_AD { get; set; } 
            public string Nationality { get; set; } = "";
        public int TaxRuleAs { get; set; } = 1;
            public int? SalaryApplicableMonthId { get; set; }
            public int? SalaryApplicableYearId { get; set; }
            public int? EmployeeGroupId { get; set; }
            public DateTime? LeaveApplicableDate { get; set; }
            public bool? IsAllowOT { get; set; }
            public int? LevelId { get; set; }
            public int? S_FirstLevelId { get; set; }
            public int? S_SecondLevelId { get; set; }
        public int? S_ThirdLevelId { get; set; }

    }
    public class UpdateEmployeeCollections : System.Collections.Generic.List<UpdateEmployee>
        {
            public UpdateEmployeeCollections(int v, object v1)
            {
                ResponseMSG = "";
            }
            public string ResponseMSG { get; set; }
            public DateTime? ExpireDateTime { get; set; }
            public bool IsSuccess { get; set; }
        }

    public class UpdateEmpCollections : System.Collections.Generic.List<UpdateEmployee>
    {
        public UpdateEmpCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}