using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class AllowPayHeading
    {
        DA.NPayroll.AllowPayHeadingDB db = null;
        int _UserId = 0;
        public AllowPayHeading(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.AllowPayHeadingDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.AllowPayHeadingCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            resVal = db.UpdateAllowPayHeading(_UserId, dataColl);

            return resVal;
        }

        public Dynamic.BE.NPayroll.EmployeeForAllowPayHeadingCollections GetAllAllowPayHeading(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId,int? CompanyRelationshipId)
        {
            return db.getAllAllowPayHeading(_UserId, EntityId, BranchId,DepartmentId,CategoryId, CompanyRelationshipId);
        }

		
	}
}