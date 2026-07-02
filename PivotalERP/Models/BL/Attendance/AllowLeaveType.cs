using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Attendance
{
    public class AllowLeaveType
    {
        DA.Attendance.AllowLeaveTypeDB db = null;
        int _UserId = 0;
        public AllowLeaveType(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.AllowLeaveTypeDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Attendance.AllowLeaveTypeCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            resVal = db.UpdateAllowLeaveType(_UserId, dataColl);

            return resVal;
        }

        public Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections getAllAllowLeaveType(int EntityId, int? BranchId, int? DepartmentId, int? DesignationId, int? LevelId, int? EmployeeGroupId, int? CompanyRelationshipId = null)
        {
            return db.getAllAllowLeaveType(_UserId, EntityId, BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId, CompanyRelationshipId);
        }
        //Add by prashtn Baishak 09
        public Dynamic.BE.Attendance.EmployeeForAllowLeaveTypeCollections GetLeaveTypeByEmployee(int UsersId)
        {
            return db.GetLeaveTypeByEmployee(_UserId, UsersId);
        }


    }
}