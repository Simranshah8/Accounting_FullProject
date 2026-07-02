using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class SampleCollect
	{

		DA.Lab.SampleCollectDB db = null;

		int _UserId = 0;

		public SampleCollect(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.SampleCollectDB(hostName, dbName);
		}
	
		public BE.Lab.SampleCollection GetAllSampleCollection(int EntityId, DateTime? FromDate, DateTime? ToDate)
		{
			return db.getAllSampleCollection(_UserId, EntityId, FromDate, ToDate);
		}
		public BE.Lab.BillingDetailsCollection GetBillingDetails(int BillingId,bool IsSampleCollected)
		{
			return db.GetBillingDetails(_UserId, BillingId, IsSampleCollected);
		}
		public ResponeValues GenerateSampleBarCode(int EntityId)
		{
			return db.GenerateSampleBarCode(_UserId, EntityId);
		}
		public ResponeValues SaveFormData(List<BE.Lab.BillingDetails> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			if (dataColl == null || dataColl.Count == 0)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "No sample data to save.";
				return resVal;
			}
            foreach (var item in dataColl)
            {
                if (item.BillingId == 0 || item.BillingId.HasValue == false)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = $"Billing number is missing for test .";
                    return resVal;
                }
                if (item.TestNameId == 0 || item.TestNameId.HasValue == false)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = $"TestNameId is missing for test.";
                    return resVal;
                }
                if (item.SpecimenId == 0 || item.SpecimenId.HasValue == false)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = $"SpecimenId is missing for test.";
                    return resVal;
                }
            }
            return db.SaveUpdate(_UserId, dataColl);
		}
	}

}

