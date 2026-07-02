app.controller('DischargeSlipController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'DischargeSlip ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();
		
		$scope.SearchPatientId = 0;
		$scope.currentPages = {
			DischargeSlip: 1,
		};

		$scope.searchData = {
			DischargeSlip: '',
		};

		$scope.perPage = {
			DischargeSlip: GlobalServices.getPerPageRow(),
		};

	
		$scope.newDet = {
			DischargeSlipId: null,
			DischargeSlipNo: '',
			PatientId: '',
			DichargeSlipDate_TMP: new Date(),
			FinalDiagnosis: '',
			DischargeStatus: '',
			History: '',
			ExaminationFindingOnAdmission: '',
			CourseInHospital: '',
			ConditionAtTheTimeOfDischarge: '',
			NextFollowupDate_TMP: '',
			NextFollowupTime: '',
			Advice: '',
			Recommendation: '',
			Medications: '',
			PreparedBy: '',
			ApprovedBy: '',
			InvestigationColl: [],
			Mode: 'Save'
		};
		$scope.newDet.InvestigationColl.push({});		
	}

	
	$scope.ClearFields = function () {
		$scope.newDet = {
			DischargeSlipId: null,
			DischargeSlipNo: '',
			PatientId: '',
			DichargeSlipDate_TMP: new Date(),
			FinalDiagnosis: '',
			DischargeStatus: '',
			History: '',
			ExaminationFindingOnAdmission: '',
			CourseInHospital: '',
			ConditionAtTheTimeOfDischarge: '',
			NextFollowupDate_TMP: '',
			NextFollowupTime: '',
			Advice: '',
			Recommendation: '',
			Medications: '',
			PreparedBy: '',
			ApprovedBy: '',
			InvestigationColl: [],
			Mode: 'Save'
		};
		$scope.newDet.InvestigationColl.push({});
		
	}


	$scope.AddInvestigation = function (ind) {
		if ($scope.newDet.InvestigationColl) {
			if ($scope.newDet.InvestigationColl.length > ind + 1) {
				$scope.newDet.InvestigationColl.splice(ind + 1, 0, {
					Remarks: ''
				})
			} else {
				$scope.newDet.InvestigationColl.push({
					Remarks: ''
				})
			}
		}
	};

	$scope.delInvestigation = function (ind) {
		if ($scope.newDet.InvestigationColl) {
			if ($scope.newDet.InvestigationColl.length > 1) {
				$scope.newDet.InvestigationColl.splice(ind, 1);
			}
		}
	};
	//************************* DischargeSlip *********************************
	$scope.IsValidDischargeSlip = function () {
		if ($scope.newDet.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateDischargeSlip = function () {
		if ($scope.IsValidDischargeSlip() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateDischargeSlip();
					}
				});
			} else
				$scope.CallSaveUpdateDischargeSlip();
		}
	};

	$scope.CallSaveUpdateDischargeSlip = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newDet.NextFollowupDateTimeDet)
			$scope.newDet.NextFollowupDateTime = $filter('date')(new Date($scope.newDet.NextFollowupDateTimeDet.dateAD), 'yyyy-MM-dd');
		else
			$scope.newDet.NextFollowupDateTime = null;

		if ($scope.newDet.NextFollowupTime_TMP)
			$scope.newDet.NextFollowupTime = $filter('date')(new Date($scope.newDet.NextFollowupTime_TMP), 'HH:mm');
		else
			$scope.newDet.NextFollowupTime = '';

		if ($scope.newDet.NextFollowupDateTime && $scope.newDet.NextFollowupTime.length > 0)
			$scope.newDet.NextFollowupDateTime = $scope.newDet.NextFollowupDateTime + " " + $scope.newDet.NextFollowupTime;


		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/SaveDischargeSlip",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.lastTranId = res.data.Data.RId;
				$scope.Print();
				$scope.ClearFields();
				//$scope.GetAllDischargeSlip();
			}

			 
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllDischargeSlip = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DischargeSlipList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Creation/GetAllDischargeSlip",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DischargeSlipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetDischargeSlipById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DischargeSlipId: refData.DischargeSlipId
		};
		$http({
			method: 'POST',
			url: base_url + "Service/Creation/getDischargeSlipById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$scope.newDet.Mode = 'Modify';
				document.getElementById('DischargeSlip-section').style.display = "none";
				document.getElementById('DischargeSlip-form').style.display = "block";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelDischargeSlipById = function (refData) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					DischargeSlipId: refData.DischargeSlipId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Creation/DeleteDischargeSlip",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllDischargeSlip();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.getPatientDet = function () {

		if ($scope.SearchPatientId == 0)
			return;

		$timeout(function () {
			var para = {
				PatientId: $scope.SearchPatientId
			};
			$scope.loadingstatus = "running";
			showPleaseWait();

			$http({
				method: 'POST',
				url: base_url + "Inventory/Transaction/GetPatientForDS",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();

				if (res.data.IsSuccess && res.data.Data) {
					$scope.newDet = res.data.Data;
					$scope.newDet.DichargeSlipDate_TMP = new Date();
					$scope.newDet.Mode = 'Save';
					   
				} else {
					alert(res.data.ResponseMSG);
				}
			}, function (reason) {
				alert('Failed' + reason);
			});
		});

	}
	$scope.Print = function () {
		if ($scope.lastTranId > 0) {
			var TranId = $scope.lastTranId;
			 

			$http({
				method: 'GET',
				url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=true",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					var templatesColl = res.data.Data;
					if (templatesColl && templatesColl.length > 0) {
						var templatesName = [];
						var sno = 1;
						angular.forEach(templatesColl, function (tc) {
							templatesName.push(sno + '-' + tc.ReportName);
							sno++;
						});

						var printDone = false;

						var rptTranId = 0;
						if (templatesColl.length == 1)
							rptTranId = templatesColl[0].RptTranId;
						else {
							Swal.fire({
								title: 'Report Templates For Print',
								input: 'select',
								inputOptions: templatesName,
								inputPlaceholder: 'Select a template',
								showCancelButton: true,
								inputValidator: (value) => {
									return new Promise((resolve) => {
										if (value >= 0) {
											resolve()
											rptTranId = templatesColl[value].RptTranId;

											printDone = true;
											if (rptTranId > 0) {

												document.body.style.cursor = 'wait';
												document.getElementById("frmRpt").src = '';
												document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
												document.body.style.cursor = 'default';
												$('#FrmPrintReport').modal('show');

												 
											}
										} else {
											resolve('You need to select:)')
										}
									})
								}
							})
						}

						if (rptTranId > 0) {
							 
							document.body.style.cursor = 'wait';
							document.getElementById("frmRpt").src = '';
							document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
							document.body.style.cursor = 'default';
							$('#FrmPrintReport').modal('show');

						}

					} else
						Swal.fire('No Templates found for print');
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});



		}
	};
	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.ValidLedAllocationColl = [];
	$scope.IsValidTran = function () {
		$scope.ValidLedAllocationColl = [];
		if ($scope.IsValidData() == true) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			$http({
				method: 'POST',
				url: base_url + "Global/IsValidVoucher",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("EntityId", EntityId);
					formData.append("jsonData", angular.toJson(data.jsonData));
					return formData;
				},
				data: { jsonData: $scope.GetData() }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res.data.IsSuccess == true) {
					if (res.data.Data && res.data.Data.length > 0) {
						$scope.ValidLedAllocationColl = JSON.parse(res.data.Data);
						$('#frmMDLLedAllocation').modal('show');
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
			});

		}
	}

});