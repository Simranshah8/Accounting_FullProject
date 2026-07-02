using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class AgentNumbering
    {
        DA.AgentNumberingDB db = null;
        int _UserId = 0;
        public AgentNumbering(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AgentNumberingDB(hostName, dbName);
        }
        public ResponeValues SaveUpdate(BE.AgentNumberingCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();


            resVal = db.SaveUpdate(_UserId, dataColl);

            return resVal;
        }
        //public BE.AgentNumberingCollections GetAllAgentNumbering(int EntityId)
        //{
        //    return db.getAllAgentNumbering(_UserId, EntityId);
        //}


    }
}
