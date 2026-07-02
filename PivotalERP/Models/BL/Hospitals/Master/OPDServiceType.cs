using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class OPDServiceType
	{

		DA.Hospital.OPDServiceTypeDB db = null;

		int _UserId = 0;

		public OPDServiceType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.OPDServiceTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.OPDServiceType beData)
		{
			bool isModify = beData.OPDServiceTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.OPDServiceTypeCollections GetAllOPDServiceType(int EntityId)
		{
			return db.getAllOPDServiceType(_UserId, EntityId);
		}
		public BE.Hospital.OPDServiceType GetOPDServiceTypeById(int EntityId, int OPDServiceTypeId)
		{
			return db.getOPDServiceTypeById(_UserId, EntityId, OPDServiceTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int OPDServiceTypeId)
		{
			return db.DeleteById(_UserId, EntityId, OPDServiceTypeId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.OPDServiceType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.OPDServiceTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.OPDServiceTypeId != 0)
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
				else if (beData.ForTran == 0 || beData.ForTran.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select ForTran ";
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

