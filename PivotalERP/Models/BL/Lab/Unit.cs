using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class lab_Unit
	{

		DA.lab_UnitDB db = null;

		int _UserId = 0;

		public lab_Unit(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.lab_UnitDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.lab_Unit beData)
		{
			bool isModify = beData.UnitId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.lab_UnitCollections GetAlllab_Unit(int EntityId)
		{
			return db.getAlllab_Unit(_UserId, EntityId);
		}
		public BE.lab_Unit Getlab_UnitById(int EntityId, int UnitId)
		{
			return db.getlab_UnitById(_UserId, EntityId, UnitId);
		}
		public ResponeValues DeleteById(int EntityId, int UnitId)
		{
			return db.DeleteById(_UserId, EntityId, UnitId);
		}
		public ResponeValues IsValidData(ref BE.lab_Unit beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.UnitId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.UnitId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Symbol))
				{
					resVal.ResponseMSG = "Please ! Enter Symbol ";
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

