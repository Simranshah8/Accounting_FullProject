using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class JobType
	{

		DA.JobTypeDB db = null;

		int _UserId = 0;

		public JobType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.JobTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.JobType beData)
		{
			bool isModify = beData.JobTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.JobTypeCollections GetAllJobType(int EntityId)
		{
			return db.getAllJobType(_UserId, EntityId);
		}
		public BE.JobType GetJobTypeById(int EntityId, int JobTypeId)
		{
			return db.getJobTypeById(_UserId, EntityId, JobTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int JobTypeId)
		{
			return db.DeleteById(_UserId, EntityId, JobTypeId);
		}
		public ResponeValues IsValidData(ref BE.JobType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.JobTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.JobTypeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.LedgerId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Ledger ";
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

