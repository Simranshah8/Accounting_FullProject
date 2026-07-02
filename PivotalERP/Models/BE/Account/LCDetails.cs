using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE
{
	public class LCDetails : ResponeValues
	{

		public int? TranId { get; set; }
		public int FromTo { get; set; }
		public int LedgerId { get; set; }
		public string BankName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string LCNo { get; set; } = "";
		public double Amount { get; set; }
		public double Tolerance { get; set; }
		public double TAmount { get; set; }
		public DateTime IssuesDate { get; set; }
		public DateTime ExpiredDate { get; set; }
		public DateTime LastDateOfShipment { get; set; }
		public int PaymentTermsInDays { get; set; }
		public string Remarks { get; set; } = "";
		public bool Status { get; set; }
		public int UserId { get; set; }
		public int? DeActiveBy { get; set; }
		public string Reason { get; set; } = "";
		public DateTime? DeActiveDateTime { get; set; }
		public double MarginHoldAmt { get; set; }
		public int? BranchId { get; set; }
		public double? TotalDr { get; set; }
		public double? TotalCr { get; set; }
		public LCDetails()
		{
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
    }
	public class LCDetailsCollections : System.Collections.Generic.List<LCDetails>
	{
		public LCDetailsCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	

}
