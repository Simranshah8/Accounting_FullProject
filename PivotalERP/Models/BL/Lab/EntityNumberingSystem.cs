using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class EntityNumberingSystem
	{

		DA.Lab.EntityNumberingSystemDB db = null;

		int _UserId = 0;

		public EntityNumberingSystem(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.EntityNumberingSystemDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.EntityNumberingSystem beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.EntityNumberingSystemCollections GetAllEntityNumberingSystem(int EntityId)
		{
			return db.getAllEntityNumberingSystem(_UserId, EntityId);
		}
		public BE.Lab.EntityNumberingSystem GetEntityNumberingSystemById(int EntityId, int TranId)
		{
			return db.getEntityNumberingSystemById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.Lab.EntityNumberingSystem beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.EntityNo == 0 || !beData.EntityNo.HasValue)
                {
					resVal.ResponseMSG = "Please ! Enter Entity Number ";
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

