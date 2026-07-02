using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class EmployeeTransfer : ResponeValues
	{

		public int? TransferId { get; set; }
		public int? EmployeeId { get; set; }
		public DateTime? TransferDate { get; set; }
		public DateTime? EffectiveDate { get; set; }
		public int? CompanyId { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? CategoryId { get; set; }
		public int? DesignationId { get; set; }
		public string HeadQtr { get; set; } = "";
		public int? NewCompanyId { get; set; }
		public int? NewBranchId { get; set; }
		public int? NewDepartmentId { get; set; }
		public int? NewCategoryId { get; set; }
		public int? NewDesignationId { get; set; }
		public string NewHeadQuarter { get; set; } = "";
		public int? RecommendedById { get; set; }
		public int? VerifiedById { get; set; }
		public string RecommendedRemarks { get; set; } = "";
		public string VerifiedRemarks { get; set; } = "";
		public string Remarks { get; set; } = "";

		public string CompanyName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string Department { get; set; } = "";
		public string CategoryName { get; set; } = "";
		public string TransferMitti { get; set; } = "";
		public string EffectiveMitti { get; set; } = "";
		public string TransferBy { get; set; } = "";
		public string LogMitti { get; set; } = "";
		public string UpdateMitti { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
        public int? UserId { get; set; }
        public EmployeeTransfer()
		{
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
	}
	public class EmployeeTransferCollections : System.Collections.Generic.List<EmployeeTransfer>
	{
		public EmployeeTransferCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}
