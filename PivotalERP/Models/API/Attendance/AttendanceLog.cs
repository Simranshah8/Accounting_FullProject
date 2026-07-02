using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.API.Attendance
{
    public class AttendanceLog
    {
        public string PassKey { get; set; }
        public int EnrollNumber { get; set; }
        public string MachineSerialNo { get; set; }
        public DateTime EntryDateTime { get; set; }
        public int Mode { get; set; }
        public int Inout { get; set; }
        public int Events { get; set; }
    }
    public class AttendanceLogCollections : System.Collections.Generic.List<AttendanceLog> { }
}
