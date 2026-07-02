//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class StaffHierarchy : ResponeValues
//    {
//        public StaffHierarchy()
//        {
//            FullName = "";
//            Designation = "";
//            ContactNo = "";
//            Email = "";
//            Message = "";
//            ImagePath = "";
//            Department = "";
//            Qualification = "";
//        }
//        public int? StaffHierarchyId { get; set; }
//        public string FullName { get; set; }
//        public string Designation { get; set; }
//        public string ContactNo { get; set; }
//        public string Email { get; set; }
//        public string Message { get; set; }
//        public string ImagePath { get; set; }
//        public string Department { get; set; }
//        public int OrderNo { get; set; }

//        public string Qualification { get; set; }

//    }
//    public class StaffHierarchyCollections : System.Collections.Generic.List<StaffHierarchy>
//    {
//        public StaffHierarchyCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}
