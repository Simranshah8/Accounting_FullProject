using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class BankGroup
    {
        DA.BankGroupDB db = null;
        int _UserId = 0;
        public BankGroup(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.BankGroupDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.BankGroup beData)
        {
            bool isModify = beData.BankGroupId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.BankGroupCollections GetAllBankGroup(int EntityId)
        {
            return db.getAllBankGroup(_UserId, EntityId);
        }

        public BE.BankGroup GetBankGroupById(int EntityId, int BankGroupId)
        {
            return db.getBankGroupById(_UserId, EntityId, BankGroupId);
        }
        public ResponeValues DeleteById(int EntityId, int BankGroupId)
        {
            return db.DeleteById(_UserId, EntityId, BankGroupId);
        }
        public ResponeValues IsValidData(ref BE.BankGroup beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.BankGroupId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.BankGroupId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = "Please ! Enter  Name";
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
