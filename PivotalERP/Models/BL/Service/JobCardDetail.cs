using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class JobCardDetail
    {
        DA.JobCardDetailDB db = null;
        int _UserId = 0;
        public JobCardDetail(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.JobCardDetailDB(hostName, dbName);
        }
      
        public BE.JobCardDetailCollections GetAllJobCardDetail(int EntityId, DateTime DateFrom, DateTime DateTo)
        {
            return db.getAllJobCardDetail(_UserId, EntityId, DateFrom, DateTo);
        }

		public ResponeValues SaveRemarks(BE.JobCardRemarks beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TranId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Service Remainder";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}

			else if (string.IsNullOrEmpty(beData.Remarks))
			{
				resVal.ResponseMSG = "Please ! Enter Remarks";
			}

			else
			{
				resVal = db.SaveJobCardRemarks(beData);
			}

			return resVal;

		}

		public BE.JobCardRemarksCollections GetJobCardRematks(int TranId)
		{
			return db.getJobCardRemarksById(_UserId, TranId);
		}

	}

}
