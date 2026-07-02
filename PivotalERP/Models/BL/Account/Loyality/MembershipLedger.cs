using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class MembershipLedger : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.MembershipLedgerDB db = null;

		int _UserId = 0;

		public MembershipLedger(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.MembershipLedgerDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.MembershipLedgerCollections GetAllMembershipLedger(DateTime? DateFrom, DateTime? DateTo, int? MembershipLedgerId)
		{
			return db.getAllMembershipLedger(_UserId, DateFrom, DateTo, MembershipLedgerId);
		}
	}

}

