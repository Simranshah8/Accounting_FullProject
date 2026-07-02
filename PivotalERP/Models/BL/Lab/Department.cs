using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Lab
{
    public class Department
    {
		DA.Lab.DepartmentDB db = null;

		int _UserId = 0;

		public Department(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.DepartmentDB(hostName, dbName);
		}
		public BE.Lab.DepartmentCollections GetAllLabDepartment(int EntityId)
		{
			return db.GetAllLabDepartment(_UserId, EntityId);
		}
	}
}