using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class ProductInOutType: ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public bool IsActive { get; set; }
        public int? BDId { get; set; }
    }
    public class ProductInOutTypeCollection: System.Collections.Generic.List<ProductInOutType>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}