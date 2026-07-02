using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Task
{
	public class GenerateTicket : ResponeValues
	{
		public int? TicketId { get; set; }
		public int CustomerId { get; set; }
		public string UrlName { get; set; }
		public string DBCode { get; set; } = "";
		public string CompanyCode { get; set; } = "";
		public string ContactName { get; set; } = "";
		public string ContactDesignation { get; set; } = "";
		public string ContactMobileNo { get; set; } = "";
		public string EmailId { get; set; } = "";
		public int? SourceId { get; set; }
		public string SpecifySource { get; set; } = "";
		public int? RequirementTypeId { get; set; }
		 
		public string RequirementProblem { get; set; } = "";
		public int? PriorityId { get; set; } = 2;
		public string Description { get; set; } = "";
		public int? AssignToId { get; set; }
		public string attachFile { get; set; } = "";
		public string CustomerName { get; set; } = "";
		public string ContactSource { get; set; } = "";
		public string AssignTo { get; set; } = "";
		public string PriorityStatus { get; set; } = "";
		public string RequirementType { get; set; } = "";
		//public string PhotoPath { get; set; }
		public byte[] Photo { get; set; }
		public DateTime? LogDateTime { get; set; }
		public string LogMiti { get; set; }
		public int? CreateBy { get; set; }
		public string UserName { get; set; }

		public string Source { get; set; }
		public string StatusRemarks { get; set; }
		public string LastComment { get; set; }
		public string TicketStatus { get; set; }

		public DateTime OpenDateTime { get; set; }
		public DateTime? CloseDateTime { get; set; }
		public string OpenMiti { get; set; }
		public string ClosedMiti { get; set; }
		public string StatusMinDiff { get; set; }
		public string PendingMinDiff { get; set; }

		public string CustomerApprovedRemarks { get; set; }
		public DateTime? CustomerApprovedAt { get; set; }
		public string ApporivedMiti { get; set; }
		public string CustomerApprovedBy { get; set; }
		//Added By Suresh on 12-12-2023
		public int? AgreementProductNameId { get; set; }
		public string ProductName { get; set; }
		
		public string PaymentVerifiedBy { get; set; }
		 

	}

	public class GenerateTicketCollections : System.Collections.Generic.List<GenerateTicket>
	{
		public GenerateTicketCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


	public class CustomerContact : ResponeValues
	{
		public int? ContactId { get; set; }
		public int? CustomerId { get; set; }
		public string Name { get; set; } = "";
		public int DesignationId { get; set; }
		public string EmailId { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string WhatsappNo { get; set; } = "";
		public string Remarks { get; set; } = "";
	}


	public class CustomerContactForTicket : ResponeValues
	{

		public int? CustomerId { get; set; }
		public int? AddressBookId { get; set; }
		public string CompanyCode { get; set; } = "";
		public int CompanyTypeId { get; set; }
		public int CompanyCategoryId { get; set; }
		public string CompanyName { get; set; } = "";
		public string BillingName { get; set; } = "";
		
		
		public CustomerContactForTicket()
		{
			ContactDetColl = new List<CustomerContactforTicketDetail>();
			TicketHistorycoll = new List<GenerateTicket>();
		}

		public List<CustomerContactforTicketDetail> ContactDetColl { get; set; }
		public List<GenerateTicket> TicketHistorycoll { get; set; }
		//public BE.SupportExecutive Executive { get; set; }

		public List<CROFeedback> CROFeedBackColl { get; set; }

		//public List<PaymentScheduleDetail> PaymentTermColl { get; set; }

		public List<ReceiptSumm> ReceiptColl { get; set; } = new List<ReceiptSumm>();
	}

	public class CROFeedback
    {
		public string PurposeOfContact { get; set; }
		public DateTime FollowupDateTime { get; set; }
		public string FollowupMiti { get; set; }
		public string FollowupBy { get; set; }
		public string CallStatus { get; set; }
		public string FeedbackType { get; set; }
		public int FeedbackTypeId { get; set; }
		public string FollowupWith { get; set; }
		public string Designation { get; set; }
		public string FollowupContact { get; set; }
		public string FollowupEmail { get; set; }
		public string Remarks { get; set; }
		public int TotalDays { get; set; }
		public DateTime? NextExpiryDate { get; set; }
		public string NextExpiryMiti { get; set; }
		public int? ExpiredAfterDays { get; set; }

	}
	//public class CustomerContactForTicketCollections : System.Collections.Generic.List<CreateCustomer>
	//{
	//	public CustomerContactForTicketCollections()
	//	{
	//		ResponseMSG = "";
	//	}
	//	public string ResponseMSG { get; set; }
	//	public bool IsSuccess { get; set; }
	//}
	public class CustomerContactforTicketDetail
	{
		public int CustomerId { get; set; }
		public string Name { get; set; } = "";
		public int DesignationId { get; set; }
		public string EmailId { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string WhatsappNo { get; set; } = "";
		public string Remarks { get; set; } = "";
		public string Designation { get; set; } = "";
		public int ContactPurposeId { get; set; }
	}

	public class TicketHistoryDetail
	{
		public int TicketId { get; set; }
		public int CustomerId { get; set; }
		public string ContactName { get; set; } = "";
		public string ContactDesignation { get; set; } = "";
		public string ContactMobileNo { get; set; } = "";
		public int SourceId { get; set; }
		public int RequirementTypeId { get; set; }
		public int PriorityId { get; set; }
		public int AssignToId { get; set; }
		public string Description { get; set; } = "";
		public string CustomerName { get; set; } = "";
		public string ContactSource { get; set; } = "";
		public string AssignTo { get; set; } = "";
		public string PriorityStatus { get; set; } = "";
		public string RequirementType { get; set; } = "";
		public DateTime? LogDateTime { get; set; }
		public string LogMiti { get; set; }
		public int? CreateBy { get; set; }
		public string Username { get; set; }
	}

	public class TicketStatus : ResponeValues
	{
		public int? TicketId { get; set; }
		public int? StatusId { get; set; }
		public string StatusRemarks { get; set; } = "";
		public string attachFile { get; set; } = "";
		public int? PaymentVerifiedById { get; set; }
		public int? TranId { get; set; }
		public string ModuleName { get; set; }
		public string EntityName { get; set; }
		public int? RequirementTypeId { get; set; }
	}

	public class TicketApproved : ResponeValues
    {
		public int TicketId { get; set; }
		public string ApprovedBy { get; set; }
		public string ApprovedRemarks { get; set; }
		public string CompanyCode { get; set; }
		public string UrlName { get; set; }
		
		public int? TranId { get; set; }
	}

	public class TicketStatusCollections : System.Collections.Generic.List<TicketStatus>
	{
		public TicketStatusCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class TicketComment : ResponeValues
	{
		public int? TicketId { get; set; }
		public string Comment { get; set; } = "";
		public string UserName { get; set; } = "";
		public DateTime LogDateTime { get; set; }
		public string LogMiti { get; set; } = "";
		public string attachFile { get; set; } = "";

		public int? TranId { get; set; }

	}


	public class TicketCommentCollections : System.Collections.Generic.List<TicketComment>
	{
		public TicketCommentCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class TicketAssign : ResponeValues
	{
		public int? TicketId { get; set; }
		public int? AssignToId { get; set; }
		public string Remarks { get; set; } = "";

		public int? TranId { get; set; }
	}

	public class TicketAssignCollections : System.Collections.Generic.List<TicketAssign>
	{
		public TicketAssignCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class TicketHis 
    {
		public string Status { get; set; }
		public string Remarks { get; set; }
		public string User { get; set; }
		public DateTime LogDateTime { get; set; }
		public string LogMiti { get; set; }
	}
	public class TicketHisCollections : System.Collections.Generic.List<TicketHis>
	{
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }

	}

	public class ReceiptSumm
    {
		public string ReceiptNo { get; set; }
		public string RefNo { get; set; }
		public string ReceiptMiti { get; set; }
		public DateTime ReceiptDate { get; set; }
		public string ReceiptAs { get; set; }
		public string BankName { get; set; }
		public string Narration { get; set; }
		public double Amount { get; set; }
		public string User { get; set; }
		public DateTime LogDateTime { get; set; }

	}
}