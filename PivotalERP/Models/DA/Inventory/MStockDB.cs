using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA.Inventory
{
    internal class MStockDB
    {
        DataAccessLayer1 dal = null;
        public MStockDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
       
        public PivotalERP.BE.Inventory.MStockCollections getAllMStock(int UserId, int EntityId)
        {
            PivotalERP.BE.Inventory.MStockCollections dataColl = new PivotalERP.BE.Inventory.MStockCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllCurrentStock";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    PivotalERP.BE.Inventory.MStock beData = new PivotalERP.BE.Inventory.MStock();                   
                    if (!(reader[0] is DBNull)) beData.CTranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ProductName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Batch = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EXPDate = Convert.ToDateTime(reader[3]);

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
