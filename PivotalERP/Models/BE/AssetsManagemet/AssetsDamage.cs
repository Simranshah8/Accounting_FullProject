using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AssetManagement
{

	public class Assetdamage : ResponeValues
	{
		public int? TranId { get; set; }
		[EP("ReturnNo", "Damage No", true)]
		public int? ReturnNo { get; set; }
		[EP("VoucherDate", "Voucher Date")]
		public DateTime? VoucherDate { get; set; }
		[EP("BranchId", "Branch")]
		public int? BranchId { get; set; }
		[EP("VendorId", "Party Name")]
		public int? VendorId { get; set; }
		[EP("IsOutsideRequired", "IsOutsideRequired")]
		public bool? IsOutsideRequired { get; set; }
		public string BranchName { get; set; } = "";
		[EP("Remark", "Remarks/Notes")]
		public string Remark { get; set; } = "";
		[EP("OutLocation", "Outside Location")]

		public string OutLocation { get; set; } = "";
		public string DamageMitti { get; set; } = "";
		public string PartyName { get; set; } = "";
		public string PartyCode { get; set; } = "";
		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		[EP("VoucherId", "Voucher Type")]
		public int? VoucherId { get; set; }
		[EP("CostClassId", "Fiscal Year")]
		public int? CostClassId { get; set; }
		public string Attributes { get; set; } = "";
		public string FiscalYear { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public Assetdamage()
		{
			AssetdamageDetailsColl = new AssetdamageDetailsCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public AssetdamageDetailsCollections AssetdamageDetailsColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}

	public class AssetdamageCollections : List<Assetdamage>
	{
		public AssetdamageCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class AssetdamageDetails
	{

		public int? TranId { get; set; }
		[EP("ParticularId", "Particulars", true)]
		public int? ParticularId { get; set; }
		[EP("Qty", "Qty", true)]
		public double? Qty { get; set; }
		[EP("StatusId", "Status")]
		public int? StatusId { get; set; }
	}

	public class AssetdamageDetailsCollections : System.Collections.Generic.List<AssetdamageDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



