using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class VendorWiseAssetDB
    {
        DataAccessLayer1 dal = null;
        public VendorWiseAssetDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.VendorWiseAssetCollections GetAllVendorWiseAsset(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo)
        {
            RE.AssetManagement.Report.VendorWiseAssetCollections dataColl = new RE.AssetManagement.Report.VendorWiseAssetCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_GetVendorwiseAsset";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.VendorWiseAsset beData = new RE.AssetManagement.Report.VendorWiseAsset();
                    if (!(reader[0] is DBNull)) beData.InwardId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VendorName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.InVoiceNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.ParticularId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.AssetName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.AssetCode = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.AssetAlias = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.AssetGroup = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.AssetType = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.AssetModel = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.RAMName = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.ROMName = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.SerialNum = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.StatusName = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.BranchName = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.WarrantyMitti = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.InQTY = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.QtyRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.QtyDisAmt = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is DBNull)) beData.PRate = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is DBNull)) beData.DisAmt = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is DBNull)) beData.Amt = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.VoucherDateAD = Convert.ToDateTime(reader[22]);
                    if (!(reader[23] is DBNull)) beData.VoucherMitti = reader.GetString(23);

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