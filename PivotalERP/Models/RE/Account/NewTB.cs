using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.Reporting.Account
{

	public class NewTB : ResponeValues
	{
		public string LedgerName { get; set; } = "";
		public string Code { get; set; } = "";
		public double? Opening { get; set; } 
		public double? DrAmount { get; set; } 
		public double? CrAmount { get; set; } 
		public double? Closing { get; set; } 
		public int? LedgerId { get; set; }
		public string Brand { get; set; } = "";

		public List<string> ReportTypeName;
		public double[] ReportType { get; set; }
	}
	public class NewTBCollections : System.Collections.Generic.List<NewTB>
	{
		public NewTBCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

