using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PivotalERP.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Data.SqlClient;

namespace PivotalERP.Controllers
{
    public class LeaveController : PivotalERP.Controllers.APIBaseController
    {
        // GET api/<controller>
        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> SaveLeaveRequest()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = HttpStatusCode.UnsupportedMediaType.ToString();
                }
                else
                {
                    var provider = new FormDataStreamProvider(GetPath("~/Attachments/Employee"), UserId, 0);
                    await Request.Content.ReadAsMultipartAsync(provider);

                    string jsonData = provider.FormData["paraData"];
                    if (string.IsNullOrEmpty(jsonData))
                        return BadRequest("No data found");

                    Dynamic.API.Attendance.LeaveRequest para = DeserializeObject<Dynamic.API.Attendance.LeaveRequest>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.LeaveTypeId.HasValue || para.LeaveTypeId == 0)
                    {
                        para.LeaveTypeId = 0;
                    }
                    else
                    {
                        para.DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV != null)
                                {
                                    para.DocumentColl.Add(docV);
                                }
                            }
                        }
                        Dynamic.BL.Attendance.LeaveRequest jrn = new Dynamic.BL.Attendance.LeaveRequest(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveFromApp(para);
                    }                  
                  
                }

            }
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
            var retVal = new
            {
                ResponseMSG = resVal.ResponseMSG,
                IsSuccess = resVal.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                                 {
                                   "IsSuccess","ResponseMSG"
                                 }
                }
            });
        }
        
        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetEmpLeaveReq([FromBody] JObject para)
        {

            Dynamic.RE.Attendance.EmpLeaveRequestCollections dataColl = new Dynamic.RE.Attendance.EmpLeaveRequestCollections();
            try
            {
                int LeaveStatus = 0;
                DateTime dateFrom = DateTime.Today;
                DateTime dateTo = DateTime.Today;
                int? ForUserId = 0;
                int EmployeeOrSalesman = 0;
                bool forApproval = false;
                if (para == null)
                {
                    return BadRequest("No form data found");
                }
                else
                {
                    if (para.ContainsKey("dateFrom"))
                        dateFrom = Convert.ToDateTime(para["dateFrom"]);

                    if (para.ContainsKey("dateTo"))
                        dateTo = Convert.ToDateTime(para["dateTo"]);

                    if (para.ContainsKey("LeaveStatus"))
                        LeaveStatus = Convert.ToInt32(para["LeaveStatus"]);

                    if (para.ContainsKey("ForUserId"))
                        ForUserId = Convert.ToInt32(para["ForUserId"]);

                    if (para.ContainsKey("EmployeeOrSalesman"))
                        EmployeeOrSalesman = Convert.ToInt32(para["EmployeeOrSalesman"]);

                    if (para.ContainsKey("forApproval"))
                        forApproval = Convert.ToBoolean(para["forApproval"]);

                    dataColl = new Dynamic.BL.Attendance.LeaveRequest(UserId,hostName, dbName).getEmpLeaveRequestLst(dateFrom, dateTo, LeaveStatus, ForUserId, EmployeeOrSalesman, forApproval);
                }

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            var retVal = new
            {
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess,
                DataColl = dataColl

            };


            return Json(retVal, new JsonSerializerSettings
            {
            });
        }
        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> LeaveApprove()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = HttpStatusCode.UnsupportedMediaType.ToString();
                }
                else
                {
                    var provider = new FormDataStreamProvider(GetPath("~/Attachments/Employee"), UserId, 0);
                    await Request.Content.ReadAsMultipartAsync(provider);

                    string jsonData = provider.FormData["paraData"];
                    if (string.IsNullOrEmpty(jsonData))
                        return BadRequest("No data found");

                    Dynamic.API.Attendance.LeaveApprove para = DeserializeObject<Dynamic.API.Attendance.LeaveApprove>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (string.IsNullOrEmpty(para.ApprovedRemarks))
                    {
                        resVal.ResponseMSG = "Please ! Enter Remarks";
                    }
                    else if (para.ApprovedType <= 1)
                    {
                        resVal.ResponseMSG = "Please ! Select Approved Status";
                    }

                    else
                    {
                        Dynamic.BL.Attendance.LeaveRequest jrn = new Dynamic.BL.Attendance.LeaveRequest(UserId, hostName, dbName);
                        para.ApprovedBy = UserId;
                        //para.ApprovedByUser = UserName;
                        resVal = jrn.LeaveApproved(para);
                    }

                }

            }
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
            var retVal = new
            {
                ResponseMSG = resVal.ResponseMSG,
                IsSuccess = resVal.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                                 {
                                   "IsSuccess","ResponseMSG"
                                 }
                }
            });
        }


        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetLeaveBalanaceSummary([FromBody] JObject para)
        {

            Dynamic.BE.Attendance.LeaveBalanceSummaryCollections dataColl = new Dynamic.BE.Attendance.LeaveBalanceSummaryCollections();
            try
            {
                string BranchIdColl = "";
                string DepartmentIdColl = "";
                string CategoryIdColl = "";
                int? EmployeeId = null;
                int PeriodId = 0;
                int EmployeeOrSalesman = 1;

                if (para == null)
                {
                    return BadRequest("No form data found");
                }
                else
                {
                    if (para.ContainsKey("BranchIdColl"))
                        BranchIdColl = Convert.ToString(para["BranchIdColl"]);

                    if (para.ContainsKey("DepartmentIdColl"))
                        DepartmentIdColl = Convert.ToString(para["DepartmentIdColl"]);

                    if (para.ContainsKey("CategoryIdColl"))
                        CategoryIdColl = Convert.ToString(para["CategoryIdColl"]);

                    if (para.ContainsKey("UserId"))
                        EmployeeId = Convert.ToInt32(para["UserId"]);

                    if (para.ContainsKey("PeriodId"))
                        PeriodId = Convert.ToInt32(para["PeriodId"]);

                    if (para.ContainsKey("EmployeeOrSalesman"))
                        EmployeeOrSalesman = Convert.ToInt32(para["EmployeeOrSalesman"]);

                    dataColl = new Dynamic.BL.Attendance.LeaveBalanceSummary(UserId, hostName, dbName).GetLeaveBalanaceSummary(BranchIdColl, DepartmentIdColl, CategoryIdColl, EmployeeId, PeriodId, EmployeeOrSalesman);
                }

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            var retVal = new
            {
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess,
                DataColl = dataColl

            };


            return Json(retVal, new JsonSerializerSettings
            {
            });
        }


    }
}