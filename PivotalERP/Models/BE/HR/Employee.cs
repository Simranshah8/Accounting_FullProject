using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using Dynamic.BusinessEntity.Common;

namespace Dynamic.BE.HR
{

    public class Employee : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public int? EmployeeNo { get; set; }

        [EP("BrandId", "Brand", false)]
        public int? BrandId { get; set; }
        public string EmployeeCode { get; set; } = "";
        public long? EnrollNumber { get; set; }

        [EP("FirstName", "FirstName", true)]
        public string FirstName { get; set; } = "";

        [EP("MiddleName", "MiddleName")]
        public string MiddleName { get; set; } = "";

        [EP("LastName", "LastName")]
        public string LastName { get; set; } = "";

        [EP("Photo", "Photo")]
        public string Photo { get; set; } = "";
        public byte[] PhotoB { get; set; }

        [EP("GenderId", "Gender", true)]
        public string GenderId { get; set; } = "";

        [EP("BloodGroupId", "Blood Group")]
        public string BloodGroupId { get; set; } = "";

        /// <summary>
        /// Change ReligionId DataType to int and add Religion Prop
        /// </summary>
        [EP("ReligionId", "Religion")]
        public int? ReligionId { get; set; }
        public string Religion { get; set; } = "";
        public string DobBS { get; set; } = "";

        [EP("DobAD", "Dob AD")]
        public DateTime? DobAD { get; set; }

        [EP("MaritalStatusId", "MaritalStatusId")]
        public int? MaritalStatusId { get; set; }

        [EP("NationalityId", "NationalityId")]
        public int? NationalityId { get; set; }

        [EP("PanId", "PanId")]
        public string PanId { get; set; } = "";

        [EP("CitiNum", "CitiNum")]
        public string CitiNum { get; set; } = "";

        [EP("CitiIssueDate", "CitiIssueDate")]
        public DateTime? CitiIssueDate { get; set; }

        [EP("CitiIssuePlaceId", "CitiIssuePlaceId")]
        public int? CitiIssuePlaceId { get; set; }

        [EP("CitiFrontImg", "CitiFrontImg")]
        public string CitiFrontImg { get; set; } = "";

        [EP("CitiBackImg", "CitiBackImg")]
        public string CitiBackImg { get; set; } = "";

        [EP("EmailId", "EmailId")]
        public string EmailId { get; set; } = "";

        [EP("OfficeNum", "OfficeNum")]
        public string OfficeNum { get; set; } = "";

        [EP("PersonalNum", "PersonalNum")]
        public string PersonalNum { get; set; } = "";

        [EP("FatherName", "FatherName")]
        public string FatherName { get; set; } = "";

        [EP("GFatherName", "GFatherName")]
        public string GFatherName { get; set; } = "";

        [EP("MotherName", "MotherName")]
        public string MotherName { get; set; } = "";

        [EP("DrivingLicNum", "DrivingLicNum")]
        public string DrivingLicNum { get; set; } = "";

        [EP("LicIssueDate", "LicIssueDate")]
        public DateTime? LicIssueDate { get; set; }

        [EP("LicExpiryDate", "LicExpiryDate")]
        public DateTime? LicExpiryDate { get; set; }

        [EP("LicIssuePlace", "LicIssuePlace")]
        public string LicIssuePlace { get; set; } = "";

        [EP("PassportNum", "PassportNum")]
        public string PassportNum { get; set; } = "";

        [EP("PassportIssueDate", "PassportIssueDate")]
        public DateTime? PassportIssueDate { get; set; }

        [EP("PassportExpiryDate", "PassportExpiryDate")]
        public DateTime? PassportExpiryDate { get; set; }

        [EP("PassportIssuePlace", "PassportIssuePlace")]
        public string PassportIssuePlace { get; set; } = "";

        [EP("PCountryId", "PCountryId")]
        public int? PCountryId { get; set; }

        [EP("PStateId", "PStateId")]
        public int? PStateId { get; set; }

        [EP("PDistrictId", "PDistrictId")]
        public int? PDistrictId { get; set; }

