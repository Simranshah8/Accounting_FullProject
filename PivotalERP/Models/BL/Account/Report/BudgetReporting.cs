using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Report
{

	public class BudgetReporting
	{

		DA.Report.BudgetReportingDB db = null;

		int _UserId = 0;

		public BudgetReporting(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Report.BudgetReportingDB(hostName, dbName);
		}
		
		public BE.Report.BudgetReportingCollections GetBudgetSummary(string BranchIdColl, DateTime? DateFrom, DateTime? DateTo, int? CostClassId, int? DateType)
		{
			return db.GetBudgetSummary(_UserId, BranchIdColl, DateFrom, DateTo, CostClassId, DateType);
		}
	
	}

}

