using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.AppCMS.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: AppCMS/Creation
        string photoLocation = "/Attachments/appcms";

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_Notice)]
        public ActionResult Notice()
        {
            return View();
        }

        #region "Notice"

        [HttpPost, ValidateInput(false)]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AppCMS_Notice)]
        public JsonNetResult SaveNotice()
        {
            ResponeValues resVal = new ResponeValues();
            var usr = User;
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Notice>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.AttachmentColl;

                    if (Request.Files.Count > 0)
                    {
                        beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }

                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);
                                beData.AttachmentColl.Add
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
                            fInd++;
                        }
                    }

                    beData.CUserId = usr.UserId;

                    if (!beData.NoticeId.HasValue)
                        beData.NoticeId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Notice(usr.UserId, usr.HostName, usr.DBName).SaveFormData(beData);

                    try
                    {
                        if (resVal.IsSuccess)
                        {
                            Dynamic.BusinessEntity.Global.NotificationLog notification = new NotificationLog();
                            notification.Content =(string.IsNullOrEmpty(beData.Description) ? beData.Content : beData.Description);
                            notification.EntityId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.AppCMS_Notice);
                            notification.EntityName = Dynamic.BusinessEntity.Global.FormsEntity.AppCMS_Notice.ToString();
                            notification.Heading = beData.HeadLine;
                            notification.Subject = "Notice";
                            notification.UserId = usr.UserId;
                            notification.UserName = usr.UserName;
                            notification.UserIdColl = "";
                            var noticeRes = new Global.GlobalFunction(usr.UserId, usr.HostName, usr.DBName).SendNotification(usr.UserId, notification);
                        }                        
                    }
                    catch (Exception ee)
                    {
                        // resVal.ResponseMSG = ee.Message;
                    }
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
        public JsonNetResult GetAllNoticeList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Notice(User.UserId, User.HostName, User.DBName).GetAllNotice(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetNoticeById(int NoticeId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Notice(User.UserId, User.HostName, User.DBName).GetNoticeById(0, NoticeId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)FormsEntity.AppCMS_Notice)]
        public JsonNetResult DelNotice(int NoticeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Notice(User.UserId, User.HostName, User.DBName).DeleteById(0, NoticeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_Gallery)]
        public ActionResult Gallery()
        {
            return View();
        }
        #region "Gallery"

        [HttpPost, ValidateInput(false)]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AppCMS_Gallery)]
        public JsonNetResult SaveGallery()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Gallery>(Request["jsonData"]);
                if (beData != null)
                {
                    var tmpAttachmentColl = beData.ImageColl;

                    if (Request.Files.Count > 0)
                    {
                        beData.ImageColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                        var filesColl = Request.Files;

                        int fInd = 0;
                        foreach (var v in filesColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);
                                beData.ImageColl.Add
                                    (
                                     new Dynamic.BusinessEntity.GeneralDocument()
                                     {
                                         Data = att.Data,
                                         DocPath = att.DocPath,
                                         DocumentTypeId = null,
                                         Extension = att.Extension,
                                         Name = att.Name,
                                         Description = ""
                                     }
                                    );
                            }
                            fInd++;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.GalleryId.HasValue)
                        beData.GalleryId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Gallery(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllGalleryList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Gallery(User.UserId, User.HostName, User.DBName).GetAllGallery(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetGalleryById(int GalleryId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Gallery(User.UserId, User.HostName, User.DBName).GetGalleryById(0, GalleryId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)FormsEntity.AppCMS_Gallery)]
        public JsonNetResult DelGallery(int GalleryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Gallery(User.UserId, User.HostName, User.DBName).DeleteById(0, GalleryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion
        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_Videos)]
        public ActionResult Videos()
        {
            return View();
        }
        #region "Videos"

        [HttpPost, ValidateInput(false)]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AppCMS_Videos)]
        public JsonNetResult SaveVideos()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Videos>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.AttachFilePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.VideosId.HasValue)
                        beData.VideosId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Videos(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllVideosList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Videos(User.UserId, User.HostName, User.DBName).GetAllVideos(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetVideosById(int VideosId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Videos(User.UserId, User.HostName, User.DBName).GetVideosById(0, VideosId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)FormsEntity.AppCMS_Videos)]
        public JsonNetResult DelVideos(int VideosId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Videos(User.UserId, User.HostName, User.DBName).DeleteById(0, VideosId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion
        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_Slider)]
        public ActionResult Slider()
        {
            return View();
        }
        #region "Slider"

        [HttpPost, ValidateInput(false)]
        [PermissionsAttribute(Actions.Save, (int)FormsEntity.AppCMS_Slider)]
        public JsonNetResult SaveSlider()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Slider>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.SliderId.HasValue)
                        beData.SliderId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Slider(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllSliderList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Slider(User.UserId, User.HostName, User.DBName).GetAllSlider(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSliderById(int SliderId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Slider(User.UserId, User.HostName, User.DBName).GetSliderById(0, SliderId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Delete, (int)FormsEntity.AppCMS_Slider)]
        public JsonNetResult DelSlider(int SliderId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Slider(User.UserId, User.HostName, User.DBName).DeleteById(0, SliderId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        public ActionResult Banner()
        {
            return View();
        }
        #region "Banner"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveBanner()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Banner>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.BannerId.HasValue)
                        beData.BannerId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Banner(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
                    try
                    {
                        Dynamic.BusinessEntity.Global.NotificationLog notification = new NotificationLog();
                        notification.Content = beData.Description;
                        //notification.EntityId = Convert.ToInt32(Dynamic.BE.Global.NOTIFICATION_ENTITY.BANNER);
                        //notification.EntityName = Dynamic.BE.Global.NOTIFICATION_ENTITY.BANNER.ToString();
                        notification.Heading = beData.Title;
                        notification.Subject = "Banner";
                        notification.UserId = User.UserId;
                        notification.UserName = User.UserName;
                        notification.UserIdColl = "";
                        new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).SendNotification(User.UserId, notification);
                    }
                    catch (Exception ee)
                    {
                        // resVal.ResponseMSG = ee.Message;
                    }
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
        public JsonNetResult GetAllBannerList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Banner(User.UserId, User.HostName, User.DBName).GetAllBanner(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetBannerById(int BannerId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Banner(User.UserId, User.HostName, User.DBName).GetBannerById(0, BannerId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelBanner(int BannerId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Banner(User.UserId, User.HostName, User.DBName).DeleteById(0, BannerId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        //[PermissionsAttribute(Actions.View, (int)ENTITIES.ServiceFacilities, false)]
        public ActionResult ServicesAndFacilities()
        {
            return View();
        }
        #region "ServicesAndFacilities"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveServicesAndFacilities()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.ServicesAndFacilities>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.ServicesAndFacilities(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllServicesAndFacilitiesList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ServicesAndFacilities(User.UserId, User.HostName, User.DBName).GetAllServicesAndFacilities(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetServicesAndFacilitiesById(int ServicesAndFacilitiesId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ServicesAndFacilities(User.UserId, User.HostName, User.DBName).GetServicesAndFacilitiesById(0, ServicesAndFacilitiesId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelServicesAndFacilities(int ServicesAndFacilitiesId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.ServicesAndFacilities(User.UserId, User.HostName, User.DBName).DeleteById(0, ServicesAndFacilitiesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion


        public ActionResult AcademicProgram()
        {
            return View();
        }
        #region "AcademicProgram"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveAcademicProgram()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.AcademicProgram>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.AcademicProgram(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAcademicProgramList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AcademicProgram(User.UserId, User.HostName, User.DBName).GetAllAcademicProgram(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAcademicProgramById(int AcademicProgramId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AcademicProgram(User.UserId, User.HostName, User.DBName).GetAcademicProgramById(0, AcademicProgramId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelAcademicProgram(int AcademicProgramId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.AcademicProgram(User.UserId, User.HostName, User.DBName).DeleteById(0, AcademicProgramId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        public ActionResult ExecutiveMember()
        {
            return View();
        }
        #region "ExecutiveMember"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveExecutiveMember()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.ExecutiveMembers>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.ExecutiveMembers(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllExecutiveMemberList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ExecutiveMembers(User.UserId, User.HostName, User.DBName).GetAllExecutiveMembers(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetExecutiveMemberById(int ExecutiveMemberId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ExecutiveMembers(User.UserId, User.HostName, User.DBName).GetExecutiveMembersById(0, ExecutiveMemberId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelExecutiveMember(int ExecutiveMemberId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.ExecutiveMembers(User.UserId, User.HostName, User.DBName).DeleteById(0, ExecutiveMemberId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        public ActionResult AboutUs()
        {
            return View();
        }
        #region "AboutUs"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveAboutUs()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.AboutUs>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var logo = filesColl["logo"];
                        var img = filesColl["image"];
                        var banner = filesColl["banner"];

                        if (logo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, logo, true);
                            beData.LogoPath = photoDoc.DocPath;
                        }

                        if (img != null)
                        {
                            var signatureDoc = GetAttachmentDocuments(photoLocation, img, true);
                            beData.ImagePath = signatureDoc.DocPath;
                        }

                        if (banner != null)
                        {
                            var signatureDoc = GetAttachmentDocuments(photoLocation, banner, true);
                            beData.BannerPath = signatureDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.AboutUsId.HasValue)
                        beData.AboutUsId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAboutUsList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).GetAllAboutUs(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAboutUsById(int AboutUsId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).GetAboutUsById(0, AboutUsId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelAboutUs(int AboutUsId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).DeleteById(0, AboutUsId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_Introduction)]
        public ActionResult Introduction()
        {
            return View();
        }
        #region "VisionStatement"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveVisionStatement()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.VisionStatement>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.VisionStatementId.HasValue)
                        beData.VisionStatementId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.VisionStatement(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllVisionStatementList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.VisionStatement(User.UserId, User.HostName, User.DBName).GetAllVisionStatement(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetVisionStatementById(int VisionStatementId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.VisionStatement(User.UserId, User.HostName, User.DBName).GetVisionStatementById(0, VisionStatementId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelVisionStatement(int VisionStatementId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.VisionStatement(User.UserId, User.HostName, User.DBName).DeleteById(0, VisionStatementId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "Testimonial"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveTestimonial()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Testimonial>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.TestimonialId.HasValue)
                        beData.TestimonialId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Testimonial(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllTestimonialList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Testimonial(User.UserId, User.HostName, User.DBName).GetAllTestimonial(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetTestimonialById(int TestimonialId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Testimonial(User.UserId, User.HostName, User.DBName).GetTestimonialById(0, TestimonialId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelTestimonial(int TestimonialId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Testimonial(User.UserId, User.HostName, User.DBName).DeleteById(0, TestimonialId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "StaffHierarchy"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveStaffHierarchy()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.StaffHierarchy>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.StaffHierarchyId.HasValue)
                        beData.StaffHierarchyId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.StaffHierarchy(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllStaffHierarchyList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.StaffHierarchy(User.UserId, User.HostName, User.DBName).GetAllStaffHierarchy(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetStaffHierarchyById(int StaffHierarchyId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.StaffHierarchy(User.UserId, User.HostName, User.DBName).GetStaffHierarchyById(0, StaffHierarchyId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelStaffHierarchy(int StaffHierarchyId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.StaffHierarchy(User.UserId, User.HostName, User.DBName).DeleteById(0, StaffHierarchyId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        [PermissionsAttribute(Actions.View, (int)FormsEntity.AppCMS_WhoWeAre)]
        public ActionResult WhoWeAre()
        {
            return View();

        }
        #region "AdmissionProcedure"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveAdmissionProcedure()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.AdmissionProcedure>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.AdmissionProcedureId.HasValue)
                        beData.AdmissionProcedureId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.AdmissionProcedure(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAdmissionProcedureList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AdmissionProcedure(User.UserId, User.HostName, User.DBName).GetAllAdmissionProcedure(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAdmissionProcedureById(int AdmissionProcedureId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AdmissionProcedure(User.UserId, User.HostName, User.DBName).GetAdmissionProcedureById(0, AdmissionProcedureId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelAdmissionProcedure(int AdmissionProcedureId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.AdmissionProcedure(User.UserId, User.HostName, User.DBName).DeleteById(0, AdmissionProcedureId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "RulesRegulation"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveRulesRegulation()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.RulesRegulation>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.RulesRegulationId.HasValue)
                        beData.RulesRegulationId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.RulesRegulation(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllRulesRegulationList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.RulesRegulation(User.UserId, User.HostName, User.DBName).GetAllRulesRegulation(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetRulesRegulationById(int RulesRegulationId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.RulesRegulation(User.UserId, User.HostName, User.DBName).GetRulesRegulationById(0, RulesRegulationId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelRulesRegulation(int RulesRegulationId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.RulesRegulation(User.UserId, User.HostName, User.DBName).DeleteById(0, RulesRegulationId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "Contact"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveContact()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Contact>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            //beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.ContactId.HasValue)
                        beData.ContactId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Contact(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetContact()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Contact(User.UserId, User.HostName, User.DBName).GetContactById(0, 0);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelContact(int ContactId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Contact(User.UserId, User.HostName, User.DBName).DeleteById(0, ContactId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        
        public ActionResult EventType()
        {
            return View();
        }
        #region "EventType"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveEventType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.EventType>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.EventTypeId.HasValue)
                        beData.EventTypeId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.EventType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllEventTypeList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.EventType(User.UserId, User.HostName, User.DBName).GetAllEventType(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEventTypeById(int EventTypeId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.EventType(User.UserId, User.HostName, User.DBName).GetEventTypeById(0, EventTypeId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelEventType(int EventTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.EventType(User.UserId, User.HostName, User.DBName).DeleteById(0, EventTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        //[PermissionsAttribute(Actions.View, (int)ENTITIES.AcademicCalendar, false)]
        public ActionResult AcademicCalender()
        {
            return View();
        }

        public ActionResult Weekend()
        {
            return View();
        }

        //[PermissionsAttribute(Actions.View, (int)ENTITIES.EventType, false)]
        public ActionResult EventList()
        {
            return View();
        }
        #region "EventHoliday"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveEventHoliday()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.EventHoliday>(Request["jsonData"]);
                if (beData != null)
                {

                    beData.CUserId = User.UserId;

                    if (!beData.EventHolidayId.HasValue)
                        beData.EventHolidayId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllEventHolidayList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).GetAllEventHoliday(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEventHolidayById(int EventHolidayId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).GetEventHolidayById(0, EventHolidayId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelEventHoliday(int EventHolidayId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).DeleteById(0, EventHolidayId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveWeekend()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.WeekendCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    
                    foreach (var v in beData)
                    {
                        v.CUserId = User.UserId;
                    }

                    resVal = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).SaveWeekend(beData);
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
        public JsonNetResult GetWeekendList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.EventHoliday(User.UserId, User.HostName, User.DBName).getWeekend(null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion
        [HttpPost]
        public JsonNetResult GetFeedbackList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).getFeedbackList(null, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetNepaliCalendar(int? YearId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.AcademicCalendar(User.UserId, User.HostName, User.DBName).getNepaliCalendar(YearId, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
        }

        [HttpPost, ValidateInput(false)]
        public JsonNetResult UpdateFeedback()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.API.AppCMS.FeedbackSuggestion>(Request["jsonData"]);
                if (beData != null)
                {
                    if (beData.TranId == 0)
                    {
                        resVal.ResponseMSG = "Please ! Select Valid Feedback";
                    }
                    else if (string.IsNullOrEmpty(beData.Response))
                    {
                        resVal.ResponseMSG = "Please ! Enter Feedback Response";
                    }
                    else
                        resVal = new Dynamic.BL.AppCMS.Creation.AboutUs(User.UserId, User.HostName, User.DBName).UpdateFeedback(beData);
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



        //[PermissionsAttribute(Actions.View, (int)ENTITIES.Quotes, false)]
        public ActionResult Quotes()
        {
            return View();
        }

        #region "Quotes"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveQuotes()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.Quotes>(Request["jsonData"]);
                if (beData != null)
                {

                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.QuotesId.HasValue)
                        beData.QuotesId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.Quotes(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllQuotesList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Quotes(User.UserId, User.HostName, User.DBName).GetAllQuotes(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetQuotesById(int QuotesId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.Quotes(User.UserId, User.HostName, User.DBName).GetQuotesById(0, QuotesId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelQuotes(int QuotesId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.Quotes(User.UserId, User.HostName, User.DBName).DeleteById(0, QuotesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        public ActionResult ProductDisplay()
        {
            return View();
        }
        #region "ProductDisplay"

        [HttpPost, ValidateInput(false)]
        public JsonNetResult SaveProductDisplay()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BE.AppCMS.Creation.ProductDisplay>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["file0"];
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                            beData.ImagePath = photoDoc.DocPath;
                        }
                    }

                    beData.CUserId = User.UserId;

                    if (!beData.ProductDisplayId.HasValue)
                        beData.ProductDisplayId = 0;

                    resVal = new Dynamic.BL.AppCMS.Creation.ProductDisplay(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllProductDisplayList()
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ProductDisplay(User.UserId, User.HostName, User.DBName).GetAllProductDisplay(0, null);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetProductDisplayById(int ProductDisplayId)
        {
            var dataColl = new Dynamic.BL.AppCMS.Creation.ProductDisplay(User.UserId, User.HostName, User.DBName).GetProductDisplayById(0, ProductDisplayId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelProductDisplay(int ProductDisplayId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.Creation.ProductDisplay(User.UserId, User.HostName, User.DBName).DeleteById(0, ProductDisplayId);
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
        public JsonNetResult GetDaysByYrMonth(int YearId, int MonthId)
        {
            Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections dataColl = new Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.Creation.AcademicCalendar(User.UserId, User.HostName, User.DBName).GetDaysByYrMonth(YearId, MonthId);
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
        public JsonNetResult GetDaysByDate(DateTime DateFrom, DateTime DateTo)
        {
            Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections dataColl = new Dynamic.BE.AppCMS.Creation.AcademicCalendarCollections();
            try
            {
                dataColl = new Dynamic.BL.AppCMS.Creation.AcademicCalendar(User.UserId, User.HostName, User.DBName).GetDaysByDate(DateFrom, DateTo);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        public ActionResult HeroSection()
        {
            return View();
        }
        #region "HeroSection"
        [HttpPost]
        public JsonNetResult SaveHeroSection()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AppCMS.HeroSection>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var HPhoto = filesColl["photo"];
                        if (HPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, HPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                    }
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AppCMS.HeroSection(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllHeroSection()
        {
            var dataColl = new Dynamic.BL.AppCMS.HeroSection(User.UserId, User.HostName, User.DBName).GetAllHeroSection(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetHeroSectionById(int TranId)
        {
            var dataColl = new Dynamic.BL.AppCMS.HeroSection(User.UserId, User.HostName, User.DBName).GetHeroSectionById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelHeroSection(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.HeroSection(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
        public ActionResult Tag()
        {
            return View();
        }
        #region "TagSection"
        [HttpPost]
        public JsonNetResult SaveTagSection()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AppCMS.TagSection>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var TagPhoto = filesColl["photo"];
                        if (TagPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, TagPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                    }
                    beData.CUserId = User.UserId;
                    if (!beData.TagId.HasValue)
                        beData.TagId = 0;

                    resVal = new Dynamic.BL.AppCMS.TagSection(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllTagSection()
        {
            var dataColl = new Dynamic.BL.AppCMS.TagSection(User.UserId, User.HostName, User.DBName).GetAllTagSection(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetTagSectionById(int TagId)
        {
            var dataColl = new Dynamic.BL.AppCMS.TagSection(User.UserId, User.HostName, User.DBName).GetTagSectionById(0, TagId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelTagSection(int TagId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.TagSection(User.UserId, User.HostName, User.DBName).DeleteById(0, TagId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
        public ActionResult StoreLocator()
        {
            return View();
        }
        #region "StoreLocator"
        [HttpPost]
        public JsonNetResult SaveStoreLocator()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AppCMS.StoreLocator>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var SPhoto = filesColl["photo"];
                        if (SPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, SPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                    }
                    beData.CUserId = User.UserId;
                    if (!beData.StoreId.HasValue)
                        beData.StoreId = 0;

                    resVal = new Dynamic.BL.AppCMS.StoreLocator(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllStoreLocator()
        {
            var dataColl = new Dynamic.BL.AppCMS.StoreLocator(User.UserId, User.HostName, User.DBName).GetAllStoreLocator(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetStoreLocatorById(int StoreId)
        {
            var dataColl = new Dynamic.BL.AppCMS.StoreLocator(User.UserId, User.HostName, User.DBName).GetStoreLocatorById(0, StoreId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelStoreLocator(int StoreId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AppCMS.StoreLocator(User.UserId, User.HostName, User.DBName).DeleteById(0, StoreId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

    }
}