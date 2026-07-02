using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class AdmissionType
	{

		DA.Hospital.AdmissionTypeDB db = null;

		int _UserId = 0;

		public AdmissionType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.AdmissionTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.AdmissionType beData)
		{
			bool isModify = beData.AdmissionTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.AdmissionTypeCollections GetAllAdmissionType(int EntityId)
		{
			return db.getAllAdmissionType(_UserId, EntityId);
		}
		public BE.Hospital.AdmissionType GetAdmissionTypeById(int EntityId, int AdmissionTypeId)
		{
			return db.getAdmissionTypeById(_UserId, EntityId, AdmissionTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int AdmissionTypeId)
		{
			return db.DeleteById(_UserId, EntityId, AdmissionTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.AdmissionType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AdmissionTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AdmissionTypeId != 0)
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

