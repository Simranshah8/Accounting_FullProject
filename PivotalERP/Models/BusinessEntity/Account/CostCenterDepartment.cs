using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessEntity.Account
{
    public class CostCenterDepartment : MasterClass
    {
        public int SNo { get; set; }
        public int CostCenterDepartmentId { get; set; }      
        public int? LedgerId { get; set; }
        public string LedgerName { get; set; }
        public CostCenterDepartment()
        {
            CCDepartmentWisePayHeadLedgerColl = new CCDepartmentWisePayHeadLedgerCollection();

        }
        public CCDepartmentWisePayHeadLedgerCollection CCDepartmentWisePayHeadLedgerColl { get; set; }
    }
    public class CostCenterDepartmentCollections : System.Collections.Generic.List<CostCenterDepartment>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class CCDepartmentWisePayHeadLedger
    {
        public int? CostCenterDepartmentId { get; set; }
        public int? PayHeadingId { get; set; }
        public int? LedgerId { get; set; }
    }
    public class CCDepartmentWisePayHeadLedgerCollection : List<CCDepartmentWisePayHeadLedger>
    {
        public CCDepartmentWisePayHeadLedgerCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
