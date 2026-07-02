using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.AppCMS.Creation
{
    public class Notice: ResponeValues
    {
        public Notice()
        {
            HeadLine = "";
            Description = "";
            ImagePath = "";
            Content = "";
            NoticeDate_BS = "";
            PublishOn_BS = "";
            ValidUpto_BS = "";
            AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
        }
        public int? NoticeId { get; set; }
        public string HeadLine { get; set; }
        public string Description { get; set; }
        public DateTime NoticeDate { get; set; }
        public DateTime? PublishOn { get; set; }
        public DateTime? PublishTime { get; set; }
        public DateTime? ValidUpto { get; set; }
        public int OrderNo { get; set; }        
        public string ImagePath { get; set; }
        public string Content { get; set; }       
        
        public string NoticeDate_BS { get; set; }
        public string PublishOn_BS { get; set; }
        public string ValidUpto_BS { get; set; }
        public string CompanyIds { get; set; }
        public string BranchIds { get; set; }
        public string DepartmentIds { get; set; }

        public Dynamic.BusinessEntity.GeneralDocumentCollections AttachmentColl { get; set; }
    }
    public class NoticeCollections : List<Notice> 
    {
        public NoticeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
  
}