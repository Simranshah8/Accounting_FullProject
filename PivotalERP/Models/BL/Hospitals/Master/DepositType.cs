using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class DepositeType
	{

		DA.Hospital.DepositeTypeDB db = null;

		int _UserId = 0;

		public DepositeType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DepositeTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.DepositeType beData)
		{
			bool isModify = beData.DepositeTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DepositeTypeCollections GetAllDepositeType(int EntityId)
		{
			return db.getAllDepositeType(_UserId, EntityId);
		}
		public BE.Hospital.DepositeType GetDepositeTypeById(int EntityId, int DepositeTypeId)
		{
			return db.getDepositeTypeById(_UserId, EntityId, DepositeTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int DepositeTypeId)
		{
			return db.DeleteById(_UserId, EntityId, DepositeTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.DepositeType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DepositeTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DepositeTypeId != 0)
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

