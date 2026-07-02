using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class AttendanceEmployeewise
    {
        DA.Attendance.AttendanceEmployeewiseDB db = null;
        int _UserId = 0;
        public AttendanceEmployeewise(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.AttendanceEmployeewiseDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.AttendanceEmployeewiseCollections beData)
        {
            ResponeValues isValid = IsValidData(ref beData);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData);
            else
                return isValid;
        }
        public BE.Attendance.AttendanceEmployeewiseCollections getDepartmentWiseAttendance(int DepartmentId, DateTime forDate, int InOutMode = 2)
        {
            return db.getDepartmentWiseAttendance(_UserId, DepartmentId, forDate, InOutMode);

        }
        public ResponeValues IsValidData(ref BE.Attendance.AttendanceEmployeewiseCollections beData)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else
                {

                    foreach (var data in beData)
                    {
                        if (data.ForDate.Year < 2020)
                        {
                            resVal.ResponseMSG = "Please ! Enter For Date";
                            return resVal;
                        }

                        if (data.Attendance.HasValue)
                        {
                            if (data.Attendance.Value != BE.Attendance.ATTENDANCES.LATE)
                                data.LateMin = 0;
                        }
                        data.CUserId = _UserId;
                    }

                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Valid";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }
    }
}
