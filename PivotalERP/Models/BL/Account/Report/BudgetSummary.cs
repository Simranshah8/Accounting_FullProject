using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Report
{
	public class BudgetSummary
	{

		DA.Report.BudgetSummaryDB db = null;

		int _UserId = 0;

		public BudgetSummary(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Report.BudgetSummaryDB(hostName, dbName);
		}
		public RE.Reporting.Account.BudgetSummaryCollections GetBudgetSummary(int EntityId, DateTime? DateFrom, DateTime? DateTo)
		{
			return db.GetBudgetSummary(_UserId, EntityId, DateFrom, DateTo);
		}
	}
}