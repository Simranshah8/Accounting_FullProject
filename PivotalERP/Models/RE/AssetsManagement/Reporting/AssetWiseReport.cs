using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
   

    public class AssetWiseReport : ResponeValues
    {
        public DateTime VoucherDateAD { get; set; }
        public string VoucherDateBS { get; set; } = "";
        public string VoucherNo { get; set; } = "";
        public string VoucherName { get; set; } = "";
        public string Name { get; set; } = "";
        public string Branch { get; set; } = "";
       
       
        public double? InQty { get; set; }
  
        public double? OutQty { get; set; }
        public double? BalanceQty { get; set; }
        public double? OpeningQty { get; set; }
        public bool IsFrontDate { get; set; }


    }

    public class AssetWiseReportCollections : System.Collections.Generic.List<AssetWiseReport>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }

}