using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.Reporting.Account
{

    public class BudgetSummary : ResponeValues
    {
        public string Particular { get; set; } = "";
        public string Branch { get; set; } = "";
        public double? EQty { get; set; }
        public double? ERate { get; set; }
        public double? EAmt { get; set; }
        public double? TQty { get; set; }
        public double? TRate { get; set; }
        public double? TAmt { get; set; }
        public double? DiffAmtET { get; set; }
        public double? LastYearTranAmt { get; set; }
        public double? DiffAmt{ get; set; }
    }
    public class BudgetSummaryCollections : List<BudgetSummary>
    {
        public BudgetSummaryCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }

    }
}