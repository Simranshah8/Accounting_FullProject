using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.AssetManagement
{

	public class AssetCodeMethod : ResponeValues
	{

		public int? TranId { get; set; }
		public int? NumberingMethod { get; set; }
		public int? CompanyId { get; set; }
		public int? BranchId { get; set; }
		public int? AssetTypeId { get; set; }
		public int? AssetCategoryId { get; set; }
		public int? CostClassId { get; set; }
		public string Prefix { get; set; } = "";
		public string Suffix { get; set; } = "";
		public int? StartNo { get; set; }
		public int? PadWidth { get; set; }
	}

	public class AssetCodeMethodCollections : System.Collections.Generic.List<AssetCodeMethod>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; } = "";
	}

}

