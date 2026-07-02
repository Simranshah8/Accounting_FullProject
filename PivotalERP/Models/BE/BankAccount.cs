using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class BankAccount: ResponeValues
    {
        public int? BankAccountId { get; set; }
        public int? BankId { get; set; }
        public string AccountNo { get; set; }
        public string BranchName { get; set; }
    }
    public class BankAccountCollections : System.Collections.Generic.List<BankAccount>
    {
        public BankAccountCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}