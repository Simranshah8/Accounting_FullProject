using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class NewStockReporting : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.NewStockReportingDB db = null;

		int _UserId = 0;

		public NewStockReporting(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.NewStockReportingDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.NewStockReportingCollections GetAllNewStockReporting(int? ProductGroupId, int? GodownId, DateTime? DateFrom, DateTime? DateTo)
		{
			return db.getAllNewStockReporting(_UserId, ProductGroupId, GodownId, DateFrom, DateTo);
		}
	}

}

