using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AssetManagement
{
    public class AssetType: ResponeValues
    {
        public int? AssetTypeId { get; set; }
        public string TypeName { get; set; } = "";
        public string TypeCode { get; set; } = "";
        public int? TypeParentId { get; set; }
        public string TypeParentName { get; set; } = "";
        public AssetType()
        {
            VoucherUDFCol = new List<Dynamic.BusinessEntity.Account.VoucherUDF>();
        }
        public List<Dynamic.BusinessEntity.Account.VoucherUDF> VoucherUDFCol { get; set; }
    }
    public class AssetTypeCollections: System.Collections.Generic.List<AssetType>
    {
        public AssetTypeCollections()
        {
            VoucherUDFCol = new List<Dynamic.BusinessEntity.Account.VoucherUDF>();
        }
        public List<Dynamic.BusinessEntity.Account.VoucherUDF> VoucherUDFCol { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}