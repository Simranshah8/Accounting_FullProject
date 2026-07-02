using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessLogic.Finance
{
    public class LoanReSchedule : ISaveModifyDelete<Dynamic.BusinessEntity.Finance.LoanCreation>, IDataLoading<Dynamic.BusinessEntity.Finance.LoanCreation>, IGetDataByRow<Dynamic.BusinessEntity.Finance.LoanCreation>
    {
        Dynamic.DataAccess.Finance.LoanReScheduleDB db = new DataAccess.Finance.LoanReScheduleDB();

       public ResponeValues SaveFormData(Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            return db.SaveUpdate(beData, false);
        }
        public ResponeValues ModifyFormData(Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            return db.SaveUpdate(beData, true);
        }
        public ResponeValues DeleteFormData(Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            return db.Delete(beData.ReScheduleId);
        }
        public System.Collections.Generic.IEnumerable<Dynamic.BusinessEntity.Finance.LoanCreation> getAll(int UserId)
        {
            return db.getAllLoanCreation();
        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getDataByRowNumber(long rowNum)
        {
            return db.getCostCenterByRowNumber(rowNum);
        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getDataOfLastRow(ref long count)
        {
            return db.getLastRowData(ref count);
        }

        public void getJournalDetails(BaseDate baseDate, ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            db.getLoanDetailsByTranId(baseDate, ref beData);
        }
        public bool CanModifyOrDeleteLoanCreation(int TranId)
        {
            return db.CanModifyOrDeleteLoanCreation(TranId);
        }
        public Dynamic.BusinessEntity.Finance.LoanCreation getLoanDetailsForReGenerate(int LedgerId)
        {
            return db.getLoanDetailsForReGenerate(LedgerId);
        }
        public System.Collections.Generic.List<int> GetAllLoanPartyId()
        {
            return db.GetAllLoanPartyId();
        }
        public void getRebatePenaltyDetails(ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {
            db.getRebatePenaltyDetails(ref beData);
        }
    }
}
