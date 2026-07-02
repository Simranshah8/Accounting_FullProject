using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class NewStockReportingDB
    {
        DataAccessLayer1 dal = null;
        public NewStockReportingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.RE.Reporting.Account.NewStockReportingCollections getAllNewStockReporting(int UserId, int? ProductGroupId, int? GodownId, DateTime? DateFrom, DateTime? DateTo)
        {
            Dynamic.RE.Reporting.Account.NewStockReportingCollections dataColl = new Dynamic.RE.Reporting.Account.NewStockReportingCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@ProductGroupId", ProductGroupId);
            cmd.Parameters.AddWithValue("@GodownId", GodownId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_U_StockReport";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.NewStockReporting beData = new Dynamic.RE.Reporting.Account.NewStockReporting();
                    if (!(reader[0] is DBNull)) beData.Code = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.PartNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.ProductGroup = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Opening_Qty = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.Opening_Rate = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.Opening_Amount = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.PurchaseImport_Qty = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.PurchaseImport_Amount = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.PurchaseLocal_Qty = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.PurchaseLocal_Amount = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.StockJournalIn_Qty = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.StockJournalIn_Amount = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is DBNull)) beData.StockJournalOut_Qty = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) beData.StockJournalOut_Amount = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is DBNull)) beData.CannibalizedIn_Qty = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.CannibalizedIn_Amount = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.CannibalizedOut_Qty = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is DBNull)) beData.CannibalizedOut_Amount = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is DBNull)) beData.Sales_Qty = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is DBNull)) beData.Sales_Amount = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.SalesReturn_Qty = Convert.ToDouble(reader[22]);
                    if (!(reader[23] is DBNull)) beData.SalesReturn_Amount = Convert.ToDouble(reader[23]);
                    if (!(reader[24] is DBNull)) beData.Closing_Qty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is DBNull)) beData.Closing_Rate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is DBNull)) beData.Closing_Amount = Convert.ToDouble(reader[26]);
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

