using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class Source : ResponeValues
    {
        public int? SourceId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int? SNo { get; set; }
        public bool Status { get; set; }
    }
    public class SourceCollections : System.Collections.Generic.List<Source>
    {
        public SourceCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}