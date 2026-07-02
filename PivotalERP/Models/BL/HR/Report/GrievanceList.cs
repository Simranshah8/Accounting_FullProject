using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR.Report
{

    public class GrievanceList
    {

        DA.HR.Report.GrievanceListDB db = null;

        int _UserId = 0;

        public GrievanceList(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.HR.Report.GrievanceListDB(hostName, dbName);
        }

        public RE.HR.Report.GrievanceListCollections GetGrievanceList(int EntityId, DateTime? DateFrom, DateTime? DateTo, int? DepartmentId, int? ForUserId, int? GrievanceTypeId, int? StatusId)
        {
            return db.GetGrievanceList(_UserId, EntityId, DateFrom, DateTo, DepartmentId, ForUserId, GrievanceTypeId, StatusId);
        }

    }

}

