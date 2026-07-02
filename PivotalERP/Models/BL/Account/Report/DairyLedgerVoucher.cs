using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Report
{
    public class DairyLedgerVoucher
	{

		DA.Report.DairyLedgerVoucherDB db = null;

		int _UserId = 0;

		public DairyLedgerVoucher(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Report.DairyLedgerVoucherDB(hostName, dbName);
        }
        public RE.Reporting.Account.DairyLedgerVoucherCollections GetDailyLedgerVoucher(BaseDate baseDate, int? LedgerId, DateTime? dateFrom, DateTime? dateTo, ref double OpeningAmt, bool ShowInventoryDetails , bool showAsCurrency )
        {
			return db.GetDailyLedgerVoucher(_UserId, baseDate, LedgerId, dateFrom, dateTo, ref OpeningAmt, ShowInventoryDetails , showAsCurrency ,  null, "", false);
        }
    }
}