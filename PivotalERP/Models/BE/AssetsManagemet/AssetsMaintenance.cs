using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AssetsManagemet
{

    public class AssetsMaintenance : ResponeValues
    {
        public int? TranId { get; set; }
        public int? BranchId { get; set; }
        public int? VoucherId { get; set; }
        public int? CostClassId { get; set; }
        public DateTime? VoucherDate { get; set; }
        public bool IsEmployeeNeeded { get; set; }
        public int? UserId { get; set; }
        public int? AssetsNameId { get; set; }
        public bool IsChildNeeded { get; set; }
        public string MaintenanceReason { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string Branch { get; set; } = "";
        public string CostClass { get; set; } = "";
        public string AssetsName { get; set; } = "";
        public string VoucherDateBS { get; set; } = "";
        public string Department { get; set; } = "";
        public string BranchName { get; set; } = "";
        public AssetsMaintenance()
        {
            AssetMaintenanceDetailsColl = new AssetMaintenanceDetailsCollections();
        }
        public AssetMaintenanceDetailsCollections AssetMaintenanceDetailsColl { get; set; }
    }

    public class AssetsMaintenanceCollections : System.Collections.Generic.List<AssetsMaintenance>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }
    }
    public class AssetMaintenanceDetails
    {
        public int? TranId { get; set; }
        public int? ParticularsId { get; set; }
        public int? Qty { get; set; }
        public string Remarks { get; set; } = "";
    }

    public class AssetMaintenanceDetailsCollections : System.Collections.Generic.List<AssetMaintenanceDetails>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }
    }

    public class AssetsByEmp : ResponeValue
    {
        public int? ParticularId { get; set; }
        public string Particular { get; set; } = "";
    }
    public class AssetsByEmpCollections : List<AssetsByEmp>
    {
        public AssetsByEmpCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}