using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class MemSalesSummary : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.MemSalesSummaryDB db = null;

		int _UserId = 0;

		public MemSalesSummary(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.MemSalesSummaryDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.MemSalesSummaryCollections GetAllMemSalesSummary(DateTime? DateFrom, DateTime? DateTo, int? BillingTypeId, bool? IsOpenPoint)
		{
			return db.getAllMemSalesSummary(_UserId, DateFrom, DateTo, BillingTypeId, IsOpenPoint);
		}
	}

}

