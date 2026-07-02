using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.ReportEntity.Finance
{
    public class LoanDetails
    {
        public int LedgerId { get; set; }
        public string Name  { get; set; }
        public string Address  { get; set; }
        public string MobileNo  { get; set; }
        public string TelNo  { get; set; }
        public string GroupName  { get; set; }
        public DateTime StartDate  { get; set; }
        public int NY  { get; set; }
        public int NM  { get; set; }
        public int ND  { get; set; }
        public double LoanAmount  { get; set; }
        public double InterestRate  { get; set; }
        public double DebitPrincipal  { get; set; }
        public double DuesPrincipal  { get; set; }
        public double DebitInterest  { get; set; }
        public double DuesInterest  { get; set; }
        public double Rebate  { get; set; }
        public double Penalty  { get; set; }
        public double LedgerClosing { get; set; }
        public double ClosingBalance { get; set; }
        public double CurrentClosingBalance { get; set; }
        public DateTime LastEMIDate { get; set; }
        public double SchedulePayment { get; set; }
        public double DuesEMINo { get; set; }
        public int DoneEMI { get; set; }
        public int DueEMI { get; set; }
        public DateTime? NextEMIDate { get; set; }
        public int NextEMIAfterDays { get; set; }
    }
    public class LoanDetailsCollections : System.Collections.Generic.List<LoanDetails> { }

    public class LoanMonthly : LoanDetails
    {
        public LoanMonthly()
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
    }
    public class LoanMonthlyCollections : System.Collections.Generic.List<LoanMonthly> { }
}
