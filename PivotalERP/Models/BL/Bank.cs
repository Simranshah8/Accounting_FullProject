using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class Bank
    {
        DA.BankDB db = null;
        int _UserId = 0;
        public Bank(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.BankDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Bank beData)
        {
            bool isModify = beData.BankId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.BankCollections GetAllBank(int EntityId)
        {
            return db.getAllBank(_UserId, EntityId);
        }

        public BE.Bank GetBankById(int EntityId, int BankId)
        {
            return db.getBankById(_UserId, EntityId, BankId);
        }
        public ResponeValues DeleteById(int EntityId, int BankId)
        {
            return db.DeleteById(_UserId, EntityId, BankId);
        }
        public ResponeValues IsValidData(ref BE.Bank beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.BankId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.BankId != 0)
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
