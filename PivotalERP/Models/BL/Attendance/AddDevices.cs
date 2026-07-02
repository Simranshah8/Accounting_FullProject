using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{
	public class AddDevices
	{

		DA.Attendance.AddDevicesDB db = null;

		int _UserId = 0;

		public AddDevices(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.AddDevicesDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.AddDevices beData)
		{
			bool isModify = beData.DeviceId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Attendance.AddDevicesCollections GetAllAddDevices(int EntityId)
		{
			return db.getAllAddDevices(_UserId, EntityId);
		}
		public BE.Attendance.AddDevices GetAddDevicesById(int EntityId, int DeviceId)
		{
			return db.getAddDevicesById(_UserId, EntityId, DeviceId);
		}
		public ResponeValues DeleteById(int EntityId, int DeviceId)
		{
			return db.DeleteById(_UserId, EntityId, DeviceId);
		}
		public RE.Attendance.MissingEmployeeAsEnrollNoCollections getMissingEmployeeAsEnrollNo()
		{
			return db.getMissingEmployeeAsEnrollNo(_UserId);
		}
			public ResponeValues IsValidData(ref BE.Attendance.AddDevices beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DeviceId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DeviceId != 0)
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

