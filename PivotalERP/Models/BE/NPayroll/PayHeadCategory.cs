using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class PayHeadCategory : ResponeValues
    {
        public int? PayHeadCategoryId { get; set; }
        public int? BranchId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int SNo { get; set; }
        public string Description { get; set; } = "";

        public int? id
        {
            get
            {
                return this.PayHeadCategoryId;
            }
        }
        public string text
        {
            get
            {
                return this.Name;
            }
        }
    }
    public class PayHeadCategoryCollections : System.Collections.Generic.List<PayHeadCategory>
    {
        public PayHeadCategoryCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}