//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class Videos : ResponeValues
//    {
//        public Videos()
//        {
//            Title = "";
//            Description = "";
//            AddUrl = "";
//            AttachFilePath = "";
//            Content = "";
//            UrlColl = new List<string>();
//        }
//        public int? VideosId { get; set; }
//        public string Title { get; set; }
//        public string Description { get; set; }
//        public string AddUrl { get; set; }
//        public string AttachFilePath { get; set; }
//        public int OrderNo { get; set; }
//        public string Content { get; set; }

//        public List<string> UrlColl
//        {
//            get; set;
//        }
//    }
//    public class VideosCollections : List<Videos>
//    {
//        public VideosCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}