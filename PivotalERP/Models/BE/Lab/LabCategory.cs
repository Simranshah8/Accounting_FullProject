using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class LabCategory : ResponeValues
	{

		public int? TestGroupId { get; set; }
		public string Code { get; set; } = "";
		public string Name { get; set; } = "";
		public int? SortOrder { get; set; }
		public bool isActive { get; set; }
		public int? id
		{
			get
			{
				return this.TestGroupId;
			}
		}
		public string text
		{
			get
			{
				return this.Name;
			}
		}
	}
	public class LabCategoryCollections : System.Collections.Generic.List<LabCategory>
	{
		public LabCategoryCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

