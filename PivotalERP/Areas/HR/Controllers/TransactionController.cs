using Dynamic.BusinessEntity.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.HR.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
    {
        // GET: Payroll/Transaction
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_PayHeading)]
        public ActionResult PayHeading()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_TaxRule)]
        public ActionResult TaxRule()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_ExpenseCategory)]
        public ActionResult ExpenseCategory()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_AllowPayHeading)]
        public ActionResult AllowPayHeading()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_SalaryDetail)]
        public ActionResult SalaryDetail()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_EmployeeLoan)]
        public ActionResult EmployeeLoan()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_EmployeeAdvance)]
        public ActionResult EmployeeAdvance()
        {
            return View();
        }
        public ActionResult SalaryAddDeduct()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_SalarySheet)]
        public ActionResult SalarySheet()
        {
            return View();
        }
        public ActionResult Incentive()
        {
            return View();
        }
        public ActionResult TaxCalculator()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_ArrearSalarySheet)]
        public ActionResult ArrearSalarySheet()
        {
            return View();
        }
        public ActionResult Category()
        {
            return View();
        }

        #region "PayHeadGroup"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult SavePayHeadGroup()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.PayHeadGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.PayHeadGroupId.HasValue)
                        beData.PayHeadGroupId = 0;

                    resVal = new Dynamic.BL.NPayroll.PayHeadGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult getPayHeadGroupById(int PayHeadGroupId)
        {
            Dynamic.BE.NPayroll.PayHeadGroup resVal = new Dynamic.BE.NPayroll.PayHeadGroup();
            try
            {
                resVal = new Dynamic.BL.NPayroll.PayHeadGroup(User.UserId, User.HostName, User.DBName).GetPayHeadGroupById(0, PayHeadGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult DeletePayHeadGroup(int PayHeadGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (PayHeadGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.PayHeadGroup(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, PayHeadGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllPayHeadGroup()
        {
            Dynamic.BE.NPayroll.PayHeadGroupCollections dataColl = new Dynamic.BE.NPayroll.PayHeadGroupCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeadGroup(User.UserId, User.HostName, User.DBName).GetAllPayHeadGroup(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        #region "PayHeadCategory"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.PayHeadCategory)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult SavePayHeadCategory()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.PayHeadCategory>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.PayHeadCategoryId.HasValue)
                        beData.PayHeadCategoryId = 0;

                    resVal = new Dynamic.BL.NPayroll.PayHeadCategory(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult getPayHeadCategoryById(int PayHeadCategoryId)
        {
            Dynamic.BE.NPayroll.PayHeadCategory resVal = new Dynamic.BE.NPayroll.PayHeadCategory();
            try
            {
                resVal = new Dynamic.BL.NPayroll.PayHeadCategory(User.UserId, User.HostName, User.DBName).GetPayHeadCategoryById(0, PayHeadCategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult DeletePayHeadCategory(int PayHeadCategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (PayHeadCategoryId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.PayHeadCategory(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, PayHeadCategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllPayHeadCategory()
        {
            Dynamic.BE.NPayroll.PayHeadCategoryCollections dataColl = new Dynamic.BE.NPayroll.PayHeadCategoryCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeadCategory(User.UserId, User.HostName, User.DBName).GetAllPayHeadCategory(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetBranchListforPayhead()
        {
            Dynamic.BE.NPayroll.BranchForPayHeadingCollections dataColl = new Dynamic.BE.NPayroll.BranchForPayHeadingCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).GetBranchForPayHeading(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetCategoryListforPayhead()
        {
            Dynamic.BE.NPayroll.CategoryForPayHeadingCollections dataColl = new Dynamic.BE.NPayroll.CategoryForPayHeadingCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).GetCategoryForPayHeading(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        #region "PayHeading"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.PayHeading)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult SavePayHeading()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.PayHeading>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.PayHeadingId.HasValue)
                        beData.PayHeadingId = 0;

                    resVal = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult getPayHeadingById(int PayHeadingId)
        {
            Dynamic.BE.NPayroll.PayHeading resVal = new Dynamic.BE.NPayroll.PayHeading();
            try
            {
                resVal = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).GetPayHeadingById(0, PayHeadingId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_PayHeading)]
        public JsonNetResult DeletePayHeading(int PayHeadingId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (PayHeadingId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, PayHeadingId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllPayHeading()
        {
            Dynamic.BE.NPayroll.PayHeadingCollections dataColl = new Dynamic.BE.NPayroll.PayHeadingCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).GetAllPayHeading(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllPayHeadingForTran()
        {
            Dynamic.BE.NPayroll.PayHeadingCollections dataColl = new Dynamic.BE.NPayroll.PayHeadingCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.PayHeading(User.UserId, User.HostName, User.DBName).getAllPayHeadingForTran();
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion



        #region "TaxRule"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.TaxRule)]

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_TaxRule)]
        public JsonNetResult SaveTaxRule()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.TaxRuleCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.BL.NPayroll.TaxRule(User.UserId, User.HostName, User.DBName).Update(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_TaxRule)]
        public JsonNetResult GetAllTaxRule(int? TaxFor)
        {
            Dynamic.BE.NPayroll.TaxRuleCollections dataColl = new Dynamic.BE.NPayroll.TaxRuleCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.TaxRule(User.UserId, User.HostName, User.DBName).GetAllTaxRule(0, TaxFor);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion




        #region EmployeeLoan

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_EmployeeLoan)]
        public JsonNetResult SaveEmployeeLoan()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.EmployeeLoan>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.EmployeeLoan(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllEmployeeLoan()
        {
            Dynamic.BE.NPayroll.EmployeeLoanCollections dataColl = new Dynamic.BE.NPayroll.EmployeeLoanCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.EmployeeLoan(User.UserId, User.HostName, User.DBName).GetAllEmployeeLoan(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_EmployeeLoan)]
        public JsonNetResult getEmployeeLoanById(int TranId)
        {
            Dynamic.BE.NPayroll.EmployeeLoan resVal = new Dynamic.BE.NPayroll.EmployeeLoan();
            try
            {
                resVal = new Dynamic.BL.NPayroll.EmployeeLoan(User.UserId, User.HostName, User.DBName).GetEmployeeLoanById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_EmployeeLoan)]
        public JsonNetResult DeleteEmployeeLoan(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Product Color name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.EmployeeLoan(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region "LoanType"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_LoanType)]
        public ActionResult LoanType()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_LoanType)]
        public JsonNetResult SaveLoanType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.LoanType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.LoanType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllLoanType()
        {
            Dynamic.BE.NPayroll.LoanTypeCollections dataColl = new Dynamic.BE.NPayroll.LoanTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.LoanType(User.UserId, User.HostName, User.DBName).GetAllLoanType(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_LoanType)]
        public JsonNetResult getLoanTypeById(int TranId)
        {
            Dynamic.BE.NPayroll.LoanType resVal = new Dynamic.BE.NPayroll.LoanType();
            try
            {
                resVal = new Dynamic.BL.NPayroll.LoanType(User.UserId, User.HostName, User.DBName).GetLoanTypeById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_LoanType)]
        public JsonNetResult DeleteLoanType(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.LoanType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "EmployeeAdvance"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_EmployeeAdvance)]
        public JsonNetResult SaveEmployeeAdvance()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.EmployeeAdvance>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.EmployeeAdvance(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_EmployeeAdvance)]
        public JsonNetResult getEmployeeAdvanceById(int TranId)
        {
            Dynamic.BE.NPayroll.EmployeeAdvance resVal = new Dynamic.BE.NPayroll.EmployeeAdvance();
            try
            {
                resVal = new Dynamic.BL.NPayroll.EmployeeAdvance(User.UserId, User.HostName, User.DBName).GetEmployeeAdvanceById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_EmployeeAdvance)]
        public JsonNetResult DeleteEmployeeAdvance(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.EmployeeAdvance(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllEmployeeAdvance()
        {
            Dynamic.BE.NPayroll.EmployeeAdvanceCollections dataColl = new Dynamic.BE.NPayroll.EmployeeAdvanceCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.EmployeeAdvance(User.UserId, User.HostName, User.DBName).GetAllEmployeeAdvance(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        #region "AdvanceType"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AdvanceType)]
        public ActionResult AdvanceType()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AdvanceType)]
        public JsonNetResult SaveAdvanceType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.AdvanceType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.AdvanceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_AdvanceType)]
        public JsonNetResult getAdvanceTypeById(int TranId)
        {
            Dynamic.BE.NPayroll.AdvanceType resVal = new Dynamic.BE.NPayroll.AdvanceType();
            try
            {
                resVal = new Dynamic.BL.NPayroll.AdvanceType(User.UserId, User.HostName, User.DBName).GetAdvanceTypeById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_AdvanceType)]
        public JsonNetResult DeleteAdvanceType(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.AdvanceType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllAdvanceType()
        {
            Dynamic.BE.NPayroll.AdvanceTypeCollections dataColl = new Dynamic.BE.NPayroll.AdvanceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.AdvanceType(User.UserId, User.HostName, User.DBName).GetAllAdvanceType(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion



        #region "Incentive"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Incentive)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Incentive)]
        public JsonNetResult SaveIncentive()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.Incentive>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.IncentiveId.HasValue)
                        beData.IncentiveId = 0;

                    resVal = new Dynamic.BL.NPayroll.Incentive(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        //[PermissionsAttribute(Dynamic.BE.NPayroll.Global.Actions.Modify, (int)FormsEntity.Incentive)]
        public JsonNetResult getIncentiveById(int IncentiveId)
        {
            Dynamic.BE.NPayroll.Incentive resVal = new Dynamic.BE.NPayroll.Incentive();
            try
            {
                resVal = new Dynamic.BL.NPayroll.Incentive(User.UserId, User.HostName, User.DBName).GetIncentiveById(0, IncentiveId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Incentive)]
        public JsonNetResult DeleteIncentive(int IncentiveId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (IncentiveId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.Incentive(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, IncentiveId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllIncentive()
        {
            Dynamic.BE.NPayroll.IncentiveCollections dataColl = new Dynamic.BE.NPayroll.IncentiveCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.Incentive(User.UserId, User.HostName, User.DBName).GetAllIncentive(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        #region "IncentiveType"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.IncentiveType)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.IncentiveType)]
        public JsonNetResult SaveIncentiveType()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.IncentiveType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.IncentiveType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        //[PermissionsAttribute(Dynamic.BE.NPayroll.Global.Actions.Modify, (int)FormsEntity.IncentiveType)]
        public JsonNetResult getIncentiveTypeById(int TranId)
        {
            Dynamic.BE.NPayroll.IncentiveType resVal = new Dynamic.BE.NPayroll.IncentiveType();
            try
            {
                resVal = new Dynamic.BL.NPayroll.IncentiveType(User.UserId, User.HostName, User.DBName).GetIncentiveTypeById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.IncentiveType)]
        public JsonNetResult DeleteIncentiveType(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.IncentiveType(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllIncentiveType()
        {
            Dynamic.BE.NPayroll.IncentiveTypeCollections dataColl = new Dynamic.BE.NPayroll.IncentiveTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.IncentiveType(User.UserId, User.HostName, User.DBName).GetAllIncentiveType(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "Brand"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Brand)]

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Brand)]
        public JsonNetResult SaveBrand()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.Brand>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.Brand(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        //[PermissionsAttribute(Dynamic.BE.NPayroll.Global.Actions.Modify, (int)FormsEntity.Brand)]
        public JsonNetResult getBrandById(int TranId)
        {
            Dynamic.BE.NPayroll.Brand resVal = new Dynamic.BE.NPayroll.Brand();
            try
            {
                resVal = new Dynamic.BL.NPayroll.Brand(User.UserId, User.HostName, User.DBName).GetBrandById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Brand)]
        public JsonNetResult DeleteBrand(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.Brand(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllBrand()
        {
            Dynamic.BE.NPayroll.BrandCollections dataColl = new Dynamic.BE.NPayroll.BrandCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.Brand(User.UserId, User.HostName, User.DBName).GetAllBrand(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion



        #region ExpenseCategory

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult SaveExpenseCategory()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.ExpenseCategory>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.ExpenseCategory(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult getExpenseCategoryById(int TranId)
        {
            Dynamic.BE.NPayroll.ExpenseCategory resVal = new Dynamic.BE.NPayroll.ExpenseCategory();
            try
            {
                resVal = new Dynamic.BL.NPayroll.ExpenseCategory(User.UserId, User.HostName, User.DBName).GetExpenseCategoryById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult DeleteExpenseCategory(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Product Color name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.ExpenseCategory(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllExpenseCategory()
        {
            Dynamic.BE.NPayroll.ExpenseCategoryCollections dataColl = new Dynamic.BE.NPayroll.ExpenseCategoryCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.ExpenseCategory(User.UserId, User.HostName, User.DBName).GetAllExpenseCategory(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region ExpenseGroup

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult SaveExpenseGroup()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.ExpenseGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.ExpenseGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult getExpenseGroupById(int TranId)
        {
            Dynamic.BE.NPayroll.ExpenseGroup resVal = new Dynamic.BE.NPayroll.ExpenseGroup();
            try
            {
                resVal = new Dynamic.BL.NPayroll.ExpenseGroup(User.UserId, User.HostName, User.DBName).GetExpenseGroupById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult DeleteExpenseGroup(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Product Color name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.ExpenseGroup(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllExpenseGroup()
        {
            Dynamic.BE.NPayroll.ExpenseGroupCollections dataColl = new Dynamic.BE.NPayroll.ExpenseGroupCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.ExpenseGroup(User.UserId, User.HostName, User.DBName).GetAllExpenseGroup(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "SalaryAddDeduct"
        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.SalaryAddDeduct)]
        public JsonNetResult SaveSalaryAddDeduct()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.SalaryAddDeduct>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.NPayroll.SalaryAddDeduct(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        //[PermissionsAttribute(Dynamic.BE.NPayroll.Global.Actions.Modify, (int)FormsEntity.SalaryAddDeduct)]
        public JsonNetResult getSalaryAddDeductById(int TranId)
        {
            Dynamic.BE.NPayroll.SalaryAddDeduct resVal = new Dynamic.BE.NPayroll.SalaryAddDeduct();
            try
            {
                resVal = new Dynamic.BL.NPayroll.SalaryAddDeduct(User.UserId, User.HostName, User.DBName).GetSalaryAddDeductById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.SalaryAddDeduct)]
        public JsonNetResult DeleteSalaryAddDeduct(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete defaultProduct Category";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.SalaryAddDeduct(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllSalaryAddDeduct()
        {
            Dynamic.BE.NPayroll.SalaryAddDeductCollections dataColl = new Dynamic.BE.NPayroll.SalaryAddDeductCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.SalaryAddDeduct(User.UserId, User.HostName, User.DBName).GetAllSalaryAddDeduct(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion


        #region "AllowPayheading"
        [HttpGet]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_AllowPayHeading)]
        public JsonNetResult GetAllEmployeeForAllowPayHeading(int? BranchId, int? DepartmentId, int? CategoryId, int? CompanyRelationshipId=null)
        {
            Dynamic.BE.NPayroll.EmployeeForAllowPayHeadingCollections dataColl = new Dynamic.BE.NPayroll.EmployeeForAllowPayHeadingCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.AllowPayHeading(User.UserId, User.HostName, User.DBName).GetAllAllowPayHeading(0, BranchId, DepartmentId, CategoryId,CompanyRelationshipId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_AllowPayHeading)]
        public JsonNetResult SaveAllowPayHeading()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.AllowPayHeadingCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.AllowPayHeading(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "AllowExpenseCategory"
        [HttpGet]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult GetAllEmployeeForAllowExpenseCategory(int? BranchId, int? DepartmentId, int? CategoryId)
        {
            Dynamic.BE.NPayroll.EmployeeForAllowExpenseCategoryCollections dataColl = new Dynamic.BE.NPayroll.EmployeeForAllowExpenseCategoryCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.AllowExpenseCategory(User.UserId, User.HostName, User.DBName).GetAllAllowExpenseCategory(0, BranchId, DepartmentId, CategoryId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult SaveAllowExpenseCategory()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.AllowExpenseCategoryCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.AllowExpenseCategory(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "ExpenseRateSetup"
        [HttpGet]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult GetAllEmployeeForExpenseRateSetup(int? BranchId, int? DepartmentId, int? CategoryId)
        {
            Dynamic.BE.NPayroll.EmployeeForExpenseRateSetupCollections dataColl = new Dynamic.BE.NPayroll.EmployeeForExpenseRateSetupCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.ExpenseRateSetup(User.UserId, User.HostName, User.DBName).GetAllExpenseRateSetup(0, BranchId, DepartmentId, CategoryId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ExpenseCategory)]
        public JsonNetResult SaveExpenseRateSetup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.ExpenseRateSetupCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.ExpenseRateSetup(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "SalaryDetail"
        [HttpPost]
        public JsonNetResult GetAllEmployeeForSalaryDetail(int? BranchId, int? DepartmentId, int? CategoryId, int YearId, int MonthId, int? CompanyRelationshipId=null)
        {
            Dynamic.BE.NPayroll.EmployeeForSalaryDetailCollections dataColl = new Dynamic.BE.NPayroll.EmployeeForSalaryDetailCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.SalaryDetail(User.UserId, User.HostName, User.DBName).GetAllSalaryDetail(0, BranchId, DepartmentId, CategoryId, YearId, MonthId,CompanyRelationshipId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveSalaryDetail()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.SalaryDetailCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.SalaryDetail(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Brand)]
        public JsonNetResult DeleteSalaryDetail(int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.NPayroll.SalaryDetail(User.UserId, User.HostName, User.DBName).DeleteSalaryDetail(User.UserId, BranchId, DepartmentId, CategoryId, YearId, MonthId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Brand)]
        public JsonNetResult DelSalaryDetailData(int EmployeeId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (EmployeeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Salary Detail";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.SalaryDetail(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, EmployeeId, YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "SalarySheet"
        [HttpPost]
        public JsonNetResult GetAllEmployeeForSalarySheet(int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId, int? CompanyRelationshipId=null)
        {
            Dynamic.BE.NPayroll.SalarySheetDetail dt = new Dynamic.BE.NPayroll.SalarySheetDetail();
            try
            {
                dt = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).GetAllSalarySheet(0, BranchId, DepartmentId, CategoryId, YearId, MonthId,CompanyRelationshipId);
                return new JsonNetResult() { Data = dt, TotalCount = dt.PayColl.Count + dt.AttColl.Count, IsSuccess = dt.IsSuccess, ResponseMSG = dt.ResponseMSG };
            }
            catch (Exception ee)
            {
                dt.IsSuccess = false;
                dt.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dt.IsSuccess, ResponseMSG = dt.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_SalarySheet)]
        public JsonNetResult SaveSalarySheet()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var payData = DeserializeObject<Dynamic.BE.NPayroll.SalarySheetCollections>(Request["dtColl"]);
                var atData = DeserializeObject<Dynamic.BE.NPayroll.AttendanceTypeCollections>(Request["atColl"]);
                if (payData != null && atData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).SaveUpdate(payData, atData);
                }

                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetSalaryJV(int YearId, int MonthId)
        {
            (Dynamic.RE.HR.LedgerSJVCollections ledgerColl, Dynamic.RE.HR.PayHeadSJVCollections payHeadColl) dataColl;
            try
            {
                dataColl = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).GetSalaryJV(YearId, MonthId);
                return new JsonNetResult
                {
                    Data = new { LedgerSJV = dataColl.ledgerColl, PayHeadSJV = dataColl.payHeadColl },
                    TotalCount = dataColl.ledgerColl.Count + dataColl.payHeadColl.Count,
                    IsSuccess = dataColl.ledgerColl.IsSuccess && dataColl.payHeadColl.IsSuccess,
                    ResponseMSG = dataColl.ledgerColl.IsSuccess && dataColl.payHeadColl.IsSuccess ? dataColl.ledgerColl.ResponseMSG : "Error in retrieving data"
                };
            }
            catch (Exception ex)
            {
                return new JsonNetResult
                {
                    Data = null,
                    TotalCount = 0,
                    IsSuccess = false,
                    ResponseMSG = ex.Message
                };
            }
        }

        //[PermissionsAttribute(Actions.Save, (int)ENTITIES.SalarySheet, false)]
        public JsonNetResult SaveSalaryJV(int YearId, int MonthId)
        {
            ResponeValue resVal = new ResponeValue();
            try
            {
                resVal = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).SaveJV(YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_SalarySheet)]
        public JsonNetResult DeleteSalarySheet(int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).DeleteSalarySheet(0,BranchId, DepartmentId, CategoryId, YearId, MonthId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_SalarySheet)]
        public JsonNetResult DelSalarySheetData(int EmployeeId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (EmployeeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Salary Sheet";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.SalarySheet(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, EmployeeId, YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "ArrearSalarySheet"
        

        

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ArrearSalarySheet)]
        public JsonNetResult DeleteArrearSalarySheet(int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.NPayroll.ArrearSalarySheet(User.UserId, User.HostName, User.DBName).DeleteArrearSalarySheet(User.UserId, BranchId, DepartmentId, CategoryId, YearId, MonthId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ArrearSalarySheet)]
        public JsonNetResult DelArrearSalarySheetData(int EmployeeId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (EmployeeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Salary Sheet";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.NPayroll.ArrearSalarySheet(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, EmployeeId, YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAttendanceTypeForTran()
        {
            Dynamic.BE.NPayroll.AttendanceTypeCollections dataColl = new Dynamic.BE.NPayroll.AttendanceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.AttendanceType(User.UserId, User.HostName, User.DBName).getAttendanceTypeForTran();
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        #endregion

        // GET: HR/Transaction
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_PayrollConfiguration)]
        public ActionResult PayrollConfiguration()
        {
            return View();
        }


        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_PayrollConfiguration)]
        public JsonNetResult SavePayrollConfig()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.PayrollConfig>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Payroll.PayrollConfig(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Payroll_PayrollConfiguration)]
        public JsonNetResult GetPayrollConfiguration()
        {
            Dynamic.BE.Payroll.PayrollConfig resVal = new Dynamic.BE.Payroll.PayrollConfig();
            try
            {
                resVal = new Dynamic.BL.Payroll.PayrollConfig(User.UserId, User.HostName, User.DBName).GetPayrollConfig(0);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllPaySlipsReport()
        {
            Dynamic.BE.Payroll.PaySlipReportCollections dataColl = new Dynamic.BE.Payroll.PaySlipReportCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.PayrollConfig(User.UserId, User.HostName, User.DBName).GetPaySlipsReport(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        //Code by Prashant on 28Kartik
        //add Shift Menu EmployeeWiseWeekend

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_WeeklyShiftMapping)]
        public ActionResult WeeklyShiftMapping()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_EmployeeWiseWeekend)]
        public ActionResult EmployeeWiseWeekend()
        {
            return View();
        }
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_CopyEmployeeWeekend)]
        public ActionResult CopyEmployeeWeekend()
        {
            return View();
        }

         
        //Change Delete Function fro EmployeeWIseWeeke
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_WeeklyShiftMapping)]
        public JsonNetResult DelWeeklyShiftMapping(int EmployeeId, DateTime DateFrom, DateTime DateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.WeeklyShiftMapping(User.UserId, User.HostName, User.DBName).DeleteById(EmployeeId, DateFrom, DateTo);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetWeeklyShiftMapping(DateTime DateFrom, DateTime DateTo, string BranchIdColl = "", string DepartmentIdColl = "", string DesignationIdColl = "", string CategoryIdColl = "", int? WorkingShiftId = null)
        {
            Dynamic.BE.Attendance.WeeklyShiftMappingCollections dataColl = new Dynamic.BE.Attendance.WeeklyShiftMappingCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.WeeklyShiftMapping(User.UserId, User.HostName, User.DBName).GetWeeklyShiftMapping(DateFrom, DateTo, BranchIdColl, DepartmentIdColl, DesignationIdColl, CategoryIdColl, WorkingShiftId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_WeeklyShiftMapping)]
        public JsonNetResult SaveWeeklyShiftMappingColl()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.WeeklyShiftMappingCollections>(Request["jsonData"]);
                if (beData != null && beData.Count > 0)
                {
                    resVal = new Dynamic.BL.Attendance.WeeklyShiftMapping(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }




        //for EmployeeWiseWeekEnd

        [HttpPost]
        public JsonNetResult GetEmployeeWiseWeekend(int YearId, int MonthId, int? BranchId, int? DepartmentId)
        {
            Dynamic.BE.Attendance.EmployeeWiseWeekendCollections dataColl = new Dynamic.BE.Attendance.EmployeeWiseWeekendCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.EmployeeWiseWeekend(User.UserId, User.HostName, User.DBName).GetEmployeeWiseWeekend(YearId, MonthId, BranchId, DepartmentId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_EmployeeWiseWeekend)]
        public JsonNetResult SaveEmpWiseWeekend()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.EmployeeWiseWeekendCollections>(Request["jsonData"]);
                if (beData != null && beData.Count > 0)
                {
                    resVal = new Dynamic.BL.Attendance.EmployeeWiseWeekend(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        //for copy the Employee Wise Weekend

        [HttpPost]
        public JsonNetResult CopyEmpWiseWeekend(int FromYearId, int FromMonthId, int ToYearId, int ToMonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.EmployeeWiseWeekend(User.UserId, User.HostName, User.DBName).CopyEmpWiseWeekend(FromYearId, FromMonthId, ToYearId, ToMonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_EmployeeWiseWeekend)]
        public JsonNetResult DelEmployeeWiseWeekend(int BranchId, int DepartmentId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Attendance.EmployeeWiseWeekend(User.UserId, User.HostName, User.DBName).DeleteById(BranchId, DepartmentId, YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        //Prashant code Mangsir 21
        #region "ArrearSalaryDetail"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_ArrearSalaryDetail)]
        public ActionResult ArrearSalaryDetail()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllEmployeeForArrearSalaryDetail(int? BranchId, int? DepartmentId, int? CategoryId, int YearId, int MonthId)
        {
            Dynamic.BE.Payroll.EmployeeForArrearSalaryDetailCollections dataColl = new Dynamic.BE.Payroll.EmployeeForArrearSalaryDetailCollections();
            try
            {
                dataColl = new Dynamic.BL.Payroll.ArrearSalaryDetail(User.UserId, User.HostName, User.DBName).GetAllArrearSalaryDetail(0, BranchId, DepartmentId, CategoryId, YearId, MonthId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ArrearSalaryDetail)]
        public JsonNetResult SaveArrearSalaryDetail()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Payroll.ArrearSalaryDetailCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.Payroll.ArrearSalaryDetail(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ArrearSalaryDetail)]
        public JsonNetResult DeleteArrearSalaryDetail(int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.Payroll.ArrearSalaryDetail(User.UserId, User.HostName, User.DBName).DeleteArrearSalaryDetail(User.UserId, BranchId, DepartmentId, CategoryId, YearId, MonthId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Brand)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Payroll_ArrearSalaryDetail)]
        public JsonNetResult DelArrearSalaryDetailData(int EmployeeId, int YearId, int MonthId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (EmployeeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Salary Detail";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Payroll.ArrearSalaryDetail(User.UserId, User.HostName, User.DBName).DeleteById(User.UserId, EmployeeId, YearId, MonthId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        //changes in the funtions
        //replace this two function
        [HttpPost]
        public JsonNetResult GetAllEmployeeForArrearSalarySheet(int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId)
        {
            Dynamic.BE.NPayroll.ArrearSalaryDetail dataColl = new Dynamic.BE.NPayroll.ArrearSalaryDetail();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.ArrearSalarySheet(User.UserId, User.HostName, User.DBName).GetAllArrearSalarySheet(0, BranchId, DepartmentId, CategoryId, YearId, MonthId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.PayColl.Count + dataColl.AttColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Payroll_ArrearSalarySheet)]
        public JsonNetResult SaveArrearSalarySheet()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                //var beData = DeserializeObject<Dynamic.BE.NPayroll.ArrearSalarySheetCollections>(Request["jsonData"]);
                var payData = DeserializeObject<Dynamic.BE.NPayroll.ArrearSalarySheetCollections>(Request["dtColl"]);
                var atData = DeserializeObject<Dynamic.BE.NPayroll.AttendanceTypeCollections>(Request["atColl"]);
                if (payData != null && atData !=null)
                {

                    resVal = new Dynamic.BL.NPayroll.ArrearSalarySheet(User.UserId, User.HostName, User.DBName).SaveUpdate(payData, atData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #region"attendanceColor"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_AttendanceColor)]
        public ActionResult AttendanceColor()
        {
            return View();

        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_AttendanceColor)]
        public JsonNetResult SaveAttendanceColorConfig()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.AttendanceColorConfig>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Attendance.AttendanceColorConfig(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetAllAttendanceColorConfig()
        {
            Dynamic.BE.Attendance.AttendanceColorConfig resVal = new Dynamic.BE.Attendance.AttendanceColorConfig();
            try
            {
                resVal = new Dynamic.BL.Attendance.AttendanceColorConfig(User.UserId, User.HostName, User.DBName).GetAllAttendanceColorConfig(0);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion


        [HttpPost]
        public JsonNetResult GetEmpDetForAttendanceSummary(DateTime? FromDate, int EmployeeId)
        {
            Dynamic.BE.Attendance.EmpDetForAttendanceSummary resVal = new Dynamic.BE.Attendance.EmpDetForAttendanceSummary();
            try
            {
                resVal = new Dynamic.BL.Attendance.EmpDetForAttendanceSummary(User.UserId, User.HostName, User.DBName).GetEmpDetForAttendanceSummary(FromDate, EmployeeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #region "Manual Attendance"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Att_ManualAttendance)]
        public ActionResult ManualAttendance()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Att_ManualAttendance)]
        public JsonNetResult SaveManualAttendance()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Attendance.ManualAttendance>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.Attendance.ManualAttendance(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllManualAttendance()
        {
            Dynamic.BE.Attendance.ManualAttendanceCollections dataColl = new Dynamic.BE.Attendance.ManualAttendanceCollections();
            try
            {
                dataColl = new Dynamic.BL.Attendance.ManualAttendance(User.UserId, User.HostName, User.DBName).GetAllManualAttendance(0);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Att_ManualAttendance)]
        public JsonNetResult GetManualAttendanceById(int TranId)
        {
            Dynamic.BE.Attendance.ManualAttendance beData = new Dynamic.BE.Attendance.ManualAttendance();
            try
            {
                beData = new Dynamic.BL.Attendance.ManualAttendance(User.UserId, User.HostName, User.DBName).GetManualAttendanceById(0, TranId);
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = beData, TotalCount = 0, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
        }



        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Att_ManualAttendance)]
        public JsonNetResult DeleteManualAttendance(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Salary Detail";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BL.Attendance.ManualAttendance(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion


        #region "Incentive Form"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Payroll_Incentive)]
        public ActionResult IncentiveForm()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllIncentiveSheet(int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            Dynamic.BE.NPayroll.IncentiveSheetCollections dataColl = new Dynamic.BE.NPayroll.IncentiveSheetCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.IncentiveSheet(User.UserId, User.HostName, User.DBName).getAllIncentiveSheet(0, CompanyRelationshipId, BranchId, DepartmentId, ProductBrandId, IncentiveDate);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveIncentiveSheet()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.NPayroll.IncentiveSheetCollections>(Request["jsonData"]);
                if (beData != null)
                {

                    resVal = new Dynamic.BL.NPayroll.IncentiveSheet(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DeleteIncentiveSheet(int? UserId, int? CompanyRelationshipId, int? BranchId, int? DepartmentId, int? ProductBrandId, DateTime? IncentiveDate)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.NPayroll.IncentiveSheet(User.UserId, User.HostName, User.DBName).DeleteIncentiveSheet(UserId, CompanyRelationshipId, BranchId, DepartmentId, ProductBrandId, IncentiveDate);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAllIncentiveList()
        {
            Dynamic.BE.NPayroll.IncentiveSheetCollections dataColl = new Dynamic.BE.NPayroll.IncentiveSheetCollections();
            try
            {
                dataColl = new Dynamic.BL.NPayroll.IncentiveSheet(User.UserId, User.HostName, User.DBName).GetAllIncentiveList();
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

    }
}