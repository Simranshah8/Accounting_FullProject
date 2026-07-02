using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class BankGroup: ResponeValues
    {
        public int? BankGroupId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
    public class BankGroupCollections : System.Collections.Generic.List<BankGroup>
    {
        public BankGroupCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}