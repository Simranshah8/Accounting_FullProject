using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{

	public class EmployeeLeftType : ResponeValues
	{

		public int? EmpLeftTypeId { get; set; }
		public int? EmployeeId { get; set; }
		public DateTime? LeftDate { get; set; }
		public DateTime? EffectiveDate { get; set; }
		public int? LeftTypeId { get; set; }
		public string Reason { get; set; } = "";
		public int? ApprovedBy { get; set; }
		public string ApprovedRemarks { get; set; } = "";
		public int? VerifiedBy { get; set; }
		public string VerifiedRemarks { get; set; } = "";
		public string Name { get; set; } = "";

		public string EmployeeCode { get; set; } = "";
		public string Department { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string LevelName { get; set; } = "";
		public string Designation { get; set; } = "";
		public EmployeeLeftType()
		{
			AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections AttachmentColl { get; set; }
        public int? UserId { get; set; }
    }

	public class EmployeeLeftTypeCollections : System.Collections.Generic.List<EmployeeLeftType>
	{
		public EmployeeLeftTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}

