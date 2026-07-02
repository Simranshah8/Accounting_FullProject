using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.AppCMS.Creation
{
    public class NepaliCalendar
    {
        public NepaliCalendar()
        {
            BlankDaysColl = new List<string>();
            EventColl = new List<EventSummary>();
        }
        public int MonthId { get; set; }
        public string MonthName { get; set; }
        public int DaysInMonth { get; set; }
        public int StartDayId { get; set; }
        public List<string> BlankDaysColl { get; set; }
        public IEnumerable<AcademicCalendar> DataColl { get; set; }
        public List<EventSummary> EventColl { get; set; }
    }
    public class AcademicCalendar
    {
        public AcademicCalendar()
        {
            EventColl = new List<EventSummary>();
            IsWeekend = false;
            WeekendColorCode = "";
        }
        public DateTime AD_Date { get; set; }
        public string BS_Date { get; set; }
        public int NY { get; set; }
        public int NM { get; set; }
        public int ND { get; set; }
        public int DayId { get; set; }
        public int StartDayId { get; set; }
        public int DaysInMonth { get; set; }
        public string MonthName { get; set; }

        public bool IsWeekend { get; set; }
        public string WeekendColorCode { get; set; }
        public List<EventSummary> EventColl { get; set; }

    }

    public class AcademicCalendarCollections : System.Collections.Generic.List<AcademicCalendar>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class EventSummary
    {
        public int EventHolidayId { get; set; }
        public DateTime ForDate { get; set; }
        public int NY { get; set; }
        public int NM { get; set; }
        public int ND { get; set; }
        public string EventType { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ColorCode { get; set; }
        public DateTime FromDate_AD { get; set; }
        public DateTime ToDate_AD { get; set; }
        public string FromDate_BS { get; set; }
        public string ToDate_BS { get; set; }
        public string ImagePath { get; set; }
        public string ForClass { get; set; }
        public string AtTime { get; set; }
        public string ForBranch { get; set; }
        public string ForDepartment { get; set; }
        public string ForDesignation { get; set; }
        public string ForServiceType { get; set; }
        public string ForEmployee { get; set; }
        public string ForGender { get; set; }
        public string ForReligion { get; set; }
    }

    public class Weekend : ResponeValues
    {
        public int DayId { get; set; }
        public string ColorCode { get; set; }
        public bool IsChecked { get; set; }
    }
    public class WeekendCollections : System.Collections.Generic.List<Weekend>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
