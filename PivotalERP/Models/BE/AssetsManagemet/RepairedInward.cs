using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AssetManagement
{
	public class RepairedInward : ResponeValues
	{
		public int? TranId { get; set; }
		[EP("RepairedNo", "Repaired No", true)]
		public int? RepairedNo { get; set; }
		[EP("RefNo", "Ref No.")]
		public int? RefNo { get; set; }
		[EP("BranchId", "Branch")]
		public int? BranchId { get; set; }
		[EP("VoucherDate", "Voucher Date")]
		public DateTime? VoucherDate { get; set; }
		[EP("OutsideLocation", "Outside Location")]
		public string OutsideLocation { get; set; } = "";
		[EP("VendorId", "Party Name")]
		public int? VendorId { get; set; }
		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		[EP("VoucherId", "Voucher Type")]
		public int? VoucherId { get; set; }
		[EP("CostClassId", "Fiscal Year")]
		public int? CostClassId { get; set; }
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		[EP("Remark", "Remarks")]
		public string Remark { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string VoucherMitti { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string FiscalYear { get; set; } = "";
		public RepairedInward()
		{
			RepairedInwardDetailsColl = new RepairedInwardDetailsCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public RepairedInwardDetailsCollections RepairedInwardDetailsColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}
	public class RepairedInwardCollections : List<RepairedInward>
	{
		public RepairedInwardCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}
	public class RepairedInwardDetails
	{

		public int TranId { get; set; }
		[EP("ParticularId", "Particulars")]
		public int? ParticularId { get; set; }
		[EP("QTY", "QTY")]
		public int? QTY { get; set; }
		[EP("StatusId", "Status")]
		public int? StatusId { get; set; }
		[EP("RequiredInDate", "	Repaired Inward Date")]
		public DateTime? RequiredInDate { get; set; }
		[EP("Amount", "Cost")]
		public double? Amount { get; set; }
		public int? DamageDetId { get; set; }
		public string Particular { get; set; }
	}

	public class RepairedInwardDetailsCollections : System.Collections.Generic.List<RepairedInwardDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}


}

