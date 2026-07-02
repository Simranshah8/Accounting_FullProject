using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.ReportEntity.Inventory
{
    public class StockTransfer : ResponeValues
    {
        public int TranId { get; set; }
        public int VoucherId { get; set; }
        public int CostClassId { get; set; }
        public string VoucherNo { get; set; }
        public int AutoVoucherNo { get; set; }
        public string VoucherName { get; set; }
        public string CostClassName { get; set; }
        public string RefNo { get; set; }
        public string Narration { get; set; }
        public DateTime VoucherDate { get; set; }
        public string VoucherMiti { get; set; }
        public string HaveDocument { get; set; }
        public string UserName { get; set; }
        public string SourceGodown { get; set; }
        public string TargetGodown { get; set; }
        public string Branch { get; set; }
        public string ProductName { get; set; }
        public string Unit { get; set; }
        public double ActualQty { get; set; }
        public double BilledQty { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        public double DiscountPer { get; set; }
        public double DiscountAmt { get; set; }
        public string RegdNo { get; set; }
        public string ChassisNo { get; set; }
        public string EngineNo { get; set; }
        public string Model { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public string KeyNo { get; set; }
        public string CodeNo { get; set; }
        public string MFGYear { get; set; }
        public string Batch { get; set; }
        public DateTime? MFGDate { get; set; }
        public DateTime? EXPDate { get; set; }
        public string Remarks { get; set; }
        public string LotNo { get; set; }

    }


    public class StockTransferCollections : System.Collections.Generic.List<StockTransfer>
    {
        public StockTransferCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}