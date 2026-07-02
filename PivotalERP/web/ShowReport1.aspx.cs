using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Dynamic.ReportEngine.RdlAsp;
using System.Data.SQLite;
using System.Data;

namespace WebSMS
{
 
    public partial class ShowReport : System.Web.UI.Page
    {

        public RdlReport _Report { get; set; }        
        public bool error {get; set;}

        public bool Name { get; set; }

        public ShowReport()
        {
            _Report = new RdlReport();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            string entityid = Request.QueryString["rs:entityid"];
            string FirstRun = Request.QueryString["rs:FirstRun"];
          
	        string arg = Request.QueryString["rs:Format"];
            bool isExcel = false;

            if(arg=="xlsx")
            {
                isExcel = true;
                arg = "html";
            }

            if (arg != null)
            {
                _Report.RenderType = arg;
            }
            else
            {
                _Report.RenderType = "html";
            }            

            int eid = 0;
            int.TryParse(entityid, out eid);

            Dynamic.Accounting.IReportLoadObjectData reportData = new Main().GetReport(eid);
            _Report.iReportLoadObjectData = reportData;
            _Report.ReportFile = "../"+reportData.ReportPath;
            _Report.NoShow = true;

            Response.AppendHeader("content-disposition", "attachment; filename=file."+(isExcel ? "xlsx" : arg));

	        switch (_Report.RenderType)
	        {
		        case "xml":
		
                    if (_Report.Xml == null)
                    {
                        error = true; 
                    }
                    else
                    {	
			        Response.ContentType = "application/xml";
			        Response.Write(_Report.Xml);
                    }
			        break;
		        case "pdf":
                    if (_Report.Object == null)
                    {
                        error = true;
                    }
                    else
                    { 
			        Response.ContentType = "application/pdf";
			        Response.BinaryWrite(_Report.Object);
                    }			
			        break;
                case "csv":
          
                    if (_Report.CSV == null)
                    {
                        error = true;
                    }
                    else
                    {  
                    Response.ContentType = "text/plain";
                    Response.Write(_Report.CSV);
                    }
                    break;                
                case "html":
                    {
                        if (isExcel)
                        {
                            if (_Report.Html == null)
                            {
                                error = true;
                            }
                            else
                            {
                                string css = "";
                                if (_Report.CSS != null)
                                    css = "<style type=text/css>" + _Report.CSS + "</style>"; ;

                                string js = "";
                                if (_Report.JavaScript != null)
                                    js = "<script>" + _Report.JavaScript + "</script>";


                                string ht = js + "\n" + css + "\n" + _Report.Html;

                                Response.ContentType = "application/excel";
                                Response.Write(ht);
                                Response.Flush();
                                Response.Close();
                                Response.End();
                            }

                        }else
                        {
                            if (_Report.Html == null)
                            {
                                error = true;
                            }
                            else
                            {
                                string css = "";
                                if (_Report.CSS != null)
                                    css = "<style type=text/css>" + _Report.CSS + "</style>"; ;

                                string js = "";
                                if (_Report.JavaScript != null)
                                    js = "<script>" + _Report.JavaScript + "</script>";


                                string ht = js + "\n" + css + "\n" + _Report.Html;

                                Response.ContentType = "text/html";
                                Response.Write(ht);
                            }                      
                        }
                       
                    }
                    break;
		        default:
			        break;
	        }
        }

        public string Meta
        {
            get
            {
                if (_Report.ReportFile == "statistics")
                    return "<meta http-equiv=\"Refresh\" contents=\"10\"/>";
                else
                    return "";
            }
        }
    }
}