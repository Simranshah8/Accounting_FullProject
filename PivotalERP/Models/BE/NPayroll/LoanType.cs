using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class LoanType : ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int? PayHeadingId { get; set; }
        public int? SerialNo { get; set; }
        public string Description { get; set; }
        public string PayHeadingName { get; set; }

        public int? id
        {
            get
            {
                return this.TranId;
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
    public class LoanTypeCollections : System.Collections.Generic.List<LoanType>
    {
        public LoanTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}