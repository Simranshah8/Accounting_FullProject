using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Reporting.Account
{

    internal class NewTBDB
    {
        DataAccessLayer1 dal = null;
        public NewTBDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }


        public Dynamic.RE.Reporting.Account.NewTBCollections getAllNewTB(int UserId, int? LedgerGroupId, int? ReportType, DateTime? DateFrom, DateTime? DateTo, int? ForBranchId,string BranchIdColl)
        {
            Dynamic.RE.Reporting.Account.NewTBCollections dataColl = new Dynamic.RE.Reporting.Account.NewTBCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@LedgerGroupId", LedgerGroupId);
            cmd.Parameters.AddWithValue("@ReportType", ReportType);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@ForBranchId", ForBranchId);
            cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
            cmd.CommandText = "usp_Dugar_TrailBalance";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int fieldCount = reader.FieldCount;
                List<string> colname = new List<string>();
                for (int i = 6; i < fieldCount; i++)
                {
                    colname.Add(reader.GetName(i));
                }
                while (reader.Read())
                {
                    Dynamic.RE.Reporting.Account.NewTB beData = new Dynamic.RE.Reporting.Account.NewTB();

                    if (!(reader[0] is DBNull)) beData.LedgerName = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Code = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Opening = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) beData.DrAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) beData.CrAmount = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.Closing = Convert.ToDouble(reader[5]);
                    beData.ReportTypeName = colname;
                    beData.ReportType = new double[colname.Count];                    
                    int ind = 0;
                    foreach(var col in beData.ReportTypeName)
                    {
                        if (!(reader[col] is DBNull)) beData.ReportType[ind] = Convert.ToDouble(reader[col]);
                        ind++;
                    }                     
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

