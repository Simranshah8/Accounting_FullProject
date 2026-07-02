using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Dashboard
{
    internal class SalesDashboardDB
    {
        DataAccessLayer1 dal = null;
        public SalesDashboardDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.BE.Dashboard.SalesDashboard GetSalesDashboard(int UserId)
        {
            Dynamic.BE.Dashboard.SalesDashboard beData = new Dynamic.BE.Dashboard.SalesDashboard();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_SalesDashboard";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalSales = Convert.ToDouble(reader[0]);
                    if (!(reader[1] is DBNull)) beData.TotalCustomer = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.TotalTransaction = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.TotalProduct = reader.GetInt32(3);
                }
                if (reader.NextResult())
                {
                    beData.WeeklySalesColl = new BE.Dashboard.WeeklySalesCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.WeeklySales dataColl = new BE.Dashboard.WeeklySales();
                        if (!(reader[0] is DBNull)) dataColl.Day = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.TotalAmount = Convert.ToDouble(reader[1]);
                        if (!(reader[2] is DBNull)) dataColl.TargetAmount = Convert.ToDouble(reader[2]);
                        beData.WeeklySalesColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.TopProductColl = new BE.Dashboard.TopProductCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.TopProduct dataColl = new BE.Dashboard.TopProduct();
                        if (!(reader[0] is DBNull)) dataColl.ProductCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.ProductName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.Brand = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.SalesRate = Convert.ToDouble(reader[3]);
                        beData.TopProductColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.AreaWiseSalesColl = new BE.Dashboard.AreaWiseSalesCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.AreaWiseSales dataColl = new BE.Dashboard.AreaWiseSales();
                        if (!(reader[0] is DBNull)) dataColl.AreaCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.AreaName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.Growth = Convert.ToDouble(reader[2]);
                        beData.AreaWiseSalesColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.MonthlyRevenueColl = new BE.Dashboard.MonthlyRevenueCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.MonthlyRevenue dataColl = new BE.Dashboard.MonthlyRevenue();
                        if (!(reader[0] is DBNull)) dataColl.Category = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.RevenueAmount = Convert.ToDouble(reader[1]);
                        beData.MonthlyRevenueColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.InvoiceStatisticsColl = new BE.Dashboard.InvoiceStatisticsCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.InvoiceStatistics dataColl = new BE.Dashboard.InvoiceStatistics();
                        if (!(reader[0] is DBNull)) dataColl.InvoiceType = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.InvoiceCount = reader.GetInt32(1);
                        beData.InvoiceStatisticsColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.SalesColl = new BE.Dashboard.SalesCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.Sales dataColl = new BE.Dashboard.Sales();
                        if (!(reader[0] is DBNull)) dataColl.MonthName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.PaymentType = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.TotalAmount = Convert.ToDouble(reader[2]);
                        beData.SalesColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.AnnuallySalesColl = new BE.Dashboard.AnnuallySalesCollection();
                    while (reader.Read())
                    {
                        BE.Dashboard.AnnuallySales dataColl = new BE.Dashboard.AnnuallySales();
                        if (!(reader[0] is DBNull)) dataColl.MonthNameAS = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.TotalAnnualSales = Convert.ToDouble(reader[1]);
                        beData.AnnuallySalesColl.Add(dataColl);
                    }
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


    }
}
