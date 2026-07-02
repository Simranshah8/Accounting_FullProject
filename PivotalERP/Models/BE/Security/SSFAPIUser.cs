using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Security
{
    public class SSFAPIUser : ResponeValues
    {
        public string UserName { get; set; } = "";
        public string BaseUrl { get; set; } = "";
        public string Pwd { get; set; } = "";
        public string RemoteUser { get; set; } = "";
        public string Practitioner { get; set; } = "";
        public string PractitionerRole { get; set; } = "";
        public string ServiceProvider { get; set; } = "";
    }
    public class SSFAPIUserCollections : System.Collections.Generic.List<SSFAPIUser>
    {
        public SSFAPIUserCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}