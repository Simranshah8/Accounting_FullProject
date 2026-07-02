using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AssetManagement
{

	public class AssetReturn : ResponeValues
	{
		public int? TranId { get; set; }
		[EP("ReturnNo", "Return No", true)]
		public int? ReturnNo { get; set; }
		[EP("ReturnById", "Returned By", true)]
		public int? ReturnById { get; set; }
		[EP("DepartmentId", "Department")]
		public int? DepartmentId { get; set; }
		[EP("HODId", "Name", true)]
		public int? HODId { get; set; }
		[EP("VoucherDate", "Voucher Date")]
		public DateTime? VoucherDate { get; set; }
		public int? EmployeeId { get; set; }
		[EP("UserId", "Name", true)]
		public int? UserId { get; set; }
		[EP("BranchId", "Branch")]
		public int? BranchId { get; set; }
		[EP("BarCode", "Scan Bar Code")]
		public string BarCode { get; set; } = "";
		[EP("Remarks", "Remarks/Notes")]
		public string Remarks { get; set; } = "";

		public string ReturnByName { get; set; } = "";

		public string ReturnMitti { get; set; } = "";

		public string StaffName { get; set; } = "";

		public string BranchName { get; set; } = "";
		[EP("IssueNo", "Issue No", true)]
		public string IssueNo { get; set; }

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
		public string EmployeeCode { get; set; } = "";

		public AssetReturn()
		{

			AssetReturnDetailsColl = new AssetReturnDetailsCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public AssetReturnDetailsCollections AssetReturnDetailsColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }


	}

	public class AssetReturnCollections : List<AssetReturn>
	{
		public AssetReturnCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class AssetReturnDetails
	{

		public int TranId { get; set; }
		[EP("ParticularId", "Particulars", true)]
		public int? ParticularId { get; set; }
		[EP("CategoryId", "Category", true)]
		public int? CategoryId { get; set; }
		[EP("PurposeId", "Purpose", true)]
		public int? PurposeId { get; set; }
		[EP("QTY", "Qty", true)]
		public int? QTY { get; set; }
		[EP("StatusId", "Status")]
		public int? StatusId { get; set; }
		public int? IssueId { get; set; }
		public string Particular { get; set; }
		public string Category { get; set; }
		public string Purpose { get; set; }
	}

	public class AssetReturnDetailsCollections : System.Collections.Generic.List<AssetReturnDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