        [EP("PCity", "PCity")]
        public string PCity { get; set; } = "";

        [EP("P_LocalLevelId", "P_LocalLevelId")]
        public int? P_LocalLevelId { get; set; }

        [EP("PWard", "PWard")]
        public int? PWard { get; set; }

        [EP("PStreet", "PStreet")]
        public string PStreet { get; set; } = "";

        [EP("PHouseNum", "PHouseNum")]
        public string PHouseNum { get; set; } = "";

        [EP("PFullAddr", "PFullAddr")]
        public string PFullAddr { get; set; } = "";

        [EP("TCountryId", "TCountryId")]
        public int? TCountryId { get; set; }

        [EP("TStateId", "TStateId")]
        public int? TStateId { get; set; }

        [EP("TDistrictId", "TDistrictId")]
        public int? TDistrictId { get; set; }

        [EP("TCity", "TCity")]
        public string TCity { get; set; } = "";

        [EP("Temp_LocalLevelId", "Temp_LocalLevelId")]
        public int? Temp_LocalLevelId { get; set; }

        [EP("TWard", "TWard")]
        public int? TWard { get; set; }

        [EP("TStreet", "TStreet")]
        public string TStreet { get; set; } = "";

        [EP("THouseNum", "THouseNum")]
        public string THouseNum { get; set; } = "";

        [EP("TFullAddr", "TFullAddr")]
        public string TFullAddr { get; set; } = "";

        [EP("ContactPer", "ContactPer")]
        public string ContactPer { get; set; } = "";

        [EP("ContactRelation", "ContactRelation")]
        public int? ContactRelation { get; set; }

        [EP("ContactAddr", "ContactAddr")]
        public string ContactAddr { get; set; } = "";

        [EP("ContactPhone", "ContactPhone")]
        public string ContactPhone { get; set; } = "";

        [EP("ContactMobile", "ContactMobile")]
        public string ContactMobile { get; set; } = "";

        [EP("CompanyId", "CompanyId")]
        public int? CompanyId { get; set; }

        [EP("BranchId", "BranchId")]
        public int? BranchId { get; set; }

        [EP("SubBranch", "SubBranch")]
        public int? SubBranch { get; set; }

        [EP("DepartmentId", "DepartmentId")]
        public int? DepartmentId { get; set; }

        [EP("DesignationId", "DesignationId")]
        public int? DesignationId { get; set; }

        [EP("CategoryId", "CategoryId")]
        public int? CategoryId { get; set; }

        [EP("ELevelId", "ELevelId")]
        public int? ELevelId { get; set; }

        [EP("JTitle", "JTitle")]
        public string JTitle { get; set; } = "";

        [EP("ServiceTypeId", "ServiceTypeId")]
        public int? ServiceTypeId { get; set; }

        [EP("JoinDate", "JoinDate")]
        public DateTime? JoinDate { get; set; }

        [EP("ConfirmDate", "ConfirmDate")]
        public DateTime? ConfirmDate { get; set; }

        [EP("PermanentDate", "PermanentDate")]
        public DateTime? PermanentDate { get; set; }

        [EP("RetireDate", "RetireDate")]
        public DateTime? RetireDate { get; set; }

        [EP("HeadQtr", "HeadQtr")]
        public string HeadQtr { get; set; } = "";

        [EP("TaxRullId", "TaxRullId")]
        public int? TaxRullId { get; set; }

        [EP("RemoteAreaId", "RemoteAreaId")]
        public int? RemoteAreaId { get; set; }

        [EP("DisabilitesId", "DisabilitesId")]
        public int? DisabilitesId { get; set; }

        [EP("PfAccNum", "PfAccNum")]
        public string PfAccNum { get; set; } = "";

        [EP("PfNominee", "PfNominee")]
        public string PfNominee { get; set; } = "";

        [EP("PfRelation", "PfRelation")]
        public int? PfRelation { get; set; }

        [EP("PfID", "PfID")]
        public int? PfID { get; set; }

        [EP("PfIDNum", "PfIDNum")]
        public string PfIDNum { get; set; } = "";

