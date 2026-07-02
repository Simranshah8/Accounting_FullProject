using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{

	public class ResourceGroup : ResponeValues
	{

		public int? ResourceGroupId { get; set; }
		public string Name { get; set; } = "";
		public int ResourceType { get; set; }
		public string UOMText { get; set; } = "";
		public bool Status { get; set; }
		public string ResourceTypeName { get; set; } = "";
		public ResourceGroup()
		{

			ResourceGroupCostingColl = new List<ResourceGroupCosting>();
		}
		public List<ResourceGroupCosting> ResourceGroupCostingColl { get; set; }
	}
	public class ResourceGroupCosting
	{

		public int ResourceGroupId { get; set; }
		public int ledgerId { get; set; }
		public string Name { get; set; } = "";
		public double? CostAmt { get; set; }
	}

	public class ResourceGroupCollections : System.Collections.Generic.List<ResourceGroup>
	{
		public ResourceGroupCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}
