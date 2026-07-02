using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Expense
{
    public class MonthlyExpenseSummary
    {
        DA.Expense.MonthlyExpenseSummaryDB db = null;

        int _UserId = 0;

        public MonthlyExpenseSummary(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Expense.MonthlyExpenseSummaryDB(hostName, dbName);
        }
        public RE.Expense.MonthlyExpenseSummary GetMonthlyExpenseSummary(DateTime? DateFrom, DateTime? DateTo, int? EmployeeId)
        {
            return db.GetMonthlyExpenseSummary(_UserId, DateFrom, DateTo, EmployeeId);
        }
    }
}