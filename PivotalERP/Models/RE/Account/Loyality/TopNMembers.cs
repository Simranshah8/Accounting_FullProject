using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{
	public class TopNMembers : ResponeValues
	{		
		public string MemberNo { get; set; }
		public string CustomerName { get; set; } = "";	
		public double? TotalAmount { get; set; }
		public double? DCAMNT { get; set; }
		public double? NetAmnt { get; set; }
		public int? NoOfBill { get; set; }
		public int? LedgerId { get; set; }

	}
	public class TopNMembersCollections : System.Collections.Generic.List<TopNMembers>
	{
		public TopNMembersCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

