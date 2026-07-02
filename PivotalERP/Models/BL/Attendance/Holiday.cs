using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class Holiday
    {
        DA.Attendance.HolidayDB db = null;
        int _UserId = 0;
        public Holiday(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.HolidayDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.Holiday beData)
        {
            bool isModify = beData.HolidayId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.HolidayCollections GetAllHoliday()
        {
            return db.getAllHoliday(_UserId);
        }
        public ResponeValues DeleteById(int EntityId, int HolidayId)
        {
            return db.DeleteById(_UserId, EntityId, HolidayId);
        }
        public BE.Attendance.Holiday getHolidayById(int HolidayId)
        {
            return db.getHolidayById(_UserId, HolidayId);
        }

        public ResponeValues IsValidData(ref BE.Attendance.Holiday beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.HolidayId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.HolidayId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
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
