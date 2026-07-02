using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.AssetManagement
{

	public class AssetCategory : ResponeValues
	{

		public int? AssetCategoryId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
		public int? CategoryParentId { get; set; }
		public string CategoryParentName { get; set; } = "";

	}

	public class AssetCategoryCollections : System.Collections.Generic.List<AssetCategory>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; } = "";
	}

}
