using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{
	public class Disabilities : ResponeValues
	{

		public int? DisabilitiesId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
	}
	public class DisabilitiesCollections : System.Collections.Generic.List<Disabilities>
	{
		public DisabilitiesCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

