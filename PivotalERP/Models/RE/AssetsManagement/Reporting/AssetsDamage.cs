using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement
{
    public class AssetsDamage : ResponeValues
    {
        public int? TranId { get; set; }
        public int? ReturnNo { get; set; }
        public bool? IsOutsideRequired { get; set; }
        public int? VendorId { get; set; }
        public string OutLocation { get; set; }
        public DateTime? EntryDate { get; set; }
        public string EntryMitti { get; set; }
        public int? DamageDays { get; set; }
        public string Remark { get; set; }
        public int? DamageDetId { get; set; }
        public int? ParticularId { get; set; }
        public string Particular { get; set; }
        public double? Qty { get; set; }
        public int? StatusId { get; set; }
        public string Status { get; set; }
        public string CreateBy { get; set; }
        public string VoucherNo { get; set; }
    }
    public class AssetsDamageCollections : List<AssetsDamage>
    {
        public AssetsDamageCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}