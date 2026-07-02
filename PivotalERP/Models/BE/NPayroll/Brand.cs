using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class Brand : ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int? SNo { get; set; }
        public string Description { get; set; }

    }
    public class BrandCollections : System.Collections.Generic.List<Brand>
    {
        public BrandCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}