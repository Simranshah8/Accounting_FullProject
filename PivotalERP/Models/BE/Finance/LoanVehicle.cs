//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace Dynamic.BusinessEntity.Finance
//{
//    public class LoanVehicle : ResponeValues
//    {
//        public int TranId { get; set; }
//        public int LedgerId { get; set; }
//        public string PartyName { get; set; }
//        public string EngineNo { get; set; }
//        public string ChechisNo { get; set; }
//        public string Model { get; set; }
//        public double SalesPrice { get; set; }
//        public string RegdNo { get; set; }
//        public int MfgYear { get; set; }

//        public string FinanceMode { get; set; }
//        public string InsuranceName { get; set; }
//        public DateTime? InsuraceValidUpto { get; set; }
//        public DateTime? BlueBookValidUpto { get; set; }
//        public DateTime? RoutePermitValidUpto { get; set; }
//        public DateTime? CheckupValidUpto { get; set; }
//        public double CommissionAmt { get; set; }
//        public string Zone { get; set; }
//        public string RecoveryName { get; set; }
//        public string CitizenshipNo { get; set; }
//        public string FatherName { get; set; }
//        public string MotherName { get; set; }
//        public string GFatherName { get; set; }
//        public string GMotherName { get; set; }
//        public string District { get; set; }
//        public string Notes { get; set; }
//        public int AgentId { get; set; }
//        public string Color { get; set; }
//        public double DiscountAmt { get; set; }
//        public string Type { get; set; }
//        public string CodeNo { get; set; }
//        public int MFGYear { get; set; }
//        public DateTime? BookingDate { get; set; }
//        public string BookingMemoNo { get; set; }
//        public string SalesBillNo { get; set; }
//        public DateTime? SalesDate { get; set; }
//        public string KeyNo { get; set; }
//        public bool Culty { get; set; }
//    }
//    public class LoanVehicleCollections : System.Collections.Generic.List<LoanVehicle>
//    {
//        public LoanVehicleCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}