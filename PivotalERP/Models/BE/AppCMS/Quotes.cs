//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class Quotes : ResponeValues
//    {
//        public int? QuotesId { get; set; }
//        public string Title { get; set; }
//        public DateTime? ForDate { get; set; }
//        public bool ForStudent { get; set; }
//        public bool ForTeacher { get; set; }
//        public bool ForAdmin { get; set; }
//        public string ImagePath { get; set; }
//        public string ForDate_BS { get; set; }
//        public string For
//        {
//            get
//            {
//                string val = "";

//                if (ForStudent)
//                    val = "Student";

//                if(ForTeacher)
//                {
//                    if (!string.IsNullOrEmpty(val))
//                        val = val + "/";

//                    val = val + "Teacher";
//                }

//                if (ForAdmin)
//                {
//                    if (!string.IsNullOrEmpty(val))
//                        val = val + "/";

//                    val = val + "Admin";
//                }

//                return val;
//            }
//        }
//    }
//    public class QuotesCollections : System.Collections.Generic.List<Quotes>
//    {
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }

//    }
//}
