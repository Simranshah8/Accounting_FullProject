using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class Nature : ResponeValues
    {
        public int? NatureId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int? SNo { get; set; }
        public bool Status { get; set; }
    }
    public class NatureCollections : System.Collections.Generic.List<Nature>
    {
        public NatureCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}