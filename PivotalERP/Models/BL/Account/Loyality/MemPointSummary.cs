using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class MemPointSummary : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.MemPointSummaryDB db = null;

		int _UserId = 0;

		public MemPointSummary(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.MemPointSummaryDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.MemPointSummaryCollections GetAllMemPointSummary(DateTime? DateFrom, DateTime? DateTo, bool? IsOpeningCredit)
		{
			return db.getAllMemPointSummary(_UserId, DateFrom, DateTo, IsOpeningCredit);
		}
	}

}

