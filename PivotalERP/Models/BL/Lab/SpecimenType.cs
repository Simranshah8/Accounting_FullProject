using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class SpecimenType
	{

		DA.Lab.SpecimenTypeDB db = null;

		int _UserId = 0;

		public SpecimenType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.SpecimenTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.SpecimenType beData)
		{
			bool isModify = beData.SpecimenTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.SpecimenTypeCollections GetAllSpecimenType(int EntityId)
		{
			return db.GetAllSpecimenType(_UserId, EntityId);
		}
		public BE.Lab.SpecimenType GetSpecimenTypeById(int EntityId, int SpecimenTypeId)
		{
			return db.GetSpecimenTypeById(_UserId, EntityId, SpecimenTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int SpecimenTypeId)
		{
			return db.DeleteById(_UserId, EntityId, SpecimenTypeId);
		}
		public ResponeValues IsValidData(ref BE.Lab.SpecimenType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.SpecimenTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.SpecimenTypeId != 0)
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
                else if (beData.CategoryId == 0 || beData.CategoryId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Category ";
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

