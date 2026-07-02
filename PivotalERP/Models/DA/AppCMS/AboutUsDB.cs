using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AppCMS.Creation
{
    internal class AboutUsDB
    {
        DataAccessLayer1 dal = null;
        public AboutUsDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(Dynamic.BE.AppCMS.Creation.AboutUs beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@LogoPath", beData.LogoPath);            
            cmd.Parameters.AddWithValue("@ImagePath", beData.ImagePath);            
            cmd.Parameters.AddWithValue("@BannerPath", beData.BannerPath);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@AboutUsId", beData.AboutUsId);
            if (isModify)
            {
                cmd.CommandText = "usp_UpdateAboutUs";
            }
            else
            {
                cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_AddAboutUs";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@Content", beData.Content);

            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[7].Value);

                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[8].Value);

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

        public ResponeValues SaveFeedback(Dynamic.API.AppCMS.FeedbackSuggestion beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", beData.Name);
            cmd.Parameters.AddWithValue("@ContactNo", beData.ContactNo);
            cmd.Parameters.AddWithValue("@Email", beData.Email);
            cmd.Parameters.AddWithValue("@Feedback", beData.Feedback);
            cmd.Parameters.AddWithValue("@Lan", beData.Lan);
            cmd.Parameters.AddWithValue("@Lat", beData.Lat);
            cmd.Parameters.AddWithValue("@NearestLocation", beData.NearestLocation);
            cmd.Parameters.AddWithValue("@IPAddress", beData.IPAddress);            
            cmd.CommandText = "usp_AddFeedBackSuggestion";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@BranchCode", beData.branchCode);

            try
            {
                cmd.ExecuteNonQuery();
               
                if (!(cmd.Parameters[8].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

                if (!(cmd.Parameters[9].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

                if (!(cmd.Parameters[10].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[10].Value);

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

        public ResponeValues UpdateFeedback(Dynamic.API.AppCMS.FeedbackSuggestion beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            cmd.Parameters.AddWithValue("@Response", beData.Response);
            cmd.Parameters.AddWithValue("@UserId", beData.UserId);
            cmd.Parameters.AddWithValue("@EntityId", 0);
            cmd.CommandText = "usp_UpdateFeedbackResponse";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;


            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[6].Value);

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

        public Dynamic.BE.AppCMS.Creation.AboutUsCollections getAllAboutUs(int UserId, int EntityId,string BranchCode)
        {
            Dynamic.BE.AppCMS.Creation.AboutUsCollections dataColl = new Dynamic.BE.AppCMS.Creation.AboutUsCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetAllAboutUs";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AboutUs beData = new Dynamic.BE.AppCMS.Creation.AboutUs();
                    beData.AboutUsId = reader.GetInt32(0);                    
                    if (!(reader[1] is DBNull)) beData.LogoPath = reader.GetString(1);                    
                    if (!(reader[2] is DBNull)) beData.ImagePath = reader.GetString(2);                    
                    if (!(reader[3] is DBNull)) beData.BannerPath = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Content = reader.GetString(4);
                    
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
        public Dynamic.BE.AppCMS.Creation.AboutUs getAboutUsById(int UserId, int EntityId, int AboutUsId)
        {
            Dynamic.BE.AppCMS.Creation.AboutUs beData = new Dynamic.BE.AppCMS.Creation.AboutUs();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@AboutUsId", AboutUsId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_DelAboutUsById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new Dynamic.BE.AppCMS.Creation.AboutUs();
                    beData.AboutUsId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.LogoPath = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.ImagePath = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.BannerPath = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Content = reader.GetString(4);

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

        public Dynamic.API.AppCMS.About getAbout(int UserId,string BranchCode)
        {
            Dynamic.API.AppCMS.About beData = new API.AppCMS.About();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;            
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetCompanyDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new API.AppCMS.About();                    
                    if (!(reader[0] is DBNull)) beData.Name = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Address = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.PhoneNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.FaxNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.EmalId = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.WebSite = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.LogoPath = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ImagePath = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.BannerPath = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Content = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Country = reader.GetString(10);
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
        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_DelAboutUsById";
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

        public Dynamic.API.AppCMS.WhoWeAre getWhoWeAre(int UserId,string BranchCode)
        {
            Dynamic.API.AppCMS.WhoWeAre introduction = new API.AppCMS.WhoWeAre();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@BranchCode", BranchCode);
            cmd.CommandText = "usp_GetWhoWeAre";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AboutUs beData = new BE.AppCMS.Creation.AboutUs();
                    if (!(reader[0] is DBNull)) beData.LogoPath = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.ImagePath = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.BannerPath = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Content = reader.GetString(3);
                    introduction.AboutDet = beData;
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.AdmissionProcedure beData = new BE.AppCMS.Creation.AdmissionProcedure();
                    if (!(reader[0] is DBNull)) beData.Title = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Description = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.ImagePath = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.OrderNo = reader.GetInt32(3);                    
                    introduction.AdmissionProcedureList.Add(beData);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.RulesRegulation beData = new BE.AppCMS.Creation.RulesRegulation();
                    if (!(reader[0] is DBNull)) beData.Title = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Description = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.ImagePath = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.OrderNo = reader.GetInt32(3);                    
                    introduction.RulesRegulationList.Add(beData);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    Dynamic.BE.AppCMS.Creation.Contact beData = new BE.AppCMS.Creation.Contact();
                    if (!(reader[0] is DBNull)) beData.Address = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.ContactNo = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EmailId = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.OpeningHours = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.MapUrl = reader.GetString(4);
                    introduction.ContactDet = beData;
                }
                reader.Close();
                introduction.IsSuccess = true;
                introduction.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                introduction.IsSuccess = false;
                introduction.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return introduction;
        }

        public Dynamic.API.AppCMS.FeedbackSuggestionCollections getFeedbackList(int UserId,DateTime? dateFrom,DateTime? dateTo)
        {
            Dynamic.API.AppCMS.FeedbackSuggestionCollections dataColl = new API.AppCMS.FeedbackSuggestionCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
            cmd.Parameters.AddWithValue("@DateTo", dateTo);
            cmd.CommandText = "usp_GetFeedBackSuggestionList";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.API.AppCMS.FeedbackSuggestion beData = new API.AppCMS.FeedbackSuggestion();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.ContactNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Email = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Feedback = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.IPAddress = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Lat = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.Lan = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.NearestLocation = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Response = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.ResponseDateTime = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ResponseBY = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.PostDateTime = reader.GetDateTime(12);
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

    }
}

