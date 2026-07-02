using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class TicketFor : ResponeValues
    {
        public int? TicketForId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int? SNo { get; set; }
        public bool Status { get; set; }
    }
    public class TicketForCollections : System.Collections.Generic.List<TicketFor>
    {
        public TicketForCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}