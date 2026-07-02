using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.AppCMS.Creation
{
    public class NepaliMonth
    {
        public int NM { get; set; }
        public string Name { get; set; }
        public int SNo { get; set; }
    }
    public class NepaliMonthCollections : System.Collections.Generic.List<NepaliMonth>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
