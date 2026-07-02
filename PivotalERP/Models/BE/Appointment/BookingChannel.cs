using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Appointment
{
    public class BookingChannel: ResponeValues
    {
        public int? BookingId { get; set; }
        public int? BookingChannelId { get; set; }
        public string BookingChannelName { get; set; } = "";
        public string OrderNo { get; set; } = "";
        public bool IsActive { get; set; }
        public string Remarks { get; set; } = "";
    }

    public class BookingChannelCollections: System.Collections.Generic.List<BookingChannel>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}