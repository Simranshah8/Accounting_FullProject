using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{
	public class LedgerCategory : ResponeValues
	{
		public int? CategoryId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
	}
	public class LedgerCategoryCollections : System.Collections.Generic.List<LedgerCategory>
	{
		public LedgerCategoryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

