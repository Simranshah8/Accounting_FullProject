using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using PivotalERP.Models;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System.Web.Http.Description;
using System.Web.UI.WebControls;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PivotalERP.Controllers
{
    public class EcommerceController : APIBaseController
    {
        // POST v1/GetProductGroup
        /// <summary>
        /// Get Product Groupr
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [ResponseType(typeof(ResponeValue))]
        public async Task<IHttpActionResult> GetProductGroup()
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.ProductGroup(hostName, dbName).getProductGroupEC(UserId);

            var retVal = new
            {
                DataColl = dataColl,
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = false,
                    ExcludeProperties = new List<string>
                                 {
                                    "ExpireDateTime","RId","CUserId","CUserId","ResponseId","EntityId","ErrorNumber","CUserName","DropDownList","FieldAfter","Formula","Source","ColWidth","JsonStr","SelectOptions"
                                 }
                }
            });
        }

        // POST v1/GetProductCategory
        /// <summary>
        /// Get Product Category
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [ResponseType(typeof(ResponeValue))]
        public async Task<IHttpActionResult> GetProductCategory()
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.ProductCategories(hostName, dbName).getProductCategoriesForEC(UserId);

            var retVal = new
            {
                DataColl = dataColl,
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = false,
                    ExcludeProperties = new List<string>
                                 {
                                    "ExpireDateTime","RId","CUserId","CUserId","ResponseId","EntityId","ErrorNumber","CUserName","DropDownList","FieldAfter","Formula","Source","ColWidth","JsonStr","SelectOptions"
                                 }
                }
            });
        }

        // POST v1/GetProductBrand
        /// <summary>
        /// Get Product Brand
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [ResponseType(typeof(ResponeValue))]
        public async Task<IHttpActionResult> GetProductBrand()
        {
            var dataColl = new Dynamic.BusinessLogic.Inventory.ProductBrand(hostName, dbName).getProductBrandForEC(UserId);

            var retVal = new
            {
                DataColl = dataColl,
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = false,
                    ExcludeProperties = new List<string>
                                 {
                                    "ExpireDateTime","RId","CUserId","CUserId","ResponseId","EntityId","ErrorNumber","CUserName","DropDownList","FieldAfter","Formula","Source","ColWidth","JsonStr","SelectOptions"
                                 }
                }
            });
        }


        // POST v1/GetProducts
        /// <summary>
        /// Get Product 
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [ResponseType(typeof(ResponeValue))]
        public async Task<IHttpActionResult> GetProducts([FromBody] TableFilter filter)
        {
            filter.UserId = UserId;
            var dataColl = new Dynamic.DataAccess.Common.ProductDB(hostName, dbName).getProductSearchList(filter);
            filter.TotalRows = dataColl.TotalRows;
            //return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            var retVal = new
            {
                Filter = filter,
                DataColl = dataColl,
                ResponseMSG = dataColl.ResponseMSG,
                IsSuccess = dataColl.IsSuccess
            };

            return Json(retVal, new JsonSerializerSettings
            {
            });
        }





        // POST v1/ProductReview
        /// <summary>
        /// Add Product Review   
        /// </summary>        
        /// <returns></returns>
        //[HttpPost]
        //[ResponseType(typeof(ResponeValue))]
        //public async Task<IHttpActionResult> ProductReview([FromBody] JObject para)
        //{
        //    int ProductId;
        //    int Rating;
        //    string Remarks = "";
        //    ProductId = ConvertValue<int>(para, "ProductId");
        //    Rating = ConvertValue<int>(para, "Rating");
        //    Remarks = ConvertValue<string>(para, "Remarks");

        //    var retVal = new Dynamic.BusinessLogic.Inventory.Product(hostName, dbName).ProductRatingView(UserId, ProductId, Rating, Remarks);
        //    return Json(retVal, new JsonSerializerSettings
        //    {
        //    });
        //}

        // POST v1/ProductReview
        /// <summary>
        /// Add Product Review   
        /// </summary>        
        /// <returns></returns>
        //[HttpPost]
        //[ResponseType(typeof(ResponeValue))]
        //public async Task<IHttpActionResult> ProductQA([FromBody] JObject para)
        //{
        //    int? ProductId;
        //    string Question = "", QueName = "";
        //    ProductId = ConvertValue<int>(para, "ProductId", 0);

        //    if (ProductId == 0)
        //        ProductId = null;

        //    Question = ConvertValue<string>(para, "Question");

        //    QueName = ConvertValue<string>(para, "QueName");

        //    var retVal = new Dynamic.BusinessLogic.Inventory.Product(hostName, dbName).ProductQA(UserId, ProductId, Question, QueName);
        //    return Json(retVal, new JsonSerializerSettings
        //    {
        //    });
        //}

        //[HttpPost]
        //[System.Web.Mvc.AllowAnonymous]
        //[ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        //public IHttpActionResult GetProductReview([FromBody] JObject para)
        //{
        //    Dynamic.BusinessEntity.Inventory.ProductReviewCollections DataColl = new Dynamic.BusinessEntity.Inventory.ProductReviewCollections();
        //    try
        //    {
        //        int? ProductId;
        //        ProductId = ConvertValue<int>(para, "ProductId", 0);
        //        DataColl = new Dynamic.BusinessLogic.Inventory.Product(hostName, dbName).GetProductReview(UserId, ProductId);
        //    }
        //    catch (Exception ee)
        //    {
        //        DataColl.IsSuccess = false;
        //        DataColl.ResponseMSG = ee.Message;
        //    }
        //    var retVal = new
        //    {
        //        ResponseMSG = DataColl.ResponseMSG,
        //        IsSuccess = DataColl.IsSuccess,
        //        DataColl = DataColl
        //    };
        //    return Json(retVal, new JsonSerializerSettings
        //    {
        //        ContractResolver = new JsonContractResolver()
        //        {
        //            IsInclude = true,
        //            IncludeProperties = new List<string>
        //            {
        //                "DataColl","IsSuccess","ResponseMSG","ProductId","Rating","ProductName","Remarks","RatedBy","ReviewDate"
        //            }
        //        }
        //    });
        //}

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetProductReviewQA()
        {
            Dynamic.BusinessEntity.Inventory.ProductReviewQACollections DataColl = new Dynamic.BusinessEntity.Inventory.ProductReviewQACollections();
            try
            {
                DataColl = new Dynamic.BusinessLogic.Inventory.Product(hostName, dbName).GetProductReviewQA(UserId);
            }
            catch (Exception ee)
            {
                DataColl.IsSuccess = false;
                DataColl.ResponseMSG = ee.Message;
            }
            var retVal = new
            {
                ResponseMSG = DataColl.ResponseMSG,
                IsSuccess = DataColl.IsSuccess,
                DataColl = DataColl
            };
            return Json(retVal, new JsonSerializerSettings
            {
                ContractResolver = new JsonContractResolver()
                {
                    IsInclude = true,
                    IncludeProperties = new List<string>
                    {
                        "DataColl","IsSuccess","ResponseMSG","ProductId","ProductName","Question","QuestionBy","QuestionDate","Answer","AnswerBy","AnswerDate"
                    }
                }
            });
        }



        #region Hero Section
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

        #endregion

        #region Tag Section Strats
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
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllTagSection()
        {
            Dynamic.BE.AppCMS.TagSectionCollections dataColl = new Dynamic.BE.AppCMS.TagSectionCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.TagSection(UserId, hostName, dbName).GetAllTagSection(0);
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
        #endregion

        #region Store Locator Section Strats
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
        #endregion


        #region"Herbs"

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllHerbs()
        {
            Dynamic.BE.AppCMS.HerbsCollections dataColl = new Dynamic.BE.AppCMS.HerbsCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.Herbs(UserId, hostName, dbName).GetAllHerbs(0);
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
                        "DataColl","IsSuccess","ResponseMSG","id","text","HerbsId","Name","ScientificName","Badge","HsubTitle","SEOTitle","SEODescription",
                        "Description","AboutPara","Banner","Photo","Tag"
                    }
                }
            });
        }

        //[HttpPost]
        //[System.Web.Mvc.AllowAnonymous]
        //[ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        //public IHttpActionResult GetHerbsById([FromBody] JObject para)
        //{
        //    Dynamic.BE.AppCMS.HerbsDetails beData = new Dynamic.BE.AppCMS.HerbsDetails();
        //    try
        //    {
        //        int HerbsId;
        //        HerbsId = ConvertValue<int>(para, "HerbsId", 0);

        //        beData = new Dynamic.BL.AppCMS.Herbs(UserId, hostName, dbName).GetHerbsById(0, HerbsId);

        //    }
        //    catch (Exception ee)
        //    {
        //        beData.IsSuccess = false;
        //        beData.ResponseMSG = ee.Message;
        //    }
        //    var retVal = new
        //    {
        //        ResponseMSG = beData.ResponseMSG,
        //        IsSuccess = beData.IsSuccess,
        //        DataColl = beData
        //    };
        //    return Json(retVal, new JsonSerializerSettings
        //    {
        //        //ContractResolver = new JsonContractResolver()
        //        //{
        //        //    IsInclude = true,
        //        //    IncludeProperties = new List<string>
        //        //    {
        //        //        "DataColl","IsSuccess","ResponseMSG","HerbsId","Name","ScientificName","Badge","HsubTitle","SEOTitle","SEODescription","Description","AboutPara","Banner","Photo","Tag"
        //        //    }
        //        //}
        //    });
        //}

        #endregion

        #region "WelnessGoals"

        [HttpPost]
        [System.Web.Mvc.AllowAnonymous]
        [ResponseType(typeof(List<Dynamic.APIEnitity.Common>))]
        public IHttpActionResult GetAllWelnessGoals()
        {
            Dynamic.BE.AppCMS.WelnessGoalsCollections dataColl = new Dynamic.BE.AppCMS.WelnessGoalsCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.WelnessGoals(UserId, hostName, dbName).GetAllWelnessGoals(0);
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
                        "DataColl","IsSuccess","ResponseMSG","id","text","WelnessId","Name","Banner","Image","Description","Badge","HerbId"
                    }
                }
            });
        }

        #endregion

    }
}