using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
    public class VendorWiseAsset : ResponeValues
    {
        public int? InwardId { get; set; }
        public int? ParticularId { get; set; }
        public string InVoiceNo { get; set; } = "";
        public string AssetName { get; set; } = "";
        public string AssetCode { get; set; } = "";
        public string AssetAlias { get; set; } = "";
        public string AssetGroup { get; set; } = "";
        public string AssetType { get; set; } = "";
        public string AssetModel { get; set; } = "";
        public string RAMName { get; set; } = "";
        public string ROMName { get; set; } = "";
        public string SerialNum { get; set; } = "";
        public string StatusName { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string WarrantyMitti { get; set; } = "";
        public string VoucherMitti { get; set; } = "";
        public string VendorName { get; set; } = "";
        public DateTime? VoucherDateAD { get; set; }
        public double? InQTY { get; set; }
        public double? QtyRate { get; set; }
        public double? QtyDisAmt { get; set; }
        public double? PRate { get; set; }
        public double? DisAmt { get; set; }
        public double? Amt { get; set; }
    }

    public class VendorWiseAssetCollections : System.Collections.Generic.List<VendorWiseAsset>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}