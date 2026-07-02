using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{
    internal class AgentNumberingDB
    {
        DataAccessLayer1 dal = null;
        public AgentNumberingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues SaveUpdate(int UserId, BE.AgentNumberingCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                var fst = dataColl.First();
                cmd.Parameters.AddWithValue("@Level", fst.Level);
                cmd.CommandText = "usp_DelAgentNumberingForUpdate";
                cmd.ExecuteNonQuery();

                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@Level", beData.Level);
                    cmd.Parameters.AddWithValue("@NumberingMethod", beData.NumberingMethod);
                    cmd.Parameters.AddWithValue("@Prefix", beData.Prefix);
                    cmd.Parameters.AddWithValue("@Suffix", beData.Suffix);
                    cmd.Parameters.AddWithValue("@NumericalPartWidth", beData.NumericalPartWidth);
                    cmd.Parameters.AddWithValue("@StartNumber", beData.StartNumber);
                    cmd.Parameters.AddWithValue("@UserId", UserId);
                    cmd.CommandText = "usp_AddAgentNumbering";
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Agent Numbering Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }
    }
}
