using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{
	public class TransactionComplain : ResponeValues
	{
		public int? TranId { get; set; }
		public int VoucherId { get; set; }
		public int CostClassId { get; set; }
		public int BranchId { get; set; }
		public int AutoVoucherNo { get; set; }
		public string ManualVoucherNO { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public int TicketForId { get; set; }
		public DateTime? VoucherDate { get; set; }
		public int LedgerId { get; set; }
		public string PhoneNo { get; set; } = "";
		public string CustomerAddress { get; set; } = "";
		public int SourceId { get; set; }
		public int NatureId { get; set; }
		public int VehicleId { get; set; }
		public string STPLComplaintNo { get; set; } = "";
		public DateTime? STPLEntryTime { get; set; }
		public string STPLContactCode { get; set; } = "";
		public DateTime? STPLEntryDate { get; set; }
		public string STPLContactName { get; set; } = "";
		public bool SyncedwithSupplierErp { get; set; }
		public string STPlEntryDatebyUser { get; set; }
		public DateTime? SatisfcationVerificationDate { get; set; }
		public string ComplaintStatus { get; set; } = "";
		public string TypeofSatisfactionVerify { get; set; } = "";
		public DateTime? ComplaintClosedDate { get; set; }
		public string ValidationRemarks { get; set; } = "";
		public DateTime? ComplaintClosedTime { get; set; }
		public DateTime? FirstResponseDateAndTime { get; set; }
		public string ComplaintClosedBy { get; set; } = "";
		public DateTime? AttendedDateAndTime { get; set; }
		public bool IsCorrectiveActionRequired { get; set; }
		public DateTime? VehicleOnRoadDateTime { get; set; }
		public DateTime? TargetDateForComplaintClosure { get; set; }
		public string ValidationStatus { get; set; } = "";
		public bool Reopened { get; set; }
		public string RepairStatus { get; set; } = "";
		public DateTime? ReopenedDateTime { get; set; }

		public string ComplainDetail { get; set; } = "";
		public string CustomerCode { get; set; } = "";
		public string CustomerName { get; set; } = "";
		public string ModelNo { get; set; } = "";
		public string ModelVersionNo { get; set; } = "";
		public string VinNo { get; set; } = "";
		public string RegdNo { get; set; } = "";
		public TransactionComplain()
		{
			ComplainLinesColl = new ComplainLinesCollections();
		}
		public ComplainLinesCollections ComplainLinesColl { get; set; }
	}
	public class ComplainLines
	{

		public int? AllocationId { get; set; }
		public int TranId { get; set; }
		public int SNo { get; set; }
		public int NatureId { get; set; }
		public string Department { get; set; } = "";
		public string LubeSegment { get; set; } = "";
		public string SubType { get; set; } = "";
		public string Type { get; set; } = "";
		public string ComplaintDetails { get; set; } = "";
		public string Status { get; set; }
		public string ForwardedBranch { get; set; } = "";
		public string ClosedBy { get; set; }
		public DateTime? STPLForwardedDate { get; set; }
		public DateTime? STPLForwaededTime { get; set; }
		public string ResponsibleEmployee { get; set; } = "";
		public string Reference { get; set; } = "";
		public string VerifiedBy { get; set; } = "";
		public string RootCause { get; set; } = "";
		public string ResolutionDetail { get; set; } = "";
		public string Remarks { get; set; } = "";
		public string ResolvedBY { get; set; } = "";
		public DateTime? ResolvedDate { get; set; }
		public DateTime? ResolvedTime { get; set; }
		public string PartNo { get; set; } = "";

		public ActionTakenCollections ActionTakenColl { get; set; } = new ActionTakenCollections();
	}

	public class ComplainLinesCollections : System.Collections.Generic.List<ComplainLines>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class TransactionComplainCollections : System.Collections.Generic.List<TransactionComplain>
	{
		public TransactionComplainCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class ActionTakenCollections : System.Collections.Generic.List<ActionTaken>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class ActionTaken
	{

		public int? AllocationId { get; set; }
		public int? SNo { get; set; }		
		public string ComplaintDetails { get; set; } = "";
		public string Type { get; set; } = "";
		public DateTime? ActionDate { get; set; }
		public DateTime? ActionTime { get; set; }
		public string ImmediateAndFurtherAction { get; set; }
		public DateTime? CommitmentDate { get; set; }
		public DateTime? CommitmentTime { get; set; }
		public string ComplaintSubType { get; set; }
		public string DeputedPerson { get; set; }
		public string DeputedPersonName { get; set; }
		public DateTime? DeputedTime { get; set; }
	}

}



