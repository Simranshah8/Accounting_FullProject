using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{
    public class MissingEmployeeAsEnrollNo  
    {
        public long EnrollNumber { get; set; }
        public string MachineSerialNo { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string IPAddress { get; set; }
        public DateTime? MinDate { get; set; }
        public DateTime? MaxDate { get; set; }
        public int? MissingFromDays { get; set; }
    }
    public class MissingEmployeeAsEnrollNoCollections : System.Collections.Generic.List<MissingEmployeeAsEnrollNo>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }
    }
}
