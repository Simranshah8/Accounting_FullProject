using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class BankAccount
    {
        DA.BankAccountDB db = null;
        int _UserId = 0;
        public BankAccount(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.BankAccountDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.BankAccount beData)
        {
            bool isModify = beData.BankAccountId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.BankAccountCollections GetAllBankAccount(int EntityId)
        {
            return db.getAllBankAccount(_UserId, EntityId);
        }

        public BE.BankAccount GetBankAccountById(int EntityId, int BankAccountId)
        {
            return db.getBankAccountById(_UserId, EntityId, BankAccountId);
        }
        public ResponeValues DeleteById(int EntityId, int BankAccountId)
        {
            return db.DeleteById(_UserId, EntityId, BankAccountId);
        }
        public ResponeValues IsValidData(ref BE.BankAccount beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.BankAccountId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.BankAccountId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.BranchName))
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
