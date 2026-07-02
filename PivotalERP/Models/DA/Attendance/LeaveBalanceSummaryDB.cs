using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Attendance
{

    internal class LeaveBalanceSummaryDB
    {
        DataAccessLayer1 dal = null;
        public LeaveBalanceSummaryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public BE.Attendance.LeaveBalanceSummaryCollections GetLeaveBalanaceSummary(int UserId, string BranchIdColl = "", string DepartmentIdColl = "", string CategoryIdColl = "", int? ForUserId = null, int? PeriodId = null,int EmployeeOrSalesman=1,int? LeaveTypeId = null )
        {
            BE.Attendance.LeaveBalanceSummaryCollections dataColl = new BE.Attendance.LeaveBalanceSummaryCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
            cmd.Parameters.AddWithValue("@DepartmentIdColl", DepartmentIdColl);
            cmd.Parameters.AddWithValue("@CategoryIdColl", CategoryIdColl);
            cmd.Parameters.AddWithValue("@ForUserId", ForUserId);
            cmd.Parameters.AddWithValue("@PeriodId", PeriodId);
            cmd.Parameters.AddWithValue("@EmployeeOrSalesman", EmployeeOrSalesman);
            cmd.Parameters.AddWithValue("@LeaveTypeId", LeaveTypeId);
            cmd.CommandText = "sp_GetLeaveBalanaceSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.LeaveBalanceSummary beData = new BE.Attendance.LeaveBalanceSummary();
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.LeaveTypeId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.EmployeeCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Name = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Department = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Category = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ContactNo = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.LeaveName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.LeaveCode = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.OpeningQty = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.QuotaQty = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.leaveQty = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.BalanceLeave = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is DBNull)) beData.ForEmpOrSalesman = reader.GetString(14);
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

