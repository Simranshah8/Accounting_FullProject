using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class EmployeePromotion : ResponeValues
	{

		public int? PromotionId { get; set; }
		public int? EmployeeId { get; set; }
		public DateTime? PromotionDate { get; set; }
		public DateTime? EffectiveDate { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? CategoryId { get; set; }
		public string JobTitle { get; set; } = "";
		public int? LevelId { get; set; }
		public int? ServiceTypeId { get; set; }
		public int? DesignationId { get; set; }
		public int? NewBranchId { get; set; }
		public int? NewDepartmentId { get; set; }
		public int? NewCategoryId { get; set; }
		public string NewJTitle { get; set; } = "";
		public int? NewLevelId { get; set; }
		public int? NewServiceTypeId { get; set; }
		public int? NewDesignationId { get; set; }
		public int? RecommendedById { get; set; }
		public int? VerifiedById { get; set; }
		public string RecommendedRemarks { get; set; } = "";
		public string VerifiedRemarks { get; set; } = "";
		public string Remarks { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string Department { get; set; } = "";
		public string CategoryName { get; set; } = "";
		public string LevelName { get; set; } = "";
		public string ServiceTypeName { get; set; } = "";
		public string DesignationName { get; set; } = "";
		public string PromotionMitti { get; set; } = "";
		public string EffectiveMitti { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string PromotionBy { get; set; } = "";
		public string LogMitti { get; set; } = "";
		public string UpdateMitti { get; set; } = "";
		public int? UserId { get; set; }


		public EmployeePromotion()
		{
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }
	}
	public class EmployeePromotionCollections : System.Collections.Generic.List<EmployeePromotion>
	{
		public EmployeePromotionCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

