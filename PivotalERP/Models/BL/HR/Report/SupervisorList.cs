using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.HR.Report
{
    public class SupervisorList
    {
        DA.HR.Report.SupervisorListDB db = null;
        int _UserId = 0;
        public SupervisorList(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.HR.Report.SupervisorListDB(hostName, dbName);
        }
        public Dynamic.RE.HR.Report.SupervisorListCollections GetSupervisorList(int EntityId, int? BranchId, int? DepartmentId, int? DesignationId,int? CompanyRelationshipId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100)
        {
            return db.GetSupervisorList(_UserId, EntityId, BranchId, DepartmentId, DesignationId, CompanyRelationshipId, ref TotalRows, PageNumber, RowsOfPage);
        }
    }
}