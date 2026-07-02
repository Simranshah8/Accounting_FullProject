using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class CommissionType
	{

		DA.Hospital.CommissionTypeDB db = null;

		int _UserId = 0;

		public CommissionType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.CommissionTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.CommissionType beData)
		{
			bool isModify = beData.CommissionTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.CommissionTypeCollections GetAllCommissionType(int EntityId)
		{
			return db.getAllCommissionType(_UserId, EntityId);
		}
		public BE.Hospital.CommissionType GetCommissionTypeById(int EntityId, int CommissionTypeId)
		{
			return db.getCommissionTypeById(_UserId, EntityId, CommissionTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int CommissionTypeId)
		{
			return db.DeleteById(_UserId, EntityId, CommissionTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.CommissionType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.CommissionTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.CommissionTypeId != 0)
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

