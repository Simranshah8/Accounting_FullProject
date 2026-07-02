using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Diagnosis
	{

		DA.Hospital.DiagnosisDB db = null;

		int _UserId = 0;

		public Diagnosis(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DiagnosisDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Diagnosis beData)
		{
			bool isModify = beData.DiagnosisId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DiagnosisCollections GetAllDiagnosis(int EntityId)
		{
			return db.getAllDiagnosis(_UserId, EntityId);
		}
		public BE.Hospital.Diagnosis GetDiagnosisById(int EntityId, int DiagnosisId)
		{
			return db.getDiagnosisById(_UserId, EntityId, DiagnosisId);
		}
		public ResponeValues DeleteById(int EntityId, int DiagnosisId)
		{
			return db.DeleteById(_UserId, EntityId, DiagnosisId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.Diagnosis beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DiagnosisId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DiagnosisId != 0)
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

