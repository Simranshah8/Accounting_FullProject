using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.API.Attendance
{
    public class AttendanceSummary  
    {
        public int SNo { get; set; }
        public int StudentId { get; set; }
        public int AutoNumber { get; set; }
        public string RegNo { get; set; }
        public int RollNo { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
        public string HouseName { get; set; } 
        public string Name { get; set; }
        public string Address { get; set; }
        public string FatherName { get; set; }
        public string ContactNo { get; set; }
        public string PhotoPath { get; set; }
        public int TotalDays { get; set; }
        public int SchoolDays { get; set; }
        public double Present { get; set; }
        public double Late { get; set; }
        public double Weekend { get; set; }
        public double Holiday { get; set; }
        public double Event { get; set; }
        public double Leave { get; set; }
        public double Absent { get; set; }
        public double Present_Per { get; set; }
        public double Late_Per { get; set; }
        public double Absent_Per { get; set; }
        public double Leave_Per { get; set; }

    }
    public class AttendanceSummaryCollections : System.Collections.Generic.List<AttendanceSummary>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
