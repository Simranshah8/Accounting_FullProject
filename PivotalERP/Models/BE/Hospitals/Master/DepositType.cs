using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class DepositeType : ResponeValues
	{

		public int? DepositeTypeId { get; set; }
		public int? Types { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public string TypesName { get; set; } = "";
		public int? LedgerId { get; set; }
		public bool IsReturn { get; set; }

		public int? id
		{
			get
			{
				return this.DepositeTypeId;
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

	public class DepositeTypeCollections : System.Collections.Generic.List<DepositeType>
	{
		public DepositeTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

