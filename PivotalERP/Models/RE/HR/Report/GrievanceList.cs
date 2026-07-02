using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR.Report
{
    public class GrievanceList : ResponeValues
    {
        public int? TranId { get; set; }
        public string SubmittedMiti { get; set; } = "";
        public string GrievanceType { get; set; } = "";
        public string EmpCode { get; set; } = "";
        public string EmpName { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Department { get; set; } = "";
        public string ContactNo { get; set; } = "";
        public string Email { get; set; } = "";

        public long? EnrollNo { get; set; } 
        public string Branch { get; set; } = "";
        public string Description { get; set; } = "";
        public string Doc { get; set; } = "";
        public string Status { get; set; } = "";
        public string ActionTaken { get; set; } = "";
        public string ActionTakenBy { get; set; } = "";
        public string AssignedTo { get; set; } = "";
        public string ActionTakenAt { get; set; } = "";
        public string Notes { get; set; } = "";
        public string Remarks { get; set; } = "";
        public string ClosureDate { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public int? StatusId { get; set; }


    }

    public class GrievanceListCollections : System.Collections.Generic.List<GrievanceList>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}