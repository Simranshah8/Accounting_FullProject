using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.AppCMS.Creation
{
    public class EventHoliday : ResponeValues
    {
        public int? EventHolidayId { get; set; }
        public int EventTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime? AtTime { get; set; }
        public string ApplicableForClass { get; set; }
        public string Branch { get; set; }
        public string DepartmentId { get; set; }
        public string DesignationId { get; set; }
        public string ServiceTypeId { get; set; }
        public string GenderId { get; set; }
        public string Employee { get; set; }
        public string Religion { get; set; }
        public string Company { get; set; } //Added by simran
    }

    public class EventHolidayCollections : System.Collections.Generic.List<EventHoliday>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
