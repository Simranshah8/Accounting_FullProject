using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class DiscountType : ResponeValues
	{

		public int? DiscountTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public double? Per { get; set; }
		public int? LedgerId { get; set; }

		public int? id
		{
			get
			{
				return this.DiscountTypeId;
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

	public class DiscountTypeCollections : System.Collections.Generic.List<DiscountType>
	{
		public DiscountTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