        [EP("PfEntryDate", "PfEntryDate")]
        public DateTime? PfEntryDate { get; set; }

        [EP("PfIssueOffice", "PfIssueOffice")]
        public string PfIssueOffice { get; set; } = "";

        [EP("PfIssuePlace", "PfIssuePlace")]
        public string PfIssuePlace { get; set; } = "";

        [EP("PfAtt", "PfAtt")]
        public string PfAtt { get; set; } = "";

        [EP("AccessNum", "AccessNum")]
        public string AccessNum { get; set; } = "";

        [EP("SsfNum", "SsfNum")]
        public string SsfNum { get; set; } = "";

        [EP("SsfAtt", "SsfAtt")]
        public string SsfAtt { get; set; } = "";

        [EP("CitCode", "CitCode")]
        public string CitCode { get; set; } = "";

        [EP("CitAccNum", "CitAccNum")]
        public string CitAccNum { get; set; } = "";

        [EP("CitAmt", "CitAmt")]
        public double? CitAmt { get; set; }

        [EP("CitNominee", "CitNominee")]
        public string CitNominee { get; set; } = "";

        [EP("CitRelationId", "CitRelationId")]
        public int? CitRelationId { get; set; }

        [EP("CitIdType", "CitIdType")]
        public int? CitIdType { get; set; }

        [EP("CitIdNum", "CitIdNum")]
        public string CitIdNum { get; set; } = "";

        [EP("CitEntryDate", "CitEntryDate")]
        public DateTime? CitEntryDate { get; set; }

        [EP("CitAtt", "CitAtt")]
        public string CitAtt { get; set; } = "";

        [EP("GratCode", "GratCode")]
        public string GratCode { get; set; } = "";

        [EP("GratAccNum", "GratAccNum")]
        public string GratAccNum { get; set; } = "";

        [EP("GratNominee", "GratNominee")]
        public string GratNominee { get; set; } = "";

        [EP("GratRelation", "GratRelation")]
        public int? GratRelation { get; set; }

        [EP("GratIdType", "GratIdType")]
        public int? GratIdType { get; set; }

        [EP("GratIdNum", "GratIdNum")]
        public string GratIdNum { get; set; } = "";

        [EP("GratEntryDate", "GratEntryDate")]
        public DateTime? GratEntryDate { get; set; }

        [EP("GratIssueOffice", "GratIssueOffice")]
        public string GratIssueOffice { get; set; } = "";

        [EP("GratIssuePlace", "GratIssuePlace")]
        public string GratIssuePlace { get; set; } = "";

        [EP("GratAtt", "GratAtt")]
        public string GratAtt { get; set; } = "";

        [EP("LInsuComp", "LInsuComp")]
        public string LInsuComp { get; set; } = "";

        [EP("LPolicyName", "LPolicyName")]
        public string LPolicyName { get; set; } = "";

        [EP("LPolicyNum", "LPolicyNum")]
        public string LPolicyNum { get; set; } = "";

        [EP("LPolicyAmt", "LPolicyAmt")]
        public double? LPolicyAmt { get; set; }

        [EP("LPolicySDate", "LPolicySDate")]
        public DateTime? LPolicySDate { get; set; }

        [EP("LPolicyLDate", "LPolicyLDate")]
        public DateTime? LPolicyLDate { get; set; }

        [EP("LPremiumAmt", "LPremiumAmt")]
        public double? LPremiumAmt { get; set; }

        [EP("LPaymentType", "LPaymentType")]
        public int? LPaymentType { get; set; }

        [EP("LStartMonth", "LStartMonth")]
        public int? LStartMonth { get; set; }

        [EP("LDedSalary", "LDedSalary")]
        public bool LDedSalary { get; set; }

        [EP("LRemarks", "LRemarks")]
        public string LRemarks { get; set; } = "";

        [EP("LInsuTypeId", "LInsuTypeId")]
        public int? LInsuTypeId { get; set; }

        [EP("LiAtt", "LiAtt")]
        public string LiAtt { get; set; } = "";

