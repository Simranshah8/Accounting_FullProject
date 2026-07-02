using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.NPayroll
{

	public class PayHeadGroup : ResponeValues
	{

		public int? PayHeadGroupId { get; set; }
		public int? BranchId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int SNo { get; set; }
		public string Description { get; set; } = "";
		public PayHeadGroup()
		{
			PayHeadGroupTaxExemptionColl = new PayHeadGroupTaxExemptionCollections();
		}
		public PayHeadGroupTaxExemptionCollections PayHeadGroupTaxExemptionColl { get; set; }

		public int? id
		{
			get
			{
				return this.PayHeadGroupId;
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
	public class PayHeadGroupTaxExemption
	{

		public int PayHeadGroupId { get; set; }
		public int? GenderId { get; set; }
		public int? MaritalStatusId { get; set; }
		public int? ResidentId { get; set; }
		public double Rate { get; set; }
		public double Amount { get; set; }
		public string Formula { get; set; } = "";
	}

	public class PayHeadGroupTaxExemptionCollections : System.Collections.Generic.List<PayHeadGroupTaxExemption>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}
	public class PayHeadGroupCollections : System.Collections.Generic.List<PayHeadGroup>
	{
		public PayHeadGroupCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}


