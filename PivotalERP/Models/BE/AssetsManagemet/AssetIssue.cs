using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AssetManagement
{

	public class AssetIssue : ResponeValues
	{
		public int? TranId { get; set; }
		[EP("IssueNo", "Issue No", true)]
		public int? IssueNo { get; set; }
		[EP("AssetReqNo", "Request No")]
		public string AssetReqNo { get; set; }
		[EP("IssueById", "Issued By", true)]
		public int? IssueById { get; set; }
		[EP("DepartmentId", "DepartmentId")]
		public int? DepartmentId { get; set; }
		[EP("HODId", "Name", true)]
		public int? HODId { get; set; }
		public int? FYearId { get; set; }
		[EP("VoucherDate", "Voucher Date")]
		public DateTime? VoucherDate { get; set; }
		public int? EmployeeId { get; set; }
		[EP("BranchId", "Branch")]
		public int? BranchId { get; set; }
		[EP("UserId", "Name", true)]
		public int? UserId { get; set; }
		public int? AutoVoucherNo { get; set; }
		[EP("VoucherId", "Voucher Type")]
		public int? VoucherId { get; set; }
		[EP("CostClassId", "Fiscal Year")]
		public int? CostClassId { get; set; }
		[EP("BarCode", "Scan Bar Code")]
		public string BarCode { get; set; } = "";
		[EP("Remarks", "Remarks/Notes")]

		public string Remarks { get; set; } = "";
		public bool IsReturnable { get; set; }
		public string IssueByName { get; set; } = "";
		public string IssueMitti { get; set; } = "";
		public string StaffName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public string FiscalYear { get; set; } = "";

		public AssetIssue()
		{
			AssetsIssueDetailsColl = new AssetsIssueDetailsCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

		}
		public AssetsIssueDetailsCollections AssetsIssueDetailsColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}
	public class AssetIssueCollections : System.Collections.Generic.List<AssetIssue>
	{
		public AssetIssueCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class AssetsIssueDetails
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
		[EP("IssueRemakes", "Remakes", true)]
		public string IssueRemakes { get; set; }
		public DateTime? ReqFrom { get; set; }
		public DateTime? ReqTO { get; set; }
		public int? IssueDetId { get; set; }
		public int? ReqDetailsId { get; set; }
		public string Particular { get; set; }
		public string Category { get; set; }
		public string Purpose { get; set; }
	}

	public class AssetsIssueDetailsCollections : System.Collections.Generic.List<AssetsIssueDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}

