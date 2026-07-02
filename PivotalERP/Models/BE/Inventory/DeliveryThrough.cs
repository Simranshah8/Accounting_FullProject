using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{

	public class DeliveryThrough : ResponeValues
	{

		public int? DeliveryThroughId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNum { get; set; }
	}
	public class DeliveryThroughCollections : System.Collections.Generic.List<DeliveryThrough>
	{
		public DeliveryThroughCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

