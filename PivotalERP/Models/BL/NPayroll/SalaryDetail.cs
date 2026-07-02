using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class SalaryDetail
    {
        DA.NPayroll.SalaryDetailDB db = null;
        int _UserId = 0;
        public SalaryDetail(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.SalaryDetailDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.SalaryDetailCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            foreach(var beData in dataColl)
            {
                if (beData.YearId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Year to save Salary Detail ";
                    return resVal;
                }

                if (beData.MonthId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Month to save Salary Detail ";
                    return resVal;
                }

                

            }
           
            resVal = db.UpdateSalaryDetail(_UserId, dataColl);

            return resVal;
        }

        public Dynamic.BE.NPayroll.EmployeeForSalaryDetailCollections GetAllSalaryDetail(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int YearId, int MonthId, int? CompanyRelationshipId)
        {
            return db.getAllSalaryDetail(_UserId, EntityId, BranchId, DepartmentId, CategoryId,YearId,MonthId, CompanyRelationshipId);
        }

        public ResponeValues DeleteSalaryDetail(int EntityId, int BranchId,int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            return db.DeleteSalaryDetail(_UserId, EntityId, BranchId, DepartmentId,CategoryId,YearId,MonthId);
        }

        public ResponeValues DeleteById(int EntityId, int EmployeeId, int YearId, int MonthId)
        {
            return db.DeleteById(_UserId, EntityId, EmployeeId, YearId, MonthId);
        }
    }
}