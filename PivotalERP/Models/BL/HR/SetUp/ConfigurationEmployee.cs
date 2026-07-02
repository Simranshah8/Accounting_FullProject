using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.HR.Setup
{
    public class ConfigurationEmployee
    {
        DA.HR.Setup.ConfigurationEmployeeDB db = null;
        int _UserId = 0;
        public ConfigurationEmployee(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.HR.Setup.ConfigurationEmployeeDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.HR.Setup.ConfigurationEmployee beData)
        {
            return db.SaveUpdate(beData);
        }
        public BE.HR.Setup.ConfigurationEmployee GetConfiguuration(int EntityId)
        {
            return db.getConfiguuration(_UserId, EntityId);
        }


    }
}
