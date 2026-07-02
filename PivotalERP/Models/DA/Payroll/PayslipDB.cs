using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Payroll
{
    internal class PaySlipDB
    {
        DataAccessLayer1 dal = null;
        public PaySlipDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }



        //Get the ReportTemplate for payslip
        public BE.Payroll.ReportTemplateCollections getAllReportTemplateSlip(int UserId, int EntityId)
        {
            BE.Payroll.ReportTemplateCollections dataColl = new BE.Payroll.ReportTemplateCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllReportTempletes";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Payroll.ReportTemplate beData = new BE.Payroll.ReportTemplate();
                    beData.RptTranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.ReportName = reader.GetString(1);

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