        [EP("HInsuComp", "HInsuComp")]
        public string HInsuComp { get; set; } = "";

        [EP("HPolicyName", "HPolicyName")]
        public string HPolicyName { get; set; } = "";

        [EP("HPolicyNum", "HPolicyNum")]
        public string HPolicyNum { get; set; } = "";

        [EP("HPolicyAmt", "HPolicyAmt")]
        public double? HPolicyAmt { get; set; }

        [EP("HPolicySDate", "HPolicySDate")]
        public DateTime? HPolicySDate { get; set; }

        [EP("HPolicyLDate", "HPolicyLDate")]
        public DateTime? HPolicyLDate { get; set; }

        [EP("HPremiumAmt", "HPremiumAmt")]
        public double? HPremiumAmt { get; set; }

        [EP("HPaymentType", "HPaymentType")]
        public int? HPaymentType { get; set; }

        [EP("HStartMonth", "MiddleName")]
        public int? HStartMonth { get; set; }

        [EP("HDedSalary", "HDedSalary")]
        public bool HDedSalary { get; set; }

        [EP("HRemarks", "HRemarks")]
        public string HRemarks { get; set; } = "";

        [EP("HInsuTypeId", "HInsuTypeId")]
        public int? HInsuTypeId { get; set; }

        [EP("HiAtt", "HiAtt")]
        public string HiAtt { get; set; } = "";

        [EP("AccLedger", "AccLedger")]
        public string AccLedger { get; set; } = "";

        [EP("CostCenterId", "CostCenterId")]
        public int? CostCenterId { get; set; }

        [EP("OTLedger", "OTLedger")]
        public string OTLedger { get; set; } = "";

        [EP("EFirstLevel", "EFirstLevel")]
        public int? EFirstLevel { get; set; }

        [EP("ESecondLevel", "ESecondLevel")]
        public int? ESecondLevel { get; set; }

        [EP("EThirdLevel", "EThirdLevel")]
        public int? EThirdLevel { get; set; }

        [EP("CitiIssuePlace", "CitiIssuePlace")]
        public string CitiIssuePlace { get; set; } = "";

        [EP("PStateName", "PStateName")]
        public string PStateName { get; set; } = "";

        [EP("PDistrictName", "PDistrictName")]
        public string PDistrictName { get; set; } = "";

        [EP("P_LocalLevelName", "P_LocalLevelName")]
        public string P_LocalLevelName { get; set; } = "";

        [EP("TStateName", "TStateName")]
        public string TStateName { get; set; } = "";

        [EP("TDistrictName", "TDistrictName")]
        public string TDistrictName { get; set; } = "";

        [EP("Temp_LocalLevelName", "Temp_LocalLevelName")]
        public string Temp_LocalLevelName { get; set; } = "";
         
        public string Name { get; set; } = "";
         
        public string DepartmentName { get; set; } = "";
         
        public string DesignationName { get; set; } = "";
         
        public string BranchName { get; set; } = "";

        [EP("CardNo", "Card No")]
        public string CardNo { get; set; } = "";


        public int? UserId { get; set; } 
        public Employee()
        {
            EmpBankAccColl = new EmpBankAccCollections();
            AcaQualificationColl = new AcaQualificationCollections();
            WorkExpColl = new WorkExpCollections();
            AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
        }
        public EmpBankAccCollections EmpBankAccColl { get; set; }
        public AcaQualificationCollections AcaQualificationColl { get; set; }
        public WorkExpCollections WorkExpColl { get; set; }
        public Dynamic.BusinessEntity.GeneralDocumentCollections AttachmentColl { get; set; }

        public int? EmployeeGroupId { get; set; }
        public int? ProjectId { get; set; }

