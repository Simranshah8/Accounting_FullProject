using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class TopNMembersDB
    {
        DataAccessLayer1 dal = null;
        public TopNMembersDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.RE.Reporting.Account.TopNMembersCollections getAllTopNMembers(int UserId, DateTime? DateFrom, DateTime? DateTo, int RowNo)
        {
            Dynamic.RE.Reporting.Account.TopNMembersCollections dataColl = new Dynamic.RE.Reporting.Account.TopNMembersCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);

            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@RowNo", RowNo);
            cmd.CommandText = "usp_GetTopNMembershipSales";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.TopNMembers beData = new Dynamic.RE.Reporting.Account.TopNMembers();
                    if (!(reader[0] is DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.MemberNo = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.CustomerName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.TotalAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.DCAMNT = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.NetAmnt = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.NoOfBill = reader.GetInt32(6);
                   
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

