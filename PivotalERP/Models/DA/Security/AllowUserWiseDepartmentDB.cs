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

    public class AllowUserWiseDepartmentDB
	{
		DataAccessLayer1 dal = null;
		public AllowUserWiseDepartmentDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

        public BusinessEntity.Security.AllowUserWiseDepartmentCollections getDepartmentForAllow(int UserId, int? forUserId, int? forGroupId)
        {
            BusinessEntity.Security.AllowUserWiseDepartmentCollections dataColl = new BusinessEntity.Security.AllowUserWiseDepartmentCollections();
            this.dal.OpenConnection();
            try
            {
                SqlCommand command = this.dal.GetCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_GetDepartmentListForAllow";
                command.Parameters.AddWithValue("@UserId", UserId);
                command.Parameters.AddWithValue("@ForUserId", forUserId);
                command.Parameters.AddWithValue("@ForGroupId", forGroupId);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    BusinessEntity.Security.AllowUserWiseDepartment beData = new BusinessEntity.Security.AllowUserWiseDepartment();
                    if (!(reader[0] is DBNull)) beData.DepartmentId = reader.GetInt32(0);
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
        public void SaveUserWiseGodown(int UserGroupId, List<int> dataColl)
        {
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserId", (object)UserGroupId);
                command.CommandText = "delete from tbl_UserWiseAllowGodown where UserId=@UserId";
                command.ExecuteNonQuery();
                foreach (int num in dataColl)
                {
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@UserGroupId", (object)UserGroupId);
                    command.Parameters.AddWithValue("@GodownId", (object)num);
                    command.CommandText = "insert into tbl_UserWiseAllowGodown(UserId,GodownId) values(@UserGroupId,@GodownId)";
                    command.ExecuteNonQuery();
                }
                this.dal.CommitTransaction();
            }
            catch (Exception ex)
            {
                this.dal.RollbackTransaction();
                throw ex;
            }
            finally
            {
                this.dal.CloseConnection();
            }
        }
        public ResponeValues SaveUserWiseDepartment(int UserId, BusinessEntity.Security.AllowUserWiseDepartmentCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserId", UserId);
                command.CommandText = "delete from tbl_UserWiseAllowDepartment where UserId=@UserId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseDepartment beData in (List<BusinessEntity.Security.AllowUserWiseDepartment>)dataColl)
                {
                    if (beData.ForTransaction || beData.ForReporting)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserId", UserId);
                        command.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowDepartment(UserId,DepartmentId,ForTransaction,ForReporting) values(@UserId,@DepartmentId,@ForTransaction,@ForReporting)";
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


        public ResponeValues SaveUserGroupWiseDepartment(int UserGroupId,  BusinessEntity.Security.AllowUserWiseDepartmentCollections dataColl)
        {
            ResponeValues responeValues = new ResponeValues();
            this.dal.OpenConnection();
            this.dal.BeginTransaction();
            SqlCommand command = this.dal.GetCommand();
            try
            {
                command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                command.CommandText = "delete from tbl_UserWiseAllowDepartment where GroupId=@UserGroupId";
                command.ExecuteNonQuery();
                foreach (BusinessEntity.Security.AllowUserWiseDepartment beData in (List<BusinessEntity.Security.AllowUserWiseDepartment>)dataColl)
                {
                    if (beData.ForReporting || beData.ForTransaction)
                    {
                        command.Parameters.Clear();
                        command.Parameters.AddWithValue("@UserGroupId", UserGroupId);
                        command.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
                        command.Parameters.AddWithValue("@ForTransaction", beData.ForTransaction);
                        command.Parameters.AddWithValue("@ForReporting", beData.ForReporting);
                        command.CommandText = "insert into tbl_UserWiseAllowDepartment(GroupId,DepartmentId,ForTransaction,ForReporting) values(@UserGroupId,@DepartmentId,@ForTransaction,@ForReporting)";
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

