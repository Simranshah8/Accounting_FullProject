using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.NPayroll
{
    public class IncentiveSheet
    {
        DA.NPayroll.IncentiveSheetDB db = null;
        int _UserId = 0;
        public IncentiveSheet(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.IncentiveSheetDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.IncentiveSheetCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            resVal = db.SaveIncentiveSheet(_UserId, dataColl);
            return resVal;
        }

        public Dynamic.BE.NPayroll.IncentiveSheetCollections getAllIncentiveSheet( int EntityId, int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            return db.getAllIncentiveSheet(_UserId, EntityId, CompanyRelationshipId, BranchId, DepartmentId, ProductBrandId, IncentiveDate);
        }

        public ResponeValues DeleteIncentiveSheet(int? UsersId, int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            return db.DeleteIncentiveSheet(_UserId, UsersId, CompanyRelationshipId, BranchId, DepartmentId, ProductBrandId, IncentiveDate);
        }

        public Dynamic.BE.NPayroll.IncentiveSheetCollections GetAllIncentiveList()
        {
            return db.GetAllIncentiveList(_UserId);
        }

    }
}