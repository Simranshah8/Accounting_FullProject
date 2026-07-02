using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Hospital
{
    public class OPDTicketType: ResponeValues
    {
        public int OpDTicketTypeId { get; set; }
        public string Name { get; set; } = "";
        public string Alias { get; set; } = "";
        public string Description { get; set; } = "";
        public int ForTran { get; set; }
        public int? id
        {
            get
            {
                return this.OpDTicketTypeId;
            }
        }
        public string text
        {
            get
            {
                return this.Name;
            }
        }
    }

    public class OPDTicketTypeCollection : System.Collections.Generic.List<OPDTicketType>{
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }

        public OPDTicketTypeCollection()
        {
            ResponseMSG = "";
        }
    }
}