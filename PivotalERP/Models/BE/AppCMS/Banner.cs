//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class Banner : ResponeValues
//    {
//        public Banner()
//        {
//            Title = "";
//            ImagePath = "";
//            Description = "";
//        }
//        public int? BannerId { get; set; }
//        public string Title { get; set; }
//        public string ImagePath { get; set; }
//        public DateTime? PublishOn { get; set; }
//        public DateTime? ValidUpTo { get; set; }
//        public string PublishOn_BS { get; set; }
//        public string ValidUpTo_BS { get; set; }
//        public bool DisplayEachTime { get; set; }
//        public string Description { get; set; }
//        public int OrderNo { get; set; }
//    }
//    public class BannerCollections : System.Collections.Generic.List<Banner>
//    {
//        public BannerCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}
