using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Report
{

    internal class BudgetReportingDB
    {
        DataAccessLayer1 dal = null;
        public BudgetReportingDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public BE.Report.BudgetReportingCollections GetBudgetSummary(int UserId,string BranchIdColl, DateTime? DateFrom,DateTime? DateTo,int? CostClassId, int? DateType)
        {
            BE.Report.BudgetReportingCollections dataColl = new BE.Report.BudgetReportingCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@CostClassId", CostClassId);
            cmd.Parameters.AddWithValue("@DateType", DateType);
            cmd.CommandText = "usp_GetBudgetSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Report.BudgetReporting beData = new BE.Report.BudgetReporting();
                    if (!(reader[0] is DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LedgerGroup = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BudgetAmt = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.ExpensesAmt = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.RemainingAmt = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.Month4 = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.Month5 = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.Month6 = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.Month7 = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.Month8 = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.Month9 = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.Month10 = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is DBNull)) beData.Month11 = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) beData.Month12 = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is DBNull)) beData.Month1 = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.Month2 = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.Month3 = Convert.ToDouble(reader[18]);
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

