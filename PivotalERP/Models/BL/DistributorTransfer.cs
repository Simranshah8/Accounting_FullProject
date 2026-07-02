using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL
{
    public class DistributorTransfer
    {
        DA.DistributorTransferDB db = null;
        int _UserId = 0;
        public DistributorTransfer(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.DistributorTransferDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(Dynamic.BE.DistributorTransfer beData)
        {
            return db.SaveUpdate(beData); 
        }




    }
}