using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace PivotalERP.BE
{

	public class JobType : ResponeValues
	{

		public int? JobTypeId { get; set; }
		public string JobTypeName { get; set; } = "";
		public int OrderNo { get; set; }
		public string Description { get; set; } = "";
		public bool IsWarranty { get; set; }
		public bool IsFreeService { get; set; }
		public int LedgerId { get; set; }
	}
	public class JobTypeCollections : System.Collections.Generic.List<JobType>
	{
		public JobTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

