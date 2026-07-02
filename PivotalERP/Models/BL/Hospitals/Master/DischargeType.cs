using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class DischargeType
	{

		DA.Hospital.DischargeTypeDB db = null;

		int _UserId = 0;

		public DischargeType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DischargeTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.DischargeType beData)
		{
			bool isModify = beData.DischargeTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DischargeTypeCollections GetAllDischargeType(int EntityId)
		{
			return db.getAllDischargeType(_UserId, EntityId);
		}
		public BE.Hospital.DischargeType GetDischargeTypeById(int EntityId, int DischargeTypeId)
		{
			return db.getDischargeTypeById(_UserId, EntityId, DischargeTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int DischargeTypeId)
		{
			return db.DeleteById(_UserId, EntityId, DischargeTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.DischargeType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DischargeTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DischargeTypeId != 0)
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

