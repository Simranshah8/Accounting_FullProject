using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{
    public class DashboardDVGrp
    {
        DA.DashboardDVGrpDB db = null;
        int _UserId = 0;
        public DashboardDVGrp(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.DashboardDVGrpDB(hostName, dbName);
        }       

        public BE.DashboardDVGrp GetDashboardDVGrpById(int EntityId, int DashboardDVGrpId)
        {
            return db.getDashboardDVGrpById(_UserId, EntityId, DashboardDVGrpId);
        }       
       
    }
}
