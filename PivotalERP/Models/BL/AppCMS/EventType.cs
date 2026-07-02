using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.AppCMS.Creation
{
    public class EventType
    {
        DA.AppCMS.Creation.EventTypeDB db = null;
        int _UserId = 0;

        public EventType(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AppCMS.Creation.EventTypeDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.AppCMS.Creation.EventType beData)
        {
            bool isModify = beData.EventTypeId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.AppCMS.Creation.EventTypeCollections GetAllEventType(int EntityId, string BranchCode)
        {
            return db.getAllEventType(_UserId, EntityId,BranchCode);
        }
        public BE.AppCMS.Creation.EventType GetEventTypeById(int EntityId, int EventTypeId)
        {
            return db.getEventTypeById(_UserId, EntityId, EventTypeId);
        }
        public ResponeValues DeleteById(int EntityId, int EventTypeId)
        {
            return db.DeleteById(_UserId, EntityId, EventTypeId);
        }
        public ResponeValues IsValidData(ref BE.AppCMS.Creation.EventType beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.EventTypeId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.EventTypeId != 0)
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
                else if (string.IsNullOrEmpty(beData.ColorCode))
                {
                    resVal.ResponseMSG = "Please ! Select Color";
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
