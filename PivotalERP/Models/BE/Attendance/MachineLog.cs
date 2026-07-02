using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class MachineLog : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public string MachineSerialNo { get; set; }
        public string EmployeeCode { get; set; }
        public string Name { get; set; }
        public string ContactNo { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public long? EnrollNumber { get; set; }
        public DateTime? PunchDateTime { get; set; }
        public DateTime? LogDateTime { get; set; }

        public string GroupName { get; set; }
        public string LevelName { get; set; }
        public string ServiceType { get; set; }
        public string PunchMiti { get; set; }
        public string MachineName { get; set; }
        public string MachineLocation { get; set; }
        public string IPAddress { get; set; }

    }
    public class MachineLogCollections : System.Collections.Generic.List<MachineLog>
    {
        public MachineLogCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
