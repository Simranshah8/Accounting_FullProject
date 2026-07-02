using Dynamic.BusinessEntity.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Text;


namespace Dynamic.BE.AssetManagement
{

    public class AssetInward : ResponeValues
    {
        public int? TranId { get; set; }
        [EP("InwardNo", "Assets InWard No.", true)]

        public int? InwardNo { get; set; }
        public int? FYearId { get; set; }
        [EP("InVoiceNo", "Party Invoice No.", true)]
        public string InVoiceNo { get; set; } = "";
        [EP("VoucherDate", "Voucher Date")]
        public DateTime? VoucherDate { get; set; }
        [EP("VendorId", "Vendor", true)]
        public int? VendorId { get; set; }
        [EP("BranchId", "Branch", true)]

        public int? BranchId { get; set; }
        public byte[] PhotoB { get; set; }
        public string FiscalYear { get; set; } = "";
        public string DocUrl { get; set; } = "";
        [EP("Remarks", "Remarks/Notes")]

        public string Remarks { get; set; } = "";
        public string InWardDateNepali { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string Vendor { get; set; } = "";
        public double? InwardQty { get; set; }
        public double? OutwardQty { get; set; }
        public double? ClosingStock { get; set; }
        //public int? TranId { get; set; }
        public int? ParticularId { get; set; }
        public int? AutoVoucherNo { get; set; }
        public string ManualVoucherNO { get; set; } = "";
        public string AutoManualNo { get; set; } = "";
        [EP("VoucherId", "Voucher Type")]
        public int? VoucherId { get; set; }
        [EP("CostClassId", "Fiscal Year")]
        public int? CostClassId { get; set; }
        public string Attributes { get; set; } = "";
        public string UDFKeyVal { get; set; } = "";
        public AssetInward()
        {
            AssetInwardDetailsColl = new AssetInwardDetailsCollections();
            DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

        }
        public AssetInwardDetailsCollections AssetInwardDetailsColl { get; set; }
        public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
    }
    public class AssetInwardCollections : List<AssetInward>
    {
        public AssetInwardCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }

    public class AssetInwardDetails
    {
        public int? InwardId { get; set; }
        [EP("ParticularId", "Particulars", true)]
        public int? ParticularId { get; set; }
        [EP("WarrantyDate", "Warranty Date")]
        public DateTime? WarrantyDate { get; set; }
        [EP("Qty", "Qty", true)]
        public double? Qty { get; set; }
        public double? QtyRate { get; set; }
        public double? QtyDisAmt { get; set; }
        [EP("PRate", "Rate")]
        public double? PRate { get; set; }
        [EP("DisAmt", "Dis Amt")]
        public double? DisAmt { get; set; }
        [EP("Amt", "Amount")]
        public double? Amt { get; set; }
        [EP("Status", "Status")]
        public int? Status { get; set; }
        public int? USno { get; set; }



    }

    public class AssetInwardDetailsCollections : System.Collections.Generic.List<AssetInwardDetails>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }



}

