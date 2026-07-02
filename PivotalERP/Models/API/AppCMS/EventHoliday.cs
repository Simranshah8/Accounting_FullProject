using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.API.AppCMS
{
    public class EventHoliday
    {
        public EventHoliday()
        {
            HolidayEvent = "";
            EventType = "";
            Name = "";
            Description = "";
            FromDate_BS = "";
            ToDate_BS = "";
            ForClass = "";
            ImagePath = "";
            ColorCode = "";
            Remaining = "";
        }
        public string HolidayEvent { get; set; }
        public string EventType { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime FromDate_AD { get; set; }
        public DateTime ToDate_AD { get; set; }
        public string FromDate_BS { get; set; }
        public string ToDate_BS { get; set; }
        public string ForClass { get; set; }
        public string ColorCode { get; set; }
        public string ImagePath { get; set; }

        public string Remaining { get; set; }
        public string AtTime { get; set; }
    }
    public class EventHolidayCollections : System.Collections.Generic.List<EventHoliday>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }

    }
}
