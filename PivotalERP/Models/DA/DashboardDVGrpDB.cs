using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{
    internal class DashboardDVGrpDB
    {
        DataAccessLayer1 dal = null;
        public DashboardDVGrpDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }      

        public PivotalERP.BE.DashboardDVGrp getDashboardDVGrpById(int UserId, int EntityId, int TranId)
        {
            PivotalERP.BE.DashboardDVGrp beData = new PivotalERP.BE.DashboardDVGrp();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetDashboardDVGrpById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new PivotalERP.BE.DashboardDVGrp();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Greeting = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Username = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Target = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.AchievementPer = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.TotalDSE = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.ActiveDSE = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.InActiveDSE = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.TotalSalesOfficer = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.ActiveSalesOfficer = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.InactiveSalesOfficer = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.TotalASM = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.ActiveASM = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.InactiveASM = reader.GetInt32(13);
                    if (!(reader[14] is DBNull)) beData.TotalRSM = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.ActiveRSM = reader.GetInt32(15);
                    if (!(reader[16] is DBNull)) beData.InactiveRSM = reader.GetInt32(16);
                    if (!(reader[17] is DBNull)) beData.TotalNSM = reader.GetInt32(17);
                    if (!(reader[18] is DBNull)) beData.ActiveNSM = reader.GetInt32(18);
                    if (!(reader[19] is DBNull)) beData.InactiveNSM = reader.GetInt32(19);
                    if (!(reader[20] is DBNull)) beData.TotalOutlets = reader.GetInt32(20);
                    if (!(reader[21] is DBNull)) beData.ActiveOutlets = reader.GetInt32(21);
                    if (!(reader[22] is DBNull)) beData.InactiveOutlets = reader.GetInt32(22);
                    if (!(reader[23] is DBNull)) beData.Products = reader.GetInt32(23);
                    if (!(reader[24] is DBNull)) beData.TotalSKUs = reader.GetInt32(24);
                    if (!(reader[25] is DBNull)) beData.TotalCall = reader.GetInt32(25);
                    if (!(reader[26] is DBNull)) beData.SuccessCall = reader.GetInt32(26);
                    if (!(reader[27] is DBNull)) beData.UnsuccessCall = reader.GetInt32(27);
                    if (!(reader[28] is DBNull)) beData.RemainingCall = reader.GetInt32(28);
                    if (!(reader[29] is DBNull)) beData.TotalOrder = reader.GetInt32(29);
                    if (!(reader[30] is DBNull)) beData.TotalOrderValue = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is DBNull)) beData.PendingOrder = reader.GetInt32(31);
                    if (!(reader[32] is DBNull)) beData.PendingOrderVal = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is DBNull)) beData.InvoicedOrder = reader.GetInt32(33);
                    if (!(reader[34] is DBNull)) beData.InvoicedOrderVal = Convert.ToDouble(reader[34]);
                    if (!(reader[35] is DBNull)) beData.SalesReturnOrder = reader.GetInt32(35);
                    if (!(reader[36] is DBNull)) beData.SalesReturnOrderVal = Convert.ToDouble(reader[36]);
                    if (!(reader[37] is DBNull)) beData.CancelledOrder = reader.GetInt32(37);
                    if (!(reader[38] is DBNull)) beData.CancelledOrderVal = Convert.ToDouble(reader[38]);
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
