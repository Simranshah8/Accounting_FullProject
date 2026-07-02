using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class JobServiceType
	{

		DA.JobServiceTypeDB db = null;

		int _UserId = 0;

		public JobServiceType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.JobServiceTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.JobServiceType beData)
		{
			bool isModify = beData.ServiceTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.JobServiceTypeCollections GetAllJobServiceType(int EntityId)
		{
			return db.getAllJobServiceType(_UserId, EntityId);
		}
		public BE.JobServiceType GetJobServiceTypeById(int EntityId, int ServiceTypeId)
		{
			return db.getJobServiceTypeById(_UserId, EntityId, ServiceTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int ServiceTypeId)
		{
			return db.DeleteById(_UserId, EntityId, ServiceTypeId);
		}
		public ResponeValues IsValidData(ref BE.JobServiceType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ServiceTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ServiceTypeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.JobCardTypeId == 0)
				{
					resVal.ResponseMSG = "Please ! Select JobCardType ";
				}
				else
				{
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	}

}

