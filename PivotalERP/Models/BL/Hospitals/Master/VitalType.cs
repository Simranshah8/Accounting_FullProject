using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Vital
	{

		DA.Hospital.VitalDB db = null;

		int _UserId = 0;

		public Vital(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.VitalDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Vital beData)
		{
			bool isModify = beData.VitalId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.VitalCollections GetAllVital(int EntityId)
		{
			return db.getAllVital(_UserId, EntityId);
		}
		public BE.Hospital.Vital GetVitalById(int EntityId, int VitalId)
		{
			return db.getVitalById(_UserId, EntityId, VitalId);
		}
		public ResponeValues DeleteById(int EntityId, int VitalId)
		{
			return db.DeleteById(_UserId, EntityId, VitalId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Vital beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.VitalId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.VitalId != 0)
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

