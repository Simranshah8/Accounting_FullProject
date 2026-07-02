using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Security
{
    public class AllowUserWiseLevel : ResponeValues
    {
        public int LevelId { get; set; }

        public string Name { get; set; }

        public bool IsAllow { get; set; }

        public bool ForTransaction { get; set; }

        public bool ForReporting { get; set; }

        public int UserId { get; set; }

        public string Branch { get; set; }
    }
    public class AllowUserWiseLevelCollections : System.Collections.Generic.List<AllowUserWiseLevel>
    {
        public AllowUserWiseLevelCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}