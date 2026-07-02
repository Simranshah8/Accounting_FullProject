using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Task
{

	public class TaskType : ResponeValues
	{

		public int? TaskTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
		public string Description { get; set; } = "";
		public bool IsActive { get; set; }
	}
	public class TaskTypeCollections : System.Collections.Generic.List<TaskType>
	{
		public TaskTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

