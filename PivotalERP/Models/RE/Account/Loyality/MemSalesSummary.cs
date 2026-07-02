using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{
	public class MemSalesSummary : ResponeValues
	{		
		public int? LedgerId { get; set; }
		public string CustomerName { get; set; } = "";
		public string MembershipNo { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public bool IsActiveMember { get; set; }
		public double? OpeningPoints { get; set; }
		public double? TotalSales { get; set; }
		public double? DiscountTotal { get; set; }
		public double? NetSales { get; set; }
		public double? NoOfInvoice { get; set; }
		public double? CreditPoints { get; set; }
		public double? DebitPoints { get; set; }
		public double? TotalPoints { get; set; }
		public DateTime RegistrationDate { get; set; }
		public string RegistrationMiti { get; set; }
		
	}
	public class MemSalesSummaryCollections : System.Collections.Generic.List<MemSalesSummary>
	{
		public MemSalesSummaryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

