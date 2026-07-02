using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace PivotalERP.BE.Inventory
{

	public class MStock : ResponeValues
	{

		public int? CTranId { get; set; }
		public string ProductName { get; set; } = "";
		public string Batch { get; set; } = "";		
		public DateTime? EXPDate { get; set; }
	}
	public class MStockCollections : System.Collections.Generic.List<MStock>
	{
		public MStockCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

