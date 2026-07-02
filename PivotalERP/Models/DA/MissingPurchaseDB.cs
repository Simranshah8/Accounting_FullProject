using System;
using System.Data.SqlClient;
using Dynamic.DataAccess.Global;

namespace Dynamic.DataAccess.Inventory
{
    internal class MissingPurchaseDB
    {
        DataAccessLayer1 dal = null;

        public MissingPurchaseDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections getMissingPurchase(int UserId, int EntityId)
        {
            Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections dataColl = new Dynamic.BusinessEntity.Inventory.MissingPurchaseCollections();

            dal.OpenConnection();
            SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.CommandText = @"
                SELECT Sales_order, Party_Name, Code=null 
                FROM DT830001.dbo.Sales_Master S
                WHERE S.Sb_InvDate = '2024-07-18'

                UNION ALL

                SELECT Sales_order, Party_Name, Code=null
                FROM VT810001.dbo.Sales_Master S
                WHERE S.Sb_InvDate = '2024-07-18';
            ";

            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.MissingPurchase beData = new Dynamic.BusinessEntity.Inventory.MissingPurchase();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Sales_order = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Party_Name = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Code = reader.GetInt32(3);

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
