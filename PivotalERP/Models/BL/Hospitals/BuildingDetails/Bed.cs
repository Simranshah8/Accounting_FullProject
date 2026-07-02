using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Bed  
	{ 

		DA.Hospital.BedDB db = null;

		int _UserId = 0;

		public Bed(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.BedDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Bed beData)
		{
			bool isModify = beData.BedId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.BedCollections GetAllBed(int EntityId)
		{
			return db.getAllBed(_UserId, EntityId);
		}
		public BE.Hospital.Bed GetBedById(int EntityId, int BedId)
		{
			return db.getBedById(_UserId, EntityId, BedId);
		}
		public ResponeValues DeleteById(int EntityId, int BedId)
		{
			return db.DeleteById(_UserId, EntityId, BedId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Bed beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.BedId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.BedId != 0)
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

