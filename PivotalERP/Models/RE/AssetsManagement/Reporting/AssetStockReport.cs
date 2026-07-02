using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
    public class AssetStockReport : ResponeValues
    {
        public int? InwardId { get; set; }
        public DateTime VoucherDateAD { get; set; }
        public string VoucherMitti { get; set; } = "";
        public string Particular { get; set; } = "";
        public string AssetCode { get; set; } = "";
        public string TypeName { get; set; } = "";
        public string AssetAlias { get; set; } = "";
        public string GroupName { get; set; } = "";
        public string ModelName { get; set; } = "";
        public string RAMName { get; set; } = "";
        public string ROMName { get; set; } = "";
        public string SerialNum { get; set; } = "";
        public string BranchName { get; set; } = "";
        public double? OpeningQTY { get; set; }
        public double? OpeningRate { get; set; }
        public double? OpeningAmt { get; set; }
        public double? InWardQty { get; set; }
        public double? InwardRate { get; set; }
        public double? InWardAmt { get; set; }
        public double? OutWardQty { get; set; }
        public double? OutWardRate { get; set; }
        public double? OutWardAmt { get; set; }
        public double? BalanceQty { get; set; }
        public double? BalanceRate { get; set; }
        public double? BalanceAmt { get; set; }

    }

    public class AssetStockReportCollections : System.Collections.Generic.List<AssetStockReport>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}