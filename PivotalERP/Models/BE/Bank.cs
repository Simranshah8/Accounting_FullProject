using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class Bank: ResponeValues
    {
        public int? BankId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int BankGroupId { get; set; }
    }
    public class BankCollections : System.Collections.Generic.List<Bank>
    {
        public BankCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}