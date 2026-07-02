using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;


namespace Dynamic.DA.AppCMS.Creation
{
    internal class NoticeDB
    {
        DataAccessLayer1 dal = null;
        public NoticeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(Dynamic.BE.AppCMS.Creation.Notice beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@HeadLine", beData.HeadLine);
            cmd.Parameters.AddWithValue("@Description", beData.Description);
            cmd.Parameters.AddWithValue("@NoticeDate", beData.NoticeDate);
            cmd.Parameters.AddWithValue("@Publishon", beData.PublishOn);
            cmd.Parameters.AddWithValue("@PublishTime", beData.PublishTime);
            cmd.Parameters.AddWithValue("@OrderNo", beData.OrderNo);            
            cmd.Parameters.AddWithValue("@ImagePath", beData.ImagePath);
            cmd.Parameters.AddWithValue("@Content", beData.Content);            
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@NoticeId", beData.NoticeId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdateNotice";
            }
            else
            {
                cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddNotice";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@ValidUpto", beData.ValidUpto);
            cmd.Parameters.AddWithValue("@CompanyIds", beData.CompanyIds);
            cmd.Parameters.AddWithValue("@BranchIds", beData.BranchIds);
            cmd.Parameters.AddWithValue("@DepartmentIds", beData.DepartmentIds);

            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[10].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[10].Value);

                if (!(cmd.Parameters[11].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[11].Value);

                if (!(cmd.Parameters[12].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[12].Value);

                if (!(cmd.Parameters[13].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[13].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";
              
                if (resVal.RId > 0 && resVal.IsSuccess)
                {
                    SaveNoticeDocument(beData.CUserId, resVal.RId, beData.AttachmentColl);

                }

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        private void SaveNoticeDocument(int UserId, int NoticeId, Dynamic.BusinessEntity.GeneralDocumentCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || NoticeId == 0)
                return;

            foreach (Dynamic.BusinessEntity.GeneralDocument beData in beDataColl)
            {
                if (!string.IsNullOrEmpty(beData.Name) && !string.IsNullOrEmpty(beData.Extension) && (beData.Data != null || !string.IsNullOrEmpty(beData.DocPath)))
                {
                    if (string.IsNullOrEmpty(beData.DocPath))
                        beData.DocPath = "";

                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.Parameters.AddWithValue("@NoticeId", NoticeId);
                    cmd.Parameters.AddWithValue("@DocumentTypeId", beData.DocumentTypeId);

                    if (beData.Data != null)
                        cmd.Parameters.AddWithValue("@Document", beData.Data);
                    else
                        cmd.Parameters.AddWithValue("@Document", System.Data.SqlTypes.SqlBinary.Null);

                    cmd.Parameters.AddWithValue("@Extension", beData.Extension);
                    cmd.Parameters.AddWithValue("@Name", beData.Name);
                    cmd.Parameters.AddWithValue("@DocPath", beData.DocPath);
                    cmd.Parameters.AddWithValue("@Description", beData.Description);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "usp_AddNoticeAttachDocument";
                    cmd.ExecuteNonQuery();
                }
            }

        }

        public Dynamic.BE.AppCMS.Creation.NoticeCollections getAllNotice(int UserId, int EntityId, string BranchCode)
        {
            Dynamic.BE.AppCMS.Creation.NoticeCollections dataColl = new Dynamic.BE.AppCMS.Creation.NoticeCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetAllNotice";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.Notice beData = new Dynamic.BE.AppCMS.Creation.Notice();
                    beData.NoticeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.HeadLine = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Description = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.NoticeDate = reader.GetDateTime(3);
                    if (!(reader[4] is DBNull)) beData.PublishOn = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.PublishTime = reader.GetDateTime(5);
                    if (!(reader[6] is DBNull)) beData.OrderNo = reader.GetInt32(6);                    
                    if (!(reader[7] is DBNull)) beData.ImagePath = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Content = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.NoticeDate_BS = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.PublishOn_BS = reader.GetString(10);

                    if (!(reader[11] is DBNull)) beData.ValidUpto = reader.GetDateTime(11);
                    if (!(reader[12] is DBNull)) beData.ValidUpto_BS = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.CompanyIds = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.BranchIds = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.DepartmentIds = reader.GetString(15);

                    if (!beData.PublishOn.HasValue)
                        beData.PublishOn = DateTime.Now.AddHours(-1);

                    if (!beData.PublishTime.HasValue)
                        beData.PublishTime = DateTime.Now.AddHours(-1);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }
        public Dynamic.BE.AppCMS.Creation.Notice getNoticeById(int UserId, int EntityId, int NoticeId)
        {
            Dynamic.BE.AppCMS.Creation.Notice beData = new Dynamic.BE.AppCMS.Creation.Notice();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@NoticeId", NoticeId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetNoticeById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.AppCMS.Creation.Notice();
                    beData.NoticeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.HeadLine = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Description = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.NoticeDate = reader.GetDateTime(3);
                    if (!(reader[4] is DBNull)) beData.PublishOn = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.PublishTime = reader.GetDateTime(5);
                    if (!(reader[6] is DBNull)) beData.OrderNo = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.ImagePath = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Content = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.ValidUpto = reader.GetDateTime(9); 
                    if (!(reader[10] is DBNull)) beData.CompanyIds = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.BranchIds = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.DepartmentIds = reader.GetString(12);
                }
                reader.NextResult();
                beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.GeneralDocument doc = new Dynamic.BusinessEntity.GeneralDocument();
                    if (!(reader[0] is DBNull)) doc.DocumentTypeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) doc.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) doc.Extension = reader.GetString(2);
                    if (!(reader[3] is DBNull)) doc.DocPath = reader.GetString(3);
                    if (!(reader[4] is DBNull)) doc.Description = reader.GetString(4);

                    beData.AttachmentColl.Add(doc);                    
                }

                reader.Close();
                beData.IsSuccess = true;
                beData.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beData;
        }
        public ResponeValues DeleteById(int UserId, int EntityId, int NoticeId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@NoticeId", NoticeId);
            cmd.CommandText = "usp_DelNoticeById";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

        public ResponeValues ReadNotice(int UserId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                dal.OpenConnection();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandText = "usp_UpdateNoticeAsRead";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[2].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[2].Value);

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[3].Value);
            }
            catch (Exception eee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = eee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues ReadAllNotice(int UserId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                dal.OpenConnection();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandText = "usp_UpdateAllNoticeAsRead";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[1].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[1].Value);

                if (!(cmd.Parameters[2].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[2].Value);
            }
            catch (Exception eee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = eee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues CountNotice(int UserId, string noticeFor)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                dal.OpenConnection();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandText = "usp_GetNoticeCount";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@noticeFor", noticeFor);
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int readCount = 0, unReadCount = 0;
                if (reader.Read())
                {
                    if (!(reader[0] is DBNull))
                        readCount = Convert.ToInt32(reader[0]);

                    if (!(reader[1] is DBNull))
                        unReadCount = Convert.ToInt32(reader[1]);
                }
                reader.Close();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                resVal.ResponseId = readCount.ToString() + "," + unReadCount.ToString();
            }
            catch (Exception eee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = eee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

    }
}
