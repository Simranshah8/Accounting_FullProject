using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.ReportEntity.Inventory
{
    public class ProductionOrder : ResponeValues
    {
        public int TranId { get; set; }
        public int VoucherId { get; set; }
        public int CostClassId { get; set; }
        public string VoucherNo { get; set; }
        public DateTime VoucherDate { get; set; }
        public string VoucherMiti { get; set; }
      
        public string ProductName { get; set; }
        public string ProductAlias { get; set; }
        public string ProductCode { get; set; }
        public double Quantity { get; set; }
        public double FQty { get; set; }
        public double PQty { get; set; }
        public string Unit { get; set; }
        public string GodownName { get; set; }
        public string GodownCode { get; set; }
        public string Narration { get; set; }
        public string RefNo { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? PostDateTime { get; set; }
        public string VoucherName { get; set; }
        public string BranchName { get; set; }
        public string BranchCode { get; set; }
        public string CostClass { get; set; }
        public string UserName { get; set; }
        public string Attributes { get; set; }
        public string UDFKeyVal { get; set; }
        public DateTime? DueDate { get; set; }
        public string RowType { get; set; }
        public string ProductName1 { get; set; }
        public string ProductCode1 { get; set; }
        public double BaseRatio { get; set; }
        public double PlanQty { get; set; }
        public double AvailableQty { get; set; }
        public double RequiredQty { get; set; }
        public double ActualQty { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        public double BalQty { get; set; }          

    }

    public class ProductionOrderCollections : System.Collections.Generic.List<ProductionOrder>
    {
        public ProductionOrderCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}