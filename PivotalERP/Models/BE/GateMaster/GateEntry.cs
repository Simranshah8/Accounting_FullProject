using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.GateMaster
{

	public class GateEntry : ResponeValues
	{

		public int? TranId { get; set; }
		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		public int? VoucherId { get; set; }
		public int? CostClassId { get; set; }
		public DateTime VoucherDate { get; set; }
		public string Narration { get; set; } = "";
		public string RefNo { get; set; } = "";
		public int? Api_Id { get; set; }
		public string Api_ResponseId { get; set; } = "";
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public string UniqueId { get; set; } = "";
		public string PassType { get; set; } = "";
		public string EntryType { get; set; } = "";
		public string TransactionType { get; set; } = "";
		public int? PartyLedgerId { get; set; }
		public int? VehicleId { get; set; }
		public string VehicleNo { get; set; } = "";
		public string DriverName { get; set; } = "";
		public string DriverMobile { get; set; } = "";
		public string DriverLicenseNo { get; set; } = "";
		public string Purpose { get; set; } = "";
		public string InvoiceNo { get; set; } = "";
		public DateTime? InvoiceDate { get; set; }
		public string EWayBillNo { get; set; } = "";
		public DateTime? ExpectedOutDate { get; set; }
		public double? InWeight { get; set; }
		public double? OutWeight { get; set; }
		public double? NetWeight { get; set; }
		public DateTime InDateTime { get; set; }
		public DateTime? OutDateTime { get; set; }
		public int? InGateId { get; set; }
		public int? OutGateId { get; set; }
		public int? InUserId { get; set; }
		public int? OutUserId { get; set; }
		public string ApprovalStatus { get; set; } = "";
		public bool IsReturnable { get; set; }
		public string SealNo { get; set; } = "";
		public string PhotoPath { get; set; } = "";
		public string VehicleType { get; set; } = "";
		public byte[] PhotoB { get; set; }

		public int? BranchId { get; set; }
		public GateEntry()
		{
			ItemDetailsGateEntryColl = new ItemDetailsGateEntryCollections();
			PersonDetailsGateEntryColl = new PersonDetailsGateEntryCollections();
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public ItemDetailsGateEntryCollections ItemDetailsGateEntryColl { get; set; }
		public PersonDetailsGateEntryCollections PersonDetailsGateEntryColl { get; set; }
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
	}
	public class GateEntryCollections : List<GateEntry>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}
	public class ItemDetailsGateEntry
	{

		public int? ItemAllocationId { get; set; }
		public int TranId { get; set; }
		public int? ProductId { get; set; }
		public string Description { get; set; } = "";
		public double ActualQty { get; set; }
		public double BilledQty { get; set; }
		public int? UnitId { get; set; }
		public string Batch { get; set; } = "";
		public DateTime? MFGDate { get; set; }
		public DateTime? EXPDate { get; set; }
		public string SerialNo { get; set; } = "";
		public string MaterialCondition { get; set; } = "";
		public bool IsReturnable { get; set; }
		public DateTime? ReturnDueDate { get; set; }
		public string Remarks { get; set; } = "";
	}

	public class ItemDetailsGateEntryCollections : System.Collections.Generic.List<ItemDetailsGateEntry>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class PersonDetailsGateEntry
	{

		public int? PersonEntryId { get; set; }
		public int TranId { get; set; }
		public int GatePassId { get; set; }
		public string PersonName { get; set; } = "";
		public string Gender { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string DepartmentName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string IDProofType { get; set; } = "";
		public string IDProofNo { get; set; } = "";
		public string AddressLine1 { get; set; } = "";
		public string Purpose { get; set; } = "";
		public DateTime InDateTime { get; set; }
		public DateTime? OutDateTime { get; set; }
		public bool IsActive { get; set; }
	}

	public class PersonDetailsGateEntryCollections : System.Collections.Generic.List<PersonDetailsGateEntry>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}
