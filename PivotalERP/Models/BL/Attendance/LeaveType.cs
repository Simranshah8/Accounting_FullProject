using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class LeaveType
    {
        DA.Attendance.LeaveTypeDB db = null;
        int _UserId = 0;
        public LeaveType(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.LeaveTypeDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.LeaveType beData)
        {
            bool isModify = beData.LeaveTypeId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.LeaveTypeCollections GetAllLeaveType(int EntityId)
        {
            return db.GetAllLeave(_UserId);
        }
        public BE.Attendance.LeaveType GetLeaveTypeById(int EntityId, int LeaveTypeId)
        {
            return db.getLeaveById(LeaveTypeId, _UserId);
        }
        public ResponeValues DeleteById(int EntityId, int LeaveTypeId)
        {
            return db.DeleteById(_UserId, EntityId, LeaveTypeId);
        }

        public ResponeValues IsValidData(ref BE.Attendance.LeaveType beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.LeaveTypeId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.LeaveTypeId != 0)
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
