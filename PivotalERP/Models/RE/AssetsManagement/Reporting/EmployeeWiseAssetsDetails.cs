namespace Dynamic.RE.AssetManagement.Report
{
    public class EmployeeWiseAssetsDetails : ResponeValues
    {
        public int? TranId { get; set; }
        public int? ParticularId { get; set; }
        public string IssueNo { get; set; }
        public int? QTY { get; set; }
        public string ReceivedNo { get; set; }
        public int? ReceivedQTY { get; set; }
        public string AssetsName { get; set; } = "";
        public string AssetAlias { get; set; } = "";
        public string AssetCode { get; set; } = "";
        public string AssetType { get; set; } = "";
        public string AssetGroup { get; set; } = "";
        public string AssetModels { get; set; } = "";
        public string IssueMitti { get; set; } = "";
        public string ReceivedMitti { get; set; } = "";
        public string UserName { get; set; } = "";
        public string SerialNum { get; set; } = "";
        public string ReceivedStatus { get; set; } = "";
    }

    public class EmployeeWiseAssetsDetCollections : System.Collections.Generic.List<EmployeeWiseAssetsDetails>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}