using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.HR.Report
{
    public class SupervisorListDB
	{
		DataAccessLayer1 dal = null;
		public SupervisorListDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}

		public Dynamic.RE.HR.Report.SupervisorListCollections GetSupervisorList(int UserId, int EntityId, int? BranchId, int? DepartmentId, int? DesignationId,int? CompanyRelationshipId, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100)
		{
			Dynamic.RE.HR.Report.SupervisorListCollections dataColl = new RE.HR.Report.SupervisorListCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@BranchId", BranchId);
			cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
			cmd.Parameters.AddWithValue("@DesignationId", DesignationId);
			cmd.Parameters.AddWithValue("@CompanyRelationshipId", CompanyRelationshipId);
			cmd.CommandText = "usp_GetSupervisorPage";
			cmd.Parameters.Add("@TotalRows", System.Data.SqlDbType.Int);
			cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@PageNumber", PageNumber);
			cmd.Parameters.AddWithValue("@RowsOfPage", RowsOfPage);
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					Dynamic.RE.HR.Report.SupervisorList beData = new Dynamic.RE.HR.Report.SupervisorList();
					if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.EmployeeCode = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.BranchName = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EmpName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.HODName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.DepartmentName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.DesignationName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.S_FirstLevel = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.S_SecondLevel = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.S_ThirdLevel = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.CompanyName = reader.GetString(10);
					
					dataColl.Add(beData);
				}
				reader.Close();
				TotalRows = Convert.ToInt32(cmd.Parameters[6].Value);
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