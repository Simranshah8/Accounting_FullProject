//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class ExecutiveMembers: ResponeValues
//    {
//        public ExecutiveMembers()
//        {
//            FullName = "";
//            Designation = "";
//            Contact = "";
//            Email = "";
//            Message = "";
//            ImagePath = "";
//        }
//        public int? TranId { get; set; }
//        public string FullName { get; set; }
//        public string Designation { get; set; }
//        public string Contact { get; set; }
//        public string Email { get; set; }
//        public string Message { get; set; }        
//        public string ImagePath { get; set; }
//    }
//    public class ExecutiveMembersCollections : List<ExecutiveMembers> 
//    {
//        public ExecutiveMembersCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}