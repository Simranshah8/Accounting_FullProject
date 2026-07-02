using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class LeaveRequest
    {
        DA.Attendance.LeaveRequestDB db = null;
        int _UserId = 0;
        public LeaveRequest(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.LeaveRequestDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.LeaveRequest beData)
        {
            bool isModify = beData.LeaveRequestId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public ResponeValues SaveFromApp(Dynamic.API.Attendance.LeaveRequest beData)
        {
            return db.SaveFromApp(beData);
        }
            public BE.Attendance.LeaveRequestCollections GetAllLeaveRequest(int EntityId)
        {
            return db.GetAllLeaveRequest(_UserId);
        }
        public BE.Attendance.LeaveRequest GetLeaveRequestById(int EntityId, int LeaveRequestId)
        {
            return db.getLeaveRequestById(_UserId, LeaveRequestId);
        }
        public ResponeValues DeleteById(int EntityId, int LeaveRequestId)
        {
            return db.DeleteById(_UserId,EntityId, LeaveRequestId);
        }
        public Dynamic.RE.Attendance.EmpLeaveRequestCollections getEmpLeaveRequestLst(DateTime? dateFrom, DateTime? dateTo, int LeaveStatus,int? ForUserId,int EmployeeOrSalesman,bool forApproval)
        {
            return db.getEmpLeaveRequestLst(_UserId, dateFrom, dateTo, LeaveStatus, ForUserId, EmployeeOrSalesman, forApproval);
        }
       
            public ResponeValues LeaveApproved(Dynamic.API.Attendance.LeaveApprove beData)
        {
            return db.LeaveApproved(beData);
        }

            public ResponeValues IsValidData(ref BE.Attendance.LeaveRequest beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.LeaveRequestId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.LeaveRequestId != 0)
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
