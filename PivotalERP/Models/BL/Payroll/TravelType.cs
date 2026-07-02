using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Payroll
{

	public class TravelType : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.Payroll.TravelTypeDB db = null;

		int _UserId = 0;

		public TravelType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.Payroll.TravelTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.Payroll.TravelType beData)
		{
			bool isModify = beData.TravelTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.Payroll.TravelTypeCollections GetAllTravelType(int EntityId)
		{
			return db.getAllTravelType(_UserId, EntityId);
		}
		public Dynamic.BE.Payroll.TravelType GetTravelTypeById(int EntityId, int TravelTypeId)
		{
			return db.getTravelTypeById(_UserId, EntityId, TravelTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int TravelTypeId)
		{
			return db.DeleteById(_UserId, EntityId, TravelTypeId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.Payroll.TravelType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TravelTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TravelTypeId != 0)
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
					if (!string.IsNullOrEmpty(beData.Name))
					{
						var validName = IsValidName(beData.Name);
						if (!validName.IsSuccess)
							return validName;
					}
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

