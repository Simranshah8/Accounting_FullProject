using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{
	public class MembershipLedger : ResponeValues
	{
		public int? LedgerId { get; set; }
		public DateTime VoucherDate { get; set; }
		public string VoucherMiti { get; set; }
		public string Particulars { get; set; } = "";
		public string VoucherType { get; set; } = "";
		public string VoucherNo { get; set; } = "";
		public string RefNo { get; set; } = "";		
		public double? Debit { get; set; }
		public double? Credit { get; set; }
		public double? PointsGained { get; set; }
		public double? PointsDeducted { get; set; }
		public double? CumulativePoints { get; set; }
		public string Age { get; set; }
		public string ContactNo { get; set; }
		
	}
	public class MembershipLedgerCollections : System.Collections.Generic.List<MembershipLedger>
	{
		public MembershipLedgerCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

