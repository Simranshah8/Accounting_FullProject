using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
   public class AttendanceEmployeewise:ResponeValues
    {
        public int DepartmentId { get; set; }        
        public int TranId { get; set; }
        public DateTime ForDate { get; set; }
        public INOUTMODES InOutMode { get; set; }
        public int EmployeeId { get; set; }
        public ATTENDANCES? Attendance { get; set; }
        public int LateMin { get; set; }
        public string Remarks { get; set; }
    }
public class AttendanceEmployeewiseCollections : List<AttendanceEmployeewise> {
        public AttendanceEmployeewiseCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public enum INOUTMODES
    {
        IN = 1,
        OUT = 2,
        BOTH = 3
    }

    public enum ATTENDANCES
    {
        PRESENT = 1,
        ABSENT = 2,
        LATE = 3,
        LEAVE = 4
    }
}