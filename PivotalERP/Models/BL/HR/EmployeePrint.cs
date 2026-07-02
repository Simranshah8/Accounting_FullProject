using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class EmployeePrint
	{

		Dynamic.DA.HR.EmployeePrintDB db = null;

		int _UserId = 0;

		public EmployeePrint(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.EmployeePrintDB(hostName, dbName);
		}
		
		public Dynamic.BE.HR.EmployeePrint GetEmployeePrintById(int EntityId, int EmpLeftTypeId)
		{
			return db.getEmployeePrintById(_UserId, EntityId, EmpLeftTypeId);
		}
	}

}

