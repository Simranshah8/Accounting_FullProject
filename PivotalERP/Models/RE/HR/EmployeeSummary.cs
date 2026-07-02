using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR
{
    public class EmployeeSummary : ResponeValue
    {
        public int EmployeeId { get; set; }

        public int AutoNumber { get; set; }

        public string EmployeeCode { get; set; }

        public long? EnrollNumber { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string ContactNo { get; set; }

        public string Department { get; set; }

        public string Designation { get; set; }

        public string Category { get; set; }

        public string Gender { get; set; }

        public DateTime? DOB_AD { get; set; }

        public string DOB_BS { get; set; }

        public string PhotoPath { get; set; }

        public string TA_FullAddress { get; set; }

        public string PA_FullAddress { get; set; }

        public string TA_District { get; set; }

        public string PA_District { get; set; }

        public string FatherName { get; set; }

        public string MotherName { get; set; }

        public string SpouseName { get; set; }

        public string CardNo { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public string SMSText { get; set; }

        public string Caste { get; set; }

        public DateTime? LeftDate { get; set; }

        public string LeftMiti { get; set; }

        public string LeftRemarks { get; set; }

        public string Nationality { get; set; }

        public string OfficeContactNo { get; set; }

        public string PersonalContactNo { get; set; }

        public string CitizenShipno { get; set; }

        public string Email { get; set; }

        public string BloodGroup { get; set; }

        public string Level { get; set; }
        public string Company { get; set;  }

    }
    public class EmployeeSummaryCollections : System.Collections.Generic.List<EmployeeSummary>
    {
        public EmployeeSummaryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}