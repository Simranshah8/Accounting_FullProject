using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class InsuranceType : ResponeValues
	{

		public int? InsuranceId { get; set; }
		public string Name { get; set; } = "";
		public string DisplayName { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
	}
	public class InsuranceTypeCollections : System.Collections.Generic.List<InsuranceType>
	{
		public InsuranceTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

