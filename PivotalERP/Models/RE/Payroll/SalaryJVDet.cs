using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace AcademicLib.RE.Payroll
{

    public class LedgerSJV : ResponeValues
    {       
        public int? LedgerId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public double? DrAmount { get; set; }
        public double? CrAmount { get; set; }
        public int DrCr { get; set; }
        public string PayHeadColl { get; set; }
        public string LedgerGroup { get; set; }

    }

    public class LedgerSJVCollections : List<LedgerSJV>
    {
        public LedgerSJVCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
    public class PayHeadSJV : ResponeValues
    {
        public int? LedgerId { get; set; }       
        public string LedgerName { get; set; }
        public string LedgerCode { get; set; }
        public string PayHeading { get; set; }
        public double? DrAmount { get; set; }
        public double? CrAmount { get; set; }
        public string PayHeadGroup { get; set; }
        public string LedgerGroup { get; set; }
        public string PayHeadType { get; set; }
    }

    public class PayHeadSJVCollections : List<PayHeadSJV>
    {
        public PayHeadSJVCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }

}
