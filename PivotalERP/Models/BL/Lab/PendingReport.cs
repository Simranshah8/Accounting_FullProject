using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class PendingReport
	{

		DA.Lab.PendingReportDB db = null;

		int _UserId = 0;

		public PendingReport(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.PendingReportDB(hostName, dbName);
		}


		public BE.Lab.PendingReportCollection GetPendingReportById(int BarCodeNumber)
		{
			return db.GetPendingReportById(_UserId, BarCodeNumber);
		}


		public BE.Lab.PendingReportCollection GetAllPendingReport(int EntityId, int Status, DateTime? FromDate, DateTime? ToDate, string GroupIdColl = "")
		{
			return db.GetAllPendingReport(_UserId, EntityId, Status, FromDate, ToDate, GroupIdColl);
		}


		public ResponeValues SaveFormData(List<BE.Lab.PendingReport> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			if (dataColl == null || dataColl.Count == 0)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "No  data to save.";
				return resVal;
			}
		

			return db.SaveUpdate(_UserId, dataColl);
		}


	}

}

