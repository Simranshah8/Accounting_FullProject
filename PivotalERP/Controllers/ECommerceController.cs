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
    public class ECommerceController : PivotalERP.Controllers.APIBaseController
    {
        // GET: ECommerce
        //Hero Section Starts
        [HttpPost]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> SaveHeroSection()
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
                    var provider = new FormDataStreamProvider(GetPath("~/Attachments/appcms"), UserId, 0);
                    await Request.Content.ReadAsMultipartAsync(provider);

                    string jsonData = provider.FormData["paraData"];
                    if (string.IsNullOrEmpty(jsonData))
                        return BadRequest("No data found");
                    Dynamic.BE.AppCMS.HeroSection para = DeserializeObject<Dynamic.BE.AppCMS.HeroSection>(jsonData);
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
                                    para.Photo = docV.DocPath;
                            }
                        }

                        if (!para.TranId.HasValue)
                            para.TranId = 0;
                        Dynamic.BL.AppCMS.HeroSection jrn = new Dynamic.BL.AppCMS.HeroSection(UserId, hostName, dbName);
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
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllHeroSection()
        {
            Dynamic.BE.AppCMS.HeroSectionCollections dataColl = new Dynamic.BE.AppCMS.HeroSectionCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.HeroSection(1, hostName, dbName).GetAllHeroSection(0);
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
                        "DataColl","IsSuccess","ResponseMSG","id","text","TranId","Badge","Title","Photo","Description"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetHeroSectionById([FromBody] JObject para)
        {
            Dynamic.BE.AppCMS.HeroSection beData = new Dynamic.BE.AppCMS.HeroSection();
            try
            {
                int TranId = 0;
                if (para.ContainsKey("TranId"))
                    TranId = Convert.ToInt32(para["TranId"]);

                beData = new Dynamic.BL.AppCMS.HeroSection(UserId, hostName, dbName).GetHeroSectionById(0, TranId);

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
                DataColl = beData
            };
            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","TranId","Badge","Title","Photo","Description"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult DeleteHeroSectionById([FromBody] JObject para)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                int TranId = 0;
                if (para.ContainsKey("TranId"))
                    TranId = Convert.ToInt32(para["TranId"]);

                resVal = new Dynamic.BL.AppCMS.HeroSection(UserId, hostName, dbName).DeleteById(0, TranId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
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

        //Hero Section Ends

        //Tag Section Strats
        [HttpPost]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> SaveTagSection()
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
                    var provider = new FormDataStreamProvider(GetPath("~/Attachments/appcms"), UserId, 0);
                    await Request.Content.ReadAsMultipartAsync(provider);

                    string jsonData = provider.FormData["paraData"];
                    if (string.IsNullOrEmpty(jsonData))
                        return BadRequest("No data found");
                    Dynamic.BE.AppCMS.TagSection para = DeserializeObject<Dynamic.BE.AppCMS.TagSection>(jsonData);
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
                                    para.Photo = docV.DocPath;
                            }
                        }

                        if (!para.TagId.HasValue)
                            para.TagId = 0;
                        Dynamic.BL.AppCMS.TagSection jrn = new Dynamic.BL.AppCMS.TagSection(UserId, hostName, dbName);
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
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllTagSection()
        {
            Dynamic.BE.AppCMS.TagSectionCollections dataColl = new Dynamic.BE.AppCMS.TagSectionCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.TagSection(1, hostName, dbName).GetAllTagSection(0);
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
                        "DataColl","IsSuccess","ResponseMSG","id","text","TagId","Badge","Title","Photo","ProductId","ProductName","ProductAlias","ProductCategory",
                        "PhotoPath","PurchaseRate","MRP","SalesRate","VideoLink"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetTagSectionById([FromBody] JObject para)
        {
            Dynamic.BE.AppCMS.TagSection beData = new Dynamic.BE.AppCMS.TagSection();
            try
            {
                int TagId = 0;
                if (para.ContainsKey("TagId"))
                    TagId = Convert.ToInt32(para["TagId"]);

                beData = new Dynamic.BL.AppCMS.TagSection(UserId, hostName, dbName).GetTagSectionById(0, TagId);

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
                DataColl = beData
            };
            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","TagId","Badge","Title","Photo","ProductId"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult DeleteTagSectionById([FromBody] JObject para)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                int TagId = 0;
                if (para.ContainsKey("TagId"))
                    TagId = Convert.ToInt32(para["TagId"]);

                resVal = new Dynamic.BL.AppCMS.TagSection(UserId, hostName, dbName).DeleteById(0, TagId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
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
        //Tag Section Ends

        //Store Locator Section Strats
        [HttpPost]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public async Task<IHttpActionResult> SaveStoreLocator()
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
                    var provider = new FormDataStreamProvider(GetPath("~/Attachments/appcms"), UserId, 0);
                    await Request.Content.ReadAsMultipartAsync(provider);

                    string jsonData = provider.FormData["paraData"];
                    if (string.IsNullOrEmpty(jsonData))
                        return BadRequest("No data found");
                    Dynamic.BE.AppCMS.StoreLocator para = DeserializeObject<Dynamic.BE.AppCMS.StoreLocator>(jsonData);
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
                                    para.Photo = docV.DocPath;
                            }
                        }

                        if (!para.StoreId.HasValue)
                            para.StoreId = 0;
                        Dynamic.BL.AppCMS.StoreLocator jrn = new Dynamic.BL.AppCMS.StoreLocator(UserId, hostName, dbName);
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
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllStoreLocator()
        {
            Dynamic.BE.AppCMS.StoreLocatorCollections dataColl = new Dynamic.BE.AppCMS.StoreLocatorCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.StoreLocator(1, hostName, dbName).GetAllStoreLocator(0);
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
                        "DataColl","IsSuccess","ResponseMSG","id","text","StoreId","StoreName","CountryName","CityName","Location","Address","PhoneNo",
                        "Photo","OpeningTime","ClosingTime"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetStoreLocatorById([FromBody] JObject para)
        {
            Dynamic.BE.AppCMS.StoreLocator beData = new Dynamic.BE.AppCMS.StoreLocator();
            try
            {
                int StoreId = 0;
                if (para.ContainsKey("StoreId"))
                    StoreId = Convert.ToInt32(para["StoreId"]);

                beData = new Dynamic.BL.AppCMS.StoreLocator(UserId, hostName, dbName).GetStoreLocatorById(0, StoreId);

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
                DataColl = beData
            };
            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","StoreId","StoreName","CountryName","CityName","Location","Address","PhoneNo","Photo","OpeningTime","ClosingTime"
                    }
                }
            });
        }

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult DeleteStoreLocatorById([FromBody] JObject para)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                int StoreId = 0;
                if (para.ContainsKey("StoreId"))
                    StoreId = Convert.ToInt32(para["StoreId"]);

                resVal = new Dynamic.BL.AppCMS.StoreLocator(UserId, hostName, dbName).DeleteById(0, StoreId);

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
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
        //Store Locator Section Ends
    }
}