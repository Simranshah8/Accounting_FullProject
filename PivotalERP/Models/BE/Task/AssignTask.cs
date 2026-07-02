using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Task
{
	public class AssignTask : ResponeValues
	{
		public int? TranId { get; set; }
		public int AssignTo { get; set; }
		public int TaskTypeId { get; set; }
		public int? CustomerId { get; set; }
		public int? Priority { get; set; }
		public string Heading { get; set; } = "";
		public string Description { get; set; } = "";
		public string attachFile { get; set; } = "";
		public byte[] Photo { get; set; }

		public int? ProductNameId { get; set; }
		public int? EstMinutes {	get;	set;}
		public DateTime? Deadline { get; set; }
		
	}

	public class AssignTaskCollections : System.Collections.Generic.List<AssignTask>
	{
		public AssignTaskCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class DayTask
    {
		public string Heading { get; set; }
		public string Description { get; set; }
		public string Remarks { get; set; }
		public DateTime LogDateTime { get; set; }
	}
	public class DayTaskCollections : System.Collections.Generic.List<DayTask>
    {
		public string ResponseMSG { get; set; } = "";
		public bool IsSuccess { get; set; }
	}
}