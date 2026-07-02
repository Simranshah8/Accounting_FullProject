using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Security
{

	public class CustomAccess
	{

		DA.Security.CustomAccessDB db = null;

		int _UserId = 0;

		public CustomAccess(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Security.CustomAccessDB(hostName, dbName);
		}
		//public ResponeValues SaveFormData(BE.Security.CustomAccess beData)
		//{
		//	bool isModify = beData.TranId > 0;
		//	ResponeValues isValid = IsValidData(ref beData, isModify);
		//	if (isValid.IsSuccess)
		//		return db.SaveUpdate(beData, isModify);
		//	else
		//		return isValid;
		//}

		public ResponeValues SaveFormData(List<BE.Security.CustomAccess> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			if (dataColl == null || dataColl.Count == 0)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "No  data to save.";
				return resVal;
			}
			if (dataColl.Any(x => x.ModuleId == null))
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "Please Select Module!";
				return resVal;
			}

			if (dataColl.Any(x => x.EntityIds == null))
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "Please Select Entity!";
				return resVal;
			}

			if (dataColl.Any(x => string.IsNullOrWhiteSpace(x.AccessName)))
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = "Please select Access Name!";
				return resVal;
			}


			return db.SaveUpdate(_UserId, dataColl);

		}
		public BE.Security.CustomAccessCollections GetAllCustomAccess(int EntityId)
		{
			return db.getAllCustomAccess(_UserId, EntityId);
		}
		public BE.Security.CustomAccess GetCustomAccessById(int EntityId,int ModuleId, int EntityIds)
		{
			return db.getCustomAccessById(_UserId, EntityId, ModuleId, EntityIds);
		}
		public ResponeValues DeleteById(int EntityId, int ModuleId, int EntityIds)
		{
			return db.DeleteById(_UserId, EntityId, ModuleId, EntityIds);
		}

		public BE.Security.CustomAccessCollections GetEntityForProperties(int ModuleId, int? EntityType)
		{
			return db.GetEntityForProperties(_UserId, ModuleId, EntityType);
		}


	}

}

