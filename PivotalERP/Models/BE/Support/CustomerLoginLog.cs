using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Support
{
    public class CustomerLoginLog
    {
        public string CustomerCode { get; set; }
        public string UrlName { get; set; }
        public int? CustomerId { get; set; }
        public string UserName { get; set; }
        public string LoginIP { get; set; }
        public DateTime LoginAt { get; set; }
        public string LoginFrom { get; set; }
        public string DBServer { get; set; }
        public string DBName { get; set; }
        public int? Api_NoOfStudent { get; set; }
        public int? Api_NoOfEmp { get; set; }
        public int? Api_NoOfBranch { get; set; }
        public int? Api_NoOfUser { get; set; }
    }
}
