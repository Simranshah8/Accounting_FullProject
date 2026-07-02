using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class MachineLog
    {
        DA.Attendance.MachineLogDB db = null;
        int _UserId = 0;
        public MachineLog(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.MachineLogDB(hostName, dbName);
        }
        public BE.Attendance.MachineLogCollections getMachineLog(DateTime? DateFrom, DateTime? DateTo)
        {
            return db.getMachineLog(_UserId, DateFrom, DateTo);
        }
    }
}
