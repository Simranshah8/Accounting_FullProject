using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Ward  
	{ 

		DA.Hospital.WardDB db = null;

		int _UserId = 0;

		public Ward(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.WardDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Ward beData)
		{
			bool isModify = beData.WardId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.WardCollections GetAllWard(int EntityId)
		{
			return db.getAllWard(_UserId, EntityId);
		}
		public BE.Hospital.Ward GetWardById(int EntityId, int WardId)
		{
			return db.getWardById(_UserId, EntityId, WardId);
		}
		public ResponeValues DeleteById(int EntityId, int WardId)
		{
			return db.DeleteById(_UserId, EntityId, WardId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Ward beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.WardId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.WardId != 0)
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

