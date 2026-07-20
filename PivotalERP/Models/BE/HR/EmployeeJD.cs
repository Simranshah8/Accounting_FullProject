using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.HR
{
	public class EmployeeJD : ResponeValues
	{
		public int? EmpJDId { get; set; }
		public int? EmployeeId { get; set; }
		public string Name { get; set; } = "";
		public string Email { get; set; } = "";
		public int? DepartmentId { get; set; }
		public string Designation { get; set; } = "";
		public string Department { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string DOB_BS { get; set; } = "";
		public DateTime? DOB_AD { get; set; }
		public string JobTitle { get; set; } = "";
		public string Division { get; set; } = "";
		public string Age { get; set; } = "";
		public string WorkStation { get; set; } = "";
		public string ExpYear { get; set; } = "";
		public string PhotoPath { get; set; } = "";
		public DateTime? DateOfJoining { get; set; }
		public string DateOfJoiningMitti { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public EmployeeJD()
		{
			EmpJDQualificationColl = new EmpJDQualificationCollections();
			EmpJDAchievementColl = new EmpJDAchievementCollections();
			EmpJDTrainingColl = new EmpJDTrainingCollections();
			EmpJDResponsibilityColl = new EmpJDResponsibilityCollections();
		}
		public EmpJDQualificationCollections EmpJDQualificationColl { get; set; }
		public EmpJDAchievementCollections EmpJDAchievementColl { get; set; }
		public EmpJDTrainingCollections EmpJDTrainingColl { get; set; }
		public EmpJDResponsibilityCollections EmpJDResponsibilityColl { get; set; }
	}

	public class EmployeeJDCollections : System.Collections.Generic.List<EmployeeJD>
	{
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }
	}



	public class EmpJDQualification
	{

		public int EmpJDId { get; set; }
		public string Qualification { get; set; } = "";
	}

	public class EmpJDQualificationCollections : System.Collections.Generic.List<EmpJDQualification>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class EmpJDAchievement
	{

		public int EmpJDId { get; set; }
		public string OrgName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Duration { get; set; } = "";
		public string WorkStation { get; set; } = "";
	}

	public class EmpJDAchievementCollections : System.Collections.Generic.List<EmpJDAchievement>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class EmpJDTraining
	{

		public int EmpJDId { get; set; }
		public string Training { get; set; } = "";
	}

	public class EmpJDTrainingCollections : System.Collections.Generic.List<EmpJDTraining>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class EmpJDResponsibility
	{

		public int EmpJDId { get; set; }
		public string Responsibility { get; set; } = "";
		public bool? IsActive { get; set; }
		public int ResponsibilityId { get; set; }
	}

	public class EmpJDResponsibilityCollections : System.Collections.Generic.List<EmpJDResponsibility>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}
}