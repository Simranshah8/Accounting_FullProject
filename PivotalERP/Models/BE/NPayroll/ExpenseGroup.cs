using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class ExpenseGroup : ResponeValues
    {
        public int? TranId { get; set; }
        public string Name { get; set; }
        public int? SNO { get; set; }
        public int? NoOfCategory { get; set; }
        public string Description { get; set; }
    }

    public class ExpenseGroupCollections : System.Collections.Generic.List<ExpenseGroup>
    {
        public ExpenseGroupCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}