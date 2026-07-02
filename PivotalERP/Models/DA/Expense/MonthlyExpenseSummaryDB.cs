using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.Expense
{
    internal class MonthlyExpenseSummaryDB
    {
        DataAccessLayer1 dal = null;
        public MonthlyExpenseSummaryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.Expense.MonthlyExpenseSummary GetMonthlyExpenseSummary(int UserId, DateTime? DateFrom, DateTime? DateTo,int? EmployeeId)
        {
            RE.Expense.MonthlyExpenseSummary beData = new RE.Expense.MonthlyExpenseSummary();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.CommandText = "usp_GetMonthlyExpenseSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new RE.Expense.MonthlyExpenseSummary();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.EmployeeName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EncloserDays = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.WorkingDays = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.RestDays = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.LeaveDays = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.Designation = reader.GetString(6);
                }
                reader.NextResult();
                beData.ExpenseClaimDetailsColl = new List<RE.Expense.ExpenseClaimDetails>();
                while (reader.Read())
                {
                    RE.Expense.ExpenseClaimDetails det1 = new RE.Expense.ExpenseClaimDetails();
                    if (!(reader[0] is DBNull)) det1.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.ExpenseTitle = reader.GetString(1);
                    if (!(reader[2] is DBNull)) det1.ExpenseTypeId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det1.DestinationFrom = reader.GetString(3);
                    if (!(reader[4] is DBNull)) det1.DestinationTo = reader.GetString(4);
                    if (!(reader[5] is DBNull)) det1.DistanceTravelled = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) det1.ExpenseDate = Convert.ToDateTime(reader[6]);
                    if (!(reader[7] is DBNull)) det1.ExpenseMitti = reader.GetString(7);
                    if (!(reader[8] is DBNull)) det1.DayName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) det1.ExpenseCategoryId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) det1.ExpenseCategory = reader.GetString(10);
                    if (!(reader[11] is DBNull)) det1.Amount = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) det1.Description = reader.GetString(12);
                    if (!(reader[13] is DBNull)) det1.TravelMode = reader.GetString(13);
                    if (!(reader[14] is DBNull)) det1.TravelFuelAmt = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) det1.LocalAllowanceAmt = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is DBNull)) det1.CountryAlowanceAmt = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) det1.GrandTotal = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) det1.Distance = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is DBNull)) det1.CheckIn = reader.GetString(19);
                    if (!(reader[20] is DBNull)) det1.CheckOut = reader.GetString(20);
                    if (!(reader[21] is DBNull)) det1.TotalWoking = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) det1.DepartureTime = reader.GetString(22);
                    if (!(reader[23] is DBNull)) det1.ArrivalTime = reader.GetString(23);
                    if (!(reader["ExpAttachment"] is DBNull)) det1.ExpAttachment = Convert.ToString(reader["ExpAttachment"]);
                    if (!(reader["ReciptImage"] is DBNull)) det1.ReciptImage = Convert.ToString(reader["ReciptImage"]);
                    beData.ExpenseClaimDetailsColl.Add(det1);

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