using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Finance
{
    public class FinanceConfig : ResponeValues
    {
        public int? FinanceLedgerId { get; set; }
        public int? PrincipalLedgerId { get; set; }
        public int? InterestLedgerId { get; set; }
        public int? RebateLedgerId { get; set; }
        public int? PenaltyLedgerId { get; set; }
        public int? VoucherId { get; set; }
        public int? CostClassId { get; set; }
    }
    public class FinanceConfigCollections : System.Collections.Generic.List<FinanceConfig>
    {
        public FinanceConfigCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }

    }

}