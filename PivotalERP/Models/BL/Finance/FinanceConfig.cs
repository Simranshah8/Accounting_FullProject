using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Finance
{
    public class FinanceConfig
    {
        DA.Finance.FinanceConfigDB db = null;
        int _UserId = 0;
        public FinanceConfig(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Finance.FinanceConfigDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Finance.FinanceConfig beData)
        {
            return db.SaveUpdate(beData);
        }
        public BE.Finance.FinanceConfig GetConfiguuration(int EntityId)
        {
            return db.getConfiguuration(_UserId, EntityId);
        }


    }
}
