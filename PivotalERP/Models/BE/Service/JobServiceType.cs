using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{

	public class JobServiceType : ResponeValues
	{

		public int? ServiceTypeId { get; set; }
		public string Name { get; set; } = "";
		public int? OrderNo { get; set; }
		public int JobCardTypeId { get; set; }
		public string JobCardTypeName { get; set; } = "";
	}
	public class JobServiceTypeCollections : System.Collections.Generic.List<JobServiceType>
	{
		public JobServiceTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

