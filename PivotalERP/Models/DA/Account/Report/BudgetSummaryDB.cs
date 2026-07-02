using Dynamic.DataAccess.Global;
using System;

namespace Dynamic.DA.Report
{
    internal class BudgetSummaryDB
    {
        DataAccessLayer1 dal = null;
        public BudgetSummaryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public RE.Reporting.Account.BudgetSummaryCollections GetBudgetSummary(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo)
        {
            RE.Reporting.Account.BudgetSummaryCollections dataColl = new RE.Reporting.Account.BudgetSummaryCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_GetBudgetSummaryReport";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.Reporting.Account.BudgetSummary beData = new RE.Reporting.Account.BudgetSummary();
                    if (!(reader[0] is DBNull)) beData.Particular = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Branch = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EQty = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) beData.ERate = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.EAmt = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.TQty = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.TRate = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.TAmt = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.LastYearTranAmt = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.DiffAmtET = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.DiffAmt = Convert.ToDouble(reader[10]);
                  
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