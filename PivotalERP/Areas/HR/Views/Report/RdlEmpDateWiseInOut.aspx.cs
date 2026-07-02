using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PivotalERP.Areas.HR.Controllers
{
    public partial class RdlEmpDateWiseInOut : System.Web.Mvc.ViewPage
    {
        public bool Loaded { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            var urlHelper = new System.Web.Mvc.UrlHelper(Html.ViewContext.RequestContext);

            var baseurl = urlHelper.Content("~");

            if (!this.IsPostBack && !Loaded)
            {
                Loaded = true;
                Dynamic.BusinessEntity.Security.User user = (Dynamic.BusinessEntity.Security.User)User;
                ReportViewer1.KeepSessionAlive = false;
                ReportViewer1.AsyncRendering = false;
                ReportViewer1.ProcessingMode = ProcessingMode.Local;

                int entityId = (int)Dynamic.BusinessEntity.Global.RptFormsEntity.Att_InOutDetails;
                int rptTranId = Convert.ToInt32(Request["rptTranId"]);
                PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(user.HostName, user.DBName, user.UserId, entityId, 0, false, rptTranId);
                Dynamic.BusinessEntity.Global.ReportTempletes template = reportTemplate.DefaultTemplate;

                //string path = baseurl + @"Report\Exam\Tabulation\RptTabulation.rdlc";
                string path = baseurl + template.Path;
               

                DateTime dateFrom = Convert.ToDateTime(Request["dateFrom"]);
                DateTime dateTo = Convert.ToDateTime(Request["dateTo"]);
                string dateFromBS = Convert.ToString(Request["dateFromBS"]);
                string dateToBS = Convert.ToString(Request["dateToBS"]);
                string period = Convert.ToString(Request["period"]);

                string BranchIdColl, DepartmentIdColl, DesignationIdColl, LevelIdColl,CompanyIdColl;
                BranchIdColl = Convert.ToString(Request["BranchIdColl"]);
                DepartmentIdColl = Convert.ToString(Request["DepartmentIdColl"]);
                DesignationIdColl = Convert.ToString(Request["DesignationIdColl"]);
                LevelIdColl = Convert.ToString(Request["LevelIdColl"]);
                CompanyIdColl = Convert.ToString(Request["CompanyIdColl"]);

                var comDet = new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).getCompanyBranchDetailsForPrint(user.UserId, entityId, 0, 0);

                System.Collections.Generic.List<Microsoft.Reporting.WebForms.ReportParameter> parameterColl = new List<Microsoft.Reporting.WebForms.ReportParameter>();
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("CompanyName", comDet.CompanyName));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Address", comDet.CompanyAddress));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Period", period));                
                ReportViewer1.LocalReport.EnableExternalImages = true;
                ReportViewer1.LocalReport.ReportPath = Server.MapPath(path);
                ReportViewer1.LocalReport.DataSources.Clear();


                int totalAb = 0;
                double totalWH = 0;
                var dataColl = new Dynamic.BL.Attendance.Device(user.UserId, user.HostName, user.DBName).getEmployeeWiseAttendance(null, dateFrom, dateTo, null, null,BranchIdColl,DepartmentIdColl,DesignationIdColl,LevelIdColl,CompanyIdColl,false, ref totalAb, ref totalWH);
                 
               // ReportViewer1.backgr
                ReportViewer1.LocalReport.DataSources.Add(new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", dataColl)); 
                ReportViewer1.LocalReport.SetParameters(parameterColl);
                ReportViewer1.LocalReport.Refresh();
                ReportViewer1.ShowPrintButton = true;
                ReportViewer1.ZoomMode = ZoomMode.PageWidth;

            }
        }
    }
}