using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class Device : ResponeValues
    {
        public int? DeviceId { get; set; }
        public string Name { get; set; }
        public string MachineSerialNo { get; set; }
        public string Location { get; set; }
        public DEVICECOMPANY DeviceCompany { get; set; }

        public int DeviceCompanyId
        {
            get
            {
                return (int)DeviceCompany;
            }
        }
    }
    public class DeviceCollections : System.Collections.Generic.List<Device>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public enum DEVICECOMPANY
    {
        REAL_TIME=1,
        DIGICOM=2
    }

    public class DeviceLog
    {
        public string MachineSerialNo { get; set; }
        public long EnrollNumber { get; set; }
        public DateTime EntryDateTime { get; set; }
        public int Mode { get; set; }
        public int InOut { get; set; }
        public int Events { get; set; }
        public string PassKey { get; set; }
    }
}
