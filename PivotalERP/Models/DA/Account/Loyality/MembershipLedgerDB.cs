using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class MembershipLedgerDB
    {
        DataAccessLayer1 dal = null;
        public MembershipLedgerDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.RE.Reporting.Account.MembershipLedgerCollections getAllMembershipLedger(int UserId, DateTime? DateFrom, DateTime? DateTo, int? MembershipLedgerId)
        {
            Dynamic.RE.Reporting.Account.MembershipLedgerCollections dataColl = new Dynamic.RE.Reporting.Account.MembershipLedgerCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);

            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@MembershipLedgerId", MembershipLedgerId);
            cmd.CommandText = "usp_GetMembershipLedger";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.MembershipLedger beData = new Dynamic.RE.Reporting.Account.MembershipLedger();
                    if (!(reader[0] is DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherDate = Convert.ToDateTime(reader[1]);
                    if (!(reader[2] is DBNull)) beData.VoucherMiti = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Particulars = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.VoucherType = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.VoucherNo = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.RefNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Debit = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.Credit = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.PointsGained = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.PointsDeducted = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.CumulativePoints = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.Age = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.ContactNo = reader.GetString(13);
                    //if (!(reader[12] is DBNull)) beData.Age = Convert.ToBoolean(reader[12]);

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

