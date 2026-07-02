using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Security
{
    public class AllowUserWiseDepartment : ResponeValues
    {
        public int DepartmentId { get; set; }

        public string Name { get; set; }

        public bool IsAllow { get; set; }

        public bool ForTransaction { get; set; }

        public bool ForReporting { get; set; }

        public int UserId { get; set; }

        public string Branch { get; set; }
    }
    public class AllowUserWiseDepartmentCollections : System.Collections.Generic.List<AllowUserWiseDepartment>
    {
        public AllowUserWiseDepartmentCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}