using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class TicketFor
	{

		DA.TicketForDB db = null;

		int _UserId = 0;

		public TicketFor(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.TicketForDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.TicketFor beData)
		{
			bool isModify = beData.TicketForId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.TicketForCollections GetAllTicketFor(int EntityId)
		{
			return db.getAllTicketFor(_UserId, EntityId);
		}
		public BE.TicketFor GetTicketForById(int EntityId, int TicketForId)
		{
			return db.getTicketForById(_UserId, EntityId, TicketForId);
		}
		public ResponeValues DeleteById(int EntityId, int TicketForId)
		{
			return db.DeleteById(_UserId, EntityId, TicketForId);
		}
		public ResponeValues IsValidData(ref BE.TicketFor beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TicketForId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TicketForId != 0)
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

