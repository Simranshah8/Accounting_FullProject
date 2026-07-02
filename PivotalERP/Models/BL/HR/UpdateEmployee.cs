using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.HR
{
    public class UpdateEmployee
    {
        Dynamic.DA.HR.UpdateEmployeeDB db = null;

        int _UserId = 0;

        public UpdateEmployee(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new Dynamic.DA.HR.UpdateEmployeeDB(hostName, dbName);
        }
        public Dynamic.RE.HR.UpdateEmpCollections getEmployeeListForupdate(int? BranchId, int? CompanyRelationId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
        {
            return db.getEmployeeForUpdate(_UserId, BranchId, CompanyRelationId, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
        }

        public ResponeValues UpdateEmployeeData(List<RE.HR.UpdateEmployee> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            int row = 1;
            foreach (var dc in dataColl)
            {
                if (string.IsNullOrEmpty(dc.EmployeeCode))
                {
                    resVal.ResponseMSG = "Please ! Enter Employee Code. at row " + row.ToString();
                    return resVal;
                }

                if (string.IsNullOrEmpty(dc.FirstName))
                {
                    resVal.ResponseMSG = "Please ! Enter First Name at row " + row.ToString();
                    return resVal;
                }

                row++;
            }

            return db.UpdateEmployee(_UserId, dataColl);
        }
    }
}