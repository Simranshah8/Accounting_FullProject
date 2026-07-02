using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class ExpenseCategory : ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; }
        public int? SNO { get; set; }
        public int? GroupNameId { get; set; }
        public bool? CanEdit { get; set; }
        public bool? IsActive { get; set; }
        public string Description { get; set; }
        public string GroupName { get; set; }
    }
    public class ExpenseCategoryCollections : System.Collections.Generic.List<ExpenseCategory>
    {
        public ExpenseCategoryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    //		$scope.ExpenseTypeColl = [{ id: 1, text: 'Travelling Expense(s)' }, { id: 2, text: 'Lodging Expense(s)' }, { id: 3, text: 'Fooding Expense(s)' }, { id: 4, text: 'Meeting Expense(s)' }, { id: 5, text: 'Office Expense(s)' }, { id: 6, text: 'Other Expense(s)' }]

    public enum EXPENSESTYPES
    {
        Travelling_Expense=1,
        Lodging_Expense=2,
        Fooding_Expense=3,
        Meeting_Expense=4,
        Office_Expense=5,
        Other_Expense=6
    }

}