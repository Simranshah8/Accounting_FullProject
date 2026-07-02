using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA
{
    internal class HRDashboardDB
    {
        DataAccessLayer1 dal = null;
        public HRDashboardDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.RE.HRDashboard GetHRDashboard(int UserId,int? ViewDetailsId)
        {
            Dynamic.RE.HRDashboard beData = new Dynamic.RE.HRDashboard();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@ViewDetailsId", ViewDetailsId);
            cmd.CommandText = "usp_GetHRDashboardAcct";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

                if (!ViewDetailsId.HasValue)
                {
                    if (reader.Read())
                    {
                        if (!(reader[0] is DBNull)) beData.TotalEmployee = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) beData.NewJoins = reader.GetInt32(1);
                        if (!(reader[2] is DBNull)) beData.ExpiringContract = reader.GetInt32(2);
                        if (!(reader[3] is DBNull)) beData.Branches = reader.GetInt32(3);
                        if (!(reader[4] is DBNull)) beData.Departments = reader.GetInt32(4);
                    }

                    //Gender Ratio Summary
                    if (reader.NextResult())
                    {
                        beData.GenderRatioColl = new RE.GenderRatioCollection();
                        while (reader.Read())
                        {
                            RE.GenderRatio dataColl = new RE.GenderRatio();
                            if (!(reader[0] is DBNull)) dataColl.Gender = reader.GetString(0);
                            if (!(reader[1] is DBNull)) dataColl.TotalEmployees = reader.GetInt32(1);
                            beData.GenderRatioColl.Add(dataColl);
                        }
                    }

                    //Marital Status Summary
                    if (reader.NextResult())
                    {
                        beData.MaritalStatusSumColl = new RE.MaritalStatusSumCollection();
                        while (reader.Read())
                        {
                            RE.MaritalStatusSum dataColl = new RE.MaritalStatusSum();
                            if (!(reader[0] is DBNull)) dataColl.MaritalStatusId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.MaritalStatusName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.TotalEmployees = Convert.ToDouble(reader[2]);
                            beData.MaritalStatusSumColl.Add(dataColl);
                        }
                    }

                    //Status Distribution Summary
                    if (reader.NextResult())
                    {
                        beData.StatusDistributionColl = new RE.StatusDistributionCollection();
                        while (reader.Read())
                        {
                            RE.StatusDistribution dataColl = new RE.StatusDistribution();
                            if (!(reader[0] is DBNull)) dataColl.DepartmentId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.Department = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.TotalEmployees = reader.GetInt32(2);

                            beData.StatusDistributionColl.Add(dataColl);
                        }
                    }

                    //Leave Details Summary
                    if (reader.NextResult() && reader.Read())
                    {
                        beData.LeaveDetailsColl = new RE.LeaveDetailsCollection();
                        RE.LeaveDetails dataColl = new RE.LeaveDetails();
                        if (!(reader[0] is DBNull)) dataColl.LeaveRequest = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.NotApproved = Convert.ToInt32(reader[1]);
                        if (!(reader[2] is DBNull)) dataColl.Approved = Convert.ToInt32(reader[2]);
                        if (!(reader[3] is DBNull)) dataColl.Cancelled = Convert.ToInt32(reader[3]);
                        if (!(reader[4] is DBNull)) dataColl.Rejected = Convert.ToInt32(reader[4]);

                        beData.LeaveDetailsColl.Add(dataColl);
                    }

                    //Transfers Summary
                    if (reader.NextResult())
                    {
                        beData.TransfersColl = new RE.TransfersCollection();
                        while (reader.Read())
                        {
                            RE.Transfers dataColl = new RE.Transfers();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.Designation = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.Branch = reader.GetString(3);
                            beData.TransfersColl.Add(dataColl);
                        }
                    }

                    //Retirement Summary
                    if (reader.NextResult())
                    {
                        beData.RetirementColl = new RE.RetirementCollection();
                        while (reader.Read())
                        {
                            RE.Retirement dataColl = new RE.Retirement();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.Designation = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.Branch = reader.GetString(3);
                            beData.RetirementColl.Add(dataColl);
                        }
                    }

                    //Employees on Leave Summary
                    if (reader.NextResult())
                    {
                        beData.EmployeesonLeaveColl = new RE.EmployeesonLeaveCollection();
                        while (reader.Read())
                        {
                            RE.EmployeesonLeave dataColl = new RE.EmployeesonLeave();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.Designation = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.LeaveRequestId = Convert.ToInt32(reader[3]);
                            if (!(reader[4] is DBNull)) dataColl.LeaveType = reader.GetString(4);
                            if (!(reader[5] is DBNull)) dataColl.DurationDisplay = reader.GetString(5);
                            if (!(reader[6] is DBNull)) dataColl.Remarks = reader.GetString(6);
                            if (!(reader[7] is DBNull)) dataColl.EmpLeaveDate = Convert.ToDateTime(reader[7]);
                            beData.EmployeesonLeaveColl.Add(dataColl);
                        }
                    }

                    //Employees Leave
                    if (reader.NextResult() && reader.Read())
                    {
                        beData.EmployeesLeaveColl = new RE.EmployeesLeaveCollection();

                        RE.EmployeesLeave dataColl = new RE.EmployeesLeave();
                        if (!(reader[0] is DBNull)) dataColl.present = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.Leave = reader.GetInt32(1);

                        beData.EmployeesLeaveColl.Add(dataColl);
                    }

                    //Attendance Report Summary
                    if (reader.NextResult())
                    {
                        beData.AttendanceReportColl = new RE.AttendanceReportCollection();
                        while (reader.Read())
                        {
                            RE.AttendanceReport dataColl = new RE.AttendanceReport();
                            if (!(reader[0] is DBNull)) dataColl.TranId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.PhotoPath = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.Department = reader.GetString(3);
                            if (!(reader[4] is DBNull)) dataColl.Designation = reader.GetString(4);
                            if (!(reader[5] is DBNull)) dataColl.AttendanceDate = Convert.ToDateTime(reader[5]);
                            if (!(reader[6] is DBNull)) dataColl.AttendanceMitti = reader.GetString(6);
                            if (!(reader[7] is DBNull)) dataColl.InTime = Convert.ToDateTime(reader[7]);
                            if (!(reader[8] is DBNull)) dataColl.OutTime = Convert.ToDateTime(reader[8]);
                            if (!(reader[9] is DBNull)) dataColl.Status = reader.GetString(9);
                            if (!(reader[10] is DBNull)) dataColl.WorkingHours = reader.GetString(10);
                            if (!(reader[10] is DBNull)) dataColl.AttDate = Convert.ToDateTime(reader[11]);
                            beData.AttendanceReportColl.Add(dataColl);
                        }
                    }

                    //Department Wise Attendance
                    if (reader.NextResult() && reader.Read())
                    {
                        beData.DepartmentWiseAttColl = new RE.DepartmentWiseAttCollection();

                        RE.DepartmentWiseAtt dataColl = new RE.DepartmentWiseAtt();
                        if (!(reader[0] is DBNull)) dataColl.DepartmentId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.Department = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.TotalEmployees = reader.GetInt32(2);

                        beData.DepartmentWiseAttColl.Add(dataColl);
                    }

                    //EmployeesList Summary
                    if (reader.NextResult())
                    {
                        beData.EmployeesListColl = new RE.EmployeesListCollection();
                        while (reader.Read())
                        {
                            RE.EmployeesList dataColl = new RE.EmployeesList();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.EmailId = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.ContactNo = reader.GetString(3);
                            if (!(reader[4] is DBNull)) dataColl.Department = reader.GetString(4);
                            if (!(reader[5] is DBNull)) dataColl.Designation = reader.GetString(5);
                            if (!(reader[6] is DBNull)) dataColl.DateofJoining = Convert.ToDateTime(reader[6]);
                            if (!(reader[7] is DBNull)) dataColl.JoiningMitti = reader.GetString(7);
                            if (!(reader[8] is DBNull)) dataColl.EmployeeType = reader.GetString(8);

                            beData.EmployeesListColl.Add(dataColl);
                        }
                    }
                }

                //Gender Ratio View All list
                if (ViewDetailsId == 1)
                {             
                        beData.GenderRatioColl = new RE.GenderRatioCollection();

                        while (reader.Read())
                        {
                            RE.GenderRatio dataColl = new RE.GenderRatio();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.EmployeeCode = reader.GetString(2);
                            if (!(reader[3] is DBNull)) dataColl.Gender = reader.GetString(3);

                            beData.GenderRatioColl.Add(dataColl);
                        }

                }

                if (ViewDetailsId == 2)
                {
                        beData.MaritalStatusSumColl = new RE.MaritalStatusSumCollection();

                        while (reader.Read())
                        {
                            RE.MaritalStatusSum dataColl = new RE.MaritalStatusSum();
                            if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                            if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                            if (!(reader[2] is DBNull)) dataColl.MaritalStatusId = reader.GetInt32(2);
                            if (!(reader[3] is DBNull)) dataColl.MaritalStatus = reader.GetString(3);
                            if (!(reader[4] is DBNull)) dataColl.EmployeeCode = reader.GetString(4);

                            beData.MaritalStatusSumColl.Add(dataColl);
                        }

                }

                if (ViewDetailsId == 3)
                {
                    beData.StatusDistributionColl = new RE.StatusDistributionCollection();

                    while (reader.Read())
                    {
                        RE.StatusDistribution dataColl = new RE.StatusDistribution();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.DepartmentId = reader.GetInt32(2);
                        if (!(reader[3] is DBNull)) dataColl.Department = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.EmployeeCode = reader.GetString(4);

                        beData.StatusDistributionColl.Add(dataColl);
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

