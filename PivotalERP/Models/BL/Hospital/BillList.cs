using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Billlist
	{

		DA.Hospital.BilllistDB db = null;

		int _UserId = 0;

		public Billlist(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.BilllistDB(hostName, dbName);
		}
		public BE.Hospital.DoctorAutoCompleteCollections getDoctorList()
		{
			return db.getDoctorList(_UserId);
		}
			public BE.Hospital.BillDetailCollections GetAllBillDetail(int TranId, string TranType)
        {
            return db.getBillDetailbyId(_UserId, TranId, TranType);
        }
		public BE.Hospital.BilllistCollections getAllBilllist(DateTime DateFrom, DateTime DateTo)
		{
			return db.getAllBilllist(_UserId, DateFrom, DateTo);
		}
		public ResponeValue UpdateCommission( string TranType, int TranId, BE.Hospital.BreakItemCollections commissionColl)
		{
			return db.UpdateCommission(_UserId, TranType, TranId, commissionColl);
		}

	}

}

