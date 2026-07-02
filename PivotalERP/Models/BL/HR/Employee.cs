using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class Employee : Dynamic.BusinessLogic.Global.Common
	{
		private const Dynamic.BusinessEntity.Global.FormsEntity EntityId = Dynamic.BusinessEntity.Global.FormsEntity.HR_EmployeeProfile;
		Dynamic.DA.HR.EmployeeDB db = null;
		string _hostName = "", _dbName = "";
		int _UserId = 0;
		Dynamic.DataAccess.Global.GlobalDB globalDB = new DataAccess.Global.GlobalDB();

		public Employee(int UserId, string hostName, string dbName)
		{
			_hostName = hostName;
			_dbName = dbName;
			this._UserId = UserId;
			globalDB = new DataAccess.Global.GlobalDB(hostName, dbName);
			db = new Dynamic.DA.HR.EmployeeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues UpdateEnrollCardNo(Dynamic.RE.HR.EmployeeSummaryCollections dataColl)
		{
			return db.UpdateEnrollCardNo(_UserId, dataColl);
		}
			public Dynamic.BE.HR.EmployeeCollections GetAllEmployee(int EntityId, int? UserType)
		{
			return db.getAllEmployee(_UserId, EntityId, UserType);
		}
		public Dynamic.BE.HR.Employee GetEmployeeById(int EntityId, int EmployeeId)
		{
			return db.getEmployeeById(_UserId, EntityId, EmployeeId);
		}
		public Dynamic.BE.HR.Employee GetDocViewById(int EntityId, int EmployeeId)
		{
			return db.getDocViewById(_UserId, EntityId, EmployeeId);
		}
		public ResponeValues DeleteById(int EntityId, int EmployeeId)
		{
			return db.DeleteById(_UserId, EntityId, EmployeeId);
		}
		public ResponeValues UpdateEmp_Query(List<Dynamic.BE.HR.Employee> dataColl, string query)
		{
			return db.UpdateEmp_Query(_UserId, dataColl, query);
		}
			//prasahnt code 1st Sep
			public ResponeValues GetAutoEmpNo(int EntityId)
		{
			return db.GetAutoEmpNo(_UserId, EntityId);
		}
		//prasahnt code 1st Sep

		public Dynamic.RE.HR.BirthdayListCollections GetBirthdayList(DateTime? FromDate, DateTime? ToDate)
		{
			return db.GetBirthdayList(_UserId, FromDate, ToDate);
        }

		public Dynamic.RE.HR.SupervisorListCollections GetSupervisorList( int? CompanyId, int? BranchId, int? DepartmentId, int? DesignationId, string EmpStatus)
		{
			return db.GetSupervisorList(_UserId, CompanyId, BranchId, DepartmentId, DesignationId, EmpStatus);
        }
        public ResponeValues AttendanceAppealApproved(Dynamic.APIEnitity.HR.LeaveApprove beData)
		{
			return db.AttendanceAppealApproved(beData);
        }

        public Dynamic.RE.HR.EmployeeProfile GetEmployee(int? ForEmployeeId, int EntityId,string EmployeeCode)
		{
			return db.GetEmployee(_UserId, ForEmployeeId, EntityId,EmployeeCode);
		}
		public Dynamic.BE.HR.EmployeeAutoCompleteCollections getAllEmployeeAutoComplete(string searchBy, string Operator, string searchValue)
		{
			return db.getAllEmployeeAutoComplete(_UserId, searchBy, Operator, searchValue);
		}
		public ResponeValues SaveAttendanceAppeals(Dynamic.APIEnitity.HR.AttendanceAppeals beData)
		{
			return db.SaveAttendanceAppeals(beData);
		}
		public RE.HR.EmployeeSummaryCollections getMyTeam(int? EmployeeId)
		{
			return db.getMyTeam(_UserId,EmployeeId);
		}
		public Dynamic.BE.HR.EmployeeCollections GetEmployeeWithPag(int EntityId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
		{
			return db.GetEmployeeWithPag(_UserId, EntityId, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.HR.Employee beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.EmployeeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.EmployeeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.EmployeeCode))
				{
					resVal.ResponseMSG = "Please ! Enter EmployeeCode ";
				}
				else if (string.IsNullOrEmpty(beData.FirstName))
				{
					resVal.ResponseMSG = "Please ! Enter First Name ";
				}
				else if (string.IsNullOrEmpty(beData.LastName))
				{
					resVal.ResponseMSG = "Please ! Enter Last Name ";
				}
				else if (string.IsNullOrEmpty(beData.GenderId))
				{
					resVal.ResponseMSG = "Please ! Enter Gender Name ";
				}
				else if (string.IsNullOrEmpty(beData.Religion))
				{
					resVal.ResponseMSG = "Please ! Enter Religion Name ";
				}
				else if (beData.MaritalStatusId == 0 || beData.MaritalStatusId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Marital Status ";
				}
				else if (beData.NationalityId == 0 || beData.NationalityId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Nationality ";
				}
				else if (string.IsNullOrEmpty(beData.FatherName))
				{
					resVal.ResponseMSG = "Please ! Enter Father Name ";
				}
				else if (string.IsNullOrEmpty(beData.PFullAddr))
				{
					resVal.ResponseMSG = "Please ! Enter Permanent Full Address ";
				}
                else if (beData.CompanyRelationshipId == 0 || beData.CompanyRelationshipId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Company Relationship ";
                }
                else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Branch ";
                }
                else if (beData.DepartmentId == 0 || beData.DepartmentId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Department ";
                }
				else if (beData.DesignationId == 0 || beData.DesignationId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Designation ";
				}
				else if (beData.JoinDate.Value.Year < 1900 || beData.JoinDate.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Enter Date of Joining";
				}
				//else if (!beData.EmployeeGroupId.HasValue || beData.EmployeeGroupId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Employee Group Name ";
				//}
				//else if (!beData.ELevelId.HasValue || beData.ELevelId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Level ";
				//}
				//else if (beData.CategoryId == 0 || beData.CategoryId.HasValue == false)
				//{
				//    resVal.ResponseMSG = "Please ! Select Category ";
				//}
				else
				{
					if (!string.IsNullOrEmpty(beData.FirstName))
					{
						var validName = IsValidName(beData.FirstName);
						if (!validName.IsSuccess)
							return validName;
					}
					if (!string.IsNullOrEmpty(beData.LastName))
					{
						var validName = IsValidName(beData.LastName);
						if (!validName.IsSuccess)
							return validName;
					}
					if (!string.IsNullOrEmpty(beData.MiddleName))
					{
						var validName = IsValidName(beData.MiddleName);
						if (!validName.IsSuccess)
							return validName;
					}
					if (!string.IsNullOrEmpty(beData.EmailId))
					{
						var validEMail = IsValidEmail(beData.EmailId);
						if (!validEMail.IsSuccess)
							return validEMail;
					}


					if (!string.IsNullOrEmpty(_hostName) && !string.IsNullOrEmpty(_dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, _hostName, _dbName);
						var isValidEntity = entityBl.IsValidEntity((int)EntityId, beData);
						if (!isValidEntity.IsSuccess)
							return isValidEntity;
					 
					}

					var action = (IsModify ? BusinessEntity.Global.Actions.Modify : BusinessEntity.Global.Actions.Save);
					string adtionalJSON = new Dynamic.BusinessLogic.Global.UDFClass().SerializedObject(beData, "EmpBankAccColl,AcaQualificationColl,AttachmentColl,WorkExpColl");
					ResponeValues validResponse = globalDB.IsValidMasteData(beData.CUserId, EntityId, action, adtionalJSON);
					if (!validResponse.IsSuccess)
						return validResponse;


					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}

		//SectionWise UPdate
		public ResponeValues SaveUpdateEmpDetail(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateEmpDetail(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateEmpAdd(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateEmpAdd(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateEmergency(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateEmergency(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateOffDet(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateOfficialDetail(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues UpdatePfSsfCit(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdatePfSsfCit(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateBankDetails(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateBankDetails(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateInsurance(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateInsurance(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateAccountDet(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateAccountDet(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateQualification(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateQualification(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateExperience(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateExperience(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateSupervisor(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateSupervisor(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues SaveUpdateDocumnet(Dynamic.BE.HR.Employee beData)
		{
			bool isModify = beData.EmployeeId > 0;
			ResponeValues isValid = IsValidDataE(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdateDocumnet(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues IsValidDataE(ref Dynamic.BE.HR.Employee beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.EmployeeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.EmployeeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else
				{
					if (!string.IsNullOrEmpty(beData.EmailId))
					{
						var validEMail = IsValidEmail(beData.EmailId);
						if (!validEMail.IsSuccess)
							return validEMail;
					}
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	}

}

