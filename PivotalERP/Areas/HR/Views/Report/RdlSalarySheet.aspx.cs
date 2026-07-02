using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PivotalERP.Areas.HR.Views.Report
{
    public partial class RdlSalarySheet : System.Web.Mvc.ViewPage
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

                int entityId = (int)Dynamic.BusinessEntity.Global.RptFormsEntity.EmployeeSalarySheet;
                int rptTranId = Convert.ToInt32(Request["rptTranId"]);
                PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(user.HostName, user.DBName, user.UserId, entityId, 0, false, rptTranId);
                Dynamic.BusinessEntity.Global.ReportTempletes template = reportTemplate.DefaultTemplate;

                string path = baseurl + template.Path;
                int YearId = Convert.ToInt32(Request["YearId"]);
                int MonthId = Convert.ToInt32(Request["MonthId"]);
                string BranchIdColl = Convert.ToString(Request["BranchIdColl"]);
                string DepartmentIdColl = Convert.ToString(Request["DepartmentIdColl"]);
                string CategoryIdColl = Convert.ToString(Request["CategoryIdColl"]);

                string Branch = Convert.ToString(Request["Branch"]);
                string Department = Convert.ToString(Request["Department"]);
                string Category = Convert.ToString(Request["Category"]);

                int EmployeeId = Convert.ToInt32(Request["EmployeeId"]);
                string EmployeeIdColl = Convert.ToString(Request["EmployeeIdColl"]);
                string CompanyIdColl = Convert.ToString(Request["CompanyIdColl"]);

                string EmpGroupIdColl = "";
                string EmployeeGroup = "";
                try
                {
                    EmpGroupIdColl = Convert.ToString(Request["EmpGroupIdColl"]);
                    EmployeeGroup = Convert.ToString(Request["EmployeeGroup"]);
                }
                catch { }
                
                var comDet = new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).getCompanyBranchDetailsForPrint(user.UserId, entityId, 0, 0);

                System.Collections.Generic.List<Microsoft.Reporting.WebForms.ReportParameter> parameterColl = new List<Microsoft.Reporting.WebForms.ReportParameter>();
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("CompanyName", comDet.CompanyName));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("CompanyAddress", comDet.CompanyAddress));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Branch", Branch));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Department", Department));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Category", Category));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("YearId", YearId.ToString()));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("MonthId", MonthId.ToString()));
                ReportViewer1.LocalReport.EnableExternalImages = true;
                ReportViewer1.LocalReport.ReportPath = Server.MapPath(path);
                ReportViewer1.LocalReport.DataSources.Clear();

                var dataColl = new Dynamic.BL.NPayroll.SalarySheet(user.UserId, user.HostName, user.DBName).getSalarySheet(YearId, MonthId, CompanyIdColl, BranchIdColl, DepartmentIdColl, CategoryIdColl, EmployeeId, EmployeeIdColl, EmpGroupIdColl);

                ReportViewer1.LocalReport.DataSources.Add(new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", dataColl));

                ReportViewer1.LocalReport.SetParameters(parameterColl);

                ReportViewer1.LocalReport.Refresh();
                ReportViewer1.ShowPrintButton = true;
                ReportViewer1.ZoomMode = ZoomMode.PageWidth;

            }
        }
    }
}