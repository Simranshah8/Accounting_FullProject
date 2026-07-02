using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class AddResult
	{

		DA.Lab.AddResultDB db = null;

		int _UserId = 0;

		public AddResult(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.AddResultDB(hostName, dbName);
		}

		public BE.Lab.AddResultCollection GetAllAddResult(int EntityId, DateTime? FromDate, DateTime? ToDate, string GroupIdColl = "")
		{
			return db.getAllAddResult(_UserId, EntityId, FromDate, ToDate, GroupIdColl);
		}

		public BE.Lab.AddResultCollection GetAddResult(int BarCodeNumber, int Age, string Gender)
		{
			return db.GetAddResult(_UserId, BarCodeNumber, Age, Gender);
		}

		public ResponeValues SaveFormData(List<BE.Lab.AddResult> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			if (dataColl == null || dataColl.Count == 0)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "No  data to save.";
				return resVal;
			}

			if (dataColl.Any(x => x.DoctorId == null))
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "You must select a technician for a signature!";
				return resVal;
			}

			return db.SaveUpdate(_UserId, dataColl);
		}

	}

}

