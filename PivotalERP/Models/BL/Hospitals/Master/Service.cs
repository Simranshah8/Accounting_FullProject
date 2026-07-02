using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Service
	{

		DA.Hospital.ServiceDB db = null;

		int _UserId = 0;

		public Service(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.ServiceDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Service beData)
		{
			bool isModify = beData.ServiceId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.ServiceCollections GetAllService(int EntityId)
		{
			return db.getAllService(_UserId, EntityId);
		}
		public BE.Hospital.Service GetServiceById(int EntityId, int ServiceId)
		{
			return db.getServiceById(_UserId, EntityId, ServiceId);
		}
		public ResponeValues DeleteById(int EntityId, int ServiceId)
		{
			return db.DeleteById(_UserId, EntityId, ServiceId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Service beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ServiceId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ServiceId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
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

