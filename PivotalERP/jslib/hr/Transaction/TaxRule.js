app.controller('TaxRuleController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Tax Rule';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();

		$scope.ResidentTypeList = [{ id: 1, text: 'Resident' }, { id: 2, text: 'Non-Resident' }];
		$scope.TaxTypeList = [{ id: 1, text: 'Normal' }, { id: 2, text: 'SSF' }];
		$scope.FPayHeadingList = [{ id: 1, text: 'Normal' }, { id: 2, text: 'SSF' }];
		$scope.TaxForList = [{ id: 1, text: 'Individual' }, { id: 2, text: 'Couple' }];

		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeading",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = res.data.Data;
				dtColl.forEach(function (dt) {
					if (dt.IsActive === true && (dt.PayheadType === 4 || dt.PayheadType === 6)) {
						$scope.PayHeadingList.push(dt);
					}
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newNormal = {
			TranId: null,
			TaxFor: 1,
			ReceidentTypeId: null,
			MinValue: 0,
			MaxValue: 0,
			Rate: 0,
			DisplayValue: null,
			PayHeadingId: null,
			NITaxDetailsColl: [],
			NCTaxDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newNormal.NITaxDetailsColl.push({});
		$scope.newNormal.NCTaxDetailsColl.push({});

		$scope.newSSF = {
			SSFId: null,
			TaxFor: 1,
			SNo: null,
			MinAmount: 0,
			MaxAmount: 0,
			Rate: '',
			ITaxDetailsColl: [],
			CTaxDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newSSF.ITaxDetailsColl.push({});
		$scope.newSSF.CTaxDetailsColl.push({});

		$scope.newExemption = {
			TranId: 0,
			TaxTypeId: null,
			LIAmount: 0,
			LIPayHeadingId: null,
			HIAmount: 0,
			HIPayHeadingId: null,
			FARAte: 0,
			FAAmount: 0,
			FAHeadingId: null,
			PIPRAte: 0,
			PIPAmount: 0,
			PensionPayHeadingId: null,
			Mode: 'Save'
		};

		$scope.GetAllTaxRule();
		$scope.GetAllTaxRulessf();

	}
	$scope.ClearNormal = function () {
		$scope.newNormal = {
			NormalId: null,
			TaxFor: 1,
			SNo: null,
			MinAmount: null,
			MaxAmount: null,
			Rate: '',
			NITaxDetailsColl: [],
			NCTaxDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newNormal.NITaxDetailsColl.push({});
		$scope.newNormal.NCTaxDetailsColl.push({});
	}

	$scope.ClearSSF = function () {
		$scope.newSSF = {
			SSFId: null,
			TaxFor: 1,
			SNo: null,
			MinAmount: null,
			MaxAmount: null,
			Rate: '',
			ITaxDetailsColl: [],
			CTaxDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newSSF.ITaxDetailsColl.push({});
		$scope.newSSF.CTaxDetailsColl.push({});
	}

	$scope.ClearExemption = function () {
		$scope.newExemption = {
			TranId: 0,
			TaxTypeId: null,
			LIAmount: 0,
			LIPayHeadingId: null,
			HIAmount: 0,
			HIPayHeadingId: null,
			FARAte: 0,
			FAAmount: 0,
			FAHeadingId: null,
			PIPRAte: 0,
			PIPAmount: 0,
			PensionPayHeadingId: null,
			Mode: 'Save'
		};
	}


	//*************************Normal *********************************
	$scope.AddNITaxDetails = function (ind) {
		if ($scope.newNormal.NITaxDetailsColl) {
			if ($scope.newNormal.NITaxDetailsColl.length > ind + 1) {
				$scope.newNormal.NITaxDetailsColl.splice(ind + 1, 0, {
					Rate: ''
				})
			} else {
				$scope.newNormal.NITaxDetailsColl.push({
					Rate: ''
				})
			}
		}
	};
	$scope.delNITaxDetails = function (ind) {
		if ($scope.newNormal.NITaxDetailsColl) {
			if ($scope.newNormal.NITaxDetailsColl.length > 1) {
				$scope.newNormal.NITaxDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.AddNCTaxDetails = function (ind) {
		if ($scope.newNormal.NCTaxDetailsColl) {
			if ($scope.newNormal.NCTaxDetailsColl.length > ind + 1) {
				$scope.newNormal.NCTaxDetailsColl.splice(ind + 1, 0, {
					Rate: ''
				})
			} else {
				$scope.newNormal.NCTaxDetailsColl.push({
					Rate: ''
				})
			}
		}
	};
	$scope.delNCTaxDetails = function (ind) {
		if ($scope.newNormal.NCTaxDetailsColl) {
			if ($scope.newNormal.NCTaxDetailsColl.length > 1) {
				$scope.newNormal.NCTaxDetailsColl.splice(ind, 1);
			}
		}
	};


	$scope.SaveUpdateNormal = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dataToSave = [];
		function processNITaxDetailsColl() {
			var niDataArray = [];
			for (var i = 0; i < $scope.newNormal.NITaxDetailsColl.length; i++) {
				var S = $scope.newNormal.NITaxDetailsColl[i];
				var taxRuleId = S.TaxRuleId;
				var minValue = S.MinValue;
				var maxValue = S.MaxValue;
				var rate = S.Rate;
				var displayValue = S.DisplayValue;
				var payHeadingId = S.PayHeadingId;
				var dataItem = {
					TaxType: 1,
					TaxFor: $scope.newNormal.TaxFor,
					CalculationFor: 1,
					TaxRuleId: taxRuleId,
					MinValue: minValue,
					MaxValue: maxValue,
					Rate: rate,
					DisplayValue: displayValue,
					PayHeadingId: payHeadingId
				};
				niDataArray.push(dataItem);
			}
			return niDataArray;
		}

		function processNCTaxDetailsColl() {
			var ncDataArray = [];
			for (var j = 0; j < $scope.newNormal.NCTaxDetailsColl.length; j++) {
				var T = $scope.newNormal.NCTaxDetailsColl[j];
				var taxRuleId = T.TaxRuleId;
				var minValue = T.MinValue;
				var maxValue = T.MaxValue;
				var rate = T.Rate;
				var displayValue = T.DisplayValue;
				var payHeadingId = T.PayHeadingId;

				var dataItem = {
					TaxType: 1,
					TaxFor: $scope.newNormal.TaxFor,
					CalculationFor: 2,
					TaxRuleId: taxRuleId,
					MinValue: minValue,
					MaxValue: maxValue,
					Rate: rate,
					DisplayValue: displayValue,
					PayHeadingId: payHeadingId
				};
				ncDataArray.push(dataItem);
			}

			return ncDataArray;
		}

		var niDataArray = processNITaxDetailsColl();
		dataToSave = dataToSave.concat(niDataArray);

		var ncDataArray = processNCTaxDetailsColl();
		dataToSave = dataToSave.concat(ncDataArray);

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveTaxRule",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: dataToSave }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetAllTaxRule();
				/*$scope.ClearNormal();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.GetAllTaxRule = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newNormal.NITaxDetailsColl = [];
		$scope.newNormal.NCTaxDetailsColl = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllTaxRule?TaxFor=" + $scope.newNormal.TaxFor,
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				for (var i = 0; i < res.data.Data.length; i++) {
					var taxRule = res.data.Data[i];
					if (taxRule.TaxType === 1 && taxRule.CalculationFor === 1) {
						$scope.newNormal.NITaxDetailsColl.push(taxRule);
					} else if (taxRule.TaxType === 1 && taxRule.CalculationFor === 2) {
						$scope.newNormal.NCTaxDetailsColl.push(taxRule);
					}
				}
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

			if (!$scope.newNormal.NITaxDetailsColl || $scope.newNormal.NITaxDetailsColl.length == 0) {
				$scope.newNormal.NITaxDetailsColl = [];
				$scope.newNormal.NITaxDetailsColl.push({});
			}
			if (!$scope.newNormal.NCTaxDetailsColl || $scope.newNormal.NCTaxDetailsColl.length == 0) {
				$scope.newNormal.NCTaxDetailsColl = [];
				$scope.newNormal.NCTaxDetailsColl.push({});
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	//************************* SSF *********************************
	$scope.AddITaxDetails = function (ind) {
		if ($scope.newSSF.ITaxDetailsColl) {
			if ($scope.newSSF.ITaxDetailsColl.length > ind + 1) {
				$scope.newSSF.ITaxDetailsColl.splice(ind + 1, 0, {
					Rate: ''
				})
			} else {
				$scope.newSSF.ITaxDetailsColl.push({
					Rate: ''
				})
			}
		}
	};
	$scope.delITaxDetails = function (ind) {
		if ($scope.newSSF.ITaxDetailsColl) {
			if ($scope.newSSF.ITaxDetailsColl.length > 1) {
				$scope.newSSF.ITaxDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.AddCTaxDetails = function (ind) {
		if ($scope.newSSF.CTaxDetailsColl) {
			if ($scope.newSSF.CTaxDetailsColl.length > ind + 1) {
				$scope.newSSF.CTaxDetailsColl.splice(ind + 1, 0, {
					Rate: ''
				})
			} else {
				$scope.newSSF.CTaxDetailsColl.push({
					Rate: ''
				})
			}
		}
	};
	$scope.delCTaxDetails = function (ind) {
		if ($scope.newSSF.CTaxDetailsColl) {
			if ($scope.newSSF.CTaxDetailsColl.length > 1) {
				$scope.newSSF.CTaxDetailsColl.splice(ind, 1);
			}
		}
	};



	$scope.SaveUpdateSSF = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dataToSave = [];
		function processSSFITaxDetailsColl() {
			var ssfiDataArray = [];
			for (var i = 0; i < $scope.newSSF.ITaxDetailsColl.length; i++) {
				var S = $scope.newSSF.ITaxDetailsColl[i];
				var taxRuleId = S.TaxRuleId;
				var minValue = S.MinValue;
				var maxValue = S.MaxValue;
				var rate = S.Rate;
				var displayValue = S.DisplayValue;
				var payHeadingId = S.PayHeadingId;
				var dataItem = {
					TaxType: 2,
					TaxFor: $scope.newSSF.TaxFor,
					CalculationFor: 1,
					TaxRuleId: taxRuleId,
					MinValue: minValue,
					MaxValue: maxValue,
					Rate: rate,
					DisplayValue: displayValue,
					PayHeadingId: payHeadingId
				};
				ssfiDataArray.push(dataItem);
			}
			return ssfiDataArray;
		}

		function processSSFCTaxDetailsColl() {
			var ssfcDataArray = [];
			for (var j = 0; j < $scope.newSSF.CTaxDetailsColl.length; j++) {
				var T = $scope.newSSF.CTaxDetailsColl[j];
				var taxRuleId = T.TaxRuleId;
				var minValue = T.MinValue;
				var maxValue = T.MaxValue;
				var rate = T.Rate;
				var displayValue = T.DisplayValue;
				var payHeadingId = T.PayHeadingId;

				var dataItem = {
					TaxType: 2,
					TaxFor: $scope.newSSF.TaxFor,
					CalculationFor: 2,
					TaxRuleId: taxRuleId,
					MinValue: minValue,
					MaxValue: maxValue,
					Rate: rate,
					DisplayValue: displayValue,
					PayHeadingId: payHeadingId
				};
				ssfcDataArray.push(dataItem);
			}

			return ssfcDataArray;
		}

		var ssfiDataArray = processSSFITaxDetailsColl();
		dataToSave = dataToSave.concat(ssfiDataArray);

		var ssfcDataArray = processSSFCTaxDetailsColl();
		dataToSave = dataToSave.concat(ssfcDataArray);

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveTaxRule",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: dataToSave }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetAllTaxRulessf();
				/*$scope.ClearSSF();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}



	$scope.GetAllTaxRulessf = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newSSF.ITaxDetailsColl = [];
		$scope.newSSF.CTaxDetailsColl = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllTaxRule?TaxFor=" + $scope.newSSF.TaxFor,
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				for (var i = 0; i < res.data.Data.length; i++) {
					var taxRule = res.data.Data[i];
					if (taxRule.TaxType === 2 && taxRule.CalculationFor === 1) {
						$scope.newSSF.ITaxDetailsColl.push(taxRule);
					} else if (taxRule.TaxType === 2 && taxRule.CalculationFor === 2) {
						$scope.newSSF.CTaxDetailsColl.push(taxRule);
					}
				}
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

			if (!$scope.newSSF.ITaxDetailsColl || $scope.newSSF.ITaxDetailsColl.length == 0) {
				$scope.newSSF.ITaxDetailsColl = [];
				$scope.newSSF.ITaxDetailsColl.push({});
			}
			if (!$scope.newSSF.CTaxDetailsColl || $scope.newSSF.CTaxDetailsColl.length == 0) {
				$scope.newSSF.CTaxDetailsColl = [];
				$scope.newSSF.CTaxDetailsColl.push({});
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});