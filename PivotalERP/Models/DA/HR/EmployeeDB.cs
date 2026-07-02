using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.DA.HR
{

	internal class EmployeeDB : Dynamic.DataAccess.Common.CommonDB
	{
		DataAccessLayer1 dal = null;
		public EmployeeDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		/// <summary>
		/// Line no 242 for Religion
		/// </summary>
		/// <param name="beData"></param>
		/// <param name="isModify"></param>
		/// <returns></returns>
		public ResponeValues SaveUpdate(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			dal.BeginTransaction();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeCode", beData.EmployeeCode);
			cmd.Parameters.AddWithValue("@EnrollNumber", beData.EnrollNumber);
			cmd.Parameters.AddWithValue("@FirstName", beData.FirstName);
			cmd.Parameters.AddWithValue("@MiddleName", beData.MiddleName);
			cmd.Parameters.AddWithValue("@LastName", beData.LastName);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);
			cmd.Parameters.AddWithValue("@GenderId", beData.GenderId);
			cmd.Parameters.AddWithValue("@BloodGroupId", beData.BloodGroupId);
			cmd.Parameters.AddWithValue("@ReligionId", beData.ReligionId);
			cmd.Parameters.AddWithValue("@DobBS", beData.DobBS);
			cmd.Parameters.AddWithValue("@DobAD", beData.DobAD);
			cmd.Parameters.AddWithValue("@MaritalStatusId", beData.MaritalStatusId);
			cmd.Parameters.AddWithValue("@NationalityId", beData.NationalityId);
			cmd.Parameters.AddWithValue("@PanId", beData.PanId);
			cmd.Parameters.AddWithValue("@CitiNum", beData.CitiNum);
			cmd.Parameters.AddWithValue("@CitiIssueDate", beData.CitiIssueDate);
			cmd.Parameters.AddWithValue("@CitiIssuePlaceId", beData.CitiIssuePlaceId);
			cmd.Parameters.AddWithValue("@CitiFrontImg", beData.CitiFrontImg);
			cmd.Parameters.AddWithValue("@CitiBackImg", beData.CitiBackImg);
			cmd.Parameters.AddWithValue("@EmailId", beData.EmailId);
			cmd.Parameters.AddWithValue("@OfficeNum", beData.OfficeNum);
			cmd.Parameters.AddWithValue("@PersonalNum", beData.PersonalNum);
			cmd.Parameters.AddWithValue("@FatherName", beData.FatherName);
			cmd.Parameters.AddWithValue("@GFatherName", beData.GFatherName);
			cmd.Parameters.AddWithValue("@MotherName", beData.MotherName);
			cmd.Parameters.AddWithValue("@DrivingLicNum", beData.DrivingLicNum);
			cmd.Parameters.AddWithValue("@LicIssueDate", beData.LicIssueDate);
			cmd.Parameters.AddWithValue("@LicExpiryDate", beData.LicExpiryDate);
			cmd.Parameters.AddWithValue("@LicIssuePlace", beData.LicIssuePlace);
			cmd.Parameters.AddWithValue("@PassportNum", beData.PassportNum);
			cmd.Parameters.AddWithValue("@PassportIssueDate", beData.PassportIssueDate);
			cmd.Parameters.AddWithValue("@PassportExpiryDate", beData.PassportExpiryDate);
			cmd.Parameters.AddWithValue("@PassportIssuePlace", beData.PassportIssuePlace);
			cmd.Parameters.AddWithValue("@PCountryId", beData.PCountryId);
			cmd.Parameters.AddWithValue("@PStateId", beData.PStateId);
			cmd.Parameters.AddWithValue("@PDistrictId", beData.PDistrictId);
			cmd.Parameters.AddWithValue("@PCity", beData.PCity);
			cmd.Parameters.AddWithValue("@P_LocalLevelId", beData.P_LocalLevelId);
			cmd.Parameters.AddWithValue("@PWard", beData.PWard);
			cmd.Parameters.AddWithValue("@PStreet", beData.PStreet);
			cmd.Parameters.AddWithValue("@PHouseNum", beData.PHouseNum);
			cmd.Parameters.AddWithValue("@PFullAddr", beData.PFullAddr);
			cmd.Parameters.AddWithValue("@TCountryId", beData.TCountryId);
			cmd.Parameters.AddWithValue("@TStateId", beData.TStateId);
			cmd.Parameters.AddWithValue("@TDistrictId", beData.TDistrictId);
			cmd.Parameters.AddWithValue("@TCity", beData.TCity);
			cmd.Parameters.AddWithValue("@Temp_LocalLevelId", beData.Temp_LocalLevelId);
			cmd.Parameters.AddWithValue("@TWard", beData.TWard);
			cmd.Parameters.AddWithValue("@TStreet", beData.TStreet);
			cmd.Parameters.AddWithValue("@THouseNum", beData.THouseNum);
			cmd.Parameters.AddWithValue("@TFullAddr", beData.TFullAddr);
			cmd.Parameters.AddWithValue("@ContactPer", beData.ContactPer);
			cmd.Parameters.AddWithValue("@ContactRelation", beData.ContactRelation);
			cmd.Parameters.AddWithValue("@ContactAddr", beData.ContactAddr);
			cmd.Parameters.AddWithValue("@ContactPhone", beData.ContactPhone);
			cmd.Parameters.AddWithValue("@ContactMobile", beData.ContactMobile);
			cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@SubBranch", beData.SubBranch);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@DesignationId", beData.DesignationId);
			cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
			cmd.Parameters.AddWithValue("@ELevelId", beData.ELevelId);
			cmd.Parameters.AddWithValue("@JTitle", beData.JTitle);
			cmd.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
			cmd.Parameters.AddWithValue("@JoinDate", beData.JoinDate);
			cmd.Parameters.AddWithValue("@ConfirmDate", beData.ConfirmDate);
			cmd.Parameters.AddWithValue("@RetireDate", beData.RetireDate);
			cmd.Parameters.AddWithValue("@HeadQtr", beData.HeadQtr);
			cmd.Parameters.AddWithValue("@RemoteAreaId", beData.RemoteAreaId);
			cmd.Parameters.AddWithValue("@DisabilitesId", beData.DisabilitesId);
			cmd.Parameters.AddWithValue("@PfAccNum", beData.PfAccNum);
			cmd.Parameters.AddWithValue("@PfNominee", beData.PfNominee);
			cmd.Parameters.AddWithValue("@PfRelation", beData.PfRelation);
			cmd.Parameters.AddWithValue("@PfID", beData.PfID);
			cmd.Parameters.AddWithValue("@PfIDNum", beData.PfIDNum);
			cmd.Parameters.AddWithValue("@PfEntryDate", beData.PfEntryDate);
			cmd.Parameters.AddWithValue("@PfIssueOffice", beData.PfIssueOffice);
			cmd.Parameters.AddWithValue("@PfIssuePlace", beData.PfIssuePlace);
			cmd.Parameters.AddWithValue("@PfAtt", beData.PfAtt);
			cmd.Parameters.AddWithValue("@AccessNum", beData.AccessNum);
			cmd.Parameters.AddWithValue("@SsfNum", beData.SsfNum);
			cmd.Parameters.AddWithValue("@SsfAtt", beData.SsfAtt);
			cmd.Parameters.AddWithValue("@CitCode", beData.CitCode);
			cmd.Parameters.AddWithValue("@CitAccNum", beData.CitAccNum);
			cmd.Parameters.AddWithValue("@CitAmt", beData.CitAmt);
			cmd.Parameters.AddWithValue("@CitNominee", beData.CitNominee);
			cmd.Parameters.AddWithValue("@CitRelationId", beData.CitRelationId);
			cmd.Parameters.AddWithValue("@CitIdType", beData.CitIdType);
			cmd.Parameters.AddWithValue("@CitIdNum", beData.CitIdNum);
			cmd.Parameters.AddWithValue("@CitEntryDate", beData.CitEntryDate);
			cmd.Parameters.AddWithValue("@CitAtt", beData.CitAtt);
			cmd.Parameters.AddWithValue("@GratCode", beData.GratCode);
			cmd.Parameters.AddWithValue("@GratAccNum", beData.GratAccNum);
			cmd.Parameters.AddWithValue("@GratNominee", beData.GratNominee);
			cmd.Parameters.AddWithValue("@GratRelation", beData.GratRelation);
			cmd.Parameters.AddWithValue("@GratIdType", beData.GratIdType);
			cmd.Parameters.AddWithValue("@GratIdNum", beData.GratIdNum);
			cmd.Parameters.AddWithValue("@GratEntryDate", beData.GratEntryDate);
			cmd.Parameters.AddWithValue("@GratIssueOffice", beData.GratIssueOffice);
			cmd.Parameters.AddWithValue("@GratIssuePlace", beData.GratIssuePlace);
			cmd.Parameters.AddWithValue("@GratAtt", beData.GratAtt);
			cmd.Parameters.AddWithValue("@LInsuComp", beData.LInsuComp);
			cmd.Parameters.AddWithValue("@LPolicyName", beData.LPolicyName);
			cmd.Parameters.AddWithValue("@LPolicyNum", beData.LPolicyNum);
			cmd.Parameters.AddWithValue("@LPolicyAmt", beData.LPolicyAmt);
			cmd.Parameters.AddWithValue("@LPolicySDate", beData.LPolicySDate);
			cmd.Parameters.AddWithValue("@LPolicyLDate", beData.LPolicyLDate);
			cmd.Parameters.AddWithValue("@LPremiumAmt", beData.LPremiumAmt);
			cmd.Parameters.AddWithValue("@LPaymentType", beData.LPaymentType);
			cmd.Parameters.AddWithValue("@LStartMonth", beData.LStartMonth);
			cmd.Parameters.AddWithValue("@LDedSalary", beData.LDedSalary);
			cmd.Parameters.AddWithValue("@LRemarks", beData.LRemarks);
			cmd.Parameters.AddWithValue("@LInsuTypeId", beData.LInsuTypeId);
			cmd.Parameters.AddWithValue("@LiAtt", beData.LiAtt);
			cmd.Parameters.AddWithValue("@HInsuComp", beData.HInsuComp);
			cmd.Parameters.AddWithValue("@HPolicyName", beData.HPolicyName);
			cmd.Parameters.AddWithValue("@HPolicyNum", beData.HPolicyNum);
			cmd.Parameters.AddWithValue("@HPolicyAmt", beData.HPolicyAmt);
			cmd.Parameters.AddWithValue("@HPolicySDate", beData.HPolicySDate);
			cmd.Parameters.AddWithValue("@HPolicyLDate", beData.HPolicyLDate);
			cmd.Parameters.AddWithValue("@HPremiumAmt", beData.HPremiumAmt);
			cmd.Parameters.AddWithValue("@HPaymentType", beData.HPaymentType);
			cmd.Parameters.AddWithValue("@HStartMonth", beData.HStartMonth);
			cmd.Parameters.AddWithValue("@HDedSalary", beData.HDedSalary);
			cmd.Parameters.AddWithValue("@HRemarks", beData.HRemarks);
			cmd.Parameters.AddWithValue("@HInsuTypeId", beData.HInsuTypeId);
			cmd.Parameters.AddWithValue("@HiAtt", beData.HiAtt);
			cmd.Parameters.AddWithValue("@AccLedger", beData.AccLedger);
			cmd.Parameters.AddWithValue("@CostCenterId", beData.CostCenterId);
			cmd.Parameters.AddWithValue("@OTLedger", beData.OTLedger);
			cmd.Parameters.AddWithValue("@EFirstLevel", beData.EFirstLevel);
			cmd.Parameters.AddWithValue("@ESecondLevel", beData.ESecondLevel);
			cmd.Parameters.AddWithValue("@EThirdLevel", beData.EThirdLevel);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);			

			if (isModify)
			{
                cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
                cmd.CommandText = "usp_UpdateEmployee";
			}
			else
			{
                cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId).Direction = System.Data.ParameterDirection.Output;                
				cmd.CommandText = "usp_AddEmployee";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254).Direction=System.Data.ParameterDirection.Output;
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;			
			cmd.Parameters.AddWithValue("@CitiIssuePlace", beData.CitiIssuePlace);
			cmd.Parameters.AddWithValue("@PStateName", beData.PStateName);
			cmd.Parameters.AddWithValue("@PDistrictName", beData.PDistrictName);
			cmd.Parameters.AddWithValue("@P_LocalLevelName", beData.P_LocalLevelName);
			cmd.Parameters.AddWithValue("@TStateName", beData.TStateName);
			cmd.Parameters.AddWithValue("@TDistrictName", beData.TDistrictName);
			cmd.Parameters.AddWithValue("@Temp_LocalLevelName", beData.Temp_LocalLevelName);
			cmd.Parameters.AddWithValue("@EmployeeNo", beData.EmployeeNo);
			cmd.Parameters.AddWithValue("@BrandId", beData.BrandId);
			cmd.Parameters.AddWithValue("@PermanentDate", beData.PermanentDate);
			cmd.Parameters.AddWithValue("@TaxRullId", beData.TaxRullId);
			cmd.Parameters.AddWithValue("@EmployeeGroupId", beData.EmployeeGroupId);
			cmd.Parameters.AddWithValue("@ProjectId", beData.ProjectId);
			cmd.Parameters.AddWithValue("@SpouseName", beData.SpouseName);
			cmd.Parameters.AddWithValue("@AnniversaryDate", beData.AnniversaryDate);
			cmd.Parameters.AddWithValue("@PA_Zone", beData.PA_Zone);
			cmd.Parameters.AddWithValue("@TA_Counrty", beData.TA_Counrty);
			cmd.Parameters.AddWithValue("@TA_Zone", beData.TA_Zone);
			cmd.Parameters.AddWithValue("@RemoteArea", beData.RemoteArea);
			cmd.Parameters.AddWithValue("@Disability", beData.Disability);
			cmd.Parameters.AddWithValue("@CIT_RelationShip", beData.CIT_RelationShip);
			cmd.Parameters.AddWithValue("@BankName", beData.BankName);
			cmd.Parameters.AddWithValue("@BA_AccountName", beData.BA_AccountName);
			cmd.Parameters.AddWithValue("@BA_AccountNo", beData.BA_AccountNo);
			cmd.Parameters.AddWithValue("@BA_Branch", beData.BA_Branch);
			cmd.Parameters.AddWithValue("@BA_IsForPayroll", beData.BA_IsForPayroll);
			cmd.Parameters.AddWithValue("@Signature", beData.Signature);
			cmd.Parameters.AddWithValue("@SignaturePath", beData.SignaturePath);
			cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
			cmd.Parameters.AddWithValue("@MotherTonque", beData.MotherTonque);
			cmd.Parameters.AddWithValue("@Rank", beData.Rank);
			cmd.Parameters.AddWithValue("@Position", beData.Position);
			cmd.Parameters.AddWithValue("@TeacherType", beData.TeacherType);
			cmd.Parameters.AddWithValue("@TeachingLanguage", beData.TeachingLanguage);
			cmd.Parameters.AddWithValue("@LicenseNo", beData.LicenseNo);
			cmd.Parameters.AddWithValue("@TrkNo", beData.TrkNo);
			cmd.Parameters.AddWithValue("@CasteId", beData.CasteId);
			cmd.Parameters.AddWithValue("@EMSId", beData.EMSId);
			cmd.Parameters.AddWithValue("@IsTeaching", beData.IsTeaching);
			cmd.Parameters.AddWithValue("@SubjectTeacherId", beData.SubjectTeacherId);
			cmd.Parameters.AddWithValue("@IsPhysicalDisability", beData.IsPhysicalDisability);
			cmd.Parameters.AddWithValue("@PhysicalDisability", beData.PhysicalDisability);
			cmd.Parameters.AddWithValue("@UDF", beData.UDF);
			cmd.Parameters.AddWithValue("@FatherContactNo", beData.FatherContactNo);
			cmd.Parameters.AddWithValue("@MotherContactNo", beData.MotherContactNo);
			cmd.Parameters.AddWithValue("@SpouseContactNo", beData.SpouseContactNo);
			cmd.Parameters.AddWithValue("@OfficeEmailId", beData.OfficeEmailId);
			cmd.Parameters.AddWithValue("@SalaryApplicableYearId", beData.SalaryApplicableYearId);
			cmd.Parameters.AddWithValue("@SalaryApplicableMonthId", beData.SalaryApplicableMonthId);
			cmd.Parameters.AddWithValue("@SystemUserId", beData.SystemUserId);
			cmd.Parameters.AddWithValue("@IsAllowOT", beData.IsAllowOT);
			cmd.Parameters.AddWithValue("@OTCalculation", beData.OTCalculation);
			cmd.Parameters.AddWithValue("@CompanyRelationshipId", beData.CompanyRelationshipId);
			cmd.Parameters.AddWithValue("@LeaveApplicableDate", beData.LeaveApplicableDate);
			cmd.Parameters.AddWithValue("@Attributes", beData.Attributes);
			cmd.Parameters.AddWithValue("@UDFKeyVal", beData.UDFKeyVal);
			cmd.Parameters.AddWithValue("@Religion", beData.Religion);
            cmd.Parameters.AddWithValue("@IsImport", beData.IsImport);
            try
			{
                //foreach (SqlParameter p in cmd.Parameters)
                //{
                //    Console.WriteLine(p.ParameterName);
                //}

                cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[136].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[136].Value);

				if (!(cmd.Parameters[137].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[137].Value);

				if (!(cmd.Parameters[138].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[138].Value);

				if (!(cmd.Parameters[139].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[139].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpBankAccDetails(beData.CUserId, resVal.RId, beData.EmpBankAccColl);
					SaveAcaQualificationDetails(beData.CUserId, resVal.RId, beData.AcaQualificationColl);
					SaveWorkExpDetails(beData.CUserId, resVal.RId, beData.WorkExpColl);
					SaveEmpDocumentDetails(beData.AttachmentColl, resVal.RId, beData.CUserId);
				}

				dal.CommitTransaction();

			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
				dal.RollbackTransaction();
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;

		}

		public ResponeValues UpdateEmp_Query(int UserId, List<Dynamic.BE.HR.Employee> dataColl, string query)
		{

			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			dal.BeginTransaction();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

			try
			{
				foreach (var beData in dataColl)
				{
					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@EmployeeCode", beData.EmployeeCode);
					cmd.Parameters.AddWithValue("@EnrollNumber", IsDBNull(beData.EnrollNumber));
					cmd.Parameters.AddWithValue("@FirstName", IsDBNull(beData.FirstName));
					cmd.Parameters.AddWithValue("@MiddleName", IsDBNull(beData.MiddleName));
					cmd.Parameters.AddWithValue("@LastName", IsDBNull(beData.LastName));
					cmd.Parameters.AddWithValue("@Photo", IsDBNull(beData.Photo));
					cmd.Parameters.AddWithValue("@GenderId", IsDBNull(beData.GenderId));
					cmd.Parameters.AddWithValue("@BloodGroupId", IsDBNull(beData.BloodGroupId));
					cmd.Parameters.AddWithValue("@ReligionId", IsDBNull(beData.ReligionId));
					cmd.Parameters.AddWithValue("@DobBS", IsDBNull(beData.DobBS));
					cmd.Parameters.AddWithValue("@DobAD", IsDBNull(beData.DobAD));
					cmd.Parameters.AddWithValue("@MaritalStatusId", IsDBNull(beData.MaritalStatusId));
					cmd.Parameters.AddWithValue("@NationalityId", IsDBNull(beData.NationalityId));
					cmd.Parameters.AddWithValue("@PanId", IsDBNull(beData.PanId));
					cmd.Parameters.AddWithValue("@CitiNum", IsDBNull(beData.CitiNum));
					cmd.Parameters.AddWithValue("@CitiIssueDate", IsDBNull(beData.CitiIssueDate));
					cmd.Parameters.AddWithValue("@CitiIssuePlaceId", IsDBNull(beData.CitiIssuePlaceId));
					cmd.Parameters.AddWithValue("@CitiFrontImg", IsDBNull(beData.CitiFrontImg));
					cmd.Parameters.AddWithValue("@CitiBackImg", IsDBNull(beData.CitiBackImg));
					cmd.Parameters.AddWithValue("@EmailId", IsDBNull(beData.EmailId));
					cmd.Parameters.AddWithValue("@OfficeNum", IsDBNull(beData.OfficeNum));
					cmd.Parameters.AddWithValue("@PersonalNum", IsDBNull(beData.PersonalNum));
					cmd.Parameters.AddWithValue("@FatherName", IsDBNull(beData.FatherName));
					cmd.Parameters.AddWithValue("@GFatherName", IsDBNull(beData.GFatherName));
					cmd.Parameters.AddWithValue("@MotherName", IsDBNull(beData.MotherName));
					cmd.Parameters.AddWithValue("@DrivingLicNum", IsDBNull(beData.DrivingLicNum));
					cmd.Parameters.AddWithValue("@LicIssueDate", IsDBNull(beData.LicIssueDate));
					cmd.Parameters.AddWithValue("@LicExpiryDate", IsDBNull(beData.LicExpiryDate));
					cmd.Parameters.AddWithValue("@LicIssuePlace", IsDBNull(beData.LicIssuePlace));
					cmd.Parameters.AddWithValue("@PassportNum", IsDBNull(beData.PassportNum));
					cmd.Parameters.AddWithValue("@PassportIssueDate", IsDBNull(beData.PassportIssueDate));
					cmd.Parameters.AddWithValue("@PassportExpiryDate", IsDBNull(beData.PassportExpiryDate));
					cmd.Parameters.AddWithValue("@PassportIssuePlace", IsDBNull(beData.PassportIssuePlace));
					cmd.Parameters.AddWithValue("@PCountryId", IsDBNull(beData.PCountryId));
					cmd.Parameters.AddWithValue("@PStateId", IsDBNull(beData.PStateId));
					cmd.Parameters.AddWithValue("@PDistrictId", IsDBNull(beData.PDistrictId));
					cmd.Parameters.AddWithValue("@PCity", IsDBNull(beData.PCity));
					cmd.Parameters.AddWithValue("@P_LocalLevelId", IsDBNull(beData.P_LocalLevelId));
					cmd.Parameters.AddWithValue("@PWard", IsDBNull(beData.PWard));
					cmd.Parameters.AddWithValue("@PStreet", IsDBNull(beData.PStreet));
					cmd.Parameters.AddWithValue("@PHouseNum", IsDBNull(beData.PHouseNum));
					cmd.Parameters.AddWithValue("@PFullAddr", IsDBNull(beData.PFullAddr));
					cmd.Parameters.AddWithValue("@TCountryId", IsDBNull(beData.TCountryId));
					cmd.Parameters.AddWithValue("@TStateId", IsDBNull(beData.TStateId));
					cmd.Parameters.AddWithValue("@TDistrictId", IsDBNull(beData.TDistrictId));
					cmd.Parameters.AddWithValue("@TCity", IsDBNull(beData.TCity));
					cmd.Parameters.AddWithValue("@Temp_LocalLevelId", IsDBNull(beData.Temp_LocalLevelId));
					cmd.Parameters.AddWithValue("@TWard", IsDBNull(beData.TWard));
					cmd.Parameters.AddWithValue("@TStreet", IsDBNull(beData.TStreet));
					cmd.Parameters.AddWithValue("@THouseNum", IsDBNull(beData.THouseNum));
					cmd.Parameters.AddWithValue("@TFullAddr", IsDBNull(beData.TFullAddr));
					cmd.Parameters.AddWithValue("@ContactPer", IsDBNull(beData.ContactPer));
					cmd.Parameters.AddWithValue("@ContactRelation", IsDBNull(beData.ContactRelation));
					cmd.Parameters.AddWithValue("@ContactAddr", IsDBNull(beData.ContactAddr));
					cmd.Parameters.AddWithValue("@ContactPhone", IsDBNull(beData.ContactPhone));
					cmd.Parameters.AddWithValue("@ContactMobile", IsDBNull(beData.ContactMobile));
					cmd.Parameters.AddWithValue("@CompanyId", IsDBNull(beData.CompanyId));
					cmd.Parameters.AddWithValue("@BranchId", IsDBNull(beData.BranchId));
					cmd.Parameters.AddWithValue("@SubBranch", IsDBNull(beData.SubBranch));
					cmd.Parameters.AddWithValue("@DepartmentId", IsDBNull(beData.DepartmentId));
					cmd.Parameters.AddWithValue("@DesignationId", IsDBNull(beData.DesignationId));
					cmd.Parameters.AddWithValue("@CategoryId", IsDBNull(beData.CategoryId));
					cmd.Parameters.AddWithValue("@ELevelId", IsDBNull(beData.ELevelId));
					cmd.Parameters.AddWithValue("@JTitle", IsDBNull(beData.JTitle));
					cmd.Parameters.AddWithValue("@ServiceTypeId", IsDBNull(beData.ServiceTypeId));
					cmd.Parameters.AddWithValue("@JoinDate", IsDBNull(beData.JoinDate));
					cmd.Parameters.AddWithValue("@ConfirmDate", IsDBNull(beData.ConfirmDate));
					cmd.Parameters.AddWithValue("@RetireDate", IsDBNull(beData.RetireDate));
					cmd.Parameters.AddWithValue("@HeadQtr", IsDBNull(beData.HeadQtr));
					cmd.Parameters.AddWithValue("@RemoteAreaId", IsDBNull(beData.RemoteAreaId));
					cmd.Parameters.AddWithValue("@DisabilitesId", IsDBNull(beData.DisabilitesId));
					cmd.Parameters.AddWithValue("@PfAccNum", IsDBNull(beData.PfAccNum));
					cmd.Parameters.AddWithValue("@PfNominee", IsDBNull(beData.PfNominee));
					cmd.Parameters.AddWithValue("@PfRelation", IsDBNull(beData.PfRelation));
					cmd.Parameters.AddWithValue("@PfID", IsDBNull(beData.PfID));
					cmd.Parameters.AddWithValue("@PfIDNum", IsDBNull(beData.PfIDNum));
					cmd.Parameters.AddWithValue("@PfEntryDate", IsDBNull(beData.PfEntryDate));
					cmd.Parameters.AddWithValue("@PfIssueOffice", IsDBNull(beData.PfIssueOffice));
					cmd.Parameters.AddWithValue("@PfIssuePlace", IsDBNull(beData.PfIssuePlace));
					cmd.Parameters.AddWithValue("@PfAtt", IsDBNull(beData.PfAtt));
					cmd.Parameters.AddWithValue("@AccessNum", IsDBNull(beData.AccessNum));
					cmd.Parameters.AddWithValue("@SsfNum", IsDBNull(beData.SsfNum));
					cmd.Parameters.AddWithValue("@SsfAtt", IsDBNull(beData.SsfAtt));
					cmd.Parameters.AddWithValue("@CitCode", IsDBNull(beData.CitCode));
					cmd.Parameters.AddWithValue("@CitAccNum", IsDBNull(beData.CitAccNum));
					cmd.Parameters.AddWithValue("@CitAmt", IsDBNull(beData.CitAmt));
					cmd.Parameters.AddWithValue("@CitNominee", IsDBNull(beData.CitNominee));
					cmd.Parameters.AddWithValue("@CitRelationId", IsDBNull(beData.CitRelationId));
					cmd.Parameters.AddWithValue("@CitIdType", IsDBNull(beData.CitIdType));
					cmd.Parameters.AddWithValue("@CitIdNum", IsDBNull(beData.CitIdNum));
					cmd.Parameters.AddWithValue("@CitEntryDate", IsDBNull(beData.CitEntryDate));
					cmd.Parameters.AddWithValue("@CitAtt", IsDBNull(beData.CitAtt));
					cmd.Parameters.AddWithValue("@GratCode", IsDBNull(beData.GratCode));
					cmd.Parameters.AddWithValue("@GratAccNum", IsDBNull(beData.GratAccNum));
					cmd.Parameters.AddWithValue("@GratNominee", IsDBNull(beData.GratNominee));
					cmd.Parameters.AddWithValue("@GratRelation", IsDBNull(beData.GratRelation));
					cmd.Parameters.AddWithValue("@GratIdType", IsDBNull(beData.GratIdType));
					cmd.Parameters.AddWithValue("@GratIdNum", IsDBNull(beData.GratIdNum));
					cmd.Parameters.AddWithValue("@GratEntryDate", IsDBNull(beData.GratEntryDate));
					cmd.Parameters.AddWithValue("@GratIssueOffice", IsDBNull(beData.GratIssueOffice));
					cmd.Parameters.AddWithValue("@GratIssuePlace", IsDBNull(beData.GratIssuePlace));
					cmd.Parameters.AddWithValue("@GratAtt", IsDBNull(beData.GratAtt));
					cmd.Parameters.AddWithValue("@LInsuComp", IsDBNull(beData.LInsuComp));
					cmd.Parameters.AddWithValue("@LPolicyName", IsDBNull(beData.LPolicyName));
					cmd.Parameters.AddWithValue("@LPolicyNum", IsDBNull(beData.LPolicyNum));
					cmd.Parameters.AddWithValue("@LPolicyAmt", IsDBNull(beData.LPolicyAmt));
					cmd.Parameters.AddWithValue("@LPolicySDate", IsDBNull(beData.LPolicySDate));
					cmd.Parameters.AddWithValue("@LPolicyLDate", IsDBNull(beData.LPolicyLDate));
					cmd.Parameters.AddWithValue("@LPremiumAmt", IsDBNull(beData.LPremiumAmt));
					cmd.Parameters.AddWithValue("@LPaymentType", IsDBNull(beData.LPaymentType));
					cmd.Parameters.AddWithValue("@LStartMonth", IsDBNull(beData.LStartMonth));
					cmd.Parameters.AddWithValue("@LDedSalary", IsDBNull(beData.LDedSalary));
					cmd.Parameters.AddWithValue("@LRemarks", IsDBNull(beData.LRemarks));
					cmd.Parameters.AddWithValue("@LInsuTypeId", IsDBNull(beData.LInsuTypeId));
					cmd.Parameters.AddWithValue("@LiAtt", IsDBNull(beData.LiAtt));

					cmd.Parameters.AddWithValue("@HInsuComp", IsDBNull(beData.HInsuComp));
					cmd.Parameters.AddWithValue("@HPolicyName", IsDBNull(beData.HPolicyName));
					cmd.Parameters.AddWithValue("@HPolicyNum", IsDBNull(beData.HPolicyNum));
					cmd.Parameters.AddWithValue("@HPolicyAmt", IsDBNull(beData.HPolicyAmt));
					cmd.Parameters.AddWithValue("@HPolicySDate", IsDBNull(beData.HPolicySDate));
					cmd.Parameters.AddWithValue("@HPolicyLDate", IsDBNull(beData.HPolicyLDate));
					cmd.Parameters.AddWithValue("@HPremiumAmt", IsDBNull(beData.HPremiumAmt));
					cmd.Parameters.AddWithValue("@HPaymentType", IsDBNull(beData.HPaymentType));
					cmd.Parameters.AddWithValue("@HStartMonth", IsDBNull(beData.HStartMonth));
					cmd.Parameters.AddWithValue("@HDedSalary", IsDBNull(beData.HDedSalary));
					cmd.Parameters.AddWithValue("@HRemarks", IsDBNull(beData.HRemarks));
					cmd.Parameters.AddWithValue("@HInsuTypeId", IsDBNull(beData.HInsuTypeId));
					cmd.Parameters.AddWithValue("@HiAtt", IsDBNull(beData.HiAtt));
					cmd.Parameters.AddWithValue("@AccLedger", IsDBNull(beData.AccLedger));
					cmd.Parameters.AddWithValue("@CostCenterId", IsDBNull(beData.CostCenterId));
					cmd.Parameters.AddWithValue("@OTLedger", IsDBNull(beData.OTLedger));
					cmd.Parameters.AddWithValue("@EFirstLevel", IsDBNull(beData.EFirstLevel));
					cmd.Parameters.AddWithValue("@ESecondLevel", IsDBNull(beData.ESecondLevel));
					cmd.Parameters.AddWithValue("@EThirdLevel", IsDBNull(beData.EThirdLevel));
					cmd.Parameters.AddWithValue("@UserId", IsDBNull(beData.CUserId));
					cmd.Parameters.AddWithValue("@EntityId", IsDBNull(beData.EntityId));
					cmd.Parameters.AddWithValue("@EmployeeId", IsDBNull(beData.EmployeeId));					 
					cmd.Parameters.AddWithValue("@CitiIssuePlace", IsDBNull(beData.CitiIssuePlace));
					cmd.Parameters.AddWithValue("@PStateName", IsDBNull(beData.PStateName));
					cmd.Parameters.AddWithValue("@PDistrictName", IsDBNull(beData.PDistrictName));
					cmd.Parameters.AddWithValue("@P_LocalLevelName", IsDBNull(beData.P_LocalLevelName));
					cmd.Parameters.AddWithValue("@TStateName", IsDBNull(beData.TStateName));
					cmd.Parameters.AddWithValue("@TDistrictName", IsDBNull(beData.TDistrictName));
					cmd.Parameters.AddWithValue("@Temp_LocalLevelName", IsDBNull(beData.Temp_LocalLevelName));
					cmd.Parameters.AddWithValue("@EmployeeNo", IsDBNull(beData.EmployeeNo));
					cmd.Parameters.AddWithValue("@BrandId", IsDBNull(beData.BrandId));
					cmd.Parameters.AddWithValue("@PermanentDate", IsDBNull(beData.PermanentDate));
					cmd.Parameters.AddWithValue("@TaxRullId", IsDBNull(beData.TaxRullId));
					cmd.Parameters.AddWithValue("@EmployeeGroupId", IsDBNull(beData.EmployeeGroupId));					
					cmd.Parameters.AddWithValue("@ProjectId", IsDBNull(beData.ProjectId));
					cmd.Parameters.AddWithValue("@SpouseName", IsDBNull(beData.SpouseName));
					cmd.Parameters.AddWithValue("@AnniversaryDate", IsDBNull(beData.AnniversaryDate));
					cmd.Parameters.AddWithValue("@PA_Zone", IsDBNull(beData.PA_Zone));
					cmd.Parameters.AddWithValue("@TA_Counrty", IsDBNull(beData.TA_Counrty));
					cmd.Parameters.AddWithValue("@TA_Zone", IsDBNull(beData.TA_Zone));
					cmd.Parameters.AddWithValue("@RemoteArea", IsDBNull(beData.RemoteArea));
					cmd.Parameters.AddWithValue("@Disability", IsDBNull(beData.Disability));
					cmd.Parameters.AddWithValue("@CIT_RelationShip", IsDBNull(beData.CIT_RelationShip));
					cmd.Parameters.AddWithValue("@BankName", IsDBNull(beData.BankName));
					cmd.Parameters.AddWithValue("@BA_AccountName", IsDBNull(beData.BA_AccountName));
					cmd.Parameters.AddWithValue("@BA_AccountNo", IsDBNull(beData.BA_AccountNo));
					cmd.Parameters.AddWithValue("@BA_Branch", IsDBNull(beData.BA_Branch));
					cmd.Parameters.AddWithValue("@BA_IsForPayroll", IsDBNull(beData.BA_IsForPayroll));
					cmd.Parameters.AddWithValue("@Signature", IsDBNull(beData.Signature));
					cmd.Parameters.AddWithValue("@SignaturePath", IsDBNull(beData.SignaturePath));
					cmd.Parameters.AddWithValue("@PhotoPath", IsDBNull(beData.PhotoPath));
					cmd.Parameters.AddWithValue("@MotherTonque", IsDBNull(beData.MotherTonque));
					cmd.Parameters.AddWithValue("@Rank", IsDBNull(beData.Rank));
					cmd.Parameters.AddWithValue("@Position", IsDBNull(beData.Position));
					cmd.Parameters.AddWithValue("@TeacherType", IsDBNull(beData.TeacherType));
					cmd.Parameters.AddWithValue("@TeachingLanguage", IsDBNull(beData.TeachingLanguage));
					cmd.Parameters.AddWithValue("@LicenseNo", IsDBNull(beData.LicenseNo));
					cmd.Parameters.AddWithValue("@TrkNo", IsDBNull(beData.TrkNo));
					cmd.Parameters.AddWithValue("@CasteId", IsDBNull(beData.CasteId));
					cmd.Parameters.AddWithValue("@EMSId", IsDBNull(beData.EMSId));
					cmd.Parameters.AddWithValue("@IsTeaching", IsDBNull(beData.IsTeaching));
					cmd.Parameters.AddWithValue("@SubjectTeacherId", IsDBNull(beData.SubjectTeacherId));
					cmd.Parameters.AddWithValue("@IsPhysicalDisability", IsDBNull(beData.IsPhysicalDisability));
					cmd.Parameters.AddWithValue("@PhysicalDisability", IsDBNull(beData.PhysicalDisability));
					cmd.Parameters.AddWithValue("@UDF", IsDBNull(beData.UDF));
					cmd.Parameters.AddWithValue("@FatherContactNo", IsDBNull(beData.FatherContactNo));
					cmd.Parameters.AddWithValue("@MotherContactNo", IsDBNull(beData.MotherContactNo));
					cmd.Parameters.AddWithValue("@SpouseContactNo", IsDBNull(beData.SpouseContactNo));
					cmd.Parameters.AddWithValue("@OfficeEmailId", IsDBNull(beData.OfficeEmailId));
					cmd.Parameters.AddWithValue("@SalaryApplicableYearId", IsDBNull(beData.SalaryApplicableYearId));
					cmd.Parameters.AddWithValue("@SalaryApplicableMonthId", IsDBNull(beData.SalaryApplicableMonthId));
					cmd.Parameters.AddWithValue("@SystemUserId", IsDBNull(beData.SystemUserId));
					cmd.Parameters.AddWithValue("@IsAllowOT", IsDBNull(beData.IsAllowOT));
					cmd.Parameters.AddWithValue("@OTCalculation", IsDBNull(beData.OTCalculation));
					cmd.Parameters.AddWithValue("@CompanyRelationshipId", IsDBNull(beData.CompanyRelationshipId));
					cmd.Parameters.AddWithValue("@LeaveApplicableDate", IsDBNull(beData.LeaveApplicableDate));
					cmd.Parameters.AddWithValue("@Attributes", IsDBNull(beData.Attributes));
					cmd.Parameters.AddWithValue("@UDFKeyVal", IsDBNull(beData.UDFKeyVal));

					int colLen = query.Split('@').Length - 2;
					if (colLen > 1)
					{
						cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + " ; " + query;
						cmd.ExecuteNonQuery();
					}
					  

				}
 

				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = "Employee Details Update Success";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;
		}

		public ResponeValues DeleteById(int UserId, int EntityId, int EmployeeId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
			cmd.CommandText = "usp_DelEmployeeById";
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}
		public Dynamic.BE.HR.EmployeeCollections getAllEmployee(int UserId, int EntityId, int? UserType)
		{
			Dynamic.BE.HR.EmployeeCollections dataColl = new Dynamic.BE.HR.EmployeeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllEmployee";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.Employee beData = new Dynamic.BE.HR.Employee();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EmailId = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.ContactPer = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.DepartmentId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.DepartmentName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.DesignationId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.DesignationName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.BranchId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.BranchName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.CardNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.UserId = reader.GetInt32(13);
					dataColl.Add(beData);
				}
				reader.Close();
				dataColl.IsSuccess = true;
				dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return dataColl;

        }

        private void SaveEmpBankAccDetails(int UserId, int EmployeeId, Dynamic.BE.HR.EmpBankAccCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || EmployeeId == 0)
                return;

            foreach (Dynamic.BE.HR.EmpBankAcc beData in beDataColl)
            {
                if (beData.BankNameId == 0 || beData.BankNameId == null)
                    continue;
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@BankNameId", beData.BankNameId);
                cmd.Parameters.AddWithValue("@AccName", beData.AccName);
                cmd.Parameters.AddWithValue("@AccNum", beData.AccNum);
                cmd.Parameters.AddWithValue("@Branch", beData.Branch);
                cmd.Parameters.AddWithValue("@ForPayroll", beData.ForPayroll);
                cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_AddEmpBankAccDetails";
                cmd.ExecuteNonQuery();
            }

        }

        private void SaveAcaQualificationDetails(int UserId, int EmployeeId, Dynamic.BE.HR.AcaQualificationCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmployeeId == 0)
				return;

			foreach (Dynamic.BE.HR.AcaQualification beData in beDataColl)
			{
				if (string.IsNullOrWhiteSpace(beData.DegreeName))
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@DegreeName", beData.DegreeName);
				cmd.Parameters.AddWithValue("@BoardUni", beData.BoardUni);
				cmd.Parameters.AddWithValue("@PassedYr", beData.PassedYr);
				cmd.Parameters.AddWithValue("@GradePer", beData.GradePer);
				cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddAcaQualificationDetails";
				cmd.ExecuteNonQuery();
			}
		}

		private void SaveWorkExpDetails(int UserId, int EmployeeId, Dynamic.BE.HR.WorkExpCollections beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || EmployeeId == 0)
				return;

			foreach (Dynamic.BE.HR.WorkExp beData in beDataColl)
			{
				if (string.IsNullOrWhiteSpace(beData.Org))
					continue;
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@Org", beData.Org);
				cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
				cmd.Parameters.AddWithValue("@JobTitle", beData.JobTitle);
				cmd.Parameters.AddWithValue("@StartDate", beData.StartDate);
				cmd.Parameters.AddWithValue("@EndDate", beData.EndDate);
				cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
				cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
				cmd.Parameters.AddWithValue("@UserId", UserId);
				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddWorkExpDetails";
				cmd.ExecuteNonQuery();
			}
		}

		private void SaveEmpDocumentDetails(Dynamic.BusinessEntity.GeneralDocumentCollections dataColl, int EmployeeId, int UserId)
		{

			foreach (var beData in dataColl)
				if (!string.IsNullOrEmpty(beData.DocPath))
				{
					System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
					cmd.CommandType = System.Data.CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);
					cmd.Parameters.AddWithValue("@Name", beData.Name);
					cmd.Parameters.AddWithValue("@Description", beData.Description);
					cmd.Parameters.AddWithValue("@Extension", beData.Extension);
					cmd.Parameters.AddWithValue("@Document", beData.Data);
					cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
					cmd.Parameters.AddWithValue("@UserId", UserId);
					cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
					cmd.CommandText = "usp_AddEmpDocumentDetails";
					cmd.ExecuteNonQuery();
				}

		}

		/// <summary>
		/// Line no 758 Change Data Type from GetString to GetInt32
		/// </summary>
		/// <param name="UserId"></param>
		/// <param name="EntityId"></param>
		/// <param name="EmployeeId"></param>
		/// <returns></returns>
		public Dynamic.BE.HR.Employee getEmployeeById(int UserId, int EntityId, int EmployeeId)
		{
			Dynamic.BE.HR.Employee beData = new Dynamic.BE.HR.Employee();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetEmployeeById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.Employee();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.FirstName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.MiddleName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.LastName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Photo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.GenderId = Convert.ToString(reader[7]);
					if (!(reader[8] is DBNull)) beData.BloodGroupId = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.ReligionId = Convert.ToInt32(reader[9]);
					if (!(reader[10] is DBNull)) beData.DobBS = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.DobAD = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.MaritalStatusId = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) beData.NationalityId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.PanId = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.CitiNum = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.CitiIssueDate = Convert.ToDateTime(reader[16]);
					if (!(reader[17] is DBNull)) beData.CitiIssuePlaceId = reader.GetInt32(17);
					if (!(reader[18] is DBNull)) beData.CitiFrontImg = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.CitiBackImg = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.EmailId = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.OfficeNum = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.PersonalNum = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.FatherName = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.GFatherName = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.MotherName = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.DrivingLicNum = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.LicIssueDate = Convert.ToDateTime(reader[27]);
					if (!(reader[28] is DBNull)) beData.LicExpiryDate = Convert.ToDateTime(reader[28]);
					if (!(reader[29] is DBNull)) beData.LicIssuePlace = reader.GetString(29);
					if (!(reader[30] is DBNull)) beData.PassportNum = reader.GetString(30);
					if (!(reader[31] is DBNull)) beData.PassportIssueDate = Convert.ToDateTime(reader[31]);
					if (!(reader[32] is DBNull)) beData.PassportExpiryDate = Convert.ToDateTime(reader[32]);
					if (!(reader[33] is DBNull)) beData.PassportIssuePlace = reader.GetString(33);
					if (!(reader[34] is DBNull)) beData.PCountryId = reader.GetInt32(34);
					if (!(reader[35] is DBNull)) beData.PStateId = reader.GetInt32(35);
					if (!(reader[36] is DBNull)) beData.PDistrictId = reader.GetInt32(36);
					if (!(reader[37] is DBNull)) beData.PCity = reader.GetString(37);
					if (!(reader[38] is DBNull)) beData.P_LocalLevelId = reader.GetInt32(38);
					if (!(reader[39] is DBNull)) beData.PWard = reader.GetInt32(39);
					if (!(reader[40] is DBNull)) beData.PStreet = reader.GetString(40);
					if (!(reader[41] is DBNull)) beData.PHouseNum = reader.GetString(41);
					if (!(reader[42] is DBNull)) beData.PFullAddr = reader.GetString(42);
					if (!(reader[43] is DBNull)) beData.TCountryId = reader.GetInt32(43);
					if (!(reader[44] is DBNull)) beData.TStateId = reader.GetInt32(44);
					if (!(reader[45] is DBNull)) beData.TDistrictId = reader.GetInt32(45);
					if (!(reader[46] is DBNull)) beData.TCity = reader.GetString(46);
					if (!(reader[47] is DBNull)) beData.Temp_LocalLevelId = reader.GetInt32(47);
					if (!(reader[48] is DBNull)) beData.TWard = reader.GetInt32(48);
					if (!(reader[49] is DBNull)) beData.TStreet = reader.GetString(49);
					if (!(reader[50] is DBNull)) beData.THouseNum = reader.GetString(50);
					if (!(reader[51] is DBNull)) beData.TFullAddr = reader.GetString(51);
					if (!(reader[52] is DBNull)) beData.ContactPer = reader.GetString(52);
					if (!(reader[53] is DBNull)) beData.ContactRelation = reader.GetInt32(53);
					if (!(reader[54] is DBNull)) beData.ContactAddr = reader.GetString(54);
					if (!(reader[55] is DBNull)) beData.ContactPhone = reader.GetString(55);
					if (!(reader[56] is DBNull)) beData.ContactMobile = reader.GetString(56);
					if (!(reader[57] is DBNull)) beData.CompanyId = reader.GetInt32(57);
					if (!(reader[58] is DBNull)) beData.BranchId = reader.GetInt32(58);
					if (!(reader[59] is DBNull)) beData.SubBranch = reader.GetInt32(59);
					if (!(reader[60] is DBNull)) beData.DepartmentId = reader.GetInt32(60);
					if (!(reader[61] is DBNull)) beData.DesignationId = reader.GetInt32(61);
					if (!(reader[62] is DBNull)) beData.CategoryId = reader.GetInt32(62);
					if (!(reader[63] is DBNull)) beData.ELevelId = reader.GetInt32(63);
					if (!(reader[64] is DBNull)) beData.JTitle = reader.GetString(64);
					if (!(reader[65] is DBNull)) beData.ServiceTypeId = reader.GetInt32(65);
					if (!(reader[66] is DBNull)) beData.JoinDate = Convert.ToDateTime(reader[66]);
					if (!(reader[67] is DBNull)) beData.ConfirmDate = Convert.ToDateTime(reader[67]);
					if (!(reader[68] is DBNull)) beData.RetireDate = Convert.ToDateTime(reader[68]);
					if (!(reader[69] is DBNull)) beData.HeadQtr = reader.GetString(69);
					if (!(reader[70] is DBNull)) beData.RemoteAreaId = reader.GetInt32(70);
					if (!(reader[71] is DBNull)) beData.DisabilitesId = reader.GetInt32(71);
					if (!(reader[72] is DBNull)) beData.PfAccNum = reader.GetString(72);
					if (!(reader[73] is DBNull)) beData.PfNominee = reader.GetString(73);
					if (!(reader[74] is DBNull)) beData.PfRelation = reader.GetInt32(74);
					if (!(reader[75] is DBNull)) beData.PfID = reader.GetInt32(75);
					if (!(reader[76] is DBNull)) beData.PfIDNum = reader.GetString(76);
					if (!(reader[77] is DBNull)) beData.PfEntryDate = Convert.ToDateTime(reader[77]);
					if (!(reader[78] is DBNull)) beData.PfIssueOffice = reader.GetString(78);
					if (!(reader[79] is DBNull)) beData.PfIssuePlace = reader.GetString(79);
					if (!(reader[80] is DBNull)) beData.PfAtt = reader.GetString(80);
					if (!(reader[81] is DBNull)) beData.AccessNum = reader.GetString(81);
					if (!(reader[82] is DBNull)) beData.SsfNum = reader.GetString(82);
					if (!(reader[83] is DBNull)) beData.SsfAtt = reader.GetString(83);
					if (!(reader[84] is DBNull)) beData.CitCode = reader.GetString(84);
					if (!(reader[85] is DBNull)) beData.CitAccNum = reader.GetString(85);
					if (!(reader[86] is DBNull)) beData.CitAmt = Convert.ToDouble(reader[86]);
					if (!(reader[87] is DBNull)) beData.CitNominee = reader.GetString(87);
					if (!(reader[88] is DBNull)) beData.CitRelationId = reader.GetInt32(88);
					if (!(reader[89] is DBNull)) beData.CitIdType = reader.GetInt32(89);
					if (!(reader[90] is DBNull)) beData.CitIdNum = reader.GetString(90);
					if (!(reader[91] is DBNull)) beData.CitEntryDate = Convert.ToDateTime(reader[91]);
					if (!(reader[92] is DBNull)) beData.CitAtt = reader.GetString(92);
					if (!(reader[93] is DBNull)) beData.GratCode = reader.GetString(93);
					if (!(reader[94] is DBNull)) beData.GratAccNum = reader.GetString(94);
					if (!(reader[95] is DBNull)) beData.GratNominee = reader.GetString(95);
					if (!(reader[96] is DBNull)) beData.GratRelation = reader.GetInt32(96);
					if (!(reader[97] is DBNull)) beData.GratIdType = reader.GetInt32(97);
					if (!(reader[98] is DBNull)) beData.GratIdNum = reader.GetString(98);
					if (!(reader[99] is DBNull)) beData.GratEntryDate = Convert.ToDateTime(reader[99]);
					if (!(reader[100] is DBNull)) beData.GratIssueOffice = reader.GetString(100);
					if (!(reader[101] is DBNull)) beData.GratIssuePlace = reader.GetString(101);
					if (!(reader[102] is DBNull)) beData.GratAtt = reader.GetString(102);
					if (!(reader[103] is DBNull)) beData.LInsuComp = reader.GetString(103);
					if (!(reader[104] is DBNull)) beData.LPolicyName = reader.GetString(104);
					if (!(reader[105] is DBNull)) beData.LPolicyNum = reader.GetString(105);
					if (!(reader[106] is DBNull)) beData.LPolicyAmt = Convert.ToDouble(reader[106]);
					if (!(reader[107] is DBNull)) beData.LPolicySDate = Convert.ToDateTime(reader[107]);
					if (!(reader[108] is DBNull)) beData.LPolicyLDate = Convert.ToDateTime(reader[108]);
					if (!(reader[109] is DBNull)) beData.LPremiumAmt = Convert.ToDouble(reader[109]);
					if (!(reader[110] is DBNull)) beData.LPaymentType = reader.GetInt32(110);
					if (!(reader[111] is DBNull)) beData.LStartMonth = reader.GetInt32(111);
					if (!(reader[112] is DBNull)) beData.LDedSalary = Convert.ToBoolean(reader[112]);
					if (!(reader[113] is DBNull)) beData.LRemarks = reader.GetString(113);
					if (!(reader[114] is DBNull)) beData.LInsuTypeId = reader.GetInt32(114);
					if (!(reader[115] is DBNull)) beData.LiAtt = reader.GetString(115);
					if (!(reader[116] is DBNull)) beData.HInsuComp = reader.GetString(116);
					if (!(reader[117] is DBNull)) beData.HPolicyName = reader.GetString(117);
					if (!(reader[118] is DBNull)) beData.HPolicyNum = reader.GetString(118);
					if (!(reader[119] is DBNull)) beData.HPolicyAmt = Convert.ToDouble(reader[119]);
					if (!(reader[120] is DBNull)) beData.HPolicySDate = Convert.ToDateTime(reader[120]);
					if (!(reader[121] is DBNull)) beData.HPolicyLDate = Convert.ToDateTime(reader[121]);
					if (!(reader[122] is DBNull)) beData.HPremiumAmt = Convert.ToDouble(reader[122]);
					if (!(reader[123] is DBNull)) beData.HPaymentType = reader.GetInt32(123);
					if (!(reader[124] is DBNull)) beData.HStartMonth = reader.GetInt32(124);
					if (!(reader[125] is DBNull)) beData.HDedSalary = Convert.ToBoolean(reader[125]);
					if (!(reader[126] is DBNull)) beData.HRemarks = reader.GetString(126);
					if (!(reader[127] is DBNull)) beData.HInsuTypeId = reader.GetInt32(127);
					if (!(reader[128] is DBNull)) beData.HiAtt = reader.GetString(128);
					if (!(reader[129] is DBNull)) beData.AccLedger = reader.GetString(129);
					if (!(reader[130] is DBNull)) beData.CostCenterId = reader.GetInt32(130);
					if (!(reader[131] is DBNull)) beData.OTLedger = reader.GetString(131);
					if (!(reader[132] is DBNull)) beData.EFirstLevel = reader.GetInt32(132);
					if (!(reader[133] is DBNull)) beData.ESecondLevel = reader.GetInt32(133);
					if (!(reader[134] is DBNull)) beData.EThirdLevel = reader.GetInt32(134);
					if (!(reader[135] is DBNull)) beData.EmployeeNo = reader.GetInt32(135);
					if (!(reader[136] is DBNull)) beData.BrandId = reader.GetInt32(136);
					if (!(reader[136] is DBNull)) beData.BrandId = reader.GetInt32(136);
					if (!(reader[137] is DBNull)) beData.PermanentDate = Convert.ToDateTime(reader[137]);
					if (!(reader[138] is DBNull)) beData.TaxRullId = reader.GetInt32(138);
					if (!(reader[139] is DBNull)) beData.EmployeeGroupId = reader.GetInt32(139);
					if (!(reader[140] is DBNull)) beData.ProjectId = reader.GetInt32(140);
					if (!(reader[141] is DBNull)) beData.SpouseName = reader.GetString(141);
					if (!(reader[142] is DBNull)) beData.AnniversaryDate = Convert.ToDateTime(reader[142]);
					if (!(reader[143] is DBNull)) beData.PA_Zone = reader.GetString(143);
					if (!(reader[144] is DBNull)) beData.TA_Counrty = reader.GetString(144);
					if (!(reader[145] is DBNull)) beData.TA_Zone = reader.GetString(145);
					if (!(reader[146] is DBNull)) beData.RemoteArea = reader.GetString(146);
					if (!(reader[147] is DBNull)) beData.Disability = reader.GetString(147);
					if (!(reader[148] is DBNull)) beData.CIT_RelationShip = reader.GetString(148);
					if (!(reader[149] is DBNull)) beData.BankName = reader.GetString(149);
					if (!(reader[150] is DBNull)) beData.BA_AccountName = reader.GetString(150);
					if (!(reader[151] is DBNull)) beData.BA_AccountNo = reader.GetString(151);
					if (!(reader[152] is DBNull)) beData.BA_Branch = reader.GetString(152);
					if (!(reader[153] is DBNull)) beData.BA_IsForPayroll = Convert.ToBoolean(reader[153] );
					if (!(reader[154] is DBNull)) beData.Signature = (byte[])reader[154];
					if (!(reader[155] is DBNull)) beData.SignaturePath = reader.GetString(155);
					if (!(reader[156] is DBNull)) beData.PhotoPath = reader.GetString(156);
					if (!(reader[157] is DBNull)) beData.MotherTonque = reader.GetString(157);
					if (!(reader[158] is DBNull)) beData.Rank = reader.GetString(158);
					if (!(reader[159] is DBNull)) beData.Position = reader.GetString(159);
					if (!(reader[160] is DBNull)) beData.TeacherType = reader.GetString(160);
					if (!(reader[161] is DBNull)) beData.TeachingLanguage = reader.GetString(161);
					if (!(reader[162] is DBNull)) beData.LicenseNo = reader.GetString(162);
					if (!(reader[163] is DBNull)) beData.TrkNo = reader.GetString(163);
					if (!(reader[164] is DBNull)) beData.CasteId = reader.GetInt32(164);
					if (!(reader[165] is DBNull)) beData.EMSId = reader.GetString(165);
					if (!(reader[166] is DBNull)) beData.IsTeaching = Convert.ToBoolean(reader[166]);
					if (!(reader[167] is DBNull)) beData.SubjectTeacherId = reader.GetInt32(167);
					if (!(reader[168] is DBNull)) beData.IsPhysicalDisability = Convert.ToBoolean(reader[168]);
					if (!(reader[169] is DBNull)) beData.PhysicalDisability = reader.GetString(169);
					if (!(reader[170] is DBNull)) beData.UDF = reader.GetString(170);
					if (!(reader[171] is DBNull)) beData.FatherContactNo = reader.GetString(171);
					if (!(reader[172] is DBNull)) beData.MotherContactNo = reader.GetString(172);
					if (!(reader[173] is DBNull)) beData.SpouseContactNo = reader.GetString(173);
					if (!(reader[174] is DBNull)) beData.OfficeEmailId = reader.GetString(174);
					if (!(reader[175] is DBNull)) beData.SalaryApplicableYearId = reader.GetInt32(175);
					if (!(reader[176] is DBNull)) beData.SalaryApplicableMonthId = reader.GetInt32(176);
					if (!(reader[177] is DBNull)) beData.SystemUserId = reader.GetInt32(177);
					if (!(reader[178] is DBNull)) beData.IsAllowOT = Convert.ToBoolean(reader[178]);
					if (!(reader[179] is DBNull)) beData.OTCalculation = reader.GetInt32(179);
					if (!(reader[180] is DBNull)) beData.CompanyRelationshipId = reader.GetInt32(180);
					if (!(reader[181] is DBNull)) beData.LeaveApplicableDate = Convert.ToDateTime(reader[181]);                    
					if (!(reader[182] is DBNull)) beData.Attributes = Convert.ToString(reader[182]);
					if (!(reader[183] is DBNull)) beData.UDFKeyVal = Convert.ToString(reader[183]);
				}
				reader.NextResult();
				beData.EmpBankAccColl = new Dynamic.BE.HR.EmpBankAccCollections();
				while (reader.Read())
				{
					Dynamic.BE.HR.EmpBankAcc det1 = new Dynamic.BE.HR.EmpBankAcc();
					if (!(reader[0] is DBNull)) det1.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.BankNameId = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) det1.AccName = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.AccNum = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.Branch = reader.GetString(4);
					if (!(reader[5] is DBNull)) det1.ForPayroll = Convert.ToBoolean(reader[5]);
					beData.EmpBankAccColl.Add(det1);
				}
				reader.NextResult();
				beData.AcaQualificationColl = new Dynamic.BE.HR.AcaQualificationCollections();
				while (reader.Read())
				{
					Dynamic.BE.HR.AcaQualification det2 = new Dynamic.BE.HR.AcaQualification();
					if (!(reader[0] is DBNull)) det2.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det2.DegreeName = reader.GetString(1);
					if (!(reader[2] is DBNull)) det2.BoardUni = reader.GetString(2);
					if (!(reader[3] is DBNull)) det2.PassedYr = reader.GetString(3);
					if (!(reader[4] is DBNull)) det2.GradePer = reader.GetString(4);
					beData.AcaQualificationColl.Add(det2);
				}
				reader.NextResult();
				beData.WorkExpColl = new Dynamic.BE.HR.WorkExpCollections();
				while (reader.Read())
				{
					Dynamic.BE.HR.WorkExp det3 = new Dynamic.BE.HR.WorkExp();
					if (!(reader[0] is DBNull)) det3.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det3.Org = reader.GetString(1);
					if (!(reader[2] is DBNull)) det3.DepartmentId = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) det3.JobTitle = reader.GetString(3);
					if (!(reader[4] is DBNull)) det3.StartDate = Convert.ToDateTime(reader[4]);
					if (!(reader[5] is DBNull)) det3.EndDate = Convert.ToDateTime(reader[5]);
					if (!(reader[6] is DBNull)) det3.Remarks = reader.GetString(6);
					beData.WorkExpColl.Add(det3);
				}
				reader.NextResult();

				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det.DocumentTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) det.Extension = reader.GetString(2);
					if (!(reader[3] is DBNull)) det.DocPath = reader.GetString(3);
					if (!(reader[4] is DBNull)) det.Description = reader.GetString(4);
					beData.AttachmentColl.Add(det);
				}
				reader.Close();
				beData.IsSuccess = true;
				beData.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				beData.IsSuccess = false;
				beData.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return beData;

		}

		public Dynamic.BE.HR.Employee getDocViewById(int UserId, int EntityId, int EmployeeId)
		{
			Dynamic.BE.HR.Employee beData = new Dynamic.BE.HR.Employee();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDovumentView";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.BE.HR.Employee();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Photo = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.CitiFrontImg = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.CitiBackImg = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.PfAtt = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.SsfAtt = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.CitAtt = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.GratAtt = reader.GetString(7);

				}
				reader.NextResult();

				while (reader.Read())
				{
					Dynamic.BusinessEntity.GeneralDocument det = new Dynamic.BusinessEntity.GeneralDocument();
					if (!(reader[0] is DBNull)) det.DocumentTypeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det.DocumentTypeName = reader.GetString(1);
					if (!(reader[2] is DBNull)) det.Name = reader.GetString(2);
					if (!(reader[3] is DBNull)) det.Extension = reader.GetString(3);
					if (!(reader[4] is DBNull)) det.DocPath = reader.GetString(4);
					if (!(reader[5] is DBNull)) det.Description = reader.GetString(5);
					beData.AttachmentColl.Add(det);
				}
				reader.Close();
				beData.IsSuccess = true;
				beData.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				beData.IsSuccess = false;
				beData.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return beData;

		}

		public ResponeValues SaveUpdateEmpDetail(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EmployeeCode", beData.EmployeeCode);
			cmd.Parameters.AddWithValue("@EnrollNumber", beData.EnrollNumber);
			cmd.Parameters.AddWithValue("@FirstName", beData.FirstName);
			cmd.Parameters.AddWithValue("@MiddleName", beData.MiddleName);
			cmd.Parameters.AddWithValue("@LastName", beData.LastName);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);
			cmd.Parameters.AddWithValue("@GenderId", beData.GenderId);
			cmd.Parameters.AddWithValue("@BloodGroupId", beData.BloodGroupId);
			cmd.Parameters.AddWithValue("@ReligionId", beData.ReligionId);
			cmd.Parameters.AddWithValue("@DobBS", beData.DobBS);
			cmd.Parameters.AddWithValue("@DobAD", beData.DobAD);
			cmd.Parameters.AddWithValue("@MaritalStatusId", beData.MaritalStatusId);
			cmd.Parameters.AddWithValue("@NationalityId", beData.NationalityId);
			cmd.Parameters.AddWithValue("@PanId", beData.PanId);
			cmd.Parameters.AddWithValue("@CitiNum", beData.CitiNum);
			cmd.Parameters.AddWithValue("@CitiIssueDate", beData.CitiIssueDate);
			cmd.Parameters.AddWithValue("@CitiIssuePlaceId", beData.CitiIssuePlaceId);
			cmd.Parameters.AddWithValue("@CitiFrontImg", beData.CitiFrontImg);
			cmd.Parameters.AddWithValue("@CitiBackImg", beData.CitiBackImg);
			cmd.Parameters.AddWithValue("@EmailId", beData.EmailId);
			cmd.Parameters.AddWithValue("@OfficeNum", beData.OfficeNum);
			cmd.Parameters.AddWithValue("@PersonalNum", beData.PersonalNum);
			cmd.Parameters.AddWithValue("@FatherName", beData.FatherName);
			cmd.Parameters.AddWithValue("@GFatherName", beData.GFatherName);
			cmd.Parameters.AddWithValue("@MotherName", beData.MotherName);
			cmd.Parameters.AddWithValue("@DrivingLicNum", beData.DrivingLicNum);
			cmd.Parameters.AddWithValue("@LicIssueDate", beData.LicIssueDate);
			cmd.Parameters.AddWithValue("@LicExpiryDate", beData.LicExpiryDate);
			cmd.Parameters.AddWithValue("@LicIssuePlace", beData.LicIssuePlace);
			cmd.Parameters.AddWithValue("@PassportNum", beData.PassportNum);
			cmd.Parameters.AddWithValue("@PassportIssueDate", beData.PassportIssueDate);
			cmd.Parameters.AddWithValue("@PassportExpiryDate", beData.PassportExpiryDate);
			cmd.Parameters.AddWithValue("@PassportIssuePlace", beData.PassportIssuePlace);
			cmd.Parameters.AddWithValue("@CitiIssuePlace", beData.CitiIssuePlace);
			cmd.Parameters.AddWithValue("@EmployeeNo", beData.EmployeeNo);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmployeeDetails";
			}
			else
			{
				cmd.Parameters[37].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmployeeDetails";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[38].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[39].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[40].Direction = System.Data.ParameterDirection.Output;

			cmd.Parameters.AddWithValue("@SpouseName", beData.SpouseName);
			cmd.Parameters.AddWithValue("@AnniversaryDate", beData.AnniversaryDate);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[37].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[37].Value);

				if (!(cmd.Parameters[38].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[38].Value);

				if (!(cmd.Parameters[39].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[39].Value);

				if (!(cmd.Parameters[40].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[40].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;

		}

		public ResponeValues SaveUpdateEmpAdd(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PCountryId", beData.PCountryId);
			cmd.Parameters.AddWithValue("@PStateId", beData.PStateId);
			cmd.Parameters.AddWithValue("@PDistrictId", beData.PDistrictId);
			cmd.Parameters.AddWithValue("@P_LocalLevelId", beData.P_LocalLevelId);
			cmd.Parameters.AddWithValue("@PCity", beData.PCity);
			cmd.Parameters.AddWithValue("@PWard", beData.PWard);
			cmd.Parameters.AddWithValue("@PStreet", beData.PStreet);
			cmd.Parameters.AddWithValue("@PHouseNum", beData.PHouseNum);
			cmd.Parameters.AddWithValue("@PFullAddr", beData.PFullAddr);
			cmd.Parameters.AddWithValue("@TCountryId", beData.TCountryId);
			cmd.Parameters.AddWithValue("@TStateId", beData.TStateId);
			cmd.Parameters.AddWithValue("@TDistrictId", beData.TDistrictId);
			cmd.Parameters.AddWithValue("@Temp_LocalLevelId", beData.Temp_LocalLevelId);
			cmd.Parameters.AddWithValue("@TCity", beData.TCity);
			cmd.Parameters.AddWithValue("@TWard", beData.TWard);
			cmd.Parameters.AddWithValue("@TStreet", beData.TStreet);
			cmd.Parameters.AddWithValue("@THouseNum", beData.THouseNum);
			cmd.Parameters.AddWithValue("@TFullAddr", beData.TFullAddr);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmployeeAdd";
			}
			else
			{
				cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmployeeAdd";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PStateName", beData.PStateName);
			cmd.Parameters.AddWithValue("@PDistrictName", beData.PDistrictName);
			cmd.Parameters.AddWithValue("@P_LocalLevelName", beData.P_LocalLevelName);
			cmd.Parameters.AddWithValue("@TStateName", beData.TStateName);
			cmd.Parameters.AddWithValue("@TDistrictName", beData.TDistrictName);
			cmd.Parameters.AddWithValue("@Temp_LocalLevelName", beData.Temp_LocalLevelName);


			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[20].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[20].Value);

				if (!(cmd.Parameters[21].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[21].Value);

				if (!(cmd.Parameters[22].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[22].Value);

				if (!(cmd.Parameters[23].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[23].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;

		}

		public ResponeValues SaveUpdateEmergency(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@ContactPer", beData.ContactPer);
			cmd.Parameters.AddWithValue("@ContactRelation", beData.ContactRelation);
			cmd.Parameters.AddWithValue("@ContactAddr", beData.ContactAddr);
			cmd.Parameters.AddWithValue("@ContactPhone", beData.ContactPhone);
			cmd.Parameters.AddWithValue("@ContactMobile", beData.ContactMobile);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmergency";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmergency";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateOfficialDetail(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@CompanyId", beData.CompanyId);
			cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
			cmd.Parameters.AddWithValue("@SubBranch", beData.SubBranch);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@DesignationId", beData.DesignationId);
			cmd.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
			cmd.Parameters.AddWithValue("@ELevelId", beData.ELevelId);
			cmd.Parameters.AddWithValue("@JTitle", beData.JTitle);
			cmd.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
			cmd.Parameters.AddWithValue("@JoinDate", beData.JoinDate);
			cmd.Parameters.AddWithValue("@ConfirmDate", beData.ConfirmDate);
			cmd.Parameters.AddWithValue("@RetireDate", beData.RetireDate);
			cmd.Parameters.AddWithValue("@HeadQtr", beData.HeadQtr);
			cmd.Parameters.AddWithValue("@RemoteAreaId", beData.RemoteAreaId);
			cmd.Parameters.AddWithValue("@DisabilitesId", beData.DisabilitesId);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateOfficeDet";
			}
			else
			{
				cmd.Parameters[17].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddOfficeDety";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[18].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[19].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[20].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PermanentDate", beData.PermanentDate);
			cmd.Parameters.AddWithValue("@TaxRullId", beData.TaxRullId);
			cmd.Parameters.AddWithValue("@EmployeeGroupId", beData.EmployeeGroupId);
			cmd.Parameters.AddWithValue("@SalaryApplicableYearId", beData.SalaryApplicableYearId);
			cmd.Parameters.AddWithValue("@SalaryApplicableMonthId", beData.SalaryApplicableMonthId);
			cmd.Parameters.AddWithValue("@IsAllowOT", beData.IsAllowOT);
			cmd.Parameters.AddWithValue("@OTCalculation", beData.OTCalculation);
			cmd.Parameters.AddWithValue("@CompanyRelationshipId", beData.CompanyRelationshipId);
			cmd.Parameters.AddWithValue("@LeaveApplicableDate", beData.LeaveApplicableDate);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[17].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[17].Value);

				if (!(cmd.Parameters[18].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[18].Value);

				if (!(cmd.Parameters[19].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[19].Value);

				if (!(cmd.Parameters[20].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[20].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdatePfSsfCit(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@PfAccNum", beData.PfAccNum);
			cmd.Parameters.AddWithValue("@PfNominee", beData.PfNominee);
			cmd.Parameters.AddWithValue("@PfRelation", beData.PfRelation);
			cmd.Parameters.AddWithValue("@PfID", beData.PfID);
			cmd.Parameters.AddWithValue("@PfIDNum", beData.PfIDNum);
			cmd.Parameters.AddWithValue("@PfEntryDate", beData.PfEntryDate);
			cmd.Parameters.AddWithValue("@PfIssueOffice", beData.PfIssueOffice);
			cmd.Parameters.AddWithValue("@PfIssuePlace", beData.PfIssuePlace);
			cmd.Parameters.AddWithValue("@PfAtt", beData.PfAtt);
			cmd.Parameters.AddWithValue("@AccessNum", beData.AccessNum);
			cmd.Parameters.AddWithValue("@SsfNum", beData.SsfNum);
			cmd.Parameters.AddWithValue("@SsfAtt", beData.SsfAtt);
			cmd.Parameters.AddWithValue("@CitCode", beData.CitCode);
			cmd.Parameters.AddWithValue("@CitAccNum", beData.CitAccNum);
			cmd.Parameters.AddWithValue("@CitAmt", beData.CitAmt);
			cmd.Parameters.AddWithValue("@CitNominee", beData.CitNominee);
			cmd.Parameters.AddWithValue("@CitRelationId", beData.CitRelationId);
			cmd.Parameters.AddWithValue("@CitIdType", beData.CitIdType);
			cmd.Parameters.AddWithValue("@CitIdNum", beData.CitIdNum);
			cmd.Parameters.AddWithValue("@CitEntryDate", beData.CitEntryDate);
			cmd.Parameters.AddWithValue("@CitAtt", beData.CitAtt);
			cmd.Parameters.AddWithValue("@GratCode", beData.GratCode);
			cmd.Parameters.AddWithValue("@GratAccNum", beData.GratAccNum);
			cmd.Parameters.AddWithValue("@GratNominee", beData.GratNominee);
			cmd.Parameters.AddWithValue("@GratRelation", beData.GratRelation);
			cmd.Parameters.AddWithValue("@GratIdType", beData.GratIdType);
			cmd.Parameters.AddWithValue("@GratIdNum", beData.GratIdNum);
			cmd.Parameters.AddWithValue("@GratEntryDate", beData.GratEntryDate);
			cmd.Parameters.AddWithValue("@GratIssueOffice", beData.GratIssueOffice);
			cmd.Parameters.AddWithValue("@GratIssuePlace", beData.GratIssuePlace);
			cmd.Parameters.AddWithValue("@GratAtt", beData.GratAtt);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdatePfSsfCit";
			}
			else
			{
				cmd.Parameters[33].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddOfficeDety";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[34].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[35].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[36].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[33].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[33].Value);

				if (!(cmd.Parameters[34].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[34].Value);

				if (!(cmd.Parameters[35].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[35].Value);

				if (!(cmd.Parameters[36].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[36].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateBankDetails(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateEmpBankAccDetails";
			}
			else
			{
				cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddEmpBankAccDetails";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpBankAccDetails(beData.CUserId, resVal.RId, beData.EmpBankAccColl);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateInsurance(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@LInsuComp", beData.LInsuComp);
			cmd.Parameters.AddWithValue("@LPolicyName", beData.LPolicyName);
			cmd.Parameters.AddWithValue("@LPolicyNum", beData.LPolicyNum);
			cmd.Parameters.AddWithValue("@LPolicyAmt", beData.LPolicyAmt);
			cmd.Parameters.AddWithValue("@LPolicySDate", beData.LPolicySDate);
			cmd.Parameters.AddWithValue("@LPolicyLDate", beData.LPolicyLDate);
			cmd.Parameters.AddWithValue("@LPremiumAmt", beData.LPremiumAmt);
			cmd.Parameters.AddWithValue("@LPaymentType", beData.LPaymentType);
			cmd.Parameters.AddWithValue("@LStartMonth", beData.LStartMonth);
			cmd.Parameters.AddWithValue("@LDedSalary", beData.LDedSalary);
			cmd.Parameters.AddWithValue("@LRemarks", beData.LRemarks);
			cmd.Parameters.AddWithValue("@LInsuTypeId", beData.LInsuTypeId);
			cmd.Parameters.AddWithValue("@LiAtt", beData.LiAtt);
			cmd.Parameters.AddWithValue("@HInsuComp", beData.HInsuComp);
			cmd.Parameters.AddWithValue("@HPolicyName", beData.HPolicyName);
			cmd.Parameters.AddWithValue("@HPolicyNum", beData.HPolicyNum);
			cmd.Parameters.AddWithValue("@HPolicyAmt", beData.HPolicyAmt);
			cmd.Parameters.AddWithValue("@HPolicySDate", beData.HPolicySDate);
			cmd.Parameters.AddWithValue("@HPolicyLDate", beData.HPolicyLDate);
			cmd.Parameters.AddWithValue("@HPremiumAmt", beData.HPremiumAmt);
			cmd.Parameters.AddWithValue("@HPaymentType", beData.HPaymentType);
			cmd.Parameters.AddWithValue("@HStartMonth", beData.HStartMonth);
			cmd.Parameters.AddWithValue("@HDedSalary", beData.HDedSalary);
			cmd.Parameters.AddWithValue("@HRemarks", beData.HRemarks);
			cmd.Parameters.AddWithValue("@HInsuTypeId", beData.HInsuTypeId);
			cmd.Parameters.AddWithValue("@HiAtt", beData.HiAtt);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateInsurance";
			}
			else
			{
				cmd.Parameters[28].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddInsurance";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[29].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[30].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[31].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[28].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[28].Value);

				if (!(cmd.Parameters[29].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[29].Value);

				if (!(cmd.Parameters[30].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[30].Value);

				if (!(cmd.Parameters[31].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[31].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpBankAccDetails(beData.CUserId, resVal.RId, beData.EmpBankAccColl);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateAccountDet(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AccLedger", beData.AccLedger);
			cmd.Parameters.AddWithValue("@CostCenterId", beData.CostCenterId);
			cmd.Parameters.AddWithValue("@OTLedger", beData.OTLedger);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAccountDet";
			}
			else
			{
				cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAccountDet";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@BrandId", beData.BrandId);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpBankAccDetails(beData.CUserId, resVal.RId, beData.EmpBankAccColl);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateQualification(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateQualification";
			}
			else
			{
				cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddQuailfiaction";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveAcaQualificationDetails(beData.CUserId, resVal.RId, beData.AcaQualificationColl);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateExperience(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateExperience";
			}
			else
			{
				cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddExperience";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveWorkExpDetails(beData.CUserId, resVal.RId, beData.WorkExpColl);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		public ResponeValues SaveUpdateSupervisor(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@EFirstLevel", beData.EFirstLevel);
			cmd.Parameters.AddWithValue("@ESecondLevel", beData.ESecondLevel);
			cmd.Parameters.AddWithValue("@EThirdLevel", beData.EThirdLevel);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateSupervisor";
			}
			else
			{
				cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddSupervisor";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}


		public ResponeValues SaveUpdateDocumnet(Dynamic.BE.HR.Employee beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateDocumentAtt";
			}
			else
			{
				cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddExperience";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";
				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveEmpDocumentDetails(beData.AttachmentColl, resVal.RId, beData.CUserId);
				}
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

		//prashant Code 09/01
		public ResponeValues GetAutoEmpNo(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@AutoNumber", System.Data.SqlDbType.Int);
			cmd.Parameters.Add("@Code", System.Data.SqlDbType.NVarChar,100);
			cmd.CommandText = "usp_GetAutoEmployeeNo";
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();


				if (!(cmd.Parameters[2].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);

				if (!(cmd.Parameters[3].Value is DBNull))
					resVal.ResponseId = Convert.ToString(cmd.Parameters[3].Value);

				resVal.IsSuccess = true;
				resVal.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}
		
		public Dynamic.RE.HR.EmployeeProfile GetEmployee(int UserId, int? ForEmployeeId, int EntityId,string EmpCode)
		{
			Dynamic.RE.HR.EmployeeProfile beData = new Dynamic.RE.HR.EmployeeProfile();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@ForEmployeeId", ForEmployeeId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@EmployeeCode", EmpCode);
            cmd.CommandText = "usp_GetEmployee";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new Dynamic.RE.HR.EmployeeProfile();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmpCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EmailId = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.OfficeContactNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.PersonalContactNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Address = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.PhotoPath = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Branch = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Department = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Grade = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Designation = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.ActiveSelfi = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) beData.AttendanceStatus = reader.GetInt32(14);
					if (!(reader[15] is DBNull)) beData.NeedRemarks = Convert.ToBoolean(reader[15]);
					if (!(reader[16] is DBNull)) beData.AllowAttendance = Convert.ToBoolean(reader[16]);
					if (!(reader[17] is DBNull)) beData.IsSuperVisor = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.HeadQuarter = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.HOD = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.SuperVisor1 = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.SuperVisor2 = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.SuperVisor3 = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.CompanyName = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.IsLeft = Convert.ToBoolean(reader[24]);
					if (!(reader[25] is DBNull)) beData.SubBranch = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.Dateofjoining = Convert.ToDateTime(reader[26]);
					if (!(reader[27] is DBNull)) beData.Mitiofjoining = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.Lat = Convert.ToDouble(reader[28]);
					if (!(reader[29] is DBNull)) beData.Lan = Convert.ToDouble(reader[29]);
					if (!(reader[30] is DBNull)) beData.ServicePeriod = Convert.ToString(reader[30]);
				}
				reader.Close();
				beData.IsSuccess = true;
				beData.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				beData.IsSuccess = false;
				beData.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return beData;

		}

		public Dynamic.BE.HR.EmployeeAutoCompleteCollections getAllEmployeeAutoComplete(int UserId, string searchBy, string Operator, string searchValue)
		{
			Dynamic.BE.HR.EmployeeAutoCompleteCollections dataColl = new BE.HR.EmployeeAutoCompleteCollections();

			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@ColName", searchBy);
			cmd.Parameters.AddWithValue("@ColValue", searchValue);
			cmd.Parameters.AddWithValue("@Operator", Operator);
			cmd.CommandText = "usp_GetAllEmployeeAutoComplete";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.EmployeeAutoComplete beData = new BE.HR.EmployeeAutoComplete();
					beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Code = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Address = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MobileNo = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.UserId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.BranchName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Designation = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.CompanyId = reader.GetInt32(10);   //Added by Simran
					dataColl.Add(beData);
				}
				reader.Close();
				dataColl.IsSuccess = true;
				dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return dataColl;
		}

		public RE.HR.EmployeeSummaryCollections getEmployeeSummaryList(int UserId, string DepartmentIdColl = "")
		{
			RE.HR.EmployeeSummaryCollections dataColl = new RE.HR.EmployeeSummaryCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = this.dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			if (!string.IsNullOrEmpty(DepartmentIdColl) && DepartmentIdColl.Trim() != "0")
				cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);
			cmd.CommandText = "usp_GetEmployeeSummary";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.HR.EmployeeSummary beData = new RE.HR.EmployeeSummary();
					beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
					if (!(reader[4] is DBNull)) beData.Name = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Address = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ContactNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Designation = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Category = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Gender = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.DOB_AD = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.DOB_BS = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.PhotoPath = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.TA_FullAddress = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.PA_FullAddress = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.TA_District = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.PA_District = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.FatherName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.MotherName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.CardNo = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.UserId = reader.GetInt32(21);
					if (!(reader[22] is DBNull)) beData.UserName = reader.GetString(22); ;
					if (!(reader[23] is DBNull)) beData.Nationality = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.OfficeContactNo = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.PersonalContactNo = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.CitizenShipno = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.Email = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.BloodGroup = reader.GetString(28);					
					if (!(reader[29] is DBNull)) beData.Level = reader.GetString(29);

					
					dataColl.Add(beData);
				}
				reader.Close();
				dataColl.IsSuccess = true;
				dataColl.ResponseMSG = "Success Get Data";
			}
			catch (Exception ex)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ex.Message;
			}
			finally
			{
				this.dal.CloseConnection();
			}
			return dataColl;
		}
		
		public ResponeValues SaveAttendanceAppeals(Dynamic.APIEnitity.HR.AttendanceAppeals beData)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandText = "usp_AddAttendanceAppeals";
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", beData.UserId);
			cmd.Parameters.AddWithValue("@InOutModeId", beData.InOutModeId);
			cmd.Parameters.AddWithValue("@PunchDateTime", beData.PunchDateTime);
			cmd.Parameters.AddWithValue("@Reason", beData.Reason);
			cmd.Parameters.Add("@TranId", System.Data.SqlDbType.Int);
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@Lat", beData.Lat);
			cmd.Parameters.AddWithValue("@Lan", beData.Lan);
			cmd.Parameters.AddWithValue("@Location", beData.Location);

			try
			{
				cmd.ExecuteNonQuery();

				if (!(cmd.Parameters[4].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);

				if (!(cmd.Parameters[5].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

				if (!(cmd.Parameters[6].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.ResponseMSG = ee.Message;
				resVal.IsSuccess = false;
			}
			catch (Exception ee)
			{
				resVal.ResponseMSG = ee.Message;
				resVal.IsSuccess = false;
			}
			finally
			{
				dal.CloseConnection();
			}

			return resVal;
		}

        public ResponeValues AttendanceAppealApproved(Dynamic.APIEnitity.HR.LeaveApprove beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.LeaveRequestId);
            cmd.Parameters.AddWithValue("@ApprovedBy", beData.ApprovedBy);
            cmd.Parameters.AddWithValue("@ApprovedByUser", beData.ApprovedByUser);
            cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
            cmd.Parameters.AddWithValue("@ApprovedType", beData.ApprovedType);
            cmd.CommandText = "usp_UpdateAttendanceAppeal";
            cmd.Parameters.Add("@UserId", System.Data.SqlDbType.Int);
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                dal.CommitTransaction();

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            catch (Exception ee)
            {
                resVal.ResponseMSG = ee.Message;
                resVal.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues UpdateEnrollCardNo(int UserId, Dynamic.RE.HR.EmployeeSummaryCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			dal.BeginTransaction();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.Text;
			try
			{
				foreach (var beData in dataColl)
				{

					cmd.Parameters.Clear();
					cmd.Parameters.AddWithValue("@EmployeeId", beData.EmployeeId);
					cmd.Parameters.AddWithValue("@EnrollNumber", beData.EnrollNumber);
					cmd.Parameters.AddWithValue("@CardNo", beData.CardNo);
					cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + " ; " + " update top(1) tbl_Employee set EnrollNumber=@EnrollNumber,CardNo=@CardNo where EmployeeId=@EmployeeId";
					cmd.ExecuteNonQuery();
				}
				dal.CommitTransaction();
				resVal.IsSuccess = true;
				resVal.ResponseMSG = "Enroll & Card No. Updated";
			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				dal.RollbackTransaction();
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}
		public RE.HR.EmployeeSummaryCollections getMyTeam(int UserId,int? EmployeeId)
		{
			RE.HR.EmployeeSummaryCollections dataColl = new RE.HR.EmployeeSummaryCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = this.dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.CommandText = "usp_GetMyEmployee";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.HR.EmployeeSummary beData = new RE.HR.EmployeeSummary();
					beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[3]);
					if (!(reader[4] is DBNull)) beData.Name = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Address = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.ContactNo = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Designation = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Category = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.Gender = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.DOB_AD = Convert.ToDateTime(reader[11]);
					if (!(reader[12] is DBNull)) beData.DOB_BS = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.PhotoPath = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.TA_FullAddress = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.PA_FullAddress = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.TA_District = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.PA_District = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.FatherName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.MotherName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.CardNo = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.UserId = reader.GetInt32(21);
					if (!(reader[22] is DBNull)) beData.UserName = reader.GetString(22); ;
					if (!(reader[23] is DBNull)) beData.Nationality = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.OfficeContactNo = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.PersonalContactNo = reader.GetString(25);
					if (!(reader[26] is DBNull)) beData.CitizenShipno = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.Email = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.BloodGroup = reader.GetString(28);
					if (!(reader[29] is DBNull)) beData.Level = reader.GetString(29);


					dataColl.Add(beData);
				}
				reader.Close();
				dataColl.IsSuccess = true;
				dataColl.ResponseMSG = "Success Get Data";
			}
			catch (Exception ex)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ex.Message;
			}
			finally
			{
				this.dal.CloseConnection();
			}
			return dataColl;
		}
		public Dynamic.BE.HR.EmployeeCollections GetEmployeeWithPag(int UserId, int EntityId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
		{
			Dynamic.BE.HR.EmployeeCollections dataColl = new Dynamic.BE.HR.EmployeeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetEmployeeWithPag";
			cmd.Parameters.Add("@TotalRows", System.Data.SqlDbType.Int);
			cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PageNumber", PageNumber);
			cmd.Parameters.AddWithValue("@RowsOfPage", RowsOfPage);
			cmd.Parameters.AddWithValue("@SearchBy", SearchBy);
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.BE.HR.Employee beData = new Dynamic.BE.HR.Employee();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EmailId = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.ContactPer = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.DepartmentId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) beData.DepartmentName = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.DesignationId = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.DesignationName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.BranchId = reader.GetInt32(10);
					if (!(reader[11] is DBNull)) beData.BranchName = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.CardNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.UserId = reader.GetInt32(13);
					if (!(reader[14] is DBNull)) beData.UserName = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.GenderId = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.MaritalStatus = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.Category = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.Level = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.EmployeeGroup = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.CompanyRelation = reader.GetString(20);
					dataColl.Add(beData);
				}
				reader.Close();
				TotalRows = Convert.ToInt32(cmd.Parameters[2].Value);
				dataColl.IsSuccess = true;
				dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
			}
			catch (Exception ee)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}

			return dataColl;

		}

        public Dynamic.RE.HR.BirthdayListCollections GetBirthdayList(int UserId, DateTime? FromDate, DateTime? ToDate)
        {
            Dynamic.RE.HR.BirthdayListCollections dataColl = new RE.HR.BirthdayListCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@FromDate", FromDate);
            cmd.Parameters.AddWithValue("@ToDate", ToDate);
            cmd.CommandText = "usp_GetEmployeeBirthDay";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.HR.BirthdayList beData = new Dynamic.RE.HR.BirthdayList();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Designation = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.EnrollNumber = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.FatherName = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.ContactNo = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.FullAddress = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.AgeYear = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.AgeMonth = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.AgeDay = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.PhotoPath = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.DOB = Convert.ToDateTime(reader[14]);
                    if (!(reader[15] is DBNull)) beData.DOB_BS = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.AgeDet = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.BranchName = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.Company = reader.GetString(18);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }
        public Dynamic.RE.HR.SupervisorListCollections GetSupervisorList(int UserId, int? CompanyId, int? BranchId, int? DepartmentId, int? DesignationId, string EmpStatus)
        {
            Dynamic.RE.HR.SupervisorListCollections dataColl = new RE.HR.SupervisorListCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
            cmd.Parameters.AddWithValue("@EmpStatus", EmpStatus);
            cmd.CommandText = "usp_GetEmpSuperVisorList";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.HR.SupervisorList beData = new Dynamic.RE.HR.SupervisorList();
                    if (!(reader[0] is DBNull)) beData.EmployeeCode = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Department = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Designation = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.LevelCode1 = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.LevelName1 = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.LevelBranch1 = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.LevelStatus1 = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.LevelCode2 = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.LevelName2 = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.LevelBranch2 = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.LevelStatus2 = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.LevelCode3 = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.LevelName3 = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.LevelBranch3 = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.LevelStatus3 = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.BranchName = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Company = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.EmployeeStatus = reader.GetString(18);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

    }

}

