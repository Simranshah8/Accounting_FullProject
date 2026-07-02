using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class CompanyRelationship
	{

        Dynamic.DA.HR.CompanyRelationshipDB db = null;

		int _UserId = 0;

		public CompanyRelationship(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.CompanyRelationshipDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.HR.CompanyRelationship beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.HR.CompanyRelationshipCollections GetAllCompanyRelationship(int EntityId)
		{
			return db.getAllCompanyRelationship(_UserId, EntityId);
		}
		public Dynamic.BE.HR.CompanyRelationship GetCompanyRelationshipById(int EntityId, int TranId)
		{
			return db.getCompanyRelationshipById(_UserId, EntityId, TranId);
		}

		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
        public ResponeValues IsValidData(ref Dynamic.BE.HR.CompanyRelationship beData, bool IsModify)
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
                else if (string.IsNullOrEmpty(beData.FullAddress))
                {
                    resVal.ResponseMSG = "Please ! Enter FullAddress ";
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

