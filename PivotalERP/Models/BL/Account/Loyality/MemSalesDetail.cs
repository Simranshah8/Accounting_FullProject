using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class MemSalesDetail : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.MemSalesDetailDB db = null;

		int _UserId = 0;

		public MemSalesDetail(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.MemSalesDetailDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.MemSalesDetailCollections GetAllMemSalesDetail(DateTime? DateFrom, DateTime? DateTo, int? BillingTypeId)
		{
			return db.getAllMemSalesDetail(_UserId, DateFrom, DateTo, BillingTypeId);
		}
	}

}

