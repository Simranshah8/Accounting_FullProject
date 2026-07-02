
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.GateMaster
{

	public class Vehicle
	{

		DA.GateMaster.VehicleDB db = null;

		int _UserId = 0;

		public Vehicle(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GateMaster.VehicleDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GateMaster.Vehicle beData)
		{
			bool isModify = beData.VehicleId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GateMaster.VehicleCollections GetAllVehicle(int EntityId)
		{
			return db.getAllVehicle(_UserId, EntityId);
		}
		public BE.GateMaster.Vehicle GetVehicleById(int EntityId, int VehicleId)
		{
			return db.getVehicleById(_UserId, EntityId, VehicleId);
		}
		public ResponeValues DeleteById(int EntityId, int VehicleId)
		{
			return db.DeleteById(_UserId, EntityId, VehicleId);
		}
		public ResponeValues IsValidData(ref BE.GateMaster.Vehicle beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.VehicleId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.VehicleId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (string.IsNullOrEmpty(beData.RegNo))
				{
					resVal.ResponseMSG = "Please ! Enter RegNo ";
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

