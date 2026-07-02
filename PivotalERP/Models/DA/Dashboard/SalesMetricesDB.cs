using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Dashboard
{
    internal class SalesMetricesDB
    {
        DataAccessLayer1 dal = null;
        public SalesMetricesDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public BE.Dashboard.ParametersforDashBoardCollection GetSelectionParametersforDashBoard(int UserId)
        {
            BE.Dashboard.ParametersforDashBoardCollection dataColl = new BE.Dashboard.ParametersforDashBoardCollection();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.CommandText = "usp_U_GetSelectionParametersforDashBoard";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Dashboard.ParametersforDashBoard beData = new BE.Dashboard.ParametersforDashBoard();
                    if (!(reader[0] is DBNull)) beData.ParameterType = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.ID = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
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

        public BE.Dashboard.SalesMetrices GetSalesMetricesDashBoard(int UserId, string FiscalYear, string Quarter, string Month, string ProductGroup, string ProductType, string Area, string Distributor, string LedgerGroup)
        {
            BE.Dashboard.SalesMetrices beData = new BE.Dashboard.SalesMetrices();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@FiscalYear", FiscalYear);
            cmd.Parameters.AddWithValue("@Quarter", Quarter);
            cmd.Parameters.AddWithValue("@Month", Month);
            cmd.Parameters.AddWithValue("@ProductGroup", ProductGroup);
            cmd.Parameters.AddWithValue("@ProductType", ProductType);
            cmd.Parameters.AddWithValue("@Area", Area);
            cmd.Parameters.AddWithValue("@Distributor", Distributor);
            cmd.Parameters.AddWithValue("@LedgerGroup", LedgerGroup);
            cmd.CommandText = "usp_U_GetSalesReportDashBoard";
            try
            {

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.ThisYearTotalAmount = Convert.ToDouble(reader[0]);
                    if (!(reader[1] is DBNull)) beData.PreviousYearTotalAmount = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is DBNull)) beData.OverallYoYGrowthPercentage = Convert.ToDouble(reader[2]);
                }

                if (reader.NextResult())
                {
                    beData.DistributorColl = new BE.Dashboard.DistributorCollections();

                    while (reader.Read())
                    {
                        BE.Dashboard.Distributor dataColl = new BE.Dashboard.Distributor();
                        if (!(reader[0] is DBNull)) dataColl.DistributorName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.TotalSalesAmount = Convert.ToDouble(reader[1]);
                        if (!(reader[2] is DBNull)) dataColl.GrowthPercentage = Convert.ToDouble(reader[2]);
                        beData.DistributorColl.Add(dataColl);
                    }
                }

               
                if (reader.NextResult())
                {
                    beData.ProductContributionColl = new BE.Dashboard.ProductContributionCollections();

                    while (reader.Read())
                    {
                        BE.Dashboard.ProductContribution dataColl = new BE.Dashboard.ProductContribution();
                        if (!(reader[0] is DBNull)) dataColl.ProductName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.Quantity = Convert.ToDouble(reader[1]);
                        beData.ProductContributionColl.Add(dataColl);
                    }
                }
                if (reader.NextResult())
                {
                    beData.MonthlySalesColl = new BE.Dashboard.MonthlySalesCollections();

                    // Convert FiscalYears string to a list of individual years
                    List<string> fiscalYearList = string.IsNullOrEmpty(FiscalYear)
    ? new List<string>()
    : FiscalYear.Split(',')
                .Select(fy => fy.Trim())
                .Where(fy => !string.IsNullOrEmpty(fy)) // Optional: Remove empty or whitespace years
                .ToList();
                    int fiscalYearCount = fiscalYearList.Count;

                    while (reader.Read())
                    {
                        BE.Dashboard.MonthlySales dataColl = new BE.Dashboard.MonthlySales();

                        // Extract Month Name
                        if (!(reader[0] is DBNull))
                            dataColl.MonthName_Sales = reader.GetString(0);

                        // Initialize the FiscalYear array with the correct length
                        dataColl.FiscalYear = new double[fiscalYearCount];

                        // Loop through each fiscal year and fetch corresponding column data
                        for (int i = 0; i < fiscalYearCount; i++)
                        {
                            int colIndex = i + 1; // Adjust for column index (since MonthName is at index 0)

                            // Ensure column index is within range before accessing it
                            if (colIndex < reader.FieldCount)
                            {
                                dataColl.FiscalYear[i] = reader[colIndex] is DBNull ? 0 : Convert.ToDouble(reader[colIndex]);
                            }
                            else
                            {
                                dataColl.FiscalYear[i] = 0; // Default to 0 if column index is invalid
                            }
                        }

                        // Add processed data to MonthlySalesColl
                        beData.MonthlySalesColl.Add(dataColl);
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
