using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{

	public class Resource : ResponeValues
	{

		public int? ResourceId { get; set; }
		public int? ResourceNo { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Code { get; set; } = "";
		public string Description { get; set; } = "";
		public int ResourceType { get; set; }
		public int ResourceGroupId { get; set; }
		public string UOMText { get; set; } = "";
		public int? ResUnitsPerTimePeriod { get; set; }
		public int? R_HH { get; set; }
		public int? R_MM { get; set; }
		public int? R_SS { get; set; }
		public int? ResourceAllocationOn { get; set; }
		public bool Status { get; set; }
		public string ResourceTypeName { get; set; } = "";
		public Resource()
		{
			ResourceCostingColl = new ResourceCostingCollections();
		}
		public ResourceCostingCollections ResourceCostingColl { get; set; }
	}
	public class ResourceCosting
	{

		public int ResourceId { get; set; }
		public int ledgerId { get; set; }
		public string Name { get; set; } = "";
		public double? CostAmt { get; set; }
	}

	public class ResourceCostingCollections : System.Collections.Generic.List<ResourceCosting>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class ResourceCollections : System.Collections.Generic.List<Resource>
	{
		public ResourceCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}
