using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class MemSalesDetailDB
    {
        DataAccessLayer1 dal = null;
        public MemSalesDetailDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.RE.Reporting.Account.MemSalesDetailCollections getAllMemSalesDetail(int UserId, DateTime? DateFrom, DateTime? DateTo, int? BillingTypeId)
        {
            Dynamic.RE.Reporting.Account.MemSalesDetailCollections dataColl = new Dynamic.RE.Reporting.Account.MemSalesDetailCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);

            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@BillingTypeId", BillingTypeId);
            cmd.CommandText = "usp_GetMembershipSalesDetail";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.MemSalesDetail beData = new Dynamic.RE.Reporting.Account.MemSalesDetail();
                    if (!(reader[0] is DBNull)) beData.MembershipNo = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.CustomerName = reader.GetString(1);                   
                    if (!(reader[2] is DBNull)) beData.ContactNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.VchDate = Convert.ToDateTime(reader[3]);
                    if (!(reader[4] is DBNull)) beData.InvoiceNo = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.BillingType = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ProductGroup = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ProductCode = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.ProductName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Qty = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.Rate = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.Amount = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.ProductDiscount = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.ProductScheme = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.Discount = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) beData.VAT = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is DBNull)) beData.ProductTotal = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.PointValue = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.InvoiceTotal = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is DBNull)) beData.TotalCreditedPoint = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is DBNull)) beData.LedgerId = reader.GetInt32(20);
                    if (!(reader[21] is DBNull)) beData.VchMiti = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.ProductId = reader.GetInt32(22);
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

