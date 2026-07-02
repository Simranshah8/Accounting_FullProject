using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Finance.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Finance/Transaction
        [HttpGet]
        public JsonNetResult GetAutoNumber()
        {
            var resVal = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName);
            var beData = resVal.getAutoNumber();
            return new JsonNetResult()
            {
                Data = beData,
                TotalCount = 0,
                IsSuccess = true,
                ResponseMSG = "Success"
            };
        }
        public ActionResult LoanCreation()
        {
            return View();
        }

        #region "VehicleDetail"
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.VehicleDetail)]
        public ActionResult VehicleDetail()
        {
            return View();
        }

        [HttpPost]
        ////[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.VehicleDetail)]
        public JsonNetResult SaveVehicleDetail()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                bool isModify = false;
                var beData = DeserializeObject<Dynamic.BusinessEntity.Finance.LoanVehicleDetails>(Request["jsonData"]);
                if (beData != null)
                {
                    //beData.CUserId = User.UserId;
                    if (beData.TranId > 0)
                    {
                        isModify = true;
                    }

                    resVal = new Dynamic.DataAccess.Finance.LoanVehicleDetailsDB(User.HostName, User.DBName).SaveUpdate(beData, isModify);

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
        public JsonNetResult GetAllLoanVehicle()
        {
            Dynamic.BusinessEntity.Finance.LoanVehicleDetailsCollections dataColl = new Dynamic.BusinessEntity.Finance.LoanVehicleDetailsCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Finance.LoanVehicleDetailsDB(User.HostName, User.DBName).GetAllLoanVehicle(User.UserId, 0);
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
        public JsonNetResult GetLoanVehicleById(int TranId)
        {
            Dynamic.BusinessEntity.Finance.LoanVehicleDetails resVal = new Dynamic.BusinessEntity.Finance.LoanVehicleDetails();
            try
            {
                resVal = new Dynamic.DataAccess.Finance.LoanVehicleDetailsDB(User.HostName, User.DBName).getLoanVehicleDetails(TranId);
                return new JsonNetResult()
                {
                    Data = resVal,
                    TotalCount = 0,
                    IsSuccess = resVal.IsSuccess,
                    ResponseMSG = resVal.ResponseMSG
                };
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
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.VehicleDetail)]
        public JsonNetResult DelLoanVehicleDetails(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Vehicle detail";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.DataAccess.Finance.LoanVehicleDetailsDB(User.HostName, User.DBName).Delete(TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region " Loan Creation"

        [HttpPost]
        public JsonNetResult SaveLoanCreation()
        {
            string photoLocation = "/Attachments/Employee";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Finance.LoanCreation>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.DocumentColl;
                    beData.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);

                                if (att != null)
                                {
                                    beData.DocumentColl.Add
                                     (
                                      new Dynamic.BusinessEntity.GeneralDocument()
                                      {
                                          Data = att.Data,
                                          DocPath = att.DocPath,
                                          DocumentTypeId = v.DocumentTypeId,
                                          Extension = att.Extension,
                                          Name = v.Name,
                                          Description = v.Description
                                      }
                                     );

                                }

                            }
                            fInd++;
                        }
                    }


                    beData.CreateBy = User.UserId;
                    bool isModify = false;
                    if ( beData.TranId > 0){
                        isModify = true;
                    }

                    resVal = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).SaveUpdate(beData, isModify);

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
        public JsonNetResult GetAllLoanCreation()
        {           
            var dataColl = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).getAllLoanCreation();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Success" };
        }



        [HttpPost]
        public JsonNetResult GetLoanCreationById(int TranId)
        {
            Dynamic.BusinessEntity.Finance.LoanCreation resVal = new Dynamic.BusinessEntity.Finance.LoanCreation();
            try
            {
                resVal = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).getLoanCreationById(User.UserId,0, TranId);
                return new JsonNetResult() { Data = resVal, TotalCount = 0,  IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
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
        public JsonNetResult GetEMICalculator(BaseDate DateStyle,double Principal, double InterestRate, Dynamic.BusinessEntity.Finance.LoanTypes LoanType, Dynamic.BusinessEntity.Finance.PeriodTypes PeriodType, int Period)
        {
            var dataColl = new Dynamic.BusinessLogic.Finance.EMICalculator(DateStyle, Principal, InterestRate,LoanType, PeriodType, Period, User.HostName, User.DBName).getSchedule();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Success" };
        }

        [HttpGet]
        public JsonNetResult GetLoanDetailsByTranId(/*BaseDate baseDate*/)
        {
            Dynamic.BusinessEntity.Finance.LoanCreation resVal = new Dynamic.BusinessEntity.Finance.LoanCreation();
            new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).getLoanDetailsByTranId(0, ref resVal);
            return new JsonNetResult()

            {
                Data = resVal,
                TotalCount = 0,
                IsSuccess = true,
                ResponseMSG = "Success"
            };
        }


        [HttpPost]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.VehicleDetail)]
        public JsonNetResult DeleteLoanCreation(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (TranId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Vehicle detail";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).Delete(TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetPartywiseLoanById(int LedgerId)
        {
            var dataColl = new Dynamic.DataAccess.Finance.LoanCreationDB(User.HostName, User.DBName).GetPartywiseLoanById(LedgerId,User.UserId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = "Success" };
        }


        public ActionResult FinanceConfig()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveFinanceConfig()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.Finance.FinanceConfig>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    resVal = new Dynamic.BL.Finance.FinanceConfig(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetFinanceConfig()
        {
            var dataColl = new Dynamic.BL.Finance.FinanceConfig(User.UserId, User.HostName, User.DBName).GetConfiguuration(0);

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
    }
}