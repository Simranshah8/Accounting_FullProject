using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class WorkingShiftMapping : ResponeValues
    {
        public int? ShiftMappingId { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public int EmployeeId { get; set; }
        public int WorkingShiftId { get; set; }
        public string WorkingShiftName { get; set; }
        public DateTime? DateFrom_AD { get; set; }
        public DateTime? DateTo_AD { get; set; }
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public string DateFrom_BS { get; set; }
        public string DateTo_BS { get; set; }

        public long EnrollNumber { get; set; }
        public string WorkingShift { get; set; }
        public bool IsMultipleShift { get; set; }

        public string BranchName { get; set; }

    }
    public class WorkingShiftMappingCollections : System.Collections.Generic.List<WorkingShiftMapping>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class WorkingShiftMappingImport
    {
        public string EmpCode { get; set; }
        public string ShiftCode { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

}
