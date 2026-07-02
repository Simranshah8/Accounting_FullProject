using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{
	public class MemSalesDetail : ResponeValues
	{
		public int? LedgerId { get; set; }
		public int? ProductId { get; set; }
		public string CustomerName { get; set; } = "";
		public string MembershipNo { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public DateTime VchDate { get; set; }
		
		public string InvoiceNo { get; set; }
		public string  BillingType { get; set; }
		public string ProductGroup { get; set; }
		public string ProductCode { get; set; }
		public string ProductName { get; set; }
		public double? Qty { get; set; }
		public double? Rate { get; set; }
		public double? Amount { get; set; }
		public double? ProductDiscount { get; set; }
		public string ProductScheme { get; set; }
		public double? Discount { get; set; }
		public double? VAT { get; set; }
		public double? ProductTotal { get; set; }
		public double? PointValue { get; set; }
		public double? InvoiceTotal { get; set; }
		public double? TotalCreditedPoint { get; set; }
		public string VchMiti { get; set; }

	}
	public class MemSalesDetailCollections : System.Collections.Generic.List<MemSalesDetail>
	{
		public MemSalesDetailCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

