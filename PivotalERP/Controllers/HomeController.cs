using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PivotalERP.Controllers
{
    [FilterIp]
    public class HomeController : BaseController
    {
        Dynamic.BusinessLogic.Security.User userBL;
        public HomeController()
        {
            string dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

            userBL = new Dynamic.BusinessLogic.Security.User(hostName, dbName);
        }
        public ActionResult Index()
        {


            var dataColl = new Dynamic.DataAccess.Security.EntityDB(User.HostName, User.DBName).getEntityForWeb(User.UserId);

            return View(dataColl);
        }

        public ActionResult IFIndex()
        {
            return View();
        }
        
        [AllowAnonymous]
        public ActionResult Login(string returnUrl = "")
        {
            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");

            var user = new Dynamic.BusinessEntity.Security.User() { ResponseMSG = returnUrl };
            
            string dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            List<SelectListItem> tmpList = new List<SelectListItem>();
            try
            {
                string companyList = System.Configuration.ConfigurationManager.AppSettings["dbList"].ToString();
                if (!string.IsNullOrEmpty(companyList))
                {
                    string[] valColl = companyList.Split(',');
                    foreach (string str in valColl)
                    {
                        string[] dbSplit = str.Split('=');
                        tmpList.Add(new SelectListItem() { Text = dbSplit[0], Value = dbSplit[1] });                        
                    }
                }
                else
                {
                    tmpList.Add(new SelectListItem() { Text = "Current Year", Value = dbName });                    
                }                
            }
            catch
            {
                tmpList.Add(new SelectListItem() { Text = "Current Year", Value = dbName });                
            }

            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");
            return View(user);
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(Dynamic.BusinessEntity.Security.User beData)
        {
            string dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            else
            {

                beData.PublicIP = GetIp();

                if (!string.IsNullOrEmpty(beData.DBName))
                    dbName = beData.DBName;

                userBL = new Dynamic.BusinessLogic.Security.User(hostName, dbName);
                Dynamic.BusinessEntity.Security.User loginUser = userBL.IsValidUser(beData);

                if (loginUser.IsValid)
                {
                    Dynamic.BusinessEntity.Security.LoginLog lLog = new Dynamic.BusinessEntity.Security.LoginLog();
                    lLog.MacAddress = GetMacAddress(beData.PublicIP);
                    lLog.UserId = loginUser.UserId;
                    lLog.UserName = loginUser.UserName;
                    lLog.LogDateTime = DateTime.Now;
                    lLog.LocalDateTime = DateTime.Now;
                    lLog.AppVersion = System.Reflection.Assembly.GetExecutingAssembly().Location;
                    lLog.InOut = 1;
                    lLog.LastUpdated = DateTime.Now;
                    lLog.PCName = System.Environment.MachineName;
                    lLog.SystemUser = System.Environment.UserName;
                    lLog.LocalIP = LocalIPAddress();
                    lLog.PublicIP = beData.PublicIP;                    
                    loginUser.DBName = dbName;
                    loginUser.HostName = hostName;

                    var resVal= new Dynamic.DataAccess.Global.GlobalDB(loginUser.HostName, loginUser.DBName).SaveLoginLog(lLog);

                    if (resVal.IsSuccess)
                    {
                        SessionContext sessContext = new SessionContext();
                        sessContext.SetAuthenticationToken(loginUser.UserName, false, loginUser);
                        return RedirectToAction("Index", "Home");
                    }else
                    {
                        ModelState.AddModelError("", "Unable To Login Pls Try Again");
                    }
                }
                else
                {
                    ModelState.AddModelError("", loginUser.ResponseMSG);
                }
            }
            
            List<SelectListItem> tmpList = new List<SelectListItem>();
            try
            {
                string companyList = System.Configuration.ConfigurationManager.AppSettings["dbList"].ToString();
                if (!string.IsNullOrEmpty(companyList))
                {
                    string[] valColl = companyList.Split(',');
                    foreach (string str in valColl)
                    {
                        string[] dbSplit = str.Split('=');
                        tmpList.Add(new SelectListItem() { Text = dbSplit[0], Value = dbSplit[1] });
                    }
                }
                else
                {
                    tmpList.Add(new SelectListItem() { Text = "Current Year", Value = dbName });
                }
            }
            catch
            {
                tmpList.Add(new SelectListItem() { Text = "Current Year", Value = dbName });
            }

            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            return View(beData);
        }

        [HttpGet]
        public ActionResult LogOff()
        {
            Dynamic.BusinessEntity.Security.LoginLog lLog = new Dynamic.BusinessEntity.Security.LoginLog();
            lLog.MacAddress = GetMacAddress(User.PublicIP);
            lLog.UserId = User.UserId;
            lLog.UserName = User.UserName;
            lLog.LogDateTime = DateTime.Now;
            lLog.LocalDateTime = DateTime.Now;
            lLog.AppVersion = System.Reflection.Assembly.GetExecutingAssembly().Location;
            lLog.InOut = 2;
            lLog.LastUpdated = DateTime.Now;
            lLog.PCName = System.Environment.MachineName;
            lLog.SystemUser = System.Environment.UserName;
            lLog.LocalIP = LocalIPAddress();
            lLog.PublicIP = User.PublicIP;

            var resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveLoginLog(lLog);

            if(resVal.IsSuccess)
                FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult UnAuthorizeAccess()
        {
            return View();
        }


        //[HttpGet]
        //public JsonNetResult GetDefaultBranch()
        //{
        //    Dynamic.BusinessEntity.Security.Branch defaultBranch = null;
        //    ResponeValues resVal = new ResponeValues();
        //    object dataObj = Session["DefaultBranch" + User.UserId.ToString()];
        //    if (dataObj != null)
        //    {
        //        defaultBranch = DeserializeObject<Dynamic.BusinessEntity.Security.Branch>(dataObj.ToString());

        //        resVal.IsSuccess = true;
        //        resVal.ResponseMSG = "The default branch has been changed.";
        //    }
        //    else
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = "no found default branch";
        //    }
        //    return new JsonNetResult() { Data = defaultBranch, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}



        [HttpGet]

        public JsonNetResult GetDefaultBranch()

        {

            Dynamic.BusinessEntity.Security.Branch defaultBranch = null;

            ResponeValues resVal = new ResponeValues();

            object dataObj = Session["DefaultBranch" + User.UserId.ToString()];

            if (dataObj != null)

            {

                defaultBranch = DeserializeObject<Dynamic.BusinessEntity.Security.Branch>(dataObj.ToString());

                resVal.IsSuccess = true;

                resVal.ResponseMSG = "The default branch has been changed.";

            }

            else

            {

                resVal.IsSuccess = false;

                resVal.ResponseMSG = "no found default branch";

            }

            return new JsonNetResult() { Data = defaultBranch, TotalCount = resVal.IsSuccess ? 1 : 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }


    }
}