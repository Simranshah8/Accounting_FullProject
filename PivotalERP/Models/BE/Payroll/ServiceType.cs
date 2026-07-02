using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{
	public class ServiceType : ResponeValues
	{

		public int? ServiceTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
		public int? LedgerId { get; set; }
	}
	public class ServiceTypeCollections : System.Collections.Generic.List<ServiceType>
	{
		public ServiceTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

