using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class LedgerChannel
	{

		DA.LedgerChannelDB db = null;

		int _UserId = 0;

		public LedgerChannel(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LedgerChannelDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.LedgerChannel beData)
		{
			bool isModify = beData.ChannelId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.LedgerChannelCollections GetAllLedgerChannel(int EntityId)
		{
			return db.getAllLedgerChannel(_UserId, EntityId);
		}
		public BE.LedgerChannel GetLedgerChannelById(int EntityId, int ChannelId)
		{
			return db.getLedgerChannelById(_UserId, EntityId, ChannelId);
		}
		public ResponeValues DeleteById(int EntityId, int ChannelId)
		{
			return db.DeleteById(_UserId, EntityId, ChannelId);
		}
		public ResponeValues IsValidData(ref BE.LedgerChannel beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ChannelId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ChannelId != 0)
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

