using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
    public class AssetsOpeningList : ResponeValues
    {
      
        public string OpeningMiti { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string ParticularName { get; set; } = "";
        public string Code { get; set; } = "";
        public string Alias { get; set; } = "";
        public string SerialNum { get; set; } = "";
        public string GroupName { get; set; } = "";
        public string TypeName { get; set; } = "";
        public string ModelName { get; set; } = "";
        public double? Qty { get; set; }
        public double? Rate { get; set; }
        public double? Amt { get; set; }
        public string FiscalYear { get; set; } = "";
        public string CreatedBy { get; set; } = "";
        public DateTime? VoucherDate { get; set; }


    }
    public class AssetsOpeningListCollections : List<AssetsOpeningList>
    {
        public AssetsOpeningListCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}