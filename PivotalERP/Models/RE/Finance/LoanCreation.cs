using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.ReportEntity.Finance
{
    public class LoanCreation
    {
        public int TranId { get; set; }
        public int LedgerId { get; set; }
        public string PartyName { get; set; }
        public string Alias { get; set; }
        public string Code { get; set; }
        public string Address { get; set; }
        public string PanVatNo { get; set; }
        public double LoanAmount { get; set; }
        public DateTime StartDate { get; set; }
        public int NY { get; set; }
        public int NM { get; set; }
        public int ND { get; set; }
        public string Period { get; set; }
        public string LoanType { get; set; }
        public double InterestRate { get; set; }
        public string RefBy { get; set; }
        public string Notes { get; set; }
        public double TotalInterest { get; set; }
    }
    public class LoanCreationCollections : System.Collections.Generic.List<LoanCreation> { }
}
