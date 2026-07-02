using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class AddDevices : ResponeValues
    {
        public int? DeviceId { get; set; }
        public string Name { get; set; } = "";
        public string MachineSerialNo { get; set; } = "";
        public string Location { get; set; } = "";
        public int? DeviceCompanyId { get; set; }
        public string IPAddress { get; set; } = "";
        public int? BranchId { get; set; }
        public int? DepartmentId { get; set; }
        public string BranchName { get; set; } = "";
        public string DepartmentName { get; set; } = "";

    }
    public class AddDevicesCollections : System.Collections.Generic.List<AddDevices>
    {
        public AddDevicesCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
