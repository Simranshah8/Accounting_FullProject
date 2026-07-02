using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class ManualAttendance
	{

		Dynamic.DA.HR.ManualAttendanceDB db = null;

		int _UserId = 0;

		public ManualAttendance(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.ManualAttendanceDB(hostName, dbName);
		}
		//public ResponeValues SaveFormData(Dynamic.BE.HR.ManualAttendance beData)
		//{
		//	bool isModify = beData.TranId > 0;
		//	ResponeValues isValid = IsValidData(ref beData, isModify);
		//	if (isValid.IsSuccess)
		//		return db.SaveUpdate(beData, isModify);
		//	else
		//		return isValid;
		//}
		public ResponeValues SaveFormData(List<Dynamic.BE.HR.ManualAttendance> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			resVal = db.SaveUpdateAtt(_UserId, dataColl);

			return resVal;
		}

		public Dynamic.BE.HR.ManualAttendanceCollections GetAllManualAttendance(int EntityId)
		{
			return db.getAllManualAttendance(_UserId, EntityId);
		}
		public Dynamic.BE.HR.ManualAttendance GetManualAttendanceById(int EntityId, int TranId)
		{
			return db.getManualAttendanceById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.HR.ManualAttendance beData, bool IsModify)
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
				else if (beData.UserId == 0 || beData.UserId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select User ";
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

