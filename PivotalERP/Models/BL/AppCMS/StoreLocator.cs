using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AppCMS
{

	public class StoreLocator: Dynamic.BusinessLogic.Global.Common
	{

		DA.AppCMS.StoreLocatorDB db = null;

		int _UserId = 0;

		public StoreLocator(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AppCMS.StoreLocatorDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AppCMS.StoreLocator beData)
		{
			bool isModify = beData.StoreId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AppCMS.StoreLocatorCollections GetAllStoreLocator(int EntityId)
		{
			return db.getAllStoreLocator(_UserId, EntityId);
		}
		public BE.AppCMS.StoreLocator GetStoreLocatorById(int EntityId, int StoreId)
		{
			return db.getStoreLocatorById(_UserId, EntityId, StoreId);
		}
		public ResponeValues DeleteById(int EntityId, int StoreId)
		{
			return db.DeleteById(_UserId, EntityId, StoreId);
		}
		public ResponeValues IsValidData(ref BE.AppCMS.StoreLocator beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.StoreId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.StoreId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.StoreName))
				{
					resVal.ResponseMSG = "Please ! Enter StoreName ";
				}
				else if (string.IsNullOrEmpty(beData.CountryName))
				{
					resVal.ResponseMSG = "Please ! Enter CountryName ";
				}
				else if (string.IsNullOrEmpty(beData.CityName))
				{
					resVal.ResponseMSG = "Please ! Enter CityName ";
				}
				else if (string.IsNullOrEmpty(beData.Location))
				{
					resVal.ResponseMSG = "Please ! Enter Location URL ";
				}
				else if (string.IsNullOrEmpty(beData.PhoneNo))
				{
					resVal.ResponseMSG = "Please ! Enter PhoneNo ";
				}
				else if (string.IsNullOrEmpty(beData.Photo))
				{
					resVal.ResponseMSG = "Please ! Choose Photo ";
				}
				else
				{
					if (!string.IsNullOrEmpty(beData.PhoneNo))
					{
						var valideNo = IsValidContactNo(beData.PhoneNo);
						if (!valideNo.IsSuccess)
						{
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "Invalid Phone number. Please! Enter a valid Phone number.";
							return resVal;
						}
					}
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