        public string PA_Country { get; set; }
        public int Gender { get; set; }
        public string Nationality { get; set; }
        public int TaxRuleAs { get; set; }
        //Add Field by Prashant 20 magh according to academic
        public string SpouseName { get; set; } = "";
        public DateTime? AnniversaryDate { get; set; }
        public string PA_Zone { get; set; } = "";
        public string TA_Counrty { get; set; } = "";
        public string TA_Zone { get; set; } = "";
        public string RemoteArea { get; set; } = "";
        public string Disability { get; set; } = "";
        public string CIT_RelationShip { get; set; } = "";
        public string BankName { get; set; } = "";
        public string BA_AccountName { get; set; } = "";
        public string BA_AccountNo { get; set; } = "";
        public string BA_Branch { get; set; } = "";
        public bool BA_IsForPayroll { get; set; }
        public byte[] Signature { get; set; }
        public string SignaturePath { get; set; } = "";
        public string PhotoPath { get; set; } = "";
        public string MotherTonque { get; set; } = "";
        public string Rank { get; set; } = "";
        public string Position { get; set; } = "";
        public string TeacherType { get; set; } = "";
        public string TeachingLanguage { get; set; } = "";
        public string LicenseNo { get; set; } = "";
        public string TrkNo { get; set; } = "";
        public int? CasteId { get; set; }
        public string EMSId { get; set; } = "";
        public bool IsTeaching { get; set; }
        public int? SubjectTeacherId { get; set; }
        public bool IsPhysicalDisability { get; set; }
        public string PhysicalDisability { get; set; } = "";
        public string UDF { get; set; } = "";
        public string FatherContactNo { get; set; } = "";
        public string MotherContactNo { get; set; } = "";
        public string SpouseContactNo { get; set; } = "";
        public string OfficeEmailId { get; set; } = "";
        public int? SalaryApplicableYearId { get; set; }
        public int? SalaryApplicableMonthId { get; set; }
        public int? SystemUserId { get; set; }
        public bool? IsAllowOT { get; set; }
        public int? OTCalculation { get; set; }
        public int? CompanyRelationshipId { get; set; }
        public DateTime? LeaveApplicableDate { get; set; }
        public string Attributes { get; set; }
        public string UDFKeyVal { get; set; }

