using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Account;
using System.Web;


namespace AcademicLib.DA.Payroll
{
    public class SalaryJVDetDB
    {
        DataAccessLayer1 dal = null;
        public SalaryJVDetDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public (AcademicLib.RE.Payroll.LedgerSJVCollections, AcademicLib.RE.Payroll.PayHeadSJVCollections) GetSalaryJV(int UserId, int YearId, int MonthId)
        {
            AcademicLib.RE.Payroll.LedgerSJVCollections ledgerColl = new AcademicLib.RE.Payroll.LedgerSJVCollections();
            AcademicLib.RE.Payroll.PayHeadSJVCollections payHeadColl = new AcademicLib.RE.Payroll.PayHeadSJVCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_SalaryJV_View";

            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();

                // Read first result set (LedgerSJV)
                while (reader.Read())
                {
                    AcademicLib.RE.Payroll.LedgerSJV ledgerData = new AcademicLib.RE.Payroll.LedgerSJV();
                    if (!(reader[0] is DBNull)) ledgerData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) ledgerData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) ledgerData.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull)) ledgerData.DrAmount = reader.GetDouble(3);
                    if (!(reader[4] is DBNull)) ledgerData.CrAmount = reader.GetDouble(4);
                    if (!(reader[5] is DBNull)) ledgerData.DrCr = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) ledgerData.PayHeadColl = reader.GetString(6);
                    if (!(reader[7] is DBNull)) ledgerData.LedgerGroup = reader.GetString(7);
                    ledgerColl.Add(ledgerData);
                }

                // Move to the next result set (PayHeadSJV)
                if (reader.NextResult())
                {
                    while (reader.Read())
                    {
                        AcademicLib.RE.Payroll.PayHeadSJV payHeadData = new AcademicLib.RE.Payroll.PayHeadSJV();
                        if (!(reader[0] is DBNull)) payHeadData.LedgerId = reader.GetInt32(0);
                        if (!(reader[1] is DBNull)) payHeadData.LedgerName = reader.GetString(1);
                        if (!(reader[2] is DBNull)) payHeadData.LedgerCode = reader.GetString(2);
                        if (!(reader[3] is DBNull)) payHeadData.PayHeading = reader.GetString(3);
                        if (!(reader[4] is DBNull)) payHeadData.DrAmount = Convert.ToDouble(reader[4]);
                        if (!(reader[5] is DBNull)) payHeadData.CrAmount = Convert.ToDouble(reader[5]);
                        if (!(reader[6] is DBNull)) payHeadData.PayHeadType = reader.GetString(6);
                        if (!(reader[7] is DBNull)) payHeadData.LedgerGroup = reader.GetString(7);
                        payHeadColl.Add(payHeadData);
                    }
                }

                reader.Close();
                ledgerColl.IsSuccess = true;
                ledgerColl.ResponseMSG = GLOBALMSG.SUCCESS;
                payHeadColl.IsSuccess = true;
                payHeadColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ex)
            {
                ledgerColl.IsSuccess = false;
                ledgerColl.ResponseMSG = ex.Message;
                payHeadColl.IsSuccess = false;
                payHeadColl.ResponseMSG = ex.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return (ledgerColl, payHeadColl);
        }


    } // class ends
} // namespace ends