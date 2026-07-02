using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{
	public class MemPointSummary : ResponeValues
	{
		public int? LedgerId { get; set; }
		public string CustomerName { get; set; } = "";
		public string MembershipNo { get; set; } = "";
		public string ContactNo { get; set; } = "";	
		public double? OpeningPoint { get; set; }
		public double? TotalSales { get; set; }
		public double? PointsGained { get; set; }
		public double? SalesReturn { get; set; }
		public double? PointsDeducted { get; set; }
		public double? CouponSales { get; set; }
		public double? TotalPoint { get; set; }
		//public bool ActiveMember { get; set; }
		public String ActiveMember { get; set; }
		public DateTime RegistrationDate { get; set; }
		public string RegistrationMiti { get; set; }
		
	}
	public class MemPointSummaryCollections : System.Collections.Generic.List<MemPointSummary>
	{
		public MemPointSummaryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

