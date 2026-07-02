using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class Billlist
	{

		DA.BilllistDB db = null;

		int _UserId = 0;

		public Billlist(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.BilllistDB(hostName, dbName);
		}

        public BE.BillDetailCollections GetAllBillDetail(int TranId, string TranType)
        {
            return db.getBillDetailbyId(_UserId, TranId, TranType);
        }


    }

}

