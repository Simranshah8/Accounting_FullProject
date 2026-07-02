using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class TravelFunding : ResponeValues
	{

		public int? TravelFundingId { get; set; }
		public string Name { get; set; } = "";
		public string Description { get; set; } = "";
		public int? OrderNo { get; set; }
	}
	public class TravelFundingCollections : System.Collections.Generic.List<TravelFunding>
	{
		public TravelFundingCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

