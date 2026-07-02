using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using Dynamic.ReportEngine.RdlAsp;

namespace WebSMS
{
    /// <summary>
    /// Summary description for newpdfviewer
    /// </summary>
    public class newpdfviewer : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
                
        public RdlReport _Report { get; set; }

        public bool error { get; set; }

        public static Dynamic.Accounting.IReportLoadObjectData reportData = null;
        public static string DBName = string.Empty;

        protected NameValueCollection GetObjectAsKeyVal(object obj)
        {
            NameValueCollection nvColl = new NameValueCollection();
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select new
                             {
                                 Key = p.Name,
                                 Value = p.GetValue(obj, null).ToString()
                             };

            foreach (var v in properties)
            {
                nvColl.Add(v.Key, v.Value);
            }
            return nvColl;
        }
        public void ProcessRequest(HttpContext context)
        {
            Dynamic.BusinessEntity.Security.User user = (Dynamic.BusinessEntity.Security.User)context.Request.RequestContext.HttpContext.User;
            Dynamic.Accounting.GlobalObject.ConnectionString = new Dynamic.DataAccess.Global.DataAccessLayer1(user.HostName, user.DBName).ConnectionString;
            string domainPath = context.Request.Url.GetLeftPart(UriPartial.Authority);// AppDomain.CurrentDomain.BaseDirectory;
                                                                                      // Dynamic.Accounting.GlobalObject.FolderPath = domainPath;

            int entityId = 0,voucherId=0,vouchetype=0,tranid=0;
            int rptTranId = 0;
            bool istransaction =false;
            var queryStrColl = context.Request.QueryString;
            if (queryStrColl != null)
            {
                var keyColl = queryStrColl.AllKeys.ToList();
                if (keyColl.Contains("entityid"))
                    int.TryParse(queryStrColl.Get("entityid"), out entityId);

                if (keyColl.Contains("istransaction"))
                    bool.TryParse(queryStrColl.Get("istransaction"), out istransaction);

                if (keyColl.Contains("voucherid"))
                    int.TryParse(queryStrColl.Get("voucherid"), out voucherId);

                if (keyColl.Contains("vouchertype"))
                    int.TryParse(queryStrColl.Get("vouchertype"), out vouchetype);

                if (keyColl.Contains("tranid"))
                    int.TryParse(queryStrColl.Get("tranid"), out tranid);

                if (keyColl.Contains("rpttranid"))
                    int.TryParse(queryStrColl.Get("rpttranid"), out rptTranId);

            }
            var comDet = new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).getCompanyBranchDetailsForPrint(user.UserId, entityId, vouchetype, tranid);
            if (comDet.IsSuccess)
            {
                System.Collections.Specialized.NameValueCollection paraColl = GetObjectAsKeyVal(comDet);
                paraColl.Add("UserId", user.UserId.ToString());
                paraColl.Add("TranId", tranid.ToString());
                paraColl.Add("UserName", user.UserName);

                PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(user.HostName, user.DBName, user.UserId, entityId, voucherId, istransaction,rptTranId);
                Dynamic.BusinessEntity.Global.ReportTempletes template = reportTemplate.DefaultTemplate;

                _Report = new RdlReport(paraColl);
                _Report.iReportLoadObjectData = reportData;
                _Report.RenderType = "pdf";

                var urlHelper = new System.Web.Mvc.UrlHelper(context.Request.RequestContext);
                var baseurl = urlHelper.Content("~");

                _Report.ReportFile = reportTemplate.GetPath(template);
                _Report.NoShow = true;

                if (_Report.Object == null)
                {
                    //error = true;
                    context.Response.ContentType = "application/pdf;charset=UTF-8";
                    context.Response.AddHeader("Content-Disposition", "inline;attachment; filename=\"document.pdf\"");
                    string str = "";
                    foreach (var err in _Report.Errors)
                    {
                        str = str + err.ToString() + "\n";
                    }
                    str = str.Replace("'", "");
                    using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
                    {
                        //creating a sample Document
                        //iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4, 30f, 30f, 30f, 30f);
                        //iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, ms);
                        //doc.Open();
                        //doc.Add(new iTextSharp.text.Chunk(str));
                        //doc.Close();
                        //byte[] result = ms.ToArray();
                        //context.Response.BinaryWrite(result);
                    }
                    context.Response.End();
                }
                else
                {

                    if (tranid > 0)
                    {
                        Dynamic.BusinessEntity.Global.AuditLogReport printLog = new Dynamic.BusinessEntity.Global.AuditLogReport();
                        printLog.ReportAction = Dynamic.BusinessEntity.Global.ReportActions.PRINT;
                        printLog.MacAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? context.Request.UserHostAddress;
                        printLog.PCName = "Web User";
                        printLog.UserName = user.UserName;
                        printLog.UserId = user.UserId;
                        printLog.TranId = tranid;
                        printLog.EntityId = entityId;
                        printLog.AutoManualNo = tranid.ToString();
                        printLog.SystemUser = user.UserName;
                        printLog.EntityName = ((Dynamic.BusinessEntity.Global.FormsEntity)entityId).ToString();
                        printLog.LogDate = DateTime.Now;
                        printLog.LogText = "Printed";
                        new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).SaveTransactionPrintAuditLog(printLog);
                    }

                    context.Response.ContentType = "application/pdf;charset=UTF-8";
                    context.Response.AddHeader("Content-Disposition", "inline;attachment; filename=\"document.pdf\"");
                    context.Response.BinaryWrite(_Report.Object);
                    context.Response.End();
                }
            }
           


        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}