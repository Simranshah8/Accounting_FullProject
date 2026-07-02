using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.AssetManagement
{

	public class AssetOpening : ResponeValues
	{

		public int? TranId { get; set; }
		public int? OpeningNo { get; set; }
		public int? BranchId { get; set; }
		public int? FYearId { get; set; }
		public DateTime? VoucherDate { get; set; }
		public string Remarks { get; set; } = "";
		public string OpeningMiti { get; set; } = "";
		public string BranchName { get; set; } = "";

		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		public int? VoucherId { get; set; }
		public int? CostClassId { get; set; }
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public double? QTY { get; set; }
		public double? Rate { get; set; }
		public double? Amt { get; set; }


		public AssetOpening()
		{
			AssetOpeningDetailsColl = new AssetOpeningDetailsCollections();
		}
		public AssetOpeningDetailsCollections AssetOpeningDetailsColl { get; set; }
	}

	public class AssetOpeningCollections : System.Collections.Generic.List<AssetOpening>
	{
		public AssetOpeningCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


	public class AssetOpeningDetails
	{

		public int? TranId { get; set; }
		public int? ParticularId { get; set; }
		public double? Qty { get; set; }
		public double? Rate { get; set; }
		public double? Amt { get; set; }
	}

	public class AssetOpeningDetailsCollections : System.Collections.Generic.List<AssetOpeningDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



