using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Task
{
    public class TicketCloseFeedback : ResponeValues
    {
        public int? TicketId { get; set; }
        public bool? CallStatus { get; set; }
        public int? WorkStatusId { get; set; }
        public int Rating { get; set; }
        public bool ReOpenTicket { get; set; }
        public string Comment { get; set; }
    }
    public class TicketCloseFeedbackCollections : System.Collections.Generic.List<TicketCloseFeedback>
    {
        public TicketCloseFeedbackCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}