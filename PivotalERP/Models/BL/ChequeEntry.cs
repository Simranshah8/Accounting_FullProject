using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class ChequeEntry
    {
        DA.ChequeEntryDB db = null;
        int _UserId = 0;
        public ChequeEntry(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.ChequeEntryDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.ChequeEntry beData)
        {
            bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.ChequeEntryCollections GetAllChequeEntry(int EntityId)
        {
            return db.getAllChequeEntry(_UserId, EntityId);
        }

        public BE.ChequeEntry GetChequeEntryById(int EntityId, int ChequeEntryId)
        {
            return db.getChequeEntryById(_UserId, EntityId, ChequeEntryId);
        }
        public ResponeValues DeleteById(int EntityId, int ChequeEntryId)
        {
            return db.DeleteById(_UserId, EntityId, ChequeEntryId);
        }
        public ResponeValues IsValidData(ref BE.ChequeEntry beData, bool IsModify)
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
                else if (string.IsNullOrEmpty(beData.ChequeName))
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
