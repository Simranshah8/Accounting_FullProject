using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class BedMapping  
	{ 

		DA.Hospital.BedMappingDB db = null;

		int _UserId = 0;

		public BedMapping(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.BedMappingDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.BedMapping beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.BedMappingCollections GetAllBedMapping(int EntityId)
		{
			return db.getAllBedMapping(_UserId, EntityId);
		}
		public BE.Hospital.BedMapping GetBedMappingById(int EntityId, int TranId)
		{
			return db.getBedMappingById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.BedMapping beData, bool IsModify)
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
			else if (beData.BuildingTypeId==0 || beData.BuildingTypeId.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select BuildingType ";
			}
			else if (beData.FloorId==0 || beData.FloorId.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select Floor ";
			}
			else if (beData.WardId==0 || beData.WardId.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select Ward ";
			}
			else if (beData.RoomId==0 || beData.RoomId.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select Room ";
			}
			else if (beData.NoOfBed==0 || beData.NoOfBed.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select NoOfBed ";
			}
			else if (beData.StartNo==0 || beData.StartNo.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select StartNo ";
			}
			else if (beData.EndNo==0 || beData.EndNo.HasValue==false)
			{
				resVal.ResponseMSG = "Please ! Select EndNo ";
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

