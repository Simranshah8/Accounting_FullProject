using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.SSF.BE
{
    public class BookingHistory : ResponeValues
    {
        public string scheme { get; set; } = "";
        public string chfid { get; set; } = "";
        public string subProduct { get; set; } = "";
        public string booked { get; set; } = "";
        public string booked_by { get; set; } = "";
        public DateTime date { get; set; }
        public string clientClaimId { get; set; } = "";
        public string clientInvoiceNumber { get; set; } = "";
    }

    public class ResponseData
    {
        public List<BookingHistory> data { get; set; } = new List<BookingHistory>(); // Matches the "data" array in JSON
    }

    public class BookingCollections
    {
        public string resourceType { get; set; } = "ExtraJson"; // Matches JSON key
        public ResponseData ResVals { get; set; } = new ResponseData(); // Maps "response" object
        public int success { get; set; } // 1 or 0 in the JSON
        public string msg { get; set; } = ""; // Matches "msg" key in JSON

        // Derived properties
        public bool IsSuccess => success == 1;
        public string ResponseMSG => msg;
    }
    public class RequestCollections : List<BookingHistory>
    {
        public bool IsSuccess { get; set; } = false;
        public string ResponseMSG { get; set; } = "";
    }

}
