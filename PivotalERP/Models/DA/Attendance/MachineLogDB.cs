using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.Attendance
{
    internal class MachineLogDB
    {
        DataAccessLayer1 dal = null;
        public MachineLogDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public BE.Attendance.MachineLogCollections getMachineLog(int UserId,  DateTime? DateFrom, DateTime? DateTo)
        {
            BE.Attendance.MachineLogCollections dataColl = new BE.Attendance.MachineLogCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "usp_GetMachineLog";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Attendance.MachineLog beData = new BE.Attendance.MachineLog();
                    if (!(reader[0] is DBNull)) beData.MachineSerialNo = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.EnrollNumber = Convert.ToInt64(reader[1]);
                    if (!(reader[2] is DBNull)) beData.PunchDateTime = Convert.ToDateTime(reader[2]);
                    if (!(reader[3] is DBNull)) beData.LogDateTime = Convert.ToDateTime(reader[3]);
                    if (!(reader[4] is DBNull)) beData.EmployeeId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.EmployeeCode = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Name = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ContactNo = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Department = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Designation = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.GroupName = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.LevelName = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.ServiceType = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.PunchMiti = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.MachineName = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.MachineLocation = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.IPAddress = reader.GetString(16);

                    if(beData.PunchDateTime.HasValue)
                    {
                        beData.PunchMiti = beData.PunchMiti + " " + beData.PunchDateTime.Value.ToString("HH:mm");
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
