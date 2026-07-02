using Dynamic.DataAccess.Global;
using System;

namespace Dynamic.DA.Report
{
    internal class DairyLedgerVoucherDB
    {
        DataAccessLayer1 dal = null;
        public DairyLedgerVoucherDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public RE.Reporting.Account.DairyLedgerVoucherCollections GetDailyLedgerVoucher(int UserId, BaseDate baseDate, int? LedgerId, DateTime? dateFrom, DateTime? dateTo, ref double OpeningAmt, bool ShowInventoryDetails = false, bool showAsCurrency = false, int? PatientId = null, string branchIdColl = "", bool ShowRelatedLC = false)
        {
            RE.Reporting.Account.DairyLedgerVoucherCollections dataColl = new RE.Reporting.Account.DairyLedgerVoucherCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
            cmd.Parameters.AddWithValue("@dateFrom", dateFrom);
            cmd.Parameters.AddWithValue("@dateTo", dateTo);
            cmd.Parameters.AddWithValue("@OpeningAmt", OpeningAmt);
            cmd.Parameters.AddWithValue("@ShowInventoryDetails", ShowInventoryDetails);
            //cmd.Parameters.AddWithValue("@showAsCurrency", showAsCurrency);
            bool flag = baseDate == BaseDate.EnglishDate;
            cmd.CommandText = "usp_GetDailyLedgerVoucher";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.Reporting.Account.DairyLedgerVoucher beData = new RE.Reporting.Account.DairyLedgerVoucher();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[1]);
                    if (!(reader[2] is DBNull)) beData.VoucherMiti = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Qty = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.Fat = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.FatKG = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.Lacto = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.SNF = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.SNFKG = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.Amount = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.BalanceAmt = Convert.ToDouble(reader[10]);
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