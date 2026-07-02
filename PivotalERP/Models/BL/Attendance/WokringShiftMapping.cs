using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class WokringShiftMapping
    {
        DA.Attendance.WorkingShiftMappingDB db = null;
        int _UserId = 0;
        public WokringShiftMapping(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.WorkingShiftMappingDB(hostName, dbName);
        }

        public ResponeValues SaveWSM(BE.Attendance.WorkingShiftMapping beData)
        {
            bool isModify = beData.ShiftMappingId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveWSM(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.WorkingShiftMappingCollections getAllWorkingShift()
        {
            return db.getAllShiftMapping(_UserId);
        }
        public ResponeValues DelDuplicate()
        {
            return db.DelDuplicate(_UserId);
        }
            public ResponeValues DeleteById(int EntityId, int DeviceId)
        {
            return db.DeleteById(_UserId, EntityId, DeviceId);
        }
        public ResponeValues DeleteById(int WorkingShiftId, int EmployeeId, DateTime DateFrom, DateTime DateTo)
        {
            return db.DeleteById(_UserId, WorkingShiftId,EmployeeId,DateFrom,DateTo);
        }
        public ResponeValues IsValidData(ref BE.Attendance.WorkingShiftMapping beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.ShiftMappingId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.ShiftMappingId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }

                else
                {
                    if (beData.IsMultipleShift == false)
                    {
                        if (beData.DateTo_AD.Value <= beData.DateFrom_AD.Value)
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Cannot Enter Same Date or Less then Date From";
                            return resVal;
                        }
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


        //Code add by Prashant on 30 Kartik
        //Added Parameter to GetMappingEmployee ,BranchId ,DepartmentId,CategoryId,DesignationId

        public BE.Attendance.WorkingShiftMappingCollections GetMappingEmployee(int? WorkingShiftId, DateTime? DateFrom, DateTime? DateTo, int? BranchId, int? DepartmentId, int? CategoryId, int? DesignationId,int? CompanyId)
        {
            return db.GetMappingEmployee(_UserId, WorkingShiftId, DateFrom, DateTo, BranchId, DepartmentId, CategoryId, DesignationId,CompanyId);
        }


        //code from Prashant on Mangsir 06
        public BE.Attendance.WorkingShiftMappingCollections GetShiftMappingByEmp(int EmployeeId)
        {
            return db.GetShiftMappingByEmp(_UserId, EmployeeId);
        }


        public ResponeValues SaveshiftMapping(List<BE.Attendance.WorkingShiftMapping> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                foreach (var beData in dataColl)
                {
                    if (beData.DateFrom_AD == null || beData.DateTo_AD == null)
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Date values cannot be null";
                        return resVal;
                    }
                    if (beData.IsMultipleShift == false)
                    {
                        if (beData.DateTo_AD.Value <= beData.DateFrom_AD.Value)
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Cannot Enter Same Date or Less then Date From";
                            return resVal;
                        }
                    }
                    else
                    {
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "Valid";
                    }

                }
                resVal = db.SaveUpdate(_UserId, dataColl);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }


        public ResponeValues SaveshiftMappingColl(Dynamic.BE.Attendance.WorkingShiftMappingCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                foreach (var beData in dataColl)
                {
                    if (beData.DateFrom_AD == null || beData.DateTo_AD == null)
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Date values cannot be null";
                        return resVal;
                    }
                    if (beData.IsMultipleShift == false)
                    {
                        if (beData.DateTo_AD.Value <= beData.DateFrom_AD.Value)
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Cannot Enter Same Date or Less then Date From";
                            return resVal;
                        }
                    }
                    else
                    {
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "Valid";
                    }

                }
                resVal = db.SaveSMColl(_UserId, dataColl);
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
