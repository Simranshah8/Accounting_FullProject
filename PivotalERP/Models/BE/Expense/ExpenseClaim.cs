using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Expense
{
	//$scope.ExpenseTypeColl = [{ id: 1, text: 'Travelling Expense(s)' }, { id: 2, text: 'Lodging Expense(s)' }, { id: 3, text: 'Fooding Expense(s)' }, { id: 4, text: 'Meeting Expense(s)' }, { id: 5, text: 'Office Expense(s)' }, { id: 6, text: 'Other Expense(s)' }]

	public enum EXPENSESTYPES
    {
		Travelling_Expense=1,
		//Lodging_Expense = 2,
		//Fooding_Expense = 3,
		Meeting_Expense = 4,
		Office_Expense = 5,
		Other_Expense = 6,		
	}

	public enum EXPENSESFOR
    {
		LOCAL_HQ=1,
		UP_COUNTRY=2,
		EX_COUNTRY=3
    }

	public class TranExpenseClaim : ResponeValues
	{

		public int? TranId { get; set; }
		public int? BranchId { get; set; }
		public int? ExpenseClaimForId { get; set; }
		public DateTime? DateFrom { get; set; }
		public DateTime? DateTo { get; set; }
		public string ExpenseTitle { get; set; } = "";
		public int? ExpenseTypeId { get; set; }
		public string DestinationFrom { get; set; } = "";
		public DateTime? DestFromDateTime { get; set; } 
		public string DestinationTo { get; set; } = "";
		public DateTime? DestToDateTime { get; set; }
		public double? DistanceTravelled { get; set; }
		public string PurposeOfVisit { get; set; } = "";
		public string Reason { get; set; } = "";
		public string ExpAttachment { get; set; } = "";
		public int? StatusId { get; set; }
		public int? StatusBy { get; set; }
		public DateTime? StatusLogDateTime { get; set; }
		public string StatusRemark { get; set; } = "";
		public int? AcClearanceBy { get; set; }
		public DateTime? AcClearanceDateTime { get; set; }
		public string AcClearanceRemark { get; set; } = "";
		public string Status { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string DateFromMiti { get; set; } = "";
		public string DateToMiti { get; set; } = "";
		
		//public TranExpenseClaimDetailsCollections TranExpenseClaimDetailsColl { get; set; }

		public ExpenseDetailsCollections DetailsColl { get; set; } = new ExpenseDetailsCollections();

		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; } = new BusinessEntity.GeneralDocumentCollections();

		public int? TravelMode { get; set; }
		public string TravelModeName { get; set; }

		public string SubmitStatus { get; set; }
		public DateTime? SubmitDateTime { get; set; }
		public string SubmitMiti { get; set; }

		public double TotalAmt { get; set; }
		public double PendingAmt { get; set; }
		public double VerifyAmt { get; set; }
		public double RejectedAmt { get; set; }
		public double CancelAmt { get; set; }
		public double PartialAmt { get; set; }
		public double ClearAmt { get; set; }
		public string StatusLogMiti { get; set; }
		public string ExpensesType { get; set; }
		public string Address { get; set; }
		public EXPENSESFOR ExpensesFor { get; set; } = EXPENSESFOR.LOCAL_HQ;




	}


	public class TranExpenseClaimCollections : System.Collections.Generic.List<TranExpenseClaim>
	{
        public TranExpenseClaimCollections()
        {
			ResponseMSG = "";

		}
		public string ResponseMSG { get; set; } = "";
		public bool IsSuccess { get; set; }

	}
	public class ExpenseDetails
	{
		public int? TranId { get; set; }
		public DateTime? ExpenseDate { get; set; }
		public int? ExpenseCategoryId { get; set; }
		public double? Quantity { get; set; }
		public double? Rate { get; set; }
		public double? Amount { get; set; }
		public string Description { get; set; } = "";
        public byte[] Data { get; set; }
        public string ReciptImage { get; set; } = "";
		public int? StatusId { get; set; }
		public int? StatusBy { get; set; }
		public DateTime? StatusLogDateTime { get; set; }
		public string StatusRemark { get; set; } = "";
		public int? AcClearanceBy { get; set; }
		public DateTime? AcClearanceDateTime { get; set; }
		public string AcClearanceRemark { get; set; } = "";
		public string Status { get; set; } = "";
		public string ExpenseCategory { get; set; } = "";
		public string ExpenseDateMiti { get; set; } = "";
	}

	public class ExpenseDetailsCollections : System.Collections.Generic.List<ExpenseDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



