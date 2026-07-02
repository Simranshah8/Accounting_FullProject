using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.Reporting.Finance
{
    public class LoanDetails
    {
        Dynamic.DataAccess.Global.DataAccessLayer1 dal = null;
        public LoanDetails() { dal = new DataAccess.Global.DataAccessLayer1(); }
        public LoanDetails(string hostName, string dbName)
        {
            dal = new DataAccess.Global.DataAccessLayer1(hostName, dbName);
        }
        public Dynamic.ReportEntity.Finance.LoanDetailsCollections getLoanDetails(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Finance.LoanDetailsCollections dataColl = new ReportEntity.Finance.LoanDetailsCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "sp_GetLoanDetails";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.Finance.LoanDetails beData = new ReportEntity.Finance.LoanDetails();
                    if (!(reader[0] is System.DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Address = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.MobileNo = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.TelNo = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.GroupName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.StartDate = reader.GetDateTime(6);
                    if (!(reader[7] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.NY = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.NM = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.ND = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.DebitPrincipal = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.DuesPrincipal = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.DebitInterest = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.DuesInterest = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.Rebate = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is System.DBNull)) beData.Penalty = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.LedgerClosing = Convert.ToDouble(reader[18]);
                    DateTime? lastEMIDate = null;
                    if (!(reader[19] is System.DBNull)) lastEMIDate = Convert.ToDateTime(reader[19]);
                    if (!(reader[20] is System.DBNull)) beData.SchedulePayment = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.DoneEMI = reader.GetInt32(21);
                    if (!(reader[22] is System.DBNull)) beData.DueEMI = reader.GetInt32(22);
                    if (!(reader[23] is System.DBNull)) beData.NextEMIDate = Convert.ToDateTime(reader[23]);

                    if (lastEMIDate.HasValue)
                        beData.LastEMIDate = lastEMIDate.Value;
                    else
                        beData.LastEMIDate = beData.StartDate;

                    if (beData.NextEMIDate.HasValue)
                        beData.NextEMIAfterDays = Math.Abs((beData.NextEMIDate.Value - DateTime.Today).Days);

                    beData.ClosingBalance = beData.LedgerClosing + beData.DuesPrincipal + beData.DuesInterest;

                    int totalDays = Math.Abs((beData.LastEMIDate - DateTime.Today).Days);
                    double interest = (Math.Round(beData.DuesPrincipal * beData.InterestRate / 100, 2) / 365) * totalDays;

                    beData.CurrentClosingBalance = beData.LedgerClosing + beData.DuesPrincipal + interest;

                    beData.DuesEMINo = Math.Round(beData.LedgerClosing / beData.SchedulePayment, 2);

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
        public Dynamic.ReportEntity.Finance.LoanMonthlyCollections getLoanMonthly(DateTime dateFrom, DateTime dateTo)
        {
            Dynamic.ReportEntity.Finance.LoanMonthlyCollections dataColl = new ReportEntity.Finance.LoanMonthlyCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@DateFrom", dateFrom);
                cmd.Parameters.AddWithValue("@DateTo", dateTo);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "sp_GetMonthlyDetails";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.Finance.LoanMonthly beData = new ReportEntity.Finance.LoanMonthly();
                    if (!(reader[0] is System.DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Address = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.MobileNo = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.TelNo = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.GroupName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.StartDate = reader.GetDateTime(6);
                    if (!(reader[7] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) beData.NY = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.NM = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.ND = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.LedgerClosing = Convert.ToDouble(reader[12]);
                    DateTime? lastEMIDate = null;
                    if (!(reader[13] is System.DBNull)) lastEMIDate = Convert.ToDateTime(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.SchedulePayment = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.NextEMIDate = Convert.ToDateTime(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.RegdNo = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.EngineNo = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.ChechisNo = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) beData.Model = reader.GetString(19);
                    if (!(reader[20] is System.DBNull)) beData.Color = reader.GetString(20);
                    if (!(reader[21] is System.DBNull)) beData.Type = reader.GetString(21);
                    if (!(reader[22] is System.DBNull)) beData.KeyNo = reader.GetString(22);
                    if (!(reader[23] is System.DBNull)) beData.CodeNo = reader.GetString(23);
                    if (!(reader[24] is System.DBNull)) beData.MFGYear = reader.GetInt32(24);
                    if (!(reader[25] is System.DBNull)) beData.BookingDate = reader.GetDateTime(25);
                    if (!(reader[26] is System.DBNull)) beData.BookingMemoNo = reader.GetString(26);
                    if (!(reader[27] is System.DBNull)) beData.SalesBillNo = reader.GetString(27);
                    if (!(reader[28] is System.DBNull)) beData.SalesDate = reader.GetDateTime(28);
                    if (!(reader[29] is System.DBNull)) beData.SalesPrice = Convert.ToDouble(reader[29]);
                    if (!(reader[30] is System.DBNull)) beData.DiscountAmt = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is System.DBNull)) beData.AgentId = reader.GetInt32(31);
                    if (!(reader[32] is System.DBNull)) beData.CommissionAmt = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is System.DBNull)) beData.FinanceMode = reader.GetString(33);
                    if (!(reader[34] is System.DBNull)) beData.InsuranceName = reader.GetString(34);
                    if (!(reader[35] is System.DBNull)) beData.InsuraceValidUpto = reader.GetDateTime(35);
                    if (!(reader[36] is System.DBNull)) beData.BlueBookValidUpto = reader.GetDateTime(36);
                    if (!(reader[37] is System.DBNull)) beData.RoutePermitValidUpto = reader.GetDateTime(37);
                    if (!(reader[38] is System.DBNull)) beData.CheckupValidUpto = reader.GetDateTime(38);
                    if (!(reader[39] is System.DBNull)) beData.Zone = reader.GetString(39);
                    if (!(reader[40] is System.DBNull)) beData.District = reader.GetString(40);
                    if (!(reader[41] is System.DBNull)) beData.RecoveryName = reader.GetString(41);
                    if (!(reader[42] is System.DBNull)) beData.CitizenshipNo = reader.GetString(42);
                    if (!(reader[43] is System.DBNull)) beData.FatherName = reader.GetString(43);
                    if (!(reader[44] is System.DBNull)) beData.MotherName = reader.GetString(44);
                    if (!(reader[45] is System.DBNull)) beData.GFatherName = reader.GetString(45);
                    if (!(reader[46] is System.DBNull)) beData.GMotherName = reader.GetString(46);
                    if (!(reader[47] is System.DBNull)) beData.Notes = reader.GetString(47);
                    if (!(reader[48] is System.DBNull)) beData.Culty = reader.GetBoolean(48);

                    if (lastEMIDate.HasValue)
                        beData.LastEMIDate = lastEMIDate.Value;
                    else
                        beData.LastEMIDate = beData.StartDate;

                    if (beData.NextEMIDate.HasValue)
                        beData.NextEMIAfterDays = Math.Abs((beData.NextEMIDate.Value - DateTime.Today).Days);

                    beData.DuesEMINo = Math.Round(beData.LedgerClosing / beData.SchedulePayment, 2);

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
