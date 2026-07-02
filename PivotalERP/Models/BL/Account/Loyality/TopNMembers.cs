using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Reporting.Account
{

	public class TopNMembers : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Reporting.Account.TopNMembersDB db = null;

		int _UserId = 0;

		public TopNMembers(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Reporting.Account.TopNMembersDB(hostName, dbName);
		}
		public Dynamic.RE.Reporting.Account.TopNMembersCollections GetAllTopNMembers(DateTime? DateFrom, DateTime? DateTo, int RowNo)
		{
			return db.getAllTopNMembers(_UserId, DateFrom, DateTo, RowNo);
		}
	}

}

