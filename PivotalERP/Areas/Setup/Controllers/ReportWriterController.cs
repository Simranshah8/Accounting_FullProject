using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using ClosedXML.Excel;
using System.IO;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.Setup.Controllers
{
    public class ReportWriterController : PivotalERP.Controllers.BaseController
    {

        private Dynamic.DataAccess.Setup.ReportWriterDB reportWriterDB = null;

        #region "Query Builder"

        //Query Builder
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ReportWriter)]
        public ActionResult QueryBuilder()
        {
            reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);
            List<SelectListItem> dateTypeColl = new List<SelectListItem>();
            ViewBag.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReportWriter);

            return View();
        }



        [HttpGet]
        public JsonNetResult GetModuleList()
        {
            List<Dynamic.BusinessEntity.Global.CommonClass> moduleColl = new List<Dynamic.BusinessEntity.Global.CommonClass>();
            int mId = 0;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Global.Modules)))
            {
                moduleColl.Add(new Dynamic.BusinessEntity.Global.CommonClass() { id = mId, text = str });
                mId++;
            }

            return new JsonNetResult() { Data = moduleColl, TotalCount = moduleColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };            
        }

        [HttpGet]
        public JsonNetResult GetActionList()
        {
            List<Dynamic.BusinessEntity.Global.CommonClass> moduleColl = new List<Dynamic.BusinessEntity.Global.CommonClass>();
            int mId = 1;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Global.Actions)))
            {
                moduleColl.Add(new Dynamic.BusinessEntity.Global.CommonClass() { id = mId, text = str });
                mId++;
            }

            return new JsonNetResult() { Data = moduleColl, TotalCount = moduleColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpGet]
        public JsonNetResult GetDataTypeList()
        {
            List<Dynamic.BusinessEntity.Global.CommonClass> moduleColl = new List<Dynamic.BusinessEntity.Global.CommonClass>();
            int mId = 1;
            foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Setup.DATATYPES)))
            {
                moduleColl.Add(new Dynamic.BusinessEntity.Global.CommonClass() { id = mId, text = str });
                mId++;
            }
            return new JsonNetResult() { Data = moduleColl, TotalCount = moduleColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };            
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ReportWriter)]
        public JsonNetResult SaveUpdateQueryBuilder(Dynamic.BusinessEntity.Setup.ReportWriter beData)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No Data Found for save/update";
                }
                else if (string.IsNullOrEmpty(beData.TSql))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "no sql query . pls write sql query first";
                }
                else
                {
                    beData.CUserId = User.UserId;
                    if (string.IsNullOrEmpty(beData.ReportName))
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Name should not be blank";
                    }
                    else
                    {
                        bool isValid = true;
                        if (beData.ParaColl != null && beData.ParaColl.Count > 0)
                        {
                            foreach (var pc in beData.ParaColl)
                            {
                                if (string.IsNullOrEmpty(pc.VariableName) || pc.VariableName.Trim().Contains(" ") || pc.VariableName.Contains("@"))
                                {
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = "Invalid Variable Name ";
                                    isValid = false;
                                    break;
                                }
                                else if (string.IsNullOrEmpty(pc.Label))
                                {
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = "Invalid Lavel Name ";
                                    isValid = false;
                                    break;
                                }

                                if (pc.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.DROPDOWN && string.IsNullOrEmpty(pc.Source))
                                {
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = "Please ! Enter Drodown Source ";
                                    isValid = false;
                                    break;
                                }

                                if (!beData.TSql.Contains("@" + pc.VariableName))
                                {
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = "Variable Name : " + pc.VariableName + " was not used so pls used or remove it.";
                                    isValid = false;
                                    break;
                                }

                            }
                        }

                        if (isValid)
                        {
                            reportWriterDB.SaveUpdate(beData, beData.TranId > 0);
                            resVal.ResponseMSG = beData.ResponseMSG;
                            resVal.IsSuccess = beData.IsSuccess;
                        }

                    }
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }



            return new JsonNetResult() { Data = resVal,TotalCount=1,IsSuccess=resVal.IsSuccess,ResponseMSG=resVal.ResponseMSG };


        }

        [HttpGet]
        public JsonNetResultWithEnum GetAllQueryBuilder()
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            Dynamic.BusinessEntity.Setup.ReportWriterCollections dataColl = dataColl = reportWriterDB.GetAllReportWriter(User.UserId,false);

            return new JsonNetResultWithEnum() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };            
        }

        [HttpPost]
        public JsonNetResult GetQueryBuilderById(int TranId)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            Dynamic.BusinessEntity.Setup.ReportWriter beData = reportWriterDB.getReportWriterById(TranId, User.UserId);

            return new JsonNetResult() { Data = beData, TotalCount = 1, IsSuccess = beData.IsSuccess, ResponseMSG = beData.ResponseMSG };
            
        }

        [HttpPost]
        public JsonNetResult DeleteQueryBuilderById(Dynamic.BusinessEntity.Setup.ReportWriter beData)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            ResponeValues resVal = reportWriterDB.Delete(User.UserId, beData.TranId);
            return new JsonNetResult() { Data = resVal };
        }

        [HttpPost]
        public JsonNetResult GetAllReportMenu()
        {
            if(reportWriterDB==null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            Dynamic.BusinessEntity.Setup.ReportWriterCollections dataColl  = reportWriterDB.GetAllReportWriterForMenu(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            
        }

        #endregion

        #region "ReportViewer"

        [HttpGet]
        //[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ReportWriter)]
        public ActionResult RunReportViewer(int TranId)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            Dynamic.BusinessEntity.Setup.ReportWriter rw = reportWriterDB.getReportWriterById(TranId, User.UserId);
            return View(rw);
        }

        [HttpPost]
        public JsonNetResult SaveRptState(Dynamic.BusinessEntity.Setup.ReportWriterState beData)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "No Data Found for save/update";
                }
                else if (beData.TranId == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Invalid Report";
                }
                else if (string.IsNullOrEmpty(beData.State))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "no data(state) for save";
                }
                else
                {
                    beData.UserId = User.UserId;

                    reportWriterDB.SaveState(beData);
                    resVal.ResponseMSG = beData.ResponseMSG;
                    resVal.IsSuccess = beData.IsSuccess;

                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }



            return new JsonNetResult() { Data = resVal,TotalCount=1,IsSuccess=resVal.IsSuccess,ResponseMSG=resVal.ResponseMSG };


        }

        //[HttpPost]
        //public JsonNetResult GetColumnsList(int TranId)
        //{
        //    if (reportWriterDB == null)
        //        reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

        //    Dynamic.BusinessEntity.Setup.ReportWriter rw = reportWriterDB.getReportWriterById(TranId, User.UserId);
        //    List<Dynamic.BusinessEntity.Global.CommonClass> dataColl = reportWriterDB.getColumnsList(User.UserId, rw);

        //    var beData = new Dynamic.BusinessEntity.Setup.ReportWriter();
        //    beData.TranId = rw.TranId;
        //    beData.ReportName = rw.ReportName;
        //    beData.TSql = rw.TSql;
        //    beData.ParaColl = new Dynamic.BusinessEntity.Setup.ReportWriterParaCollections();
        //    beData.ReportType = rw.ReportType;
        //    beData.ReportState = rw.ReportState;

        //    foreach (var v in rw.ParaColl)
        //    {
        //        Dynamic.BusinessEntity.Setup.ReportWriterPara para = new Dynamic.BusinessEntity.Setup.ReportWriterPara();
        //        para.VariableName = v.VariableName;
        //        para.Label = v.Label;
        //        para.DefaultValue = v.DefaultValue;
        //        para.DataType = v.DataType;
        //        if (string.IsNullOrEmpty(para.DefaultValue))
        //        {
        //            switch (para.DataType)
        //            {
        //                case Dynamic.BusinessEntity.Setup.DATATYPES.AMOUNT:
        //                case Dynamic.BusinessEntity.Setup.DATATYPES.DROPDOWN:
        //                case Dynamic.BusinessEntity.Setup.DATATYPES.NUMBER:
        //                    para.DefaultValue = "0";
        //                    break;
        //                case Dynamic.BusinessEntity.Setup.DATATYPES.DATE:
        //                    para.DefaultValue = DateTime.Today.ToString("yyyy-MM-dd");
        //                    break;
        //                case Dynamic.BusinessEntity.Setup.DATATYPES.TEXT:
        //                    para.DefaultValue = "";
        //                    break;
        //            }
        //        }

        //        beData.ParaColl.Add(para);
        //    }

        //    var resVal = new
        //    {
        //        BeData = beData,
        //        ColumnColl = dataColl,
        //        ParaHtml = GetParameterHtml(rw)
        //    };

        //    return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };            
        //}

        [HttpPost]
        public JsonNetResult GetReportData(Dynamic.BusinessEntity.Setup.ReportWriter beData)
        {
            if (reportWriterDB == null)
                reportWriterDB = new Dynamic.DataAccess.Setup.ReportWriterDB(User.HostName, User.DBName);

            ResponeValues resVal = new ResponeValues();

            try
            {
                var resVal1 = new
                {
                    DataColl = reportWriterDB.getData(User.UserId, beData),
                    IsSuccess = true,
                    ResponseMSG = "Success"
                };
                return new JsonNetResult() { Data = resVal1 };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
                return new JsonNetResult() { Data = resVal };
            }


        }
        //private string GetParameterHtml(Dynamic.BusinessEntity.Setup.ReportWriter beData)
        //{
        //    if (beData == null)
        //        return "";

            
        //    StringBuilder pHtml = new StringBuilder();
        //    int row = 0;
        //    foreach (Dynamic.BusinessEntity.Setup.ReportWriterPara rp in beData.ParaColl)
        //    {

        //        if (!string.IsNullOrEmpty(rp.Source) && rp.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.DROPDOWN)
        //        {
        //            //List<Dynamic.BusinessEntity.Global.CommonClass> paraValues = reportWriterDB.getParaValues(rp.Source);

        //            StringBuilder paraHtml = new StringBuilder();

        //            if (rp.AllowNull)
        //                paraHtml.Append(@"<option value=""0"">...Select " + rp.Label + "</option>");

        //            foreach (var v in paraValues)
        //            {
        //                paraHtml.Append(@"<option value=""" + v.id.ToString() + @""">" + v.text + @"</option>");
        //            }

        //            pHtml.Append(@"<div class=""col-md-3"">
        //                      <div class=""form-group"">
        //                    <label class=""control-label"">
        //                        " + rp.Label + @" <span id=""ErrUserName"" style=""color:red;""></span>
        //                    </label>
        //                    <div class=""form-group"">                                     
        //                        <select  id=" + rp.VariableName + @" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm col-md-12 select2"">" + paraHtml.ToString() + @"                                                     
        //                        </select> 
        //                    </div>
        //                </div>
        //            </div>");		// Create a row for each parameter                

        //        }
        //        else if (rp.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.TEXT)
        //        {
        //            pHtml.Append(@"<div class=""col-lg-3"">
        //                                                    <label>" + rp.Label + @"</label>
        //                                                    <div class=""input-group"">
        //                                                        <div class=""input-group-append"">
        //                                                            <button type=""submit"" class=""btn btn-default""><i class=""fas fa-info""></i></button>
        //                                                        </div>                                                                
        //                                                        <input type=""text"" id=""" + rp.VariableName + @""" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm"">
        //                                                    </div>
        //                                                </div>");

        //            //pHtml.Append(@"<div class=""col-md-3"">
        //            //          <div class=""card-tools"">
        //            //               <div class=""form-group"">
        //            //                    <label class=""control-label"">
        //            //                        " + rp.Label + @" <span id=""ErrUserName"" style=""color:red;""></span>
        //            //                    </label>
        //            //                    <div class=""input-group"">     
        //            //                        <span class=""input-group-addon""><i class=""fa fa-info""></i></span>                           
        //            //                        <input type=""text"" id=""" + rp.VariableName + @""" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm col-md-12"">
        //            //                    </div>
        //            //                </div>
        //            //         </div>
        //            //</div>");		

        //            // Create a row for each parameter                
        //        }
        //        else if (rp.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.NUMBER || rp.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.AMOUNT)
        //        {
        //            pHtml.Append(@"<div class=""col-lg-3"">
        //                                                    <label>" + rp.Label + @"</label>
        //                                                    <div class=""input-group"">
        //                                                        <div class=""input-group-append"">
        //                                                            <button type=""submit"" class=""btn btn-default""><i class=""fas fa-info""></i></button>
        //                                                        </div>                                                                
        //                                                        <input type=""number"" id=""" + rp.VariableName + @""" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm"">
        //                                                    </div>
        //                                                </div>");


        //            //pHtml.Append(@"<div class=""col-md-3"">
        //            //          <div class=""form-group"">
        //            //        <label class=""control-label"">
        //            //            " + rp.Label + @" <span id=""ErrUserName"" style=""color:red;""></span>
        //            //        </label>
        //            //        <div class=""input-group"">     
        //            //            <span class=""input-group-addon""><i class=""fa fa-info""></i></span>                           
        //            //            <input type=""number"" id=""" + rp.VariableName + @""" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm col-md-12"">
        //            //        </div>
        //            //    </div>
        //            //</div>");		
        //            // Create a row for each parameter                
        //        }
        //        else if (rp.DataType == Dynamic.BusinessEntity.Setup.DATATYPES.DATE)
        //        {
        //            pHtml.Append(@"<div class=""col-lg-3"">
        //                                                    <label>" + rp.Label + @"</label>
        //                                                    <div class=""input-group"">
        //                                                        <div class=""input-group-append"">
        //                                                            <button type=""submit"" class=""btn btn-default""><i class=""fas fa-calendar""></i></button>
        //                                                        </div>                                                                
        //                                                        <input date-control type=""text"" id=""" + rp.VariableName + @""" ng-model=""beData.ParaColl[" + row.ToString() + @"].DefaultValue"" class=""form-control input-sm"">
        //                                                    </div>
        //                                                </div>");
                   
                    
        //            // Create a row for each parameter                
        //        }

        //        row++;
        //    }

        //    pHtml.Append(@"<div class=""col-lg-3"">
        //                                                    <label>Search</label>
        //                                                    <div class=""input-group"">
        //                                                        <div class=""input-group-append"">
        //                                                            <button type=""submit"" class=""btn btn-default""><i class=""fas fa-search""></i></button>
        //                                                        </div>
        //                                                        <input type=""text"" id=""txtSearch"" ng-model=""search"" class=""form-control input-sm col-md-12"" placeholder=""Search...."" ng-change=""onFilterTextBoxChanged()"">
        //                                                    </div>
        //                                                </div>");
           

        //    if (beData.ReportType == Dynamic.BusinessEntity.Setup.REPORTTYPES.TABLE)
        //    {
        //        pHtml.Append(@"<div class=""col-md-2"">
        //                <div class=""form-group"">
        //                    <label class=""control-label"">
        //                        <span id=""ErrUserName"" style=""color:red;""></span>
        //                    </label>
        //                    <div class=""input-group"">
        //                        <a class=""btn btn-primary btn-sm"" style=""float: right; max-width: 100px"" data-toggle=""tooltip"" data-placement=""top"" title ="""" data-original-title=""Load"" ng-click=""GetData()"" ng-disabled=""loadingstatus =='running'"" ><i class=""fas fa-download"" ></i></a>
        //                        <button type=""button"" class=""btn-primary btn-sm"" ng-click=""onBtExport()"" ng-disabled=""loadingstatus == 'running'"" ><i class=""fas fa-file-export"" ></i></button>   
        //                    </div>
        //                </div>
        //            </div>");

        //    }
        //    else
        //    {
        //        pHtml.Append(@"<div class=""col-md-2"">
        //                <div class=""form-group"">
        //                    <label class=""control-label"">
        //                        <span id=""ErrUserName"" style=""color:red;""></span>
        //                    </label>
        //                    <div class=""input-group"">
        //                        <a class=""btn btn-primary btn-sm"" style=""float: right; max-width: 100px"" data-toggle=""tooltip"" data-placement=""top"" title ="""" data-original-title=""Load"" ng-click=""GetData()"" ng-disabled=""loadingstatus =='running'"" ><i class=""fas fa-download"" ></i></a>
        //                     <a onclick=""tableToExcel('testTable','exportdata');""  href=""#"" class=""btn btn-primary btn-sm"">
        //                        <i class=""fas fa-file-export""></i>
        //                            XLS
        //                     </a>
        //                    <button class=""btn btn-info btn-sm"" type=""button"" ng-click=""saveState()"" ng-disabled=""loadingstatus=='running'""><i class=""fas fa-save""></i></button>
        //                    </div>
                            
        //                </div>
        //            </div>");
        //    }


        //    //pHtml.Append(@"</div>");
        //    return pHtml.ToString();
        //}
        public ActionResult ExportToExcel()
        {
            System.Data.DataTable dt = new System.Data.DataTable();
            //Name of File  
            string fileName = "Sample.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        #endregion

        [HttpGet]
        public JsonNetResultWithEnum GetPKTables()
        {
            Dynamic.BusinessEntity.Setup.RefTableCollections DataColl = new Dynamic.DataAccess.Setup.NewEntityDB(this.User.HostName, this.User.DBName).GetAllPkTables(this.User.UserId);
            return new JsonNetResultWithEnum() { Data = DataColl, TotalCount = DataColl.Count, IsSuccess = DataColl.IsSuccess, ResponseMSG = DataColl.ResponseMSG };
        }
    }
}