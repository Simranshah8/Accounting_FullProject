using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Inventory
{
    public class MissingPurchase : ResponeValues
    {
        public int? TranId { get; set; }
        public int Code { get; set; }
        public string Sales_order { get; set; } = " ";
        public string Party_Name { get; set; } = " ";
    }
    public class MissingPurchaseCollections : System.Collections.Generic.List<MissingPurchase>
    {
        public MissingPurchaseCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}