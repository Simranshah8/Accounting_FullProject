using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{

	public class NewStockReporting : ResponeValues
	{
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public string PartNo { get; set; } = "";
		public string Description { get; set; } = "";
		public string ProductGroup { get; set; }
		public double? Opening_Qty { get; set; }
		public double? Opening_Rate { get; set; }
		public double? Opening_Amount { get; set; }
		public double? PurchaseImport_Qty { get; set; }
		public double? PurchaseImport_Amount { get; set; }
		public double? PurchaseLocal_Qty { get; set; }
		public double? PurchaseLocal_Amount { get; set; }
		public double? StockJournalIn_Qty { get; set; }
		public double? StockJournalIn_Amount { get; set; }
		public double? StockJournalOut_Qty { get; set; }
		public double? StockJournalOut_Amount { get; set; }
		public double? CannibalizedIn_Qty { get; set; }
		public double? CannibalizedIn_Amount { get; set; }
		public double? CannibalizedOut_Qty { get; set; }
		public double? CannibalizedOut_Amount { get; set; }
		public double? Sales_Qty { get; set; }
		public double? Sales_Amount { get; set; }
		public double? SalesReturn_Qty { get; set; }
		public double? SalesReturn_Amount { get; set; }
		public double? Closing_Qty { get; set; }
		public double? Closing_Rate { get; set; }
		public double? Closing_Amount { get; set; }
	}
	public class NewStockReportingCollections : System.Collections.Generic.List<NewStockReporting>
	{
		public NewStockReportingCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

