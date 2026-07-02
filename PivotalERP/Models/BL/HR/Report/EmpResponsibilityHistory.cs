using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.HR.Report
{
    public class EmpResponsibilityHistory
    {
		DA.HR.Report.EmpResponsibilityHistoryDB db = null;

		int _UserId = 0;

		public EmpResponsibilityHistory(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.HR.Report.EmpResponsibilityHistoryDB(hostName, dbName);
		}

		public RE.HR.Report.EmpResponsibilityHistoryCollections GetAllEmpResponsibilityHistory(int EntityId,int? EmployeeId)
		{
			return db.getAllEmpResponsibilityHistory(_UserId, EntityId, EmployeeId);
		}
	}
}