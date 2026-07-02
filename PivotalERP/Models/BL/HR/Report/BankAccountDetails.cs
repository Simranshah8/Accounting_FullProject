using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.HR.Report
{
    public class BankAccountDetails : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DA.HR.Report.BankAccountDetailsDB db = null;

		int _UserId = 0;

		public BankAccountDetails(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.Report.BankAccountDetailsDB(hostName, dbName);
		}
		public Dynamic.RE.HR.Report.BankAccountDetailsCollections GetBankAccountDetails(string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId)
		{
			return db.GetBankAccountDetails(_UserId, BranchId, DepartmentId, DesignationId, LevelId, EmployeeGroupId,CompanyId);
		}
	}
    
}