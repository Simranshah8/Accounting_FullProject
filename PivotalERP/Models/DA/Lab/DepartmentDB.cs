using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{
    internal class DepartmentDB
    {
        DataAccessLayer1 dal = null;
        public DepartmentDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);

        }
		public BE.Lab.DepartmentCollections GetAllLabDepartment(int UserId, int EntityId)
		{
			BE.Lab.DepartmentCollections dataColl = new BE.Lab.DepartmentCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllLabDepartmet";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Lab.Department beData = new BE.Lab.Department();
					if (!(reader[0] is DBNull)) beData.DepartmentId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Alias = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.IsActive = reader.GetBoolean(4);
				
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