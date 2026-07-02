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

namespace PivotalERP.Controllers
{
    public class EmployeeController : PivotalERP.Controllers.APIBaseController
    {
        // GET api/<controller>
        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetProfile([FromBody] JObject para)
        {

            Dynamic.RE.HR.EmployeeProfile beData = new Dynamic.RE.HR.EmployeeProfile();
            try
            {
                int? ForEmployeeId = 0;
                string EmployeeCode = "";
                if (para == null)
                {
                    return BadRequest("No form data found");
                }
                else
                {

                    if (para.ContainsKey("ForEmployeeId"))
                        ForEmployeeId = Convert.ToInt32(para["ForEmployeeId"]);
                    if (para.ContainsKey("EmployeeCode"))
                        EmployeeCode = Convert.ToString(para["EmployeeCode"]);
                    beData = new Dynamic.BL.HR.Employee(UserId, hostName, dbName).GetEmployee(ForEmployeeId, 0, EmployeeCode);

                }

            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }

            var retVal = new
            {
                ResponseMSG = beData.ResponseMSG,
                IsSuccess = beData.IsSuccess,
                DataColl = beData,

            };

            return Json(retVal, new JsonSerializerSettings
            {                 
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetEmployeeProfileById(int EmployeeId)
        {

            Dynamic.BE.HR.Employee beData = new Dynamic.BE.HR.Employee();
            try
            {
                beData = new Dynamic.BL.HR.Employee(UserId, hostName, dbName).GetEmployeeById(0, EmployeeId);

            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }

            var retVal = new
            {
                ResponseMSG = beData.ResponseMSG,
                IsSuccess = beData.IsSuccess,
                DataColl = beData,

            };

            return Json(retVal, new JsonSerializerSettings
            {                 
            });
        }

        //Badhara 31
        //[HttpPost]
        //[System.Web.Mvc.AllowAnonymous]
        //[ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        //public IHttpActionResult AttendanceLog([FromBody] JObject para)
        //{

        //    Dynamic.RE.HR.AttendanceLogCollections dataColl = new Dynamic.RE.HR.AttendanceLogCollections();
        //    try
        //    {
        //        DateTime DateFrom = DateTime.Today;
        //        DateTime DateTo = DateTime.Today;
        //        int? EmployeeId = 0;
        //        if (para == null)
        //        {
        //            return BadRequest("No form data found");
        //        }
        //        else
        //        {
        //            if (para.ContainsKey("DateFrom"))
        //               DateFrom = Convert.ToDateTime(para["DateFrom"]);

        //            if (para.ContainsKey("DateTo"))
        //                DateFrom = Convert.ToDateTime(para["DateTo"]);

        //            if (para.ContainsKey("EmployeeId"))
        //                EmployeeId = Convert.ToInt32(para["EmployeeId"]);

        //            dataColl = new Dynamic.DA.HR.AttendaceLogDB(hostName, dbName).AttendanceLog(DateFrom, DateTo, EmployeeId, UserId);
        //        }

        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;
        //    }
        //    var retVal = new
        //    {
        //        ResponseMSG = dataColl.ResponseMSG,
        //        IsSuccess = dataColl.IsSuccess,
        //        DataColl = dataColl

        //    };


        //    return Json(retVal, new JsonSerializerSettings
        //    {
        //    });
        //}


        //Asoj 8 Prashant Code
        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> ManualAttendance()
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

                    Dynamic.BE.HR.ManualAttendanceCollections para = DeserializeObject<Dynamic.BE.HR.ManualAttendanceCollections>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                  
                    else
                    {
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "photo")
                                    para.PhotoPath = docV.DocPath;
                            }
                        }

                        Dynamic.BL.HR.ManualAttendance jrn = new Dynamic.BL.HR.ManualAttendance(UserId, hostName, dbName);
                        resVal = jrn.SaveFormData(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateEmpDetails()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        para.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "photo")
                                    para.Photo = docV.DocPath;
                                else if (docV.ParaName == "citiFront")
                                    para.CitiFrontImg = docV.DocPath;
                                else if (docV.ParaName == "citiBack")
                                    para.CitiBackImg = docV.DocPath;
                                else
                                    para.AttachmentColl.Add(docV);
                            }
                        }

                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateEmpDetail(para);
                    }
                    
                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateEmpAddress()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateEmpAdd(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateEmergencyContract()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateEmergency(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateOfficialDetail()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateOffDet(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdatePfSsfCit()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        para.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "pfAttach")
                                    para.PfAtt = docV.DocPath;
                                else if (docV.ParaName == "sfAttach")
                                    para.SsfAtt = docV.DocPath;
                                else if (docV.ParaName == "citAttach")
                                    para.CitAtt = docV.DocPath;
                                else if (docV.ParaName == "gratAttach")
                                    para.GratAtt = docV.DocPath;
                                else
                                    para.AttachmentColl.Add(docV);
                            }
                        }

                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.UpdatePfSsfCit(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateBankDetails()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {

                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateBankDetails(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateInsurance()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        para.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "liAttach")
                                    para.LiAtt = docV.DocPath;
                                else if (docV.ParaName == "hiAttach")
                                    para.HiAtt = docV.DocPath;
                                else
                                    para.AttachmentColl.Add(docV);
                            }
                        }
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateInsurance(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateAccountDet()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateAccountDet(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }
        
        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateQualification()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateQualification(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateExperience()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateExperience(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateSupervisor()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateSupervisor(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        [System.Web.Http.HttpPut]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> UpdateDocument()
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

                    Dynamic.BE.HR.Employee para = DeserializeObject<Dynamic.BE.HR.Employee>(jsonData);

                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else if (!para.EmployeeId.HasValue || para.EmployeeId == 0)
                    {
                        resVal.ResponseMSG = "Invalid";
                    }
                    else
                    {
                        para.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        if (provider.FileData.Count > 0)
                        {
                            int fInd = 0;
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "files" + fInd)
                                {
                                    para.AttachmentColl.Add(new Dynamic.BusinessEntity.GeneralDocument()
                                    {
                                        Data = docV.Data,
                                        DocPath = docV.DocPath,
                                        DocumentTypeId = docV.DocumentTypeId,
                                        Extension = docV.Extension,
                                        Name = docV.Name,
                                        Description = docV.Description
                                    });
                                    fInd++;
                                }
                                else
                                    para.AttachmentColl.Add(docV);
                                
                            }
                        }
                        Dynamic.BL.HR.Employee jrn = new Dynamic.BL.HR.Employee(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveUpdateDocumnet(para);
                    }

                }

                return Json(resVal, new JsonSerializerSettings
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
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }

        #region "Grievance"
        
        [HttpGet]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetGrievanceType()
        {
            Dynamic.BE.HR.GrievanceTypeCollections dataColl = new Dynamic.BE.HR.GrievanceTypeCollections();
            try
            {
                dataColl = new Dynamic.BL.HR.GrievanceType(1, hostName, dbName).GetActiveGrievanceType(0);
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
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","id","text","TranId","Name","Code","Description"
                    }
                }
            });
        }

        [HttpPost]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> SaveGrievanceDetails()
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
                    Dynamic.BE.HR.GrievanceForm para = DeserializeObject<Dynamic.BE.HR.GrievanceForm>(jsonData);
                    if (para == null)
                    {
                        return BadRequest("No form data found");
                    }
                    else
                    {
                        if (provider.FileData.Count > 0)
                        {
                            Dynamic.BusinessEntity.GeneralDocumentCollections data = GetAttachmentDocuments(provider.FileData);
                            foreach (var docV in data)
                            {
                                if (docV.ParaName == "Photo")
                                    para.Attachment = docV.DocPath;
                            }
                        }

                        if (!para.TranId.HasValue)
                            para.TranId = 0;
                        Dynamic.BL.HR.GrievanceForm jrn = new Dynamic.BL.HR.GrievanceForm(UserId, hostName, dbName);
                        para.CUserId = UserId;
                        resVal = jrn.SaveFormData(para);
                    }
                }
                var retVal = new
                {
                    ResponseMSG = resVal.ResponseMSG,
                    IsSuccess = resVal.IsSuccess
                };
                return Json(retVal, new JsonSerializerSettings
                {
                });

            }
            catch (Exception ee)
            {
                return BadRequest(ee.Message);
            }
        }
        
        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetGrievanceList([FromBody] JObject para)
        {
            Dynamic.RE.HR.Report.GrievanceListCollections dataColl = new Dynamic.RE.HR.Report.GrievanceListCollections();
            try
            {
                DateTime DateFrom = DateTime.Today;
                DateTime DateTo = DateTime.Today;
                int? DepartmentId = null;
                int? GrievanceTypeId = null;
                int? ForUserId = null;
                int? StatusId = null;

                if (para == null)
                {
                    return BadRequest("No form data found");
                }
                else
                {
                    if (para.ContainsKey("DateFrom"))
                        DateFrom = Convert.ToDateTime(para["DateFrom"]);
 
                    if (para.ContainsKey("DateTo"))
                        DateTo = Convert.ToDateTime(para["DateTo"]);

                    if (para.ContainsKey("DepartmentId"))
                        DepartmentId = Convert.ToInt32(para["DepartmentId"]);

                    if (para.ContainsKey("ForUserId"))
                        ForUserId = Convert.ToInt32(para["ForUserId"]);
 
                    if (para.ContainsKey("GrievanceTypeId"))
                        GrievanceTypeId = Convert.ToInt32(para["GrievanceTypeId"]);
 
                    if (para.ContainsKey("StatusId"))
                        StatusId = Convert.ToInt32(para["StatusId"]);
 
                    dataColl = new Dynamic.BL.HR.Report.GrievanceList(UserId, hostName, dbName).GetGrievanceList(0,DateFrom, DateTo, DepartmentId, ForUserId, GrievanceTypeId, StatusId);
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
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","SubmittedMiti","GrievanceType","EmpCode","EmpName","Designation","Department","ContactNo", "Email","EnrollNo","Branch","Description","Doc",
                        "Status","ActionTaken","ActionTakenBy","AssignedTo","ActionTakenAt","Notes","Remarks","ClosureDate","TranId"
                    }
                }
            });
        }

        #endregion
    }
}