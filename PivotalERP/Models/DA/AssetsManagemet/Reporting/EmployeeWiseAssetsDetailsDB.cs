using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class EmployeeWiseAssetsDetailsDB
    {
        DataAccessLayer1 dal = null;
        public EmployeeWiseAssetsDetailsDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.EmployeeWiseAssetsDetCollections GetEmployeeWiseAssetsDet(int UserId, int EntityId,int? UsersId)
        {
            RE.AssetManagement.Report.EmployeeWiseAssetsDetCollections dataColl = new RE.AssetManagement.Report.EmployeeWiseAssetsDetCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@UsersId", UsersId);
            cmd.CommandText = "usp_GetEmployeeWiseAssetsDet";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.EmployeeWiseAssetsDetails beData = new RE.AssetManagement.Report.EmployeeWiseAssetsDetails();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ParticularId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.AssetsName = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.AssetAlias = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.AssetCode = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.AssetType = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.AssetGroup = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.AssetModels = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.IssueNo = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.QTY = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.IssueMitti = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ReceivedNo = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ReceivedQTY = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.ReceivedMitti = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.UserName = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.SerialNum = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.ReceivedStatus = reader.GetString(16);

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