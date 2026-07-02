using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{
	public class labTest : ResponeValues
	{
		public int LabTestId { get; set; }
		public string TestName { get; set; } = "";
		public string TestCode { get; set; } = "";
		public string Alias { get; set; } = "";
		public string ReportPrintName { get; set; } = "";
		public int? LabCategoryId { get; set; }
		public int? OrderPriorityId { get; set; }
		public string DefaultSpecimen { get; set; } = "";
		public int? DefaultMethodId { get; set; }
		public int? DefaultContainerId { get; set; }
		public string TAT { get; set; } = "";
		public double Charge { get; set; }
		public int? DisplaySequence { get; set; }
		public string LONIC { get; set; } = "";
		public int? ReportTemplateId { get; set; }
		public bool IsProfileTest { get; set; }
		public string ProfileMemberTestId { get; set; } = "";
		public bool IsActive { get; set; }
		public bool IsOutSources { get; set; }
		public string Interpretation { get; set; } = "";
		public labTest()
		{
			LabComponentsColl = new LabComponentsCollections();
		}
		public LabComponentsCollections LabComponentsColl { get; set; }

		public int? DepartmentId { get; set; }
		public bool ApplyTax { get; set; }
		public bool IncludeTax { get; set; }
		public bool CanChangeRate { get; set; }
		public double DiscountUpToPer { get; set; }
		public bool AllowDiscount { get; set; }
		public double SSFCharge { get; set; }
		public double SSFPer { get; set; }
		public int? CostCenterId { get; set; }
		public int? ProductId { get; set; }
		public int? LedgerId { get; set; }
		public int? ForGender { get; set; }
        public bool? IsIncentiveApplicable { get; set; }
        public bool? IsPathology { get; set; }
        public bool? IsRadiology { get; set; }
        public int? id
		{
			get
			{
				return this.LabTestId;
			}
		}
		public string text
		{
			get
			{
				return this.TestName;
			}
		}
	}
	public class labTestCollections : System.Collections.Generic.List<labTest>
	{
		public labTestCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class LabComponents
	{
		public int LabTestId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? UnitId { get; set; }
		public int? TypeId { get; set; }
		public int? DisplaySequence { get; set; }
		public string ComponentGroup { get; set; } = "";
		public int? AnswerSetId { get; set; }
		public int? MethodId { get; set; }
		public string Remarks { get; set; } = "";
		public string Formula { get; set; } = "";
		public bool IsActive { get; set; }
		public int? DefValue { get; set; }
		public LabComponents()
		{
			ReferenceRangeColl = new LabComponetReferenceRuleCollections();
		}
		public LabComponetReferenceRuleCollections ReferenceRangeColl { get; set; }
	}

	public class LabComponentsCollections : System.Collections.Generic.List<LabComponents>
	{
		public string ResponseMSG { get; set; } = "";
		public bool IsSuccess { get; set; }
	}

	public class LabComponetReferenceRule
	{
		public int LabTestId { get; set; }
		public int ComponetDisplaySequence { get; set; }
		public string Gender { get; set; } = "";
		public string GenderDescription { get; set; } = "";
		public int? AgeMin { get; set; }
		public int? AgeMax { get; set; }
		public string NormalLow { get; set; } = "";
		public string NormalHigh { get; set; } = "";
		public string CriticalLow { get; set; } = "";
		public string CriticalHigh { get; set; } = "";
		public string TextualReference { get; set; } = "";
		public string ReferenceRangeDescription { get; set; } = "";
	}
	public class LabComponetReferenceRuleCollections : System.Collections.Generic.List<LabComponetReferenceRule>
	{
		public string ResponseMSG { get; set; } = "";
		public bool IsSuccess { get; set; }
	}
}



