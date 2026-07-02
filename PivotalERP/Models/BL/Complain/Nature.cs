using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class Nature
	{

		DA.NatureDB db = null;

		int _UserId = 0;

		public Nature(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NatureDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Nature beData)
		{
			bool isModify = beData.NatureId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.NatureCollections GetAllNature(int EntityId)
		{
			return db.getAllNature(_UserId, EntityId);
		}
		public BE.Nature GetNatureById(int EntityId, int NatureId)
		{
			return db.getNatureById(_UserId, EntityId, NatureId);
		}
		public ResponeValues DeleteById(int EntityId, int NatureId)
		{
			return db.DeleteById(_UserId, EntityId, NatureId);
		}
		public ResponeValues IsValidData(ref BE.Nature beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.NatureId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.NatureId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
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

