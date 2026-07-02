using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class ChequeEntry: ResponeValues
    {
        public int? TranId { get; set; }
        public int BankAccountId { get; set; }
        public int FromRange { get; set; }
        public int ToRange { get; set; }
        public int NoOfCheque { get; set; }
        public string ChequeName { get; set; }
    }
    public class ChequeEntryCollections : System.Collections.Generic.List<ChequeEntry>
    {
        public ChequeEntryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}