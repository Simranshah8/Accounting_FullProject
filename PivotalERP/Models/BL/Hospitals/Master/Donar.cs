using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{
    public class Donar: Dynamic.BusinessLogic.Global.Common
	{

		DA.Hospital.DonarDB db = null;

		int _UserId = 0;

		public Donar(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DonarDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Donar beData)
		{
			bool isModify = beData.DonarId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DonarCollections GetAllDonar(int EntityId)
		{
			return db.getAllDonar(_UserId, EntityId);
		}
		public BE.Hospital.Donar GetDonarById(int EntityId, int DonarId)
		{
			return db.getDonarById(_UserId, EntityId, DonarId);
		}
		public ResponeValues DeleteById(int EntityId, int DonarId)
		{
			return db.DeleteById(_UserId, EntityId, DonarId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Donar beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DonarId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DonarId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.AutoNumber == 0 || beData.AutoNumber.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select AutoNumber ";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else
				{
					if (!string.IsNullOrEmpty(beData.MobileNo))
					{
						var valideNo = IsValidContactNo(beData.MobileNo);
						if (!valideNo.IsSuccess)
						{
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "Invalid mobile number. Please! Enter a valid mobile number.";
							return resVal;
						}
					}
					if (!string.IsNullOrEmpty(beData.PhoneNo))
					{
						var valideNo = IsValidContactNo(beData.PhoneNo);
						if (!valideNo.IsSuccess)
						{
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "Invalid Phone number. Please! Enter a valid Phone number.";
							return resVal;
						}
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

