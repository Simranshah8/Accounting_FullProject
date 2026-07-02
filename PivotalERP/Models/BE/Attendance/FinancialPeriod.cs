using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class FinancialPeriod : ResponeValues
    {
        public int? PeriodId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate_AD { get; set; }
        public DateTime EndDate_AD { get; set; }
        public string StartDate_BS { get; set; }
        public string EndDate_BS { get; set; }
    }
    public class FinancialPeriodCollections : System.Collections.Generic.List<FinancialPeriod>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
