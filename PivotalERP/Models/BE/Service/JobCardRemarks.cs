using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace PivotalERP.BE
{

	public class JobCardRemarks : ResponeValues
	{
		public int? TranId { get; set; }
		public string Remarks { get; set; } = "";
		public string CreateBy { get; set; } = "";
	}
	public class JobCardRemarksCollections : System.Collections.Generic.List<JobCardRemarks>
	{
		public JobCardRemarksCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

