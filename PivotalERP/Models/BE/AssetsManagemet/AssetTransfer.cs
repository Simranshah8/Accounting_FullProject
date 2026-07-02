using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AssetManagement
{

	public class AssetTransfer : ResponeValues
	{
		public int? TranId { get; set; }
		[EP("TransferNo", "Transfer No.", true)]
		public int? TransferNo { get; set; }
		public int? FYearId { get; set; }
		[EP("VoucherDate", "Date")]
		public DateTime? VoucherDate { get; set; }
		[EP("FromBranchId", "From Branch", true)]
		public int? FromBranchId { get; set; }
		[EP("ToBranchId", "To Branch", true)]
		public int? ToBranchId { get; set; }
		[EP("Remarks", "Remarks/Notes")]

		public string Remarks { get; set; } = "";
		public string TransferMitti { get; set; } = "";
		public string ToBranchName { get; set; } = "";
		public string FromBranchName { get; set; } = "";

		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		[EP("VoucherId", "Voucher Type")]
		public int? VoucherId { get; set; }
		[EP("CostClassId", "Fiscal Year")]

		public int? CostClassId { get; set; }
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public string FiscalYear { get; set; } = "";


		public AssetTransfer()
		{
			AssetTransferDetailsColl = new AssetTransferDetailsCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

		}
		public AssetTransferDetailsCollections AssetTransferDetailsColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}


	public class AssetTransferCollections : List<AssetTransfer>
	{
		public AssetTransferCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class AssetTransferDetails
	{

		public int? TranId { get; set; }
		[EP("ParticularId", "Particular", true)]
		public int? ParticularId { get; set; }
		[EP("Qty", "Qty", true)]
		public double? Qty { get; set; }
		[EP("Rate", "Rate")]
		public double? Rate { get; set; }
		[EP("Amount", "Amount")]
		public double? Amount { get; set; }
	}

	public class AssetTransferDetailsCollections : System.Collections.Generic.List<AssetTransferDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}


	public class ParticularByBranch : ResponeValue
	{
		public int? InwardId { get; set; }
		public int? BranchId { get; set; }
		public int? VendorId { get; set; }
		public int? ParticularId { get; set; }
		public double? PRate { get; set; }
		public string Code { get; set; } = "";
		public string SerialNum { get; set; } = "";
		public string ParticularName { get; set; } = "";

	}
	public class ParticularByBranchCollections : List<ParticularByBranch>
	{
		public ParticularByBranchCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



