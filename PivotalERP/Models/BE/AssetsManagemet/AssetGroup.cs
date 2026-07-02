using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AssetManagement
{
    public class AssetGroup: ResponeValues
    {
        public int? AssetGroupId { get; set; }
        public string GroupName { get; set; } = "";
        public string GroupCode { get; set; } = "";
        public int? GroupParentId { get; set; }
        public string GroupParentName { get; set; } = "";
    }

    public class AssetGroupCollections: System.Collections.Generic.List<AssetGroup>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}