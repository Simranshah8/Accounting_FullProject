using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DataAccess.Security
{

    public class AllowUserWiseCategoryDB
    {
        DataAccessLayer1 dal = null;
        public AllowUserWiseCategoryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public BusinessEntity.Security.AllowUserWiseCategoryCollections getCategoryForAllow(int UserId, int? forUserId, int? forGroupId)
        {
            BusinessEntity.Security.AllowUserWiseCategoryCollections dataColl = new BusinessEntity.Security.AllowUserWiseCategoryCollections();
            this.dal.OpenConnection();
            try
            {
                SqlCommand command = dal.GetCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_GetCategoryListForAllow";
                command.Parameters.AddWithValue("@UserId", UserId);
                command.Parameters.AddWithValue("@ForUserId", forUserId);
                command.Parameters.AddWithValue("@ForGroupId", forGroupId);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    BusinessEntity.Security.AllowUserWiseCategory beData = new BusinessEntity.Security.AllowUserWiseCategory();
                    if (!(reader[0] is DBNull)) beData.CategoryId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.UserId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.ForTransaction = reader.GetBoolean(3);
                    if (!(reader[4] is DBNull)) beData.ForReporting = reader.GetBoolean(4);
                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public ResponeValues SaveUserWiseCategory(int UserId, BusinessEntity.Security.AllowUserWiseCategoryCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserId", UserId);
                command.CommandText = "delete from tbl_UserWiseAllowCategory where UserId=@UserId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseCategory beData in (List<BusinessEntity.Security.AllowUserWiseCategory>)dataColl)
                {
                    if (beData.ForTransaction || beData.ForReporting)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserId", UserId);
                        command.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowCategory(UserId,CategoryId,ForTransaction,ForReporting) values(@UserId,@CategoryId,@ForTransaction,@ForReporting)";
                        command.ExecuteNonQuery();
                    }
                }
                this.dal.CommitTransaction();
                responeValues.IsSuccess = true;
                responeValues.ResponseMSG = "Success";
            }
            catch (Exception ex)
            {
                this.dal.RollbackTransaction();
                responeValues.ResponseMSG = ex.Message;
            }
            finally
            {
                this.dal.CloseConnection();
            }
            return responeValues;
        }


        public ResponeValues SaveUserGroupWiseCategory(int UserGroupId, BusinessEntity.Security.AllowUserWiseCategoryCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                command.CommandText = "delete from tbl_UserWiseAllowCategory where GroupId=@UserGroupId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseCategory beData in (List<BusinessEntity.Security.AllowUserWiseCategory>)dataColl)
                {
                    if (beData.ForReporting || beData.ForTransaction)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                        command.Parameters.AddWithValue("@CategoryId", beData.CategoryId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowCategory(GroupId,CategoryId,ForTransaction,ForReporting) values(@UserGroupId,@CategoryId,@ForTransaction,@ForReporting)";
                        command.ExecuteNonQuery();
                    }
                }
                this.dal.CommitTransaction();
                responeValues.IsSuccess = true;
                responeValues.ResponseMSG = "Success";
            }
            catch (Exception ex)
            {
                this.dal.RollbackTransaction();
                responeValues.ResponseMSG = ex.Message;
            }
            finally
            {
                this.dal.CloseConnection();
            }
            return responeValues;
        }


    }

}

