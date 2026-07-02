using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Expense
{

	public class TravelMode  
	{ 

		DA.Expense.TravelModeDB db = null;

		int _UserId = 0;

		public TravelMode(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Expense.TravelModeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Expense.TravelMode beData)
		{
			bool isModify = beData.TravelModeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Expense.TravelModeCollections GetAllTravelMode(int EntityId)
		{
			return db.getAllTravelMode(_UserId, EntityId);
		}
		public BE.Expense.TravelMode GetTravelModeById(int EntityId, int TravelModeId)
		{
			return db.getTravelModeById(_UserId, EntityId, TravelModeId);
		}
		public ResponeValues DeleteById(int EntityId, int TravelModeId)
		{
			return db.DeleteById(_UserId, EntityId, TravelModeId);
		}
		public ResponeValues IsValidData(ref BE.Expense.TravelMode beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.TravelModeId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.TravelModeId != 0)
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

