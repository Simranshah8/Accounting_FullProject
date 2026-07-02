app.controller('DischargeSlipPrintController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'DischargeSlipPrint ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.newDetDischargePrint = {
			TranId: null,
			PatientId: null,
			PatientName: '',
			AgeSex: '',
			Department: '',
			Address: '',
			Ward: '',
			BedNo: null,
			GuardianName: '',
			Relation: '',
			PhoneNo: '',
			DateAdmission: null,


			DischargeSlipNo: 0,
			PatientName: '',
			AgeSex: '',
			Department: '',
			Address: '',
			Ward: '',
			BedNo: null,
			GuardianName: '',
			Relation: '',
			PhoneNo: '',
			DateAdmission: null,
			PatientId: '',
			DichargeSlipDateTMP: new Date(),
			FinalDiagnosis: '',
			DischargeStatus: '',
			History: '',
			ExaminationAdmission: '',
			CourseInHospital: '',
			ConditionTimeDischarge: '',
			NextFollowupDate_TMP: '',
			NextFollowupTime: '',
			Advice: '',
			Recommendation: '',
			Medications: '',
			PreparedBy: '',
			CheckedBy: '',
			ApprovedBy: '',
			InvestigationDetailsColl: [],
			MedicationDetailsColl: [],
			Mode: null
		};

		if (TranID && TranID) {
			var prt = {
				TranId: TranID
			}
			$scope.GetDischargeSlipPrint(prt);
		}

		$scope.getCompanyDetail();
	}
		





	//************************* DischargeSlipPRint *********************************
	

	$scope.GetDischargeSlipPrint = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "Hospital/Transaction/getDischargeSlipPrint",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
		 

				$scope.newDetDischargePrint = res.data.Data;
				$scope.newDetDischargePrint.Mode = 'Back To Discharge Slip';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.getCompanyDetail = function () {
		GlobalServices.getCompanyDet().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.comDet = res.data.Data;
				$scope.CompanyDetail = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.Print = function () {
		$('#admitcard').printThis();
	}


});