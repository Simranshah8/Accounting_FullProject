using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{

	public class DischargeSlip  
	{ 

		DA.DischargeSlipDB db = null;

		int _UserId = 0;

		public DischargeSlip(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.DischargeSlipDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.DischargeSlip beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.DischargeSlipCollections GetAllDischargeSlip(int EntityId)
		{
			return db.getAllDischargeSlip(_UserId, EntityId);
		}
		public BE.DischargeSlip GetDischargeSlipById(int EntityId, int TranId)
		{
			return db.getDischargeSlipById(_UserId, EntityId, TranId);
		}

		public BE.PatientDetails GetPatientDetailById( int PatientId)
		{
			return db.getPatientDetailById(_UserId, PatientId);
		}

		public BE.DischargeSlipDetailsPrint GetDischargeSlipPrint(int EntityId, int TranId)
		{
			return db.getDischargeSlipPrint(_UserId, EntityId, TranId);
		}

		public ResponeValues GetAutoDischargeNo(int EntityId)
		{
			return db.GetAutoDischargeNo(_UserId, EntityId);
		}

		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.DischargeSlip beData, bool IsModify)
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

