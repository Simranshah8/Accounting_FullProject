using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class MemSalesSummaryDB
    {
        DataAccessLayer1 dal = null;
        public MemSalesSummaryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.RE.Reporting.Account.MemSalesSummaryCollections getAllMemSalesSummary(int UserId, DateTime? DateFrom, DateTime? DateTo,int? BillingTypeId, bool? IsOpenPoint)
        {
            Dynamic.RE.Reporting.Account.MemSalesSummaryCollections dataColl = new Dynamic.RE.Reporting.Account.MemSalesSummaryCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@BillingTypeId", BillingTypeId);
            cmd.Parameters.AddWithValue("@IsOpenPoint", IsOpenPoint);           
            cmd.CommandText = "usp_GetMembershipSalesSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.MemSalesSummary beData = new Dynamic.RE.Reporting.Account.MemSalesSummary();
                    if (!(reader[0] is DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.CustomerName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.MembershipNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.ContactNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.IsActiveMember = Convert.ToBoolean(reader[4]);
                    if (!(reader[5] is DBNull)) beData.OpeningPoints = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.TotalSales = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.DiscountTotal = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.NetSales = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.NoOfInvoice = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.CreditPoints = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.DebitPoints = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.TotalPoints = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.RegistrationDate = Convert.ToDateTime(reader[13]);
                    if (!(reader[14] is DBNull)) beData.RegistrationMiti = reader.GetString(14);
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

