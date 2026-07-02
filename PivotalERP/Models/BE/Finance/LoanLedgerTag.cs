using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessEntity.Finance
{
    public class LoanLedgerTag
    {
        public int PrincipalLedgerId { get; set; }
        public int InterestLedgerId { get; set; }
        public int RebateLedgerId { get; set; }
        public int PenaltyLedgerId { get; set; }
        public int FinanceLedgerId { get; set; }
        public int VoucherId { get; set; }
        public int CostClassId { get; set; }

        public string PrincipalLedger { get; set; }
        public string InterestLedger{ get; set; }
        public string RebateLedger { get; set; }
        public string PenaltyLedger { get; set; }
        public string FinanceLedger { get; set; }
        public string Voucher { get; set; }
        public string CostClass { get; set; }        
        
    }

    
}
