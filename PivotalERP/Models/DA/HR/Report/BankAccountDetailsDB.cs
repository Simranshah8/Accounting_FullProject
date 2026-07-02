using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR.Report
{

	internal class BankAccountDetailsDB
	{
		DataAccessLayer1 dal = null;
		public BankAccountDetailsDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public Dynamic.RE.HR.Report.BankAccountDetailsCollections GetBankAccountDetails(int UserId, string BranchId, string DepartmentId, string DesignationId, string LevelId, string EmployeeGroupId,string CompanyId)
		{
			Dynamic.RE.HR.Report.BankAccountDetailsCollections dataColl = new Dynamic.RE.HR.Report.BankAccountDetailsCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
			cmd.Parameters.AddWithValue("@LevelId", LevelId);
			cmd.Parameters.AddWithValue("@EmployeeGroupId", EmployeeGroupId);
            cmd.Parameters.AddWithValue("@CompanyId", CompanyId);
            cmd.CommandText = "usp_GetEmployeeBankDetail";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.RE.HR.Report.BankAccountDetails beData = new Dynamic.RE.HR.Report.BankAccountDetails();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.EnrollNo = Convert.ToInt64(reader[2]);
					if (!(reader[3] is DBNull)) beData.EmployeeName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.Gender = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MaritalStatus = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.Branch = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Designation = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.LevelName = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.ServiceType = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.EmployeeGroup = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.EmailId = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.PersnalContactNo = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.PermanentAddress = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.BankName = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.AccountNo = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.ForPayRoll = Convert.ToBoolean(reader[17]);
					if (!(reader[18] is DBNull)) beData.AccountName = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.BankBranch = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.Company = reader.GetString(20);
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

