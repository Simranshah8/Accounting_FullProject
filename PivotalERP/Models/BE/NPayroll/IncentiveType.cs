using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class IncentiveType : ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int? PayHeadingId { get; set; }
        public int? SNo { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }

    }
    public class IncentiveTypeCollections : System.Collections.Generic.List<IncentiveType>
    {
        public IncentiveTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}