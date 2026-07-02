using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.Expense
{
    public class MonthlyExpenseSummary : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; } = "";
        public string Designation { get; set; } = "";
        public int? EncloserDays { get; set; }
        public int? WorkingDays { get; set; }
        public int? RestDays { get; set; }
        public int? LeaveDays { get; set; }
        public MonthlyExpenseSummary()
        {
            ExpenseClaimDetailsColl = new List<ExpenseClaimDetails>();
        }
        public List<ExpenseClaimDetails> ExpenseClaimDetailsColl { get; set; }
    }

    public class ExpenseClaimDetails
    {
        public int? TranId { get; set; }
        public string ExpenseTitle { get; set; } = "";
        public int? ExpenseTypeId { get; set; }
        public string DestinationFrom { get; set; } = "";
        public string DestinationTo { get; set; } = "";
        public double? DistanceTravelled { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public string ExpenseMitti { get; set; } = "";
        public string DayName { get; set; } = "";
        public int? ExpenseCategoryId { get; set; }
        public string ExpenseCategory { get; set; } = "";
        public double? Amount { get; set; }
        public string Description { get; set; } = "";
        public string TravelMode { get; set; } = "";
        public double? TravelFuelAmt { get; set; }
        public double? LocalAllowanceAmt { get; set; }
        public double? CountryAlowanceAmt { get; set; }
        public double? GrandTotal { get; set; }
        public double? Distance { get; set; }
        public string CheckIn { get; set; } = "";
        public string CheckOut { get; set; } = "";
        public double? TotalWoking { get; set; }
        public string DepartureTime { get; set; } = "";
        public string ArrivalTime { get; set; } = "";

        public string ExpAttachment { get; set; } = "";
        public string ReciptImage { get; set; } = "";

        public bool HasAttachment
        {
            get
            {
                if (!string.IsNullOrEmpty(ExpAttachment) || !string.IsNullOrEmpty(ReciptImage))
                    return true;
                else
                    return false;
            }
        }
    }

}