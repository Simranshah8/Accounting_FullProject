using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR.Report
{

	public class EmployeeSummary : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.HR.Report.EmployeeSummaryDB db = null;

		int _UserId = 0;

		public EmployeeSummary(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.Report.EmployeeSummaryDB(hostName, dbName);
		}
		public Dynamic.RE.HR.Report.EmployeeSummaryCollections getEmployeeSummary(DateTime? JoinDateFrom, DateTime? JoinDateTo, DateTime? PermanentDateFrom, DateTime? PermanentDateTo, DateTime? RetireDateFrom, DateTime? RetireDateTo, string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId)
		{
			return db.getEmployeeSummary(_UserId, JoinDateFrom, JoinDateTo , PermanentDateFrom, PermanentDateTo, RetireDateFrom, RetireDateTo, BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId,CompanyId);
		}
	}

}

