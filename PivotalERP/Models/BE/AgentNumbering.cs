using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class AgentNumbering : ResponeValues
    {
        public int Level { get; set; }
        public int NumberingMethod { get; set; }
        public string Prefix { get; set; }
        public string Suffix { get; set; }
        public int? NumericalPartWidth { get; set; }
        public int? StartNumber { get; set; }

    }
    public class AgentNumberingCollections : System.Collections.Generic.List<AgentNumbering>
    {
        public AgentNumberingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}