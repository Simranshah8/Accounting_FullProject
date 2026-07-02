using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Inventory.Transaction
{
    public class FixedUnit
    {
        DA.Inventory.Transaction.FixedUnitDB db = null;
        int _UserId = 0;
        public FixedUnit(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Inventory.Transaction.FixedUnitDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BusinessEntity.Inventory.Transaction.FixedUnit beData)
        {
            return db.SaveUpdate(_UserId,beData);
        }
        public BusinessEntity.Inventory.Transaction.FixedUnit GetFixedUnit()
        {
            return db.getFixedUnit(_UserId);
        }


    }
}
