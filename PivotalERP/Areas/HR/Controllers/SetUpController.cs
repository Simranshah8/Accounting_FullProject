using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.HR.Controllers
{
    public class SetUpController : PivotalERP.Controllers.BaseController
    {
        // GET: HR/SetUp
        public ActionResult Configuration()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult SaveEmployeeConfiguration()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.HR.Setup.ConfigurationEmployee>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.HR.Setup.ConfigurationEmployee(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEmployeeConfiguration()
        {
            var dataColl = new Dynamic.BL.HR.Setup.ConfigurationEmployee(User.UserId, User.HostName, User.DBName).GetConfiguuration(0);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

    }
}