        public bool IsImport { get; set; }
        public string UserName { get; set; } = "";
        public string MaritalStatus { get; set; } = "";
        public string Category { get; set; } = "";
        public string Level { get; set; } = "";
        public string EmployeeGroup { get; set; } = "";
        public string CompanyRelation { get; set; } = "";

    }
    public class EmpBankAcc
    {

        public int EmployeeId { get; set; }
        public int? BankNameId { get; set; }
        public string AccName { get; set; } = "";
        public string AccNum { get; set; } = "";
        public string Branch { get; set; } = "";
        public bool ForPayroll { get; set; }
    }

    public class EmpBankAccCollections : System.Collections.Generic.List<EmpBankAcc>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }

    public class AcaQualification
    {

        public int EmployeeId { get; set; }
        public string DegreeName { get; set; } = "";
        public string BoardUni { get; set; } = "";
        public string PassedYr { get; set; } = "";
        public string GradePer { get; set; } = "";
    }

    public class AcaQualificationCollections : System.Collections.Generic.List<AcaQualification>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }

    public class WorkExp
    {

        public int EmployeeId { get; set; }
        public string Org { get; set; } = "";
        public int? DepartmentId { get; set; }
        public string JobTitle { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Remarks { get; set; } = "";
    }

    public class WorkExpCollections : System.Collections.Generic.List<WorkExp>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }

    public class EmpDocument
    {

        public int EmployeeId { get; set; }
        public int? DocTypeId { get; set; }
        public string DocAtt { get; set; } = "";
        public string Description { get; set; } = "";
    }

    public class EmpDocumentCollections : System.Collections.Generic.List<EmpDocument>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }
    public class EmployeeCollections : System.Collections.Generic.List<Employee>
    {
        public EmployeeCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class ImportEmployee
    {
        [Column("E.EmployeeCode")]
        public string EmployeeCode { get; set; }

        [Column("E.EnrollNumber")]
        public long EnrollNumber { get; set; }

        [Column("E.Name")]
        public string Name { get; set; }

        [Column("E.FirstName")]
        public string FirstName { get; set; }
        [Column("E.MiddleName")]
        public string MiddleName { get; set; }
        [Column("E.LastName")]
        public string LastName { get; set; }

        [Column("E.GenderId")]
        public string Gender { get; set; }

        [Column("E.BloodGroupId")]
        public string BloodGroup { get; set; }

        [Column("E.ReligionId")]
        public string Religion { get; set; }

        [Column("E.DobAD")]
        public DateTime? DobAD { get; set; }

        [Column("E.MaritalStatusId")]
        public string MaritalStatus { get; set; }

        [Column("E.NationalityId")]
        public string Nationality { get; set; }

        [Column("E.FatherName")]
        public string FatherName { get; set; }

        [Column("E.CompanyId")]
        public string Company { get; set; }

        [Column("E.BranchId")]
        public string Branch { get; set; }

        [Column("E.SubBranch")]
        public string SubBranch { get; set; }

        [Column("E.DepartmentId")]
        public string Department { get; set; }

        [Column("E.DesignationId")]
        public string Designation { get; set; }

        [Column("E.CategoryId")]
        public string Category { get; set; }

        [Column("E.ELevelId")]
        public string ELevel { get; set; }

        [Column("E.DisabilitesId")]
        public string Disability { get; set; }

        [Column("E.ServiceTypeId")]
        public string ServiceType { get; set; }

        [Column("E.PFullAddr")]
        public string Address { get; set; }

        [Column("E.EmployeeGroupId")]
        public string EmployeeGroup { get; set; }

        [Column("E.PanId")]
        public string PAN { get; set; }

        [Column("E.CitiNum")]
        public string CitizenshipNo { get; set; }

        [Column("E.SsfNum")]
        public string SSFNo { get; set; }

        [Column("E.CitIdNum")]
        public string CIT_Id { get; set; }

        [Column("E.CitCode")]
        public string CIT_Code { get; set; }

        [Column("E.OfficeContactNo")]
        public string OfficeContactNo { get; set; }

        [Column("E.PersnalContactNo")]
        public string PersnalContactNo { get; set; }

        [Column("E.EmailId")]
        public string Email { get; set; }

        [Column("E.TaxRullId")]
        public string TaxRuleAs { get; set; }

        [Column("E.GFatherName")]
        public string GFatherName { get; set; }

        [Column("E.MotherName")]
        public string MotherName { get; set; }

        [Column("E.DrivingLicNum")]
        public string DrivingLicNo { get; set; }

        [Column("E.LicIssueDate")]
        public DateTime? LicIssueDate { get; set; }

        [Column("E.LicExpiryDate")]
        public DateTime? LicExpiryDate { get; set; }

        [Column("E.LicIssuePlace")]
        public string LicIssuePlace { get; set; }

        [Column("E.PassportNum")]
        public string PassportNo { get; set; }

        [Column("E.PassportIssueDate")]
        public DateTime? PassportIssueDate { get; set; }

        [Column("E.PassportExpiryDate")]
        public DateTime? PassportExpiryDate { get; set; }

        [Column("E.PassportIssuePlace")]
        public string PassportIssuePlace { get; set; }

        [Column("E.PCountryId")]
        public string PermanentCountry { get; set; }

        [Column("E.PStateId")]
        public string PermanentState { get; set; }

        [Column("E.PDistrictId")]
        public string PermanentDistrict { get; set; }

        [Column("E.P_LocalLevelId")]
        public string PermanentLocalLevel { get; set; }

        [Column("E.PCity")]
        public string PermanentCity { get; set; }

        [Column("E.PWard")]
        public string PermanentWard { get; set; }

        [Column("E.PStreet")]
        public string PermanentStreet { get; set; }

        [Column("E.PHouseNum")]
        public string PermanentHouseNo { get; set; }

        [Column("E.TCountryId")]
        public string TemporaryCountry { get; set; }

        [Column("E.TStateId")]
        public string TemporaryState { get; set; }

        [Column("E.TDistrictId")]
        public string TemporaryDistrict { get; set; }

        [Column("E.Temp_LocalLevelId")]
        public string TemporaryLocalLevel { get; set; }

        [Column("E.TCity")]
        public string TemporaryCity { get; set; }

        [Column("E.TWard")]
        public string TemporaryWard { get; set; }

        [Column("E.TStreet")]
        public string TemporaryStreet { get; set; }

        [Column("E.THouseNum")]
        public string TemporaryHouseNo { get; set; }

        [Column("E.TFullAddr")]
        public string TemporaryFullAddr { get; set; }

        [Column("E.ContactPer")]
        public string ContactPerName { get; set; }

        [Column("E.ContactRelation")]
        public string ContactRelation { get; set; }

        [Column("E.ContactAddr")]
        public string ContactAddr { get; set; }

        [Column("E.ContactPhone")]
        public string ContactPhone { get; set; }

        [Column("E.ContactMobile")]
        public string ContactMobile { get; set; }

        [Column("E.PfAccNum")]
        public string PFAccNo { get; set; }

        [Column("E.PfNominee")]
        public string PFNominee { get; set; }

        [Column("E.PfRelation")]
        public string PFRelation { get; set; }
        [Column("E.PfID")]
        public string PFID { get; set; }

        [Column("E.PfIDNum")]
        public string PFIDNUmber { get; set; }

        [Column("E.PfEntryDate")]
        public DateTime? PFEntryDate { get; set; }

        [Column("E.PfIssueOffice")]
        public string PFIssueOffice { get; set; }

        [Column("E.PfIssuePlace")]
        public string PFIssuePlace { get; set; }

        [Column("E.AccessNum")]
        public string AccessNo { get; set; }

        [Column("E.CitAccNum")]
        public string CITAccNo { get; set; }

        [Column("E.CitAmt")]
        public string CITAmount { get; set; }

        [Column("E.CitNominee")]
        public string CITNominee { get; set; }

        [Column("E.CitRelationId")]
        public string CITRelation { get; set; }

        [Column("E.CitIdType")]
        public string CITIdType { get; set; }

        [Column("E.CitIdNum")]
        public string CITIdNo { get; set; }

        [Column("E.CitEntryDate")]
        public DateTime? CITEntryDate { get; set; }

        [Column("E.GratCode")]
        public string GratuityCode { get; set; }

        [Column("E.GratAccNum")]
        public string GratuityAccNo { get; set; }

        [Column("E.GratNominee")]
        public string GratuityNominee { get; set; }

        [Column("E.GratRelation")]
        public string GratuityRelation { get; set; }

        [Column("E.GratIdType")]
        public string GratuityIdType { get; set; }

        [Column("E.GratIdNum")]
        public string GratuityIdNo { get; set; }

        [Column("E.GratEntryDate")]
        public DateTime? GratuityEntryDate { get; set; }

        [Column("E.GratIssueOffice")]
        public string GratuityIssueOffice { get; set; }

        [Column("E.GratIssuePlace")]
        public string GratuityIssuePlace { get; set; }

        [Column("E.LInsuComp")]
        public string LInsuComp { get; set; }

        [Column("E.LPolicyName")]
        public string LPolicyName { get; set; }

        [Column("E.LPolicyNum")]
        public string LPolicyNo { get; set; }

        [Column("E.LPolicyAmt")]
        public string LPolicyAmt { get; set; }

        [Column("E.LPolicySDate")]
        public DateTime? LPolicySDate { get; set; }
        [Column("E.LPolicyLDate")]
        public DateTime? LPolicyLDate { get; set; }

        [Column("E.LPremiumAmt")]
        public string LPremiumAmt { get; set; }

        [Column("E.LPaymentType")]
        public string LPaymentType { get; set; }

        [Column("E.LStartMonth")]
        public string LStartMonth { get; set; }

        [Column("E.LDedSalary")]
        public string LDedSalary { get; set; }

        [Column("E.LRemarks")]
        public string LRemarks { get; set; }

        [Column("E.LInsuTypeId")]
        public string LInsuType { get; set; }

        [Column("E.HInsuComp")]
        public string HInsuComp { get; set; }

        [Column("E.HPolicyName")]
        public string HPolicyName { get; set; }

        [Column("E.HPolicyNum")]
        public string HPolicyNo { get; set; }

        [Column("E.HPolicyAmt")]
        public string HPolicyAmt { get; set; }

        [Column("E.HPolicySDate")]
        public DateTime? HPolicySDate { get; set; }

        [Column("E.HPolicyLDate")]
        public DateTime? HPolicyLDate { get; set; }

        [Column("E.HPremiumAmt")]
        public string HPremiumAmt { get; set; }

        [Column("E.HPaymentType")]
        public string HPaymentType { get; set; }

        [Column("E.HStartMonth")]
        public string HStartMonth { get; set; }

        [Column("E.HDedSalary")]
        public string HDedSalary { get; set; }

        [Column("E.HRemarks")]
        public string HRemarks { get; set; }

        [Column("E.HInsuTypeId")]
        public string HInsuTypeId { get; set; }

        [Column("E.CostCenterId")]
        public string CostCenter { get; set; }

        [Column("E.BrandId")]
        public string Brand { get; set; }

        [Column("E.EFirstLevel")]
        public string FSupervisorName { get; set; }

        [Column("E.ESecondLevel")]
        public string SSupervisorName { get; set; }

        [Column("E.EThirdLevel")]
        public string TSupervisorName { get; set; }

        [Column("E.CompanyRelationshipId")]
        public string CompanyRelationship { get; set; }


        [Column("E.DateofJoining")]
        public DateTime? JoinDate { get; set; }

        public string BankName { get; set; }
        public string BankAccountName { get; set; }
        public string BankAccountNo { get; set; }

        public string UDF1 { get; set; }
        public string UDF2 { get; set; }
        public string UDF3 { get; set; }
        public string UDF4 { get; set; }
        public string UDF5 { get; set; }

        public string UDF6 { get; set; }
        public string UDF7 { get; set; }
        public string UDF8 { get; set; }
        public string UDF9 { get; set; }
        public string UDF10 { get; set; }

        public string Query { get; set; }
        public string Table
        {
            get
            {
                return "update top(1) E set " + Query + "  from tbl_Employee(nolock) E where E.EmployeeCode=@EmployeeCode  ";
            }
        }


    }
    public class ImportBankDetails
    {
        [Column("E.BankNameId")]
        public string BankName { get; set; }

        [Column("E.AccName")]
        public string AccountName { get; set; }

        [Column("E.AccNum")]
        public string AccountNo { get; set; }

        [Column("E.Branch")]
        public string Branch { get; set; }

        [Column("E.ForPayroll")]
        public string ForPayroll { get; set; }
    }
    public class ImportAccademicQualification
    {
        [Column("E.DegreeName")]
        public string DegreeName { get; set; }

        [Column("E.BoardUni")]
        public string BoardUni { get; set; }

        [Column("E.PassedYr")]
        public string PassedYr { get; set; }

        [Column("E.GradePer")]
        public string GradePer { get; set; }
    }
    public class ImportWorkExp
    {
        [Column("E.Org")]
        public string Organization { get; set; }

        [Column("E.DepartmentId")]
        public string Department { get; set; }

        [Column("E.JobTitle")]
        public string JobTitle { get; set; }

        [Column("E.StartDate")]
        public string StartDate { get; set; }

        [Column("E.EndDate")]
        public string EndDate { get; set; }

        [Column("E.Remarks")]
        public string Remarks { get; set; }
    }


    public class EmployeeAutoComplete
    {
        public EmployeeAutoComplete()
        {
            Code = "";
            Address = "";
            Name = "";
            MobileNo = "";
            Address = "";
            UserName = "";
            Pwd = "";
        }
        public int EmployeeId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public long EnrollNo { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Pwd { get; set; }
        public string BranchName { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public int? CompanyId { get; set; } //Added by Simran

    }

    public class EmployeeAutoCompleteCollections : System.Collections.Generic.List<EmployeeAutoComplete>
    {
        public EmployeeAutoCompleteCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }

    }
}

