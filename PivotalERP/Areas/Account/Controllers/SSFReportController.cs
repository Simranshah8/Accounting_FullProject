using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Account.Controllers
{
    public class SSFReportController : PivotalERP.Controllers.BaseController
    {
        // GET: Account/SSFReport
        public ActionResult BookingData()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonNetResultWithEnum> GetOnlyBookingDataAsync()
        {
            PivotalERP.SSF.BE.BookingCollections dataColl = new PivotalERP.SSF.BE.BookingCollections();
            try
            {
                dataColl = await new PivotalERP.SSF.BL.Request(User.UserId, User.HostName, User.DBName).GetOnlyBookingDataAsync();
                return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.success = 0;
                dataColl.msg = ee.Message;

            }
            return new JsonNetResultWithEnum() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
    }
}