using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class PayrollConfig : ResponeValues
	{

		public int? TranId { get; set; }
		public int? JV_VoucherId { get; set; }
		public int? JV_CostClassId { get; set; }
		public bool JV_AutoGenerate { get; set; }
		public bool JV_AutoCancelRegenerate { get; set; }
		public int? PV_VoucherId { get; set; }
		public int? PV_CostClassId { get; set; }
		public bool PV_AutoGenerate { get; set; }
		public bool PV_AutoCancelRegenerate { get; set; }

		public int? AV_VoucherId { get; set; }
		public int? AV_CostClassId { get; set; }
		public bool AV_AutoGenerate { get; set; }
		public bool AV_AutoCancelRegenerate { get; set; }
		public int NoOfDecimal { get; set; }

		public int? PaySlipTemplateId { get; set; }


		//added by yubaraj poudel
		public bool ShowSalAttn { get; set; }
		public bool BlockScreenshot { get; set; }
		public bool AllowPayslipDL { get; set; }
	}
	public class PayrollConfigCollections : System.Collections.Generic.List<PayrollConfig>
	{
		public PayrollConfigCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Added By Suresh fore payslip Get
	public class PaySlipReport : ResponeValues
	{

		public int? RptTranId { get; set; }
		public string ReportName { get; set; }
		public string Path { get; set; }
		public bool IsDefault { get; set; }
		public bool IsActive { get; set; }
	}
	public class PaySlipReportCollections : System.Collections.Generic.List<PaySlipReport>
	{
		public PaySlipReportCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}


