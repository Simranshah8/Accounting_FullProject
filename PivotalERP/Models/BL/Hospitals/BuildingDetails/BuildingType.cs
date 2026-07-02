using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class BuildingType  
	{ 

		DA.Hospital.BuildingTypeDB db = null;

		int _UserId = 0;

		public BuildingType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.BuildingTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.BuildingType beData)
		{
			bool isModify = beData.BuildingTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.BuildingTypeCollections GetAllBuildingType(int EntityId)
		{
			return db.getAllBuildingType(_UserId, EntityId);
		}
		public BE.Hospital.BuildingType GetBuildingTypeById(int EntityId, int BuildingTypeId)
		{
			return db.getBuildingTypeById(_UserId, EntityId, BuildingTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int BuildingTypeId)
		{
			return db.DeleteById(_UserId, EntityId, BuildingTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.BuildingType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.BuildingTypeId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.BuildingTypeId != 0)
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

