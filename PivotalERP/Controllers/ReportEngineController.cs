using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Controllers
{
    public class ReportEngineController : BaseController
    {
        public ActionResult SelectReportTemplate(int EntityId)
        {

            return View();
        }

        [HttpGet]
        public JsonNetResult GetReportTemplates(int entityId,int voucherId,bool isTran)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                Dynamic.BusinessEntity.Global.ReportTempletesAttachmentsCollections dataColl = new Dynamic.DataAccess.Global.ReportTempletesDB(User.HostName, User.DBName, isTran).getReportTempletesForSelection(User.UserId, entityId, voucherId, isTran);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS};
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

    }
}