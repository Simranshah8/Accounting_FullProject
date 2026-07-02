using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class NewTB : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.NewTBDB db = null;

		int _UserId = 0;

		public NewTB(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.NewTBDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.NewTBCollections GetAllNewTB(int? LedgerGroupId, int? ReportType, DateTime? DateFrom, DateTime? DateTo, int? ForBranchId,string BranchIdColl)
		{
			return db.getAllNewTB(_UserId, LedgerGroupId, ReportType, DateFrom, DateTo, ForBranchId,BranchIdColl);
		}
	}

}

