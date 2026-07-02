using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PivotalERP.Areas.Service.Views.Reporting
{
    public partial class RDLVH : System.Web.Mvc.ViewPage
    {
        public bool Loaded { get; set; }
        private Dynamic.ReportEntity.Service.VehicleHistory CurrentDataColl = null;
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

                int entityId = (int)Dynamic.BusinessEntity.Global.RptFormsEntity.VehicleHistory;
                int rptTranId = Convert.ToInt32(Request["rptTranId"]);
                PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(user.HostName, user.DBName, user.UserId, entityId, 0, false, rptTranId);
                Dynamic.BusinessEntity.Global.ReportTempletes template = reportTemplate.DefaultTemplate;
                
                string path = baseurl + template.Path;
                int VehicleEntryId = Convert.ToInt32(Request["VehicleEntryId"]);             
                var comDet = new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).getCompanyBranchDetailsForPrint(user.UserId, entityId, 0, 0);

                var dataColl = new Dynamic.Reporting.Service.JobCardList(user.HostName, user.DBName).getVehicleHistory(user.UserId,  VehicleEntryId);
                CurrentDataColl = dataColl;
                System.Collections.Generic.List<Microsoft.Reporting.WebForms.ReportParameter> parameterColl = new List<Microsoft.Reporting.WebForms.ReportParameter>();
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("CompanyName", comDet.CompanyName));
                parameterColl.Add(new Microsoft.Reporting.WebForms.ReportParameter("Address", comDet.CompanyAddress));
                  
                ReportViewer1.LocalReport.EnableExternalImages = true;
                ReportViewer1.LocalReport.ReportPath = Server.MapPath(path);
                ReportViewer1.LocalReport.DataSources.Clear();
                List<Dynamic.ReportEntity.Service.VehicleHistory> dataColl1 = new List<Dynamic.ReportEntity.Service.VehicleHistory>();
                dataColl1.Add(dataColl);
                ReportViewer1.LocalReport.DataSources.Add(new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", dataColl1));
                ReportViewer1.LocalReport.DataSources.Add(new Microsoft.Reporting.WebForms.ReportDataSource("DataSet2", dataColl.JobHistoryCOll));
                ReportViewer1.LocalReport.SetParameters(parameterColl);
                ReportViewer1.LocalReport.SubreportProcessing += LocalReport_SubreportProcessing;
                ReportViewer1.LocalReport.Refresh();
                ReportViewer1.ShowPrintButton = true;
                ReportViewer1.ZoomMode = ZoomMode.PageWidth;

            }
        }

        private void LocalReport_SubreportProcessing(object sender, SubreportProcessingEventArgs e)
        {
            int tranId = Convert.ToInt32(e.Parameters["TranId"].Values[0]);

            try
            {
                if (CurrentDataColl != null)
                {
                    if (e.Parameters["Type"].Values[0] == "C")
                    {
                        var data = CurrentDataColl.JobHistoryCOll.Find(p1 => p1.TranId == tranId);
                        if (data != null)
                        {
                            Microsoft.Reporting.WebForms.ReportDataSource rds = new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", data.ComplainColl);
                            e.DataSources.Add(rds);
                        }
                    }
                    else if (e.Parameters["Type"].Values[0] == "I")
                    {
                        var data = CurrentDataColl.JobHistoryCOll.Find(p1 => p1.TranId == tranId);
                        if (data != null)
                        {
                            Microsoft.Reporting.WebForms.ReportDataSource rds = new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", data.InspectionCOll);
                            e.DataSources.Add(rds);
                        }
                    }
                    else if (e.Parameters["Type"].Values[0] == "P")
                    {
                        var data = CurrentDataColl.JobHistoryCOll.Find(p1 => p1.TranId == tranId);
                        if (data != null)
                        {
                            Microsoft.Reporting.WebForms.ReportDataSource rds = new Microsoft.Reporting.WebForms.ReportDataSource("DataSet1", data.PartsColl);
                            e.DataSources.Add(rds);
                        }
                    }
                } 

            }
            catch (Exception ee)
            {
               // GlobalFunction.ShowErrorMessage(GlobalFunction.ExceptionInfo(ee));
            }
        }
    }
}