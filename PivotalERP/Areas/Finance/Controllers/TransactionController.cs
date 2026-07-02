using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Finance.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
    {
        public ActionResult EndLoan()
        {
            return View();
        }
        public ActionResult MonthEnd()
        {
            return View();
        }
        public ActionResult CalculateRebatePenalty()
        {
            return View();
        }
        public ActionResult RescheduleLoan()
        {
            return View();
        }



        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.MonthEnd)]
        public JsonNetResult SaveMonthEnd(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Finance.LoanCreation>(Request["jsonData"]);
                if (beData != null)
                {
                    // Call your DB method (void)
                    new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).SaveMonthEnd(User.UserId, dateFrom, dateTo);

                    // Manually set success response
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Month end process completed successfully.";
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.MonthEnd)]
        public JsonNetResult DelMonthEnd(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {               
                new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).DeleteMonthEnd(dateFrom, dateTo);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Month end data deleted successfully.";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }



        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.MonthEnd)]
        public JsonNetResult ClearMonthEnd()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).ClearMonthEnd();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Month End Cleared Successfully.";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }
                   

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CalculateRebatePenalty)]
        public JsonNetResult DelRebatePenalty(DateTime dateFrom, DateTime dateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).DeleteRebatePenalty(dateFrom, dateTo);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Rebate/Penalty data deleted successfully.";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CalculateRebatePenalty)]
        public JsonNetResult CalculateRebate(DateTime dateFrom)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                // Call your DB method
                new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).CalculateRebate(User.UserId, dateFrom);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Rebate Calculated successfully.";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }

        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.CalculateRebatePenalty)]
        public JsonNetResult CalculatePenalty(DateTime dateFrom)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                // Call your DB method
                new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).CalculatePenalty(User.UserId, dateFrom);

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Penalty Calculated successfully.";
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult()
            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = resVal.IsSuccess,
                ResponseMSG = resVal.ResponseMSG
            };
        }



        #region "End Loan"

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VehicleDetail)]
        public JsonNetResult SaveEndLoan()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Finance.LoanCreation>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CreateBy = User.UserId;
                    new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).SaveEndLoan(beData);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Loan ended successfully.";
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
        public JsonNetResult GetAllEndLoan()
        {
            var dataColl = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).getAllLoanCreationForEndLoan();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Success" };
        }

        #endregion
        [HttpPost]
        public JsonNetResult SaveLoanReschedule()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                bool isModify = false;
                var beData = DeserializeObject<Dynamic.BusinessEntity.Finance.LoanCreation>(Request["jsonData"]);
                if (beData != null)
                {
                    // Call the DB method
                    int result = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).SaveUpdateReSchedule(beData, isModify);

                    // Map the result to your response
                    if (result > 0)  // or whatever your logic defines as success
                    {
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "Reschedule saved successfully";
                    }
                    else
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Failed to save reschedule";
                    }
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Blank Data Can't be Accepted";
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
        public JsonNetResult GetAllLoanCreationForEndLoan()
        {
            var dataColl = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).getAllLoanCreationForEndLoan();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Success" };
        }

    }
}