using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class DashboardDVGrp : ResponeValues
    {
        public int? TranId { get; set; }
        public string Greeting { get; set; }
        public string Username { get; set; }
        public double Target { get; set; }
        public double AchievementPer { get; set; }
        public int TotalDSE { get; set; }
        public int ActiveDSE { get; set; }
        public int InActiveDSE { get; set; }
        public int TotalSalesOfficer { get; set; }
        public int ActiveSalesOfficer { get; set; }
        public int InactiveSalesOfficer { get; set; }
        public int TotalASM { get; set; }
        public int ActiveASM { get; set; }
        public int InactiveASM { get; set; }
        public int TotalRSM { get; set; }
        public int ActiveRSM { get; set; }
        public int InactiveRSM { get; set; }
        public int TotalNSM { get; set; }
        public int ActiveNSM { get; set; }
        public int InactiveNSM { get; set; }
        public int TotalOutlets { get; set; }
        public int ActiveOutlets { get; set; }
        public int InactiveOutlets { get; set; }
        public int Products { get; set; }
        public int TotalSKUs { get; set; }
        public int TotalCall { get; set; }
        public int SuccessCall { get; set; }
        public int UnsuccessCall { get; set; }
        public int RemainingCall { get; set; }
        public int TotalOrder { get; set; }
        public double TotalOrderValue { get; set; }
        public int PendingOrder { get; set; }
        public double PendingOrderVal { get; set; }
        public int InvoicedOrder { get; set; }
        public double InvoicedOrderVal { get; set; }
        public int SalesReturnOrder { get; set; }
        public double SalesReturnOrderVal { get; set; }
        public int CancelledOrder { get; set; }
        public double CancelledOrderVal { get; set; }
    }
    public class DashboardDVGrpCollections : System.Collections.Generic.List<DashboardDVGrp>
    {
        public DashboardDVGrpCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}