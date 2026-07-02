using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{
	public class LabReportTemplate : ResponeValues
	{
		public int TranId { get; set; }
		public int? TemplateTypeId { get; set; }
		public string TemplateName { get; set; } = "";
		public string ReportPrintName { get; set; } = "";
		public bool IsGroupRow { get; set; }
		public string GroupName { get; set; } = "";
		public bool IsInvestigation { get; set; }
		public string InvestigationName { get; set; } = "";
		public bool IsResult { get; set; }
		public string ResultName { get; set; } = "";
		public bool IsReferenceRange { get; set; }
		public string RefRangeColName { get; set; } = "";
		public bool IsUnitCol { get; set; }
		public string UnitColName { get; set; } = "";
		public bool IsMethod { get; set; }
		public string MethodColName { get; set; } = "";
		public bool IsRemark { get; set; }
		public string RemarkColName { get; set; } = "";
		public int? FlagStyle { get; set; }
		public bool IsAbnormalRow { get; set; }
		public bool IsClinicalNotes { get; set; }
		//added 
		public bool IsTestNameOrComponent { get; set; }

		
	}
	public class LabReportTemplateCollections : System.Collections.Generic.List<LabReportTemplate>
	{
		public LabReportTemplateCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class HeaderFooterConfig : ResponeValues
	{
		public int? TranId { get; set; }
		public bool IsHeader { get; set; }
		public bool IsPatientId { get; set; }
		public bool IsPatientName { get; set; }
		public bool IsSampleNo { get; set; }
		public bool IsAge { get; set; }
		public bool IsGender { get; set; }
		public bool IsSampleCollectDate { get; set; }
		public bool IsReportingDate { get; set; }
		public bool IsReferredBy { get; set; }
		public bool IsSampleCollectionAt { get; set; }
		public bool IsBarCode { get; set; }
		public bool IsQR { get; set; }
		public bool IsSignature1 { get; set; }
		public bool IsSignature2 { get; set; }
		public string SignatureLebel1 { get; set; } = "";
		public string SignatureLebel2 { get; set; } = "";
		public string Signature1 { get; set; } = "";
		public string Signature2 { get; set; } = "";
		public string FooterNote { get; set; } = "";
		public double? HeaderHeight { get; set; }
		public byte[] Photo { get; set; }

		//added 
		public bool ShowNotes { get; set; }
		public bool IsFooter { get; set; }
		public double? FooterHeight { get; set; }
		public bool IsAllSignature { get; set; }

		


	}

	public class HeaderFooterConfigCollections : System.Collections.Generic.List<HeaderFooterConfig>
	{
		public HeaderFooterConfigCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

