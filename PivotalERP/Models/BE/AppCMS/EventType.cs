using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.AppCMS.Creation
{
    public class EventType : ResponeValues
    {
        public int? EventTypeId { get; set; }
        public int EType { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ColorCode { get; set; }
        public string ImagePath { get; set; }
    }
    public class EventTypeCollections : System.Collections.Generic.List<EventType>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
