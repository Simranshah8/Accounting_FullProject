using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.Reporting.Account
{
    public class DairyLedgerVoucher : ResponeValues
    {
        public int? TranId { get; set; }
        public DateTime? VoucherDate { get; set; }
        public string VoucherMiti { get; set; } = "";
        public double? Qty { get; set; }
        public double? Fat { get; set; }
        public double? FatKG { get; set; }
        public double? Lacto { get; set; }
        public double? SNF { get; set; }
        public double? SNFKG { get; set; }
        public double? Amount { get; set; }
        public double? PayAmount { get; set; }
        public double? BalanceAmt { get; set; }
    }
    public class DairyLedgerVoucherCollections : List<DairyLedgerVoucher>
    {
        public DairyLedgerVoucherCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }

    }
}