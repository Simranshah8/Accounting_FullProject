using Dynamic.DataAccess.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.DA.HR.Report
{
    public class EmpResponsibilityHistoryDB
    {
        DataAccessLayer1 dal = null;

        public EmpResponsibilityHistoryDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

		public RE.HR.Report.EmpResponsibilityHistoryCollections getAllEmpResponsibilityHistory(int UserId, int EntityId,int? EmployeeId)
		{
			RE.HR.Report.EmpResponsibilityHistoryCollections dataColl = new RE.HR.Report.EmpResponsibilityHistoryCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
			cmd.CommandText = "usp_GetEmployeeJDHistory";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					RE.HR.Report.EmpResponsibilityHistory beData = new RE.HR.Report.EmpResponsibilityHistory();
					if (!(reader[0] is DBNull)) beData.EmpJDId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Responsibility = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.FromMitti = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.ToMitti = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.EmployeeId = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.JDStatus = reader.GetString(5);
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