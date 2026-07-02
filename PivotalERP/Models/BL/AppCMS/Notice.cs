using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AppCMS.Creation
{
    public class Notice
    {
        DA.AppCMS.Creation.NoticeDB db = null;
        int _UserId = 0;

        public Notice(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AppCMS.Creation.NoticeDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.AppCMS.Creation.Notice beData)
        {
            bool isModify = beData.NoticeId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.AppCMS.Creation.NoticeCollections GetAllNotice(int EntityId, string BranchCode)
        {
            return db.getAllNotice(_UserId, EntityId,BranchCode);
        }
        public ResponeValues ReadNotice( int TranId)
        {
            return db.ReadNotice(_UserId, TranId);
        }
        public ResponeValues ReadAllNotice()
        {
            return db.ReadAllNotice(_UserId);
        }
        public ResponeValues CountNotice(string NoticeFor)
        {
            return db.CountNotice(_UserId,NoticeFor);
        }
            public BE.AppCMS.Creation.Notice GetNoticeById(int EntityId, int NoticeId)
        {
            return db.getNoticeById(_UserId, EntityId, NoticeId);
        }
        public ResponeValues DeleteById(int EntityId, int NoticeId)
        {
            return db.DeleteById(_UserId, EntityId, NoticeId);
        }

        public ResponeValues IsValidData(ref BE.AppCMS.Creation.Notice beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.NoticeId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.NoticeId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.HeadLine))
                {
                    resVal.ResponseMSG = "Please ! Enter HeadLine ";
                }
                else
                {
                    if (beData.NoticeDate.Year < 2000)
                    {
                        resVal.ResponseMSG = "Invalid Notice Date";
                        return resVal;
                    }

                    if (!beData.PublishOn.HasValue)
                        beData.PublishOn = DateTime.Now;

                    if (beData.PublishTime.HasValue)
                    {
                        var p = beData.PublishOn.Value;
                        beData.PublishTime = new DateTime(p.Year, p.Month, p.Day, beData.PublishTime.Value.Hour, beData.PublishTime.Value.Minute, beData.PublishTime.Value.Second);
                        beData.PublishOn = beData.PublishTime;
                    }


                    var dt1 = new DateTime(beData.NoticeDate.Year, beData.NoticeDate.Month, beData.NoticeDate.Day);
                    var dt2 = new DateTime(beData.PublishOn.Value.Year, beData.PublishOn.Value.Month, beData.PublishOn.Value.Day);
                    if (dt1 > dt2)
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Please ! Enter Valid Puslish Date.";
                        return resVal;
                    }

                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Valid";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return resVal;
        }
    }
}
