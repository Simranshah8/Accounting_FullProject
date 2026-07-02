using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR.Report
{

	internal class EmployeeSummaryDB
	{
		DataAccessLayer1 dal = null;
		public EmployeeSummaryDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public Dynamic.RE.HR.Report.EmployeeSummaryCollections getEmployeeSummary(int UserId, DateTime? JoinDateFrom, DateTime? JoinDateTo, DateTime? PermanentDateFrom, DateTime? PermanentDateTo, DateTime? RetireDateFrom, DateTime? RetireDateTo,
            string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId)
        {
            Dynamic.RE.HR.Report.EmployeeSummaryCollections dataColl = new Dynamic.RE.HR.Report.EmployeeSummaryCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@JoinDateFrom", JoinDateFrom);
            cmd.Parameters.AddWithValue("@JoinDateTo", JoinDateTo);
            cmd.Parameters.AddWithValue("@PermanentDateFrom", PermanentDateFrom);
            cmd.Parameters.AddWithValue("@PermanentDateTo", PermanentDateTo);
            cmd.Parameters.AddWithValue("@RetireDateFrom", RetireDateFrom);
            cmd.Parameters.AddWithValue("@RetireDateTo", RetireDateTo);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
			cmd.Parameters.AddWithValue("@LevelId", LevelId);
			cmd.Parameters.AddWithValue("@EmployeeGroupId", EmployeeGroupId);
            cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
            cmd.CommandText = "usp_GetEmployeeSummary";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.RE.HR.Report.EmployeeSummary beData = new Dynamic.RE.HR.Report.EmployeeSummary();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.PhotoPath = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.AutoNumber = reader.GetInt32(2);
					if (!(reader[3] is DBNull)) beData.EmployeeCode = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[4]);
					if (!(reader[5] is DBNull)) beData.EmployeeName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Gender = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.DOB_AD = Convert.ToDateTime(reader[7]);
					if (!(reader[8] is DBNull)) beData.DOB_BS = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.Nationality = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.MaritalStatus = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Branch = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.ContactNo = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.Department = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Designation = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.LevelName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.ServiceType = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.EmployeeGroup = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.EmailId = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.PersnalContactNo = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.EmergencyContactNo = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.PermanentAddress = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.TemporaryAddress = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.DateofJoining = Convert.ToDateTime(reader[23]);
					if (!(reader[24] is DBNull)) beData.DateofJoiningMiti = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.DateofRetirement = Convert.ToDateTime(reader[25]);
					if (!(reader[26] is DBNull)) beData.DateofRetirementMiti = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.FatherName = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.MotherName = reader.GetString(28);
					if (!(reader[29] is DBNull)) beData.CardNo = reader.GetString(29);
					if (!(reader[30] is DBNull)) beData.UserId = reader.GetInt32(30);
					if (!(reader[31] is DBNull)) beData.UserName = reader.GetString(31);
					if (!(reader[32] is DBNull)) beData.CitizenshipNo = reader.GetString(32);
					if (!(reader[33] is DBNull)) beData.BloodGroup = reader.GetString(33);
					if (!(reader[34] is DBNull)) beData.PanId = reader.GetString(34);
					if (!(reader[35] is DBNull)) beData.ServicePeriod = reader.GetString(35);
					if (!(reader[36] is DBNull)) beData.PermanentDate = Convert.ToDateTime(reader[36]);
					if (!(reader[37] is DBNull)) beData.PermanentDateMiti = reader.GetString(37);
					if (!(reader[38] is DBNull)) beData.PFAccountNo = reader.GetString(38);
					if (!(reader[39] is DBNull)) beData.AccessionNo = reader.GetString(39);
					if (!(reader[40] is DBNull)) beData.SSFNo = reader.GetString(40);
					if (!(reader[41] is DBNull)) beData.CitCode = reader.GetString(41);
					if (!(reader[42] is DBNull)) beData.CITAcNo = reader.GetString(42);
					if (!(reader[43] is DBNull)) beData.GratIdNum = reader.GetString(43);
					if (!(reader[44] is DBNull)) beData.GratAccNum = reader.GetString(44);
                    if (!(reader[45] is DBNull)) beData.Company = reader.GetString(45);
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

