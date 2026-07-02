using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Hospital
{
    public class DoctorAutoComplete  
    {
        public int DoctorId { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string ContactNo { get; set; }
        public string EmailId { get; set; }
    }

    public class DoctorAutoCompleteCollections : System.Collections.Generic.List<DoctorAutoComplete>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }

    }


}
