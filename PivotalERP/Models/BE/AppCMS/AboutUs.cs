//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//   public class AboutUs : ResponeValues
//    {
//        public AboutUs()
//        {
//            ImagePath = "";
//            BannerPath = "";
//            Content = "";
//            LogoPath = "";
//        }
//        public int? AboutUsId { get; set; }        
//        public string LogoPath { get; set; }        
//        public string ImagePath { get; set; }        
//        public string BannerPath { get; set; }
//        public string Content { get; set; }        
//    }
//    public class AboutUsCollections : List<AboutUs> 
//    {
//        public AboutUsCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}