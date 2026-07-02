using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Ethinicity
	{

		DA.Hospital.EthinicityDB db = null;

		int _UserId = 0;

		public Ethinicity(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.EthinicityDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Ethinicity beData)
		{
			bool isModify = beData.EthinicityId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.EthinicityCollections GetAllEthinicity(int EntityId)
		{
			return db.getAllEthinicity(_UserId, EntityId);
		}
		public BE.Hospital.Ethinicity GetEthinicityById(int EntityId, int EthinicityId)
		{
			return db.getEthinicityById(_UserId, EntityId, EthinicityId);
		}
		public ResponeValues DeleteById(int EntityId, int EthinicityId)
		{
			return db.DeleteById(_UserId, EntityId, EthinicityId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Ethinicity beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.EthinicityId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.EthinicityId != 0)
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

