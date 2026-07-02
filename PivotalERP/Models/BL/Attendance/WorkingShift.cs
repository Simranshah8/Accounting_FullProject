using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class WorkingShift 
    {
        DA.Attendance.WorkingShiftDB db = null;
        int _UserId = 0;
        public WorkingShift(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.WorkingShiftDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.WorkingShift beData)
        {
            bool isModify = beData.WorkingShiftId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.WorkingShiftCollections getAllWorkingShift()
        {
            return db.getAllWorkingShift(_UserId);
        }
        public BE.Attendance.WorkingShift getWorkingShiftById(int WorkingShiftId )
        {
            return db.getWorkingShiftById(WorkingShiftId, _UserId);
        }
            public ResponeValues DeleteById(int EntityId, int DeviceId)
        {
            return db.DeleteById(_UserId, EntityId, DeviceId);
        }
      
        public ResponeValues IsValidData(ref BE.Attendance.WorkingShift beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.WorkingShiftId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.WorkingShiftId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = "Please ! Enter Shift Name";
                }
                if (!beData.OnDutyTime.HasValue || beData.OnDutyTime.Value.Year < 1900)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Please ! Enter On Duty Time";
                    return resVal;
                }
                if (!beData.OffDutyTime.HasValue || beData.OffDutyTime.Value.Year < 1900)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Please ! Enter Off Duty Time";
                    return resVal;
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
