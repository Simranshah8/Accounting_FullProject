

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.GateMaster
{

	public class ReOrderStockLevel : ResponeValues
	{
		public int? GodownId { get; set; }
		public int ProductId { get; set; }
		public int? LeadTimeDays { get; set; }
		public double? MinStock { get; set; }
		public double? MaxStock { get; set; }
		public bool IsActive { get; set; }
	}

	public class ReOrderStockLevelCollections : System.Collections.Generic.List<ReOrderStockLevel>
	{
		public ReOrderStockLevelCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

