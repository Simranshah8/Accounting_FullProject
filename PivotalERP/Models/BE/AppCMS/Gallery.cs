//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dynamic.BE.AppCMS.Creation
//{
//    public class Gallery : ResponeValues
//    {
//        public Gallery()
//        {
//            Title = "";
//            Description = "";
//            ImageColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
//        }
//        public int? GalleryId { get; set; }
//        public string Title { get; set; }
//        public string Description { get; set; }
//        public int OrderNo { get; set; }
//        public Dynamic.BusinessEntity.GeneralDocumentCollections ImageColl { get; set; }
//    }
//    public class GalleryCollections : List<Gallery>
//    {
//        public GalleryCollections()
//        {
//            ResponseMSG = "";
//        }
//        public string ResponseMSG { get; set; }
//        public bool IsSuccess { get; set; }
//    }
//}