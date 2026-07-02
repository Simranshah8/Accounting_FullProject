using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class AdvanceType : ResponeValues
    {
        public int? TranId { get; set; }
        public int? BranchId { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int PayHeadingId { get; set; }
        public int SNO { get; set; }
        public string Description { get; set; } = "";
        public string PayHeading { get; set; } = "";

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

    public class AdvanceTypeCollections : System.Collections.Generic.List<AdvanceType>
    {
        public AdvanceTypeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}