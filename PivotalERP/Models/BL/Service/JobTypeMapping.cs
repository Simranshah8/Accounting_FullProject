using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class JobTypeMapping
	{

		DA.JobTypeMappingDB db = null;

		int _UserId = 0;

		public JobTypeMapping(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.JobTypeMappingDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.JobTypeMapping beData)
		{
			bool isModify = beData.JobTypeMappingId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.JobTypeMappingCollections GetAllJobTypeMapping(int EntityId)
		{
			return db.getAllJobTypeMapping(_UserId, EntityId);
		}
		public BE.JobTypeMapping GetJobTypeMappingById(int EntityId, int JobTypeMappingId)
		{
			return db.getJobTypeMappingById(_UserId, EntityId, JobTypeMappingId);
		}
		public ResponeValues DeleteById(int EntityId, int JobTypeMappingId)
		{
			return db.DeleteById(_UserId, EntityId, JobTypeMappingId);
		}
		public ResponeValues IsValidData(ref BE.JobTypeMapping beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.JobTypeMappingId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.JobTypeMappingId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.VehicleTypeId == 0)
				{
					resVal.ResponseMSG = "Please ! Select VehicleType ";
				}
				else if (beData.VehicleModelId == 0)
				{
					resVal.ResponseMSG = "Please ! Select VehicleModel ";
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

