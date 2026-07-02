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

    public class AllowUserWiseServiceTypeDB
    {
        DataAccessLayer1 dal = null;
        public AllowUserWiseServiceTypeDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public BusinessEntity.Security.AllowUserWiseServiceTypeCollections getServiceTypeForAllow(int UserId, int? forUserId, int? forGroupId)
        {
            BusinessEntity.Security.AllowUserWiseServiceTypeCollections dataColl = new BusinessEntity.Security.AllowUserWiseServiceTypeCollections();
            this.dal.OpenConnection();
            try
            {
                SqlCommand command = dal.GetCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_GetServiceTypeListForAllow";
                command.Parameters.AddWithValue("@UserId", UserId);
                command.Parameters.AddWithValue("@ForUserId", forUserId);
                command.Parameters.AddWithValue("@ForGroupId", forGroupId);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    BusinessEntity.Security.AllowUserWiseServiceType beData = new BusinessEntity.Security.AllowUserWiseServiceType();
                    if (!(reader[0] is DBNull)) beData.ServiceTypeId = reader.GetInt32(0);
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
        public ResponeValues SaveUserWiseServiceType(int UserId, BusinessEntity.Security.AllowUserWiseServiceTypeCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserId", UserId);
                command.CommandText = "delete from tbl_UserWiseAllowServiceType where UserId=@UserId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseServiceType beData in (List<BusinessEntity.Security.AllowUserWiseServiceType>)dataColl)
                {
                    if (beData.ForTransaction || beData.ForReporting)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserId", UserId);
                        command.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowServiceType(UserId,ServiceTypeId,ForTransaction,ForReporting) values(@UserId,@ServiceTypeId,@ForTransaction,@ForReporting)";
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


        public ResponeValues SaveUserGroupWiseServiceType(int UserGroupId, BusinessEntity.Security.AllowUserWiseServiceTypeCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                command.CommandText = "delete from tbl_UserWiseAllowServiceType where GroupId=@UserGroupId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseServiceType beData in (List<BusinessEntity.Security.AllowUserWiseServiceType>)dataColl)
                {
                    if (beData.ForReporting || beData.ForTransaction)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                        command.Parameters.AddWithValue("@ServiceTypeId", beData.ServiceTypeId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowServiceType(GroupId,ServiceTypeId,ForTransaction,ForReporting) values(@UserGroupId,@ServiceTypeId,@ForTransaction,@ForReporting)";
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

