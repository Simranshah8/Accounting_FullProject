using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class WeeklyShiftMapping : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public string Name { get; set; }
        public string EmployeeCode { get; set; }
        public long? EnrollNumber { get; set; }
        public string BranchName { get; set; }
        public string Department { get; set; }
        public DateTime? Date { get; set; }
        public string Remarks { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public int? WorkingShiftId { get; set; }
        public string WorkingShiftName { get; set; }
        public string DateBS { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public int? Day { get; set; }
        public string Code { get; set; }
    }
    public class WeeklyShiftMappingCollections : System.Collections.Generic.List<WeeklyShiftMapping>
    {
        public WeeklyShiftMappingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
