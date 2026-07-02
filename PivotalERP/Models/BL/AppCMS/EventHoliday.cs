using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.AppCMS.Creation
{
    public class EventHoliday
    {
        DA.AppCMS.Creation.EventHolidayDB db = null;
        int _UserId = 0;

        public EventHoliday(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AppCMS.Creation.EventHolidayDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.AppCMS.Creation.EventHoliday beData)
        {
            bool isModify = beData.EventHolidayId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.AppCMS.Creation.EventHolidayCollections GetAllEventHoliday(int EntityId, string BranchCode)
        {
            return db.getAllEventHoliday(_UserId, EntityId,BranchCode);
        }
        public BE.AppCMS.Creation.EventHoliday GetEventHolidayById(int EntityId, int EventHolidayId)
        {
            return db.getEventHolidayById(_UserId, EntityId, EventHolidayId);
        }
        public ResponeValues DeleteById(int EntityId, int EventHolidayId)
        {
            return db.DeleteById(_UserId, EntityId, EventHolidayId);
        }
        public ResponeValues SaveWeekend(Dynamic.BE.AppCMS.Creation.WeekendCollections dataColl)
        {
            return db.SaveWeekend(_UserId, dataColl);
        }
        public Dynamic.BE.AppCMS.Creation.WeekendCollections getWeekend(string BranchCode)
        {
            return db.getWeekend(_UserId,BranchCode);
        }
            public ResponeValues IsValidData(ref BE.AppCMS.Creation.EventHoliday beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.EventHolidayId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.EventHolidayId != 0)
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
                else if (beData.EventTypeId==0)
                {
                    resVal.ResponseMSG = "Please ! Select Holiday/Event Type";
                }
                if (string.IsNullOrEmpty(beData.Branch) && string.IsNullOrEmpty(beData.DepartmentId) &&
                    string.IsNullOrEmpty(beData.DesignationId) && string.IsNullOrEmpty(beData.ServiceTypeId) &&
                    string.IsNullOrEmpty(beData.GenderId) && string.IsNullOrEmpty(beData.Employee) &&
                    string.IsNullOrEmpty(beData.Religion) && string.IsNullOrEmpty(beData.Company))
                {
                    resVal.ResponseMSG = "Please! Select at least one value for Branch, Department, Designation, ServiceType, Gender, Employee, Religion, or Company.";
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
