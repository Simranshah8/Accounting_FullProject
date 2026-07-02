using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Designation
	{

		DA.Hospital.DesignationDB db = null;
		
		int _UserId = 0;

		public Designation(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DesignationDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Designation beData)
		{
			bool isModify = beData.DesignationId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DesignationCollections GetAllDesignation(int EntityId)
		{
			return db.getAllDesignation(_UserId, EntityId);
		}
		public BE.Hospital.Designation GetDesignationById(int EntityId, int DesignationId)
		{
			return db.getDesignationById(_UserId, EntityId, DesignationId);
		}
		public ResponeValues DeleteById(int EntityId, int DesignationId)
		{
			return db.DeleteById(_UserId, EntityId, DesignationId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Designation beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DesignationId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DesignationId != 0)
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

