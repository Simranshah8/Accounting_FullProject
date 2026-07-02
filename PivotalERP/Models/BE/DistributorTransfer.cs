using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE
{
    public class DistributorTransfer : ResponeValues
    {
        public int? FromLedgerId { get; set; }
        public int? ToLedgerId { get; set; }
        public string Code { get; set; }
    }
   
}