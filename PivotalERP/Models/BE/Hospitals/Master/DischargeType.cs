using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class DischargeType : ResponeValues
	{


		public int? DischargeTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public double? Discount { get; set; }
		public int? Ledger { get; set; }
		public int? id
		{
			get
			{
				return this.DischargeTypeId;
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

	public class DischargeTypeCollections : System.Collections.Generic.List<DischargeType>
	{
		public DischargeTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

