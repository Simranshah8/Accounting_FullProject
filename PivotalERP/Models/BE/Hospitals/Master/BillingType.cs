using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class BillingType : ResponeValues
	{

		public int? BillingTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public double DiscountPer { get; set; }
		public int? LedgerId { get; set; }
		public int? id
		{
			get
			{
				return this.BillingTypeId;
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

	public class BillingTypeCollections : System.Collections.Generic.List<BillingType>
	{
		public BillingTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}


