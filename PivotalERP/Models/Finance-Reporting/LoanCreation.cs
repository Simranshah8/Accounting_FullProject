using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.Reporting.Finance
{
    public class LoanCreation
    {
        Dynamic.DataAccess.Global.DataAccessLayer1 dal = null;
        public LoanCreation() { dal = new DataAccess.Global.DataAccessLayer1(); }
        public LoanCreation(string hostName, string dbName)
        {
            dal = new DataAccess.Global.DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.ReportEntity.Finance.LoanCreationCollections getLoanCreation(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Finance.LoanCreationCollections dataColl = new ReportEntity.Finance.LoanCreationCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "sp_LoanCreation";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.Finance.LoanCreation beData = new ReportEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LedgerId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.PartyName = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Address = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.PanVatNo = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.StartDate = reader.GetDateTime(8);
                    if (!(reader[9] is System.DBNull)) beData.NY = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.NM = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ND = reader.GetInt32(11);
                    if (!(reader[12] is System.DBNull)) beData.Period = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.LoanType = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.RefBy = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.Notes = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.TotalInterest = Convert.ToDouble(reader[17]);

                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
    }
}
