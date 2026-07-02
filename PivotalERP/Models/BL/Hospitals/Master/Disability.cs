using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Disability
	{

		DA.Hospital.DisabilityDB db = null;

		int _UserId = 0;

		public Disability(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DisabilityDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Disability beData)
		{
			bool isModify = beData.DisabilityId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DisabilityCollections GetAllDisability(int EntityId)
		{
			return db.getAllDisability(_UserId, EntityId);
		}
		public BE.Hospital.Disability GetDisabilityById(int EntityId, int DisabilityId)
		{
			return db.getDisabilityById(_UserId, EntityId, DisabilityId);
		}
		public ResponeValues DeleteById(int EntityId, int DisabilityId)
		{
			return db.DeleteById(_UserId, EntityId, DisabilityId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Disability beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DisabilityId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DisabilityId != 0)
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

