using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class PayHeading : ResponeValues
    {
        public PayHeading()
        {
            PayHeadingDetailsColl = new List<PayHeadingDetails>();
            PayHeadingTaxExemptionColl = new List<PayHeadingTaxExemption>();
        }
        public int? PayHeadingId { get; set; }
        public int? BranchId { get; set; }
        public string Name { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public string Code { get; set; } = "";
        public int SNo { get; set; }
        public int? PayheadType { get; set; }
        public int? Natures { get; set; }
        public int? MonthId { get; set; }
        public int? CalculationType { get; set; }
        public int? LedgerId { get; set; }
        public int PayHeadGroupId { get; set; }
        public int PayHeadCategoryId { get; set; }
        public int? CalculationOnHeading { get; set; }
        public new string Formula { get; set; } = "";
        public bool IsTaxable { get; set; }
        public bool IsActive { get; set; }
        public string PayheadGroupName { get; set; } = "";
        public string PayHeadType { get; set; } = "";
        public int? SNoSD { get; set; }
        public bool IsSalaryDetail { get; set; }
        public bool IsSalarySheet { get; set; }
        public int? LedgerOnId { get; set; }
        //Add by Prashnt Chaitra 17
        public bool IsPaySlip { get; set; }
        public List<PayHeadingDetails> PayHeadingDetailsColl { get; set; }
        public List<PayHeadingTaxExemption> PayHeadingTaxExemptionColl { get; set; }

        public int? TaxRuleAs { get; set; }

        public int? id
        {
            get
            {
                return this.PayHeadingId;
            }
        }
        public string text
        {
            get
            {
                return this.Name;
            }
        }

        public int? AttendanceTypeId { get; set; }
        public bool? IsIncentive { get; set; }
        public string LedgerName { get; set; } = "";
        public string LedgerGroup { get; set; } = "";
        public string NaturesName { get; set; } = "";
        public string CalculationTypeName { get; set; } = "";
    }
    public class PayHeadingCollections : System.Collections.Generic.List<PayHeading>
    {
        public PayHeadingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class PayHeadingDetails
    {
        public int PayHeadingId { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public double MinAmount { get; set; }
        public double MaxAmount { get; set; }
        public double Rate { get; set; }
        public double FixedAmount { get; set; }
        public string Formula { get; set; } = "";
        public int? LevelId { get; set; }
    }

    public class PayHeadingTaxExemption
    {
        public int PayHeadingId { get; set; }
        public int? GenderId { get; set; }
        public int? MaritalStatusId { get; set; }
        public int? ResidentId { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        public string Formula { get; set; } = "";
        public int? LevelId { get; set; } 
    }

    public class BranchForPayHeading : ResponeValues
    {
        public int? BranchId { get; set; }
        public string Name { get; set; }
    }
    public class BranchForPayHeadingCollections : System.Collections.Generic.List<BranchForPayHeading>
    {
        public BranchForPayHeadingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class CategoryForPayHeading : ResponeValues
    {
        public int? CategoryId { get; set; }
        public string Name { get; set; }
    }
    public class CategoryForPayHeadingCollections : System.Collections.Generic.List<CategoryForPayHeading>
    {
        public CategoryForPayHeadingCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}