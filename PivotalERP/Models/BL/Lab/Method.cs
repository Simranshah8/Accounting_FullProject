using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class lab_Method
	{

		DA.lab_MethodDB db = null;

		int _UserId = 0;

		public lab_Method(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.lab_MethodDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.lab_Method beData)
		{
			bool isModify = beData.MethodId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues GetAutoCode(int EntityId)
		{
			return db.GetAutoCode(_UserId, EntityId);
		}
		public BE.lab_MethodCollections GetAlllab_Method(int EntityId)
		{
			return db.getAlllab_Method(_UserId, EntityId);
		}
		public BE.lab_Method Getlab_MethodById(int EntityId, int MethodId)
		{
			return db.getlab_MethodById(_UserId, EntityId, MethodId);
		}
		public ResponeValues DeleteById(int EntityId, int MethodId)
		{
			return db.DeleteById(_UserId, EntityId, MethodId);
		}
		public ResponeValues IsValidData(ref BE.lab_Method beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.MethodId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.MethodId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
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

