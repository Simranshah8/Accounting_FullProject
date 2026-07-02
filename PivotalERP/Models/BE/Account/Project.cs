using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BusinessEntity.Account
{

	public class Project : ResponeValues 
	{ 

		public int? ProjectId { get; set; } 
		public string Name { get; set; } ="" ; 
		public string Code { get; set; } ="" ; 
		public string Location { get; set; } ="" ; 
		public string ProjectHead { get; set; } ="" ; 
		public string ContactNo { get; set; } ="" ; 
		public int? OrderNo { get; set; } 
		public DateTime? ValidFrom { get; set; } 
		public DateTime? ValidTo { get; set; } 
		public bool IsActive { get; set; } 
		}
	public class ProjectCollections : System.Collections.Generic.List<Project>
	{
		public ProjectCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

