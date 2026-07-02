using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Appointment
{
    public class AppointmentType: ResponeValues
    {
        public int? AppointmentId { get; set; }
        public int? AppointmentTypeId { get; set; }
        public string AppointmentTypeName { get; set; } = "";
        public string OrderNo { get; set; } = "";
        public bool? IsActive { get; set; }
        public string Remarks { get; set; } = "";
    }
    public class AppointmentTypeCollection: System.Collections.Generic.List<AppointmentType>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}