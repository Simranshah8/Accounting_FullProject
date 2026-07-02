using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class AssetsUseDetailsDB
    {
        DataAccessLayer1 dal = null;
        public AssetsUseDetailsDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.AssetsUseDetailsCollections GetAllAssetsUseDetails(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo, int? TranId)
        {
            RE.AssetManagement.Report.AssetsUseDetailsCollections dataColl = new RE.AssetManagement.Report.AssetsUseDetailsCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "usp_GetAssetsUseDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.AssetsUseDetails beData = new RE.AssetManagement.Report.AssetsUseDetails();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.FromMitti = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.TOMitti = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Particular = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Designation = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.CompanyId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.CompanyName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.IssueById = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.IssueByName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.DepartmentName = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Branch = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ReceivedStatus = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.EmployeeCode = reader.GetString(12);

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