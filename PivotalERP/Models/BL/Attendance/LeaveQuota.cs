using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class LeaveQuota
    {
        DA.Attendance.LeaveQuotaDB db = null;
        int _UserId = 0;
        public LeaveQuota(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.LeaveQuotaDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.LeaveQuota beData)
        {
            bool isModify = beData.LeaveQuotaId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.LeaveQuotaCollections GetAllLeaveQuota(int EntityId)
        {
            return db.getAllLeaveQuota(_UserId);
        }
        public ResponeValues DeleteById(int EntityId, int LeaveQuotaId)
        {
            return db.DeleteById(_UserId, EntityId, LeaveQuotaId);
        }
        public BE.Attendance.LeaveQuota getLeaveQuotaById(int LeaveQuotaId)
        {
            return db.getLeaveQuotaById(_UserId, LeaveQuotaId);
        }

        public RE.Leave.LeaveQuotaSummaryCollections getLeaveBalanceSummary( string BranchIdColl, string DepartmentIdColl, string CategoryIdColl, int? EmployeeId, int? PeriodId,int? LeaveTypeId,int? ForUserId)
        {
            return db.getLeaveBalanceSummary(_UserId, BranchIdColl, DepartmentIdColl, CategoryIdColl, EmployeeId, PeriodId,LeaveTypeId,ForUserId);
        }
        public ResponeValues IsValidData(ref BE.Attendance.LeaveQuota beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.LeaveQuotaId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.LeaveQuotaId != 0)
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
