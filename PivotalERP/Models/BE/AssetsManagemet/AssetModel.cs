using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AssetManagement
{
    public class AssetModel: ResponeValues
    {
        public int? AssetModelId { get; set; }
        public string ModelName { get; set; } = "";
        public string ModelCode { get; set; } = "";
        public int? ModelParentId { get; set; }
        public string ModelParentName { get; set; } = "";
    }
    public class AssetModelCollections: System.Collections.Generic.List<AssetModel>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}