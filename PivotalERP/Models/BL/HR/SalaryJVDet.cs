using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BL.Payroll
{
    public class SalaryJVDet
    {
        DA.Payroll.SalaryJVDetDB db = null;
        int _UserId = 0;
        public SalaryJVDet(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Payroll.SalaryJVDetDB(hostName, dbName);
        }

        public (AcademicLib.RE.Payroll.LedgerSJVCollections, AcademicLib.RE.Payroll.PayHeadSJVCollections) GetSalaryJVDet(int YearId, int MonthId)
        {
            return db.GetSalaryJV(_UserId, YearId, MonthId);
        }
    }
}