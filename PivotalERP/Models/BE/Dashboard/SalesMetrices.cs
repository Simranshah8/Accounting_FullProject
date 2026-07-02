using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Dashboard
{
    public class ParametersforDashBoard : ResponeValues
    {
        public string ParameterType { get; set; } = "";
        public int? ID { get; set; }
        public string Name { get; set; } = "";
    }
    public class ParametersforDashBoardCollection : List<ParametersforDashBoard>
    {
        public ParametersforDashBoardCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class SalesMetrices : ResponeValues
    {
        //Added By Suresh
        public double? ThisYearTotalAmount { get; set; }
        public double? PreviousYearTotalAmount { get; set; }
        public double? OverallYoYGrowthPercentage { get; set; }
        //Ends
        public SalesMetrices()
        {
            DistributorColl = new DistributorCollections();
            ProductContributionColl = new ProductContributionCollections();
            MonthlySalesColl = new MonthlySalesCollections();
        }
        public DistributorCollections DistributorColl { get; set; }
        public ProductContributionCollections ProductContributionColl { get; set; }
        public MonthlySalesCollections MonthlySalesColl { get; set; }
    }
    public class Distributor : ResponeValues
    {
        public string DistributorName { get; set; } = "";
        public double? TotalSalesAmount { get; set; }
        public double? GrowthPercentage { get; set; }
    }
    public class DistributorCollections : List<Distributor>
    {
        public DistributorCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class ProductContribution : ResponeValues
    {
        public int? TranId { get; set; }
        public DateTime? VoucherDate { get; set; }
        public int? ProductID { get; set; }
        public string ProductName { get; set; } = "";
        public double? Quantity { get; set; }
        public int? ProductGroupId { get; set; }
        public int? ProductTypeId { get; set; }
        public double? QuantitySold { get; set; }
        public double? TotalAmount { get; set; }
        public double? GrowthPercentage { get; set; }
        public int? DistributorID { get; set; }
        public string DistributorName { get; set; } = "";
        public string FiscalYear { get; set; } = "";
        public string MonthName { get; set; } = "";
        public int? ledgergroupid { get; set; }
    }
    public class ProductContributionCollections : List<ProductContribution>
    {
        public ProductContributionCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class MonthlySales : ResponeValues
    {
        public string MonthName_Sales { get; set; } = "";
        public double[] FiscalYear { get; set; } 
    }
    public class MonthlySalesCollections : List<MonthlySales>
    {
        public MonthlySalesCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }






}