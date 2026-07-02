using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Account
{

	public class Circle  
	{ 

		DA.Account.CircleDB db = null;

		int _UserId = 0;

		public Circle(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Account.CircleDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Account.Circle beData)
		{
			bool isModify = beData.CircleID > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Account.CircleCollections GetAllCircle(int EntityId)
		{
			return db.getAllCircle(_UserId, EntityId);
		}
		public BE.Account.Circle GetCircleById(int EntityId, int CircleID)
		{
			return db.getCircleById(_UserId, EntityId, CircleID);
		}
		public ResponeValues DeleteById(int EntityId, int CircleID)
		{
			return db.DeleteById(_UserId, EntityId, CircleID);
		}
		public ResponeValues IsValidData(ref BE.Account.Circle beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.CircleID == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.CircleID != 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}
			else if (string.IsNullOrEmpty(beData.CircleName))
			{
				resVal.ResponseMSG = "Please ! Enter CircleName ";
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

