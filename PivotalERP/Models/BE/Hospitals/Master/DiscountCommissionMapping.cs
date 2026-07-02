using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{
	public class DiscountCommissionMapping : ResponeValues
	{
		public int? DiscountTypeId { get; set; }
		public string DiscountType { get; set; } = "";
		public int? CommissionTypeId { get; set; }
		public int? TranId { get; set; }
	
	}

	public class DiscountCommissionMappingCollections : System.Collections.Generic.List<DiscountCommissionMapping>
	{
		public DiscountCommissionMappingCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

