using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class GrievanceType
	{

		DA.HR.GrievanceTypeDB db = null;

		int _UserId = 0;

		public GrievanceType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.HR.GrievanceTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.HR.GrievanceType beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.HR.GrievanceTypeCollections GetAllGrievanceType(int EntityId)
		{
			return db.getAllGrievanceType(_UserId, EntityId);
		}
		public BE.HR.GrievanceTypeCollections GetActiveGrievanceType(int EntityId)
		{
			return db.GetActiveGrievanceType(_UserId, EntityId);
		}
		public BE.HR.GrievanceType GetGrievanceTypeById(int EntityId, int TranId)
		{
			return db.getGrievanceTypeById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.HR.GrievanceType beData, bool IsModify)
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

