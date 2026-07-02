using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Master
{
	public class Religion
	{

		Dynamic.DA.Master.ReligionDB db = null;

		int _UserId = 0;

		public Religion(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Master.ReligionDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Master.Religion beData)
		{
			bool isModify = beData.ReligionId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Master.ReligionCollections GetAllReligion(int EntityId)
		{
			return db.getAllReligion(_UserId, EntityId);
		}
		public BE.Master.Religion GetReligionById(int EntityId, int ReligionId)
		{
			return db.getReligionById(_UserId, EntityId, ReligionId);
		}
		public ResponeValues DeleteById(int EntityId, int ReligionId)
		{
			return db.DeleteById(_UserId, EntityId, ReligionId);
		}
		public ResponeValues IsValidData(ref BE.Master.Religion beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ReligionId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ReligionId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please! Enter Name ";
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

