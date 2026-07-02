using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Report
{

	public class BudgetReporting : ResponeValues
	{

		public int? LedgerId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public string LedgerGroup { get; set; } = "";
		public double? BudgetAmt { get; set; }
		public double? ExpensesAmt { get; set; }
		public double? RemainingAmt { get; set; }
		public double? Month1 { get; set; }
		public double? Month2 { get; set; }
		public double? Month3 { get; set; }
		public double? Month4 { get; set; }
		public double? Month5 { get; set; }
		public double? Month6 { get; set; }
		public double? Month7 { get; set; }
		public double? Month8 { get; set; }
		public double? Month9 { get; set; }
		public double? Month10 { get; set; }
		public double? Month11 { get; set; }
		public double? Month12 { get; set; }
		
	}

	public class BudgetReportingCollections : System.Collections.Generic.List<BudgetReporting>
	{
		public BudgetReportingCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

