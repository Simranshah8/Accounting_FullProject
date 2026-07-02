using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

using System.Runtime.Serialization;
using System.IO;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;

namespace WebSMS
{
    public partial class ReportViewer : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
            LiteralOtherLinks.Text = "";

           // try
           // {

                //object entityid = Request.QueryString.Get("entityid");
                //if (entityid != null)
                //{
                  //  int eid = 0;
                   // int.TryParse(entityid.ToString(), out eid);
                    //if (eid != 0)
                   // {
                      //  StringBuilder sb = new StringBuilder();
                      //  sb.Append(string.Format("<a href=\"ShowReport.aspx?rs:entityid={0}&rs:Format=xml\" target=_self  onclick=\"document.execCommand('SaveAs',true,'file.xml');\">XML</a> | ", eid));
                      //  sb.Append(string.Format("<a href=\"ShowReport.aspx?rs:entityid={0}&rs:Format=csv\" target=_self  onclick=\"document.execCommand('SaveAs',true,'file.csv');\">CSV</a> | ", eid));
                      //  sb.Append(string.Format("<a href=\"ShowReport.aspx?rs:entityid={0}&rs:Format=xlsx\" target=_self  onclick=\"document.execCommand('SaveAs',true,'file.xls');\">EXCEL</a> | ", eid));
                      //  sb.Append(string.Format("<a href=\"ShowReport.aspx?rs:entityid={0}&rs:Format=html\" target=_self onclick=\"document.execCommand('SaveAs',true,'file.html');\">HTML</a>", eid));
                        //                       LiteralOtherLinks.Text = sb.ToString();
                    //}
              //  }


          //  catch (Exception)
         //   {

         //   }
            
        }
    }
}