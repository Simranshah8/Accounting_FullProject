using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Security
{
    public class AllowUserWiseServiceType : ResponeValues
    {
        public int ServiceTypeId { get; set; }

        public string Name { get; set; }

        public bool IsAllow { get; set; }

        public bool ForTransaction { get; set; }

        public bool ForReporting { get; set; }

        public int UserId { get; set; }

        public string Branch { get; set; }
    }
    public class AllowUserWiseServiceTypeCollections : System.Collections.Generic.List<AllowUserWiseServiceType>
    {
        public AllowUserWiseServiceTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}