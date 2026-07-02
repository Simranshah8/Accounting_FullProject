using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{
	public class LedgerAuthorized : ResponeValues
	{
		public int? TranId { get; set; }
		public int LedgerId { get; set; }
		public int? BranchId { get; set; }
		public int? UserId1 { get; set; }
		public int? UserId2 { get; set; }
		public int? UserId3 { get; set; }
		public double LimitAmt { get; set; }
		public double UsedAmt { get; set; }
		public double BalanceAmt { get; set; }
		public double LimitAmt_Monthly { get; set; }
		public double UsedAmt_Monthly { get; set; }
		public double BalanceAmt_Monthly { get; set; }
	}
	public class LedgerAuthorizedyCollections : System.Collections.Generic.List<LedgerAuthorized>
	{
		public LedgerAuthorizedyCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

