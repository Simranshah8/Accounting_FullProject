using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class LedgerAuthorized
	{

		DA.LedgerAuthorizedDB db = null;

		int _UserId = 0;

		public LedgerAuthorized(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LedgerAuthorizedDB(hostName, dbName);
		}

		public ResponeValues SaveFormData(BE.LedgerAuthorizedyCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();

			resVal = db.SaveUpdate(_UserId, dataColl);

			return resVal;
		}

		public BE.LedgerAuthorizedyCollections GetLedgerAuthorized(int EntityId, int? LedgerId)
		{
			return db.getLedgerAuthorized(_UserId, EntityId, LedgerId);
		}
		
	
	}

}

