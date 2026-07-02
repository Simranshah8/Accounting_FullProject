    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Dashboard
{
     internal class HRMDashBoardDB
     {
            DataAccessLayer1 dal = null;
            public HRMDashBoardDB(string hostName, string dbName)
            {
                dal = new DataAccessLayer1(hostName, dbName);
            }
            public Dynamic.RE.Dashboard.HRMDashboard GetHRMDashBoard(int UserId,int ForDate)
            {
                Dynamic.RE.Dashboard.HRMDashboard beData = new Dynamic.RE.Dashboard.HRMDashboard();

                dal.OpenConnection();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ForDate", ForDate);
                cmd.CommandText = "usp_GetHRMDashBoard";
                try
                {
                    System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

                //Gender Ratio Summary
                if (reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalEmployees = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Male = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Female = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.MaleRatio = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.FemaleRatio = Convert.ToDouble(reader[4]);
                }
                //Attendance Summary
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.Present = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Absent = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.PresentPercentage = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) beData.AbsentPercentage = Convert.ToDouble(reader[3]);
                }
                // New Employees
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalNewEmp = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.MonthNames = reader.GetString(1);
                }
                //Attendance Appeal
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.ApprovedAtt = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PendingAtt = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.RejectedAtt = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.TotalAppealedAtt = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.AttApprovalRate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.ApprovedAttPer = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.PendingAttper = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.RejectedAttPer = Convert.ToDouble(reader[7]);
                }
                //Leave Status
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.LeaveApproved = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.LeavePending = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.LeaveRejected = reader.GetInt32(2);
                }
                //Holidays
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalHolodays = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.RemainingHolidays = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.HolidayTaken = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.AvailableHolidays = reader.GetInt32(3);
                }

                //TOTAL ADVANCE / RECEIVE
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalAdvanceAmt = Convert.ToDouble(reader[0]);
                    if (!(reader[1] is DBNull)) beData.TotalReceivedAmt = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is DBNull)) beData.TotalAmount = Convert.ToDouble(reader[2]);
                }
                //Salary Distribution
                if (reader.NextResult())
                {
                    beData.SalaryDistributionColl = new RE.Dashboard.SalaryDistributionCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.SalaryDistribution dataColl = new RE.Dashboard.SalaryDistribution();
                        if (!(reader[0] is DBNull)) dataColl.SalaryDistrPer = Convert.ToDouble(reader[0]);
                        if (!(reader[1] is DBNull)) dataColl.MonthsName = reader.GetString(1);

                        beData.SalaryDistributionColl.Add(dataColl);
                    }
                }
                //BRANCH WISE EMPLOYEE & ATTENDANCE
                if (reader.NextResult())
                {
                    beData.BranchWiseEmpAttColl = new RE.Dashboard.BranchWiseEmpAttCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.BranchWiseEmpAtt dataColl = new RE.Dashboard.BranchWiseEmpAtt();
                        if (!(reader[0] is DBNull)) dataColl.BTotalEmployees = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.BTotalPresent = reader.GetInt32(1);
                        if (!(reader[2] is DBNull)) dataColl.BTotalAbsent = reader.GetInt32(2);
                        if (!(reader[3] is DBNull)) dataColl.BranchName = reader.GetString(3);

                        beData.BranchWiseEmpAttColl.Add(dataColl);
                    }
                }
                //DEPARTMENT WISE EMPLOYEE
                if (reader.NextResult())
                {
                    beData.DepartmentWiseEmpColl = new RE.Dashboard.DepartmentWiseEmpCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.DepartmentWiseEmp dataColl = new RE.Dashboard.DepartmentWiseEmp();
                        if (!(reader[0] is DBNull)) dataColl.TotalEmployees = reader.GetInt32(0); 
                        if (!(reader[1] is DBNull)) dataColl.DepartmentName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.PresentEmp = reader.GetInt32(2);
                        if (!(reader[3] is DBNull)) dataColl.AbsentEmp = reader.GetInt32(3);

                        beData.DepartmentWiseEmpColl.Add(dataColl);
                    }
                }
                //UPCOMING BIRTHDAY
                if (reader.NextResult() && reader.Read())
                {
                    if (!(reader[0] is DBNull)) beData.TotalEmployeeBirthdays = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.NepaliMonth = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.MonthId = reader.GetInt32(2);
                }

                //Workforce List 
                if (reader.NextResult())
                {
                    beData.EmpListGenderCardColl = new RE.Dashboard.EmpListGenderCardCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.EmpListGenderCard dataColl = new RE.Dashboard.EmpListGenderCard();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.PanId = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Department = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.Designation = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.BranchName = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.CITAcNo = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.SSFNo = reader.GetString(7);
                        if (!(reader[8] is DBNull)) dataColl.CompanyName = reader.GetString(8);
                        if (!(reader[9] is DBNull)) dataColl.CompanyContactNo = reader.GetString(9);
                        if (!(reader[10] is DBNull)) dataColl.JoiningMitti = reader.GetString(10);
                        if (!(reader[11] is DBNull)) dataColl.AccountNo = reader.GetString(11);

                        beData.EmpListGenderCardColl.Add(dataColl);
                    }
                }
                //EmpAttendance List
                if (reader.NextResult())
                {
                    beData.EmpAttendanceColl = new RE.Dashboard.EmpAttendanceCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.EmpAttendance dataColl = new RE.Dashboard.EmpAttendance();
                        if (!(reader[0] is DBNull)) dataColl.UserId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeId = reader.GetInt32(1);
                        if (!(reader[2] is DBNull)) dataColl.EmployeeName = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.EmployeeCode = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.CompanyName = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.TranId = reader.GetInt32(6);
                        if (!(reader[7] is DBNull)) dataColl.InOutTypes = reader.GetString(7);
                        if (!(reader[8] is DBNull)) dataColl.InTime = Convert.ToDateTime(reader[8]);
                        if (!(reader[9] is DBNull)) dataColl.OutTime = Convert.ToDateTime(reader[9]);
                        if (!(reader[10] is DBNull)) dataColl.AttendanceDate = Convert.ToDateTime(reader[10]);
                        if (!(reader[11] is DBNull)) dataColl.AttendanceMitti = reader.GetString(11);
                        if (!(reader[12] is DBNull)) dataColl.AttRemarks = reader.GetString(12);
                        if (!(reader[13] is DBNull)) dataColl.AttStatus = reader.GetString(13);

                        beData.EmpAttendanceColl.Add(dataColl);
                    }
                }
                //New Employee List
                if (reader.NextResult())
                {
                    beData.NewEmployeeDetColl = new RE.Dashboard.NewEmployeeDetCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.NewEmployeeDet dataColl = new RE.Dashboard.NewEmployeeDet();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.BranchName = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.CompanyName = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.JoiningMitti = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.Department = reader.GetString(5);
                        beData.NewEmployeeDetColl.Add(dataColl);
                    }
                }

                //Attendance Apeal List
                if (reader.NextResult())
                {
                    beData.AttendanceApealColl = new RE.Dashboard.AttendanceApealCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.AttendanceApeal dataColl = new RE.Dashboard.AttendanceApeal();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.CompanyName = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.BranchName = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.Reason = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.ApprovedType = reader.GetInt32(5);
                        if (!(reader[6] is DBNull)) dataColl.ApprovedStatus = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.AppealMitti = reader.GetString(7);
                        if (!(reader[8] is DBNull)) dataColl.InTime = Convert.ToDateTime(reader[8]);
                        if (!(reader[9] is DBNull)) dataColl.OutTime = Convert.ToDateTime(reader[9]);
                        beData.AttendanceApealColl.Add(dataColl);
                    }
                }

                //Leave Status List
                if (reader.NextResult())
                {
                    beData.LeaveStatusColl = new RE.Dashboard.LeaveStatusCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.LeaveStatus dataColl = new RE.Dashboard.LeaveStatus();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.BranchName = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.LeaveFromMitti = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.LeaveToMitti = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.TotalDays = Convert.ToDouble(reader[5]);
                        if (!(reader[6] is DBNull)) dataColl.Reasons = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.ApprovedType = reader.GetInt32(7);
                        if (!(reader[8] is DBNull)) dataColl.ApprovedStatus = reader.GetString(8);
                        if (!(reader[9] is DBNull)) dataColl.LeaveType = reader.GetString(9);
                        beData.LeaveStatusColl.Add(dataColl);
                    }
                }
                //Holidays List
                if (reader.NextResult())
                {
                    beData.HolidaysColl = new RE.Dashboard.HolidaysCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.Holidays dataColl = new RE.Dashboard.Holidays();
                        if (!(reader[0] is DBNull)) dataColl.HolidayName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.HolidayMitti = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.TotalDays = Convert.ToDouble(reader[2]);
                        if (!(reader[3] is DBNull)) dataColl.HolidayType = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.HolidayStatus = reader.GetString(4);
                        beData.HolidaysColl.Add(dataColl);
                    }
                }

                //Total Advance/Receive List
                if (reader.NextResult())
                {
                    beData.AdvanceReceiveColl = new RE.Dashboard.AdvanceReceiveCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.AdvanceReceive dataColl = new RE.Dashboard.AdvanceReceive();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.Department = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.CompanyName = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.TotalAdvanceAmt = Convert.ToDouble(reader[6]);
                        if (!(reader[7] is DBNull)) dataColl.TotalReceiveAmt = Convert.ToDouble(reader[7]);
                        if (!(reader[8] is DBNull)) dataColl.RemainingAmt = Convert.ToDouble(reader[8]);
                        beData.AdvanceReceiveColl.Add(dataColl);
                    }
                }
                //Salary Distribution List
                if (reader.NextResult())
                {
                    beData.SalaryDistributionListColl = new RE.Dashboard.SalaryDistributionListCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.SalaryDistributionList dataColl = new RE.Dashboard.SalaryDistributionList();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.Department = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.YearName = reader.GetInt32(5);
                        if (!(reader[6] is DBNull)) dataColl.NepaliMonth = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.BasicSalary = Convert.ToDouble(reader[7]);
                        if (!(reader[8] is DBNull)) dataColl.Allowance = Convert.ToDouble(reader[8]);
                        if (!(reader[9] is DBNull)) dataColl.DeductedAmt = Convert.ToDouble(reader[9]);
                        if (!(reader[10] is DBNull)) dataColl.NetPayableAmt = Convert.ToDouble(reader[10]);
                        beData.SalaryDistributionListColl.Add(dataColl);

                        //if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        //if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        //if (!(reader[2] is DBNull)) dataColl.Department = reader.GetString(2);
                        //if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        //if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        //if (!(reader[5] is DBNull)) dataColl.YearName = reader.GetInt32(5);
                        //if (!(reader[6] is DBNull)) dataColl.NepaliMonth = reader.GetString(6);
                        //if (!(reader[7] is DBNull)) dataColl.Earning = Convert.ToDouble(reader[7]);
                        //if (!(reader[8] is DBNull)) dataColl.DeductedAmt = Convert.ToDouble(reader[8]);
                        //if (!(reader[9] is DBNull)) dataColl.NetPayableAmt = Convert.ToDouble(reader[9]);
                        //if (!(reader[10] is DBNull)) dataColl.CompanyName = reader.GetString(10);
                        //beData.SalaryDistributionListColl.Add(dataColl);

                        //if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        //if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        //if (!(reader[2] is DBNull)) dataColl.Department = reader.GetString(2);
                        //if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        //if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        //if (!(reader[5] is DBNull)) dataColl.YearName = reader.GetInt32(5);
                        //if (!(reader[6] is DBNull)) dataColl.NepaliMonth = reader.GetString(6);
                        //if (!(reader[7] is DBNull)) dataColl.Earning = Convert.ToDouble(reader[7]);
                        //if (!(reader[8] is DBNull)) dataColl.DeductedAmt = Convert.ToDouble(reader[8]);
                        //if (!(reader[9] is DBNull)) dataColl.NetPayableAmt = Convert.ToDouble(reader[9]);
                        //if (!(reader[10] is DBNull)) dataColl.CompanyName = reader.GetString(10);
                        //if (!(reader[11] is DBNull)) dataColl.PayHeading = reader.GetString(11);
                        //if (!(reader[12] is DBNull)) dataColl.PayHeadingAmounts = Convert.ToDouble(reader[12]);
                        //beData.SalaryDistributionListColl.Add(dataColl);

                    }
                }
                //Branch Wise Employee Attendance List
                if (reader.NextResult())
                {
                    beData.BranchWiseEmpAttendanceColl = new RE.Dashboard.BranchWiseEmpAttendanceCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.BranchWiseEmpAttendance dataColl = new RE.Dashboard.BranchWiseEmpAttendance();
                        if (!(reader[0] is DBNull)) dataColl.BranchName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.EmployeeCode = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.Department = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.AttStatus = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.AttendanceMitti = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.InTime = Convert.ToDateTime(reader[7]);
                        if (!(reader[8] is DBNull)) dataColl.OutTime = Convert.ToDateTime(reader[8]);
                        beData.BranchWiseEmpAttendanceColl.Add(dataColl);
                    }
                }

                //Department Wise Employee Attendance List
                if (reader.NextResult())
                {
                    beData.DepartmentWiseEmplpyeeColl = new RE.Dashboard.DepartmentWiseEmplpyeeCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.DepartmentWiseEmplpyee dataColl = new RE.Dashboard.DepartmentWiseEmplpyee();
                        if (!(reader[0] is DBNull)) dataColl.DepartmentName = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.EmployeeCode = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Designation = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.Department = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.AttStatus = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.AttendanceMitti = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.InTime = Convert.ToDateTime(reader[7]);
                        if (!(reader[8] is DBNull)) dataColl.OutTime = Convert.ToDateTime(reader[8]);
                        beData.DepartmentWiseEmplpyeeColl.Add(dataColl);
                    }
                }
                // Upcoming Birthday Employee List
                if (reader.NextResult())
                {
                    beData.EmployeeBirthdayListColl = new RE.Dashboard.EmployeeBirthdayListCollection();
                    while (reader.Read())
                    {
                        RE.Dashboard.EmployeeBirthdayList dataColl = new RE.Dashboard.EmployeeBirthdayList();
                        if (!(reader[0] is DBNull)) dataColl.EmployeeCode = reader.GetString(0);
                        if (!(reader[1] is DBNull)) dataColl.EmployeeName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) dataColl.Designation = reader.GetString(2);
                        if (!(reader[3] is DBNull)) dataColl.Department = reader.GetString(3);
                        if (!(reader[4] is DBNull)) dataColl.BranchName = reader.GetString(4);
                        if (!(reader[5] is DBNull)) dataColl.CompanyName = reader.GetString(5);
                        if (!(reader[6] is DBNull)) dataColl.ContactNo = reader.GetString(6);
                        if (!(reader[7] is DBNull)) dataColl.DOBMitti = reader.GetString(7);
                        if (!(reader[8] is DBNull)) dataColl.Age = reader.GetInt32(8);
                        beData.EmployeeBirthdayListColl.Add(dataColl);
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

