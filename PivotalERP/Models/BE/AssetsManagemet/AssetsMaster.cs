using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.AssetManagement
{
	public class Assetsmaster : ResponeValues
	{
		public int? TranId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Code { get; set; } = "";
		public string Photo { get; set; } = "";
		public int? AssetGroupId { get; set; }
		public int? AssetTypeId { get; set; }
		public int? ModelId { get; set; }
		public int? RackId { get; set; }
		public string SerialNum { get; set; } = "";
		public int? RAMId { get; set; }
		public int? ROMId { get; set; }
		public int? BranchId { get; set; }
		public double? PurchaseRate { get; set; }
		public double? DepreciationRate { get; set; }
		public int? StatusId { get; set; }
		public byte[] PhotoB { get; set; }
		public string BranchName { get; set; } = "";
		public string RAMName { get; set; } = "";
		public string RoMName { get; set; } = "";
		public string StatusName { get; set; } = "";
		public string RackName { get; set; } = "";
		public string AssetGroupName { get; set; } = "";
		public string AssetTypeName { get; set; } = "";
		public string ModelName { get; set; } = "";
		public string Notes { get; set; } = "";
		public int? ProductId { get; set; }
		public int? UnitId { get; set; }


	}
	public class AssetsmasterCollections : System.Collections.Generic.List<Assetsmaster>
	{
		public AssetsmasterCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

