using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessEntity.Finance
{
    public class LoanVehicleDetails:ResponeValues
    {
        public LoanVehicleDetails()
        {
            RegdNo = "";
            EngineNo = "";
            ChechisNo = "";
            Model = "";
            Color = "";
            KeyNo = "";
            CodeNo = "";
            BookingMemoNo = "";
            FinanceMode = "";
            InsuranceName = "";
            Zone = "";
            District = "";
            FatherName = "";
            MotherName = "";
            GFatherName = "";
            GMotherName = "";
            CitizenshipNo = "";
            Notes = "";
            RecoveryName = "";
        }
        public int LedgerId { get; set; }
        public string RegdNo { get; set; }
        public string EngineNo { get; set; }
        public string ChechisNo { get; set; }
        public string Model { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
        public string KeyNo { get; set; }
        public string CodeNo { get; set; }
        public int MFGYear { get; set; }
        public DateTime? BookingDate { get; set; }
        public string BookingMemoNo { get; set; }
        public string SalesBillNo { get; set; }
        public DateTime? SalesDate { get; set; }
        public double SalesPrice { get; set; }
        public double DiscountAmt { get; set; }
        public int AgentId { get; set; }
        public double CommissionAmt { get; set; }
        public string FinanceMode { get; set; }
        public string InsuranceName { get; set; }
        public DateTime? InsuraceValidUpto { get; set; }
        public DateTime? BlueBookValidUpto { get; set; }
        public DateTime? RoutePermitValidUpto { get; set; }
        public DateTime? CheckupValidUpto { get; set; }
        public string Zone { get; set; }
        public string District { get; set; }
        public string RecoveryName { get; set; }
        public string CitizenshipNo { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string GFatherName { get; set; }
        public string GMotherName { get; set; }
        public string Notes { get; set; }
        public bool Culty { get; set; }
        //Added by Suresh
        public string PartyName { get; set; }
        public string Province { get; set; }
        public int VoucherId { get; set; }
        public int CostClassId { get; set; }
        public int TranId { get; set; }
    }

    public class LoanVehicleDetailsCollections : System.Collections.Generic.List<LoanVehicleDetails>
    {
        public LoanVehicleDetailsCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
