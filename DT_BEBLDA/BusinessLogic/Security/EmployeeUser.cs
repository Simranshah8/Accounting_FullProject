using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BusinessLogic.Security
{
    public class EmployeeUser
    {

        DataAccess.Security.EmployeeUserDB db = null;

        int _UserId = 0;

        public EmployeeUser(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DataAccess.Security.EmployeeUserDB(hostName, dbName);
        }

        public ResponeValues UpdateUserWiseActive(Dynamic.BusinessEntity.Security.User beData)
        {
            bool isModify = beData.UserId > 0;
            return db.UpdateUserWiseActive( beData, isModify);
        }
    }
}
