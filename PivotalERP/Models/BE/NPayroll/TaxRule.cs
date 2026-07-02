using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class TaxRule : ResponeValues
    {
        public int? TaxRuleId { get; set; }
        public int? TaxType { get; set; }
        public int? TaxFor { get; set; }
        public int? CalculationFor { get; set; }
        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }
        public double? Rate { get; set; }
        public string DisplayValue { get; set; }
        public int? PayHeadingId { get; set; }

    }
    public class TaxRuleCollections : System.Collections.Generic.List<TaxRule>
    {
        public TaxRuleCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}