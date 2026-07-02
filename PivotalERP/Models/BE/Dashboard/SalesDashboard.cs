using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Dashboard
{
    public class SalesDashboard : ResponeValues
    {
        public double? TotalSales { get; set; }
        public int? TotalCustomer { get; set; }
        public int? TotalTransaction { get; set; }
        public int? TotalProduct { get; set; }
        public SalesDashboard()
        {
            WeeklySalesColl = new WeeklySalesCollection();
            TopProductColl = new TopProductCollection();
            AreaWiseSalesColl = new AreaWiseSalesCollection();
            MonthlyRevenueColl = new MonthlyRevenueCollection();
            InvoiceStatisticsColl = new InvoiceStatisticsCollection();
            SalesColl = new SalesCollection();
            AnnuallySalesColl = new AnnuallySalesCollection(); 
        }
        public WeeklySalesCollection WeeklySalesColl { get; set; }
        public TopProductCollection TopProductColl { get; set; }
        public AreaWiseSalesCollection AreaWiseSalesColl { get; set; }
        public MonthlyRevenueCollection MonthlyRevenueColl { get; set; }
        public InvoiceStatisticsCollection InvoiceStatisticsColl { get; set; }
        public SalesCollection SalesColl { get; set; }
        public AnnuallySalesCollection AnnuallySalesColl { get; set; }
    }

    public class WeeklySales
    {
        public string Day { get; set; } = "";
        public double? TotalAmount { get; set; }
        public double? TargetAmount { get; set; }
    }
    public class WeeklySalesCollection : List<WeeklySales>
    {
        public WeeklySalesCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }   
    public class TopProduct
    {
        public string ProductCode { get; set; } = "";
        public string ProductName { get; set; } = "";
        public string Brand { get; set; } = "";
        public double? SalesRate { get; set; }
    }
    public class TopProductCollection : List<TopProduct>
    {
        public TopProductCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class AreaWiseSales
    {
        public string AreaCode { get; set; } = "";
        public string AreaName { get; set; } = "";
        public double? Growth { get; set; }
    }
    public class AreaWiseSalesCollection : List<AreaWiseSales>
    {
        public AreaWiseSalesCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    
    public class MonthlyRevenue
    {
        public string Category { get; set; } = "";
        public string AreaName { get; set; } = "";
        public double? RevenueAmount { get; set; }
    }
    public class MonthlyRevenueCollection : List<MonthlyRevenue>
    {
        public MonthlyRevenueCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class InvoiceStatistics
    {
        public string InvoiceType { get; set; } = "";
        public int? InvoiceCount { get; set; }
    }
    public class InvoiceStatisticsCollection : List<InvoiceStatistics>
    {
        public InvoiceStatisticsCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class Sales
    {
        public string MonthName { get; set; } = "";
        public string PaymentType { get; set; } = "";
        public double? TotalAmount { get; set; }
    }
    public class SalesCollection : List<Sales>
    {
        public SalesCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class AnnuallySales
    {
        public string MonthNameAS { get; set; } = "";
        public double? TotalAnnualSales { get; set; }
    }
    public class AnnuallySalesCollection : List<AnnuallySales>
    {
        public AnnuallySalesCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }




}