app.controller('budgetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Target ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		/*$scope.Monthlist = GlobalServices.getMonthList();*/
		$scope.DateTypeList = [{ id: 1, text: 'AD' }, { id: 2, text: 'BS' }];
		$scope.TypeColl = [{ id: 1, text: 'Monthly' }];
		 
		$scope.BS_MonthColl = [{ id: 4, text: 'सावन' }, { id: 5, text: 'भदौ' }, { id: 6, text: 'असोज' }, { id: 7, text: 'कार्तिक' }, { id: 8, text: 'मंसिर' }, { id: 9, text: 'पौष' }, { id: 10, text: 'माघ' }, { id: 11, text: 'फागुन' }, { id: 12, text: 'चैत' }, { id: 1, text: 'बैशाख' }, { id: 2, text: 'जेठ' }, { id: 3, text: 'असार' }];
		$scope.AD_MonthColl = [{ id: 4, text: 'April' }, { id: 5, text: 'May' }, { id: 6, text: 'June' }, { id: 7, text: 'July' }, { id: 8, text: 'August' }, { id: 9, text: 'September' }, { id: 10, text: 'October' }, { id: 11, text: 'November' }, { id: 12, text: 'December' }, { id: 1, text: 'January' }, { id: 2, text: 'February' }, { id: 3, text: 'March' }];

		$scope.BudgetTypeColl = [{ id: 1, text: 'GroupWise' }, { id: 2, text: 'LedgerWise' }];

		//$scope.LedgerGroupColl = [];
		//$http({
		//	method: 'GET',
		//	url: base_url + "Account/Creation/GetLedgerGroupForBudget",
		//	dataType: "json" 
		//}).then(function (res) {
			 
		//	if (res.data.IsSuccess && res.data.Data) {
		//		$scope.LedgerGroupColl = res.data.Data;
		//	}
		//}, function (reason) {
		//	alert('Failed' + reason);
		//});

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.CostClassColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res1) {
			if (res1.data.IsSuccess && res1.data.Data) {
				$scope.CostClassColl = res1.data.Data;				 
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newMonthly = {
			DateType: 2,
			BudgetType:2,
		};

		$scope.newSalesmanWise = {
			DateType: 2,
			BudgetType: 2,
		};


		$scope.newYearly = {
			DateType: 2,
			BudgetType: 2,
		};
		$scope.searchData = {
			Monthly: '',
			SalesmanWise: '',
			Yearly:''
		};
		 
	}
	 
	//************************* Normal Tab Starts *********************************
	$scope.GetMonthlyTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.MonthlyTargetColl = [];
		var para = {
			DateType: $scope.newMonthly.DateType,
			CostClassId: $scope.newMonthly.CostClassId,
			BranchId: $scope.newMonthly.BranchId,
			MonthId: $scope.newMonthly.MonthId,
			BudgetType: $scope.newMonthly.BudgetType,
			LedgerGroupId: null,
			LedgerId:null,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBudget",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.MonthlyTargetColl = res.data.Data;
				$scope.MonthlyQtyChange();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.MonthlyQtyChange = function (curRow) {
	 
		$scope.newMonthly.TotalAmount = 0;

		var   amt = 0;
		angular.forEach($scope.MonthlyTargetColl, function (mt) {
			 
			amt += mt.Amount;
		});

	 
		$scope.newMonthly.TotalAmount = amt;

	}

	function ToRound(val) {
		val = isEmptyAmt(val);
		return ($filter('number')(val, 2)).parseDBL();
	}
	$scope.ChangeTotalAmt = function (curRow) {
		curRow.MonthColl.forEach(function (m) {
			m.Amount = 0;
		});

		var perMonth =ToRound(curRow.Amount / curRow.MonthColl.length);
		curRow.MonthColl.forEach(function (m) {
			m.Amount = perMonth;
		});

		curRow.TotalAmount = curRow.Amount;
    }

	$scope.SaveSalesmanTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
 
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBudget",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.MonthlyTargetColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				/*    $scope.GetAllAssignCustomer();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

 
	//************************* ProductTypeWise Tab Starts *********************************


	$scope.GetYearlyTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.YearlyTargetColl = [];
		var para = { 
			DateType: $scope.newYearly.DateType,
			CostClassId: $scope.newYearly.CostClassId,
			BranchId: $scope.newYearly.BranchId,
			MonthId: 0,
			BudgetType: $scope.newYearly.BudgetType,
			LedgerGroupId: null,
			LedgerId: null,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBudget",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = mx(res.data.Data);
				var groupQry = dtColl.groupBy(p1 => ({ LedgerGroupId: p1.LedgerGroupId, LedgerId: p1.LedgerId }) );
				var monthColl = $scope.newYearly.DateType == 1 ? $scope.AD_MonthColl : $scope.BS_MonthColl;
				$scope.newYearly.MonthColl = monthColl;

				angular.forEach(groupQry, function (q) {
					var chColl = mx(q.elements);
					var fst = q.elements[0];

					var newData = {
						GroupName: fst.GroupName,
						Name: fst.Name,
						Code:fst.Code,
						CostClassId: fst.CostClassId,
						DateType: fst.DateType,					 
						BudgetType: fst.BudgetType,
						BranchId: fst.BranchId,
						LedgerGroupId: q.key.LedgerGroupId,
						LedgerId: q.key.LedgerId,
						Amount:ToRound(mx(q.elements).sum(p1=>p1.Amount),2),
						TotalAmount: ToRound(mx(q.elements).sum(p1 => p1.Amount), 2),
						CanBlock:fst.CanBlock,
						MonthColl:[],
					};
					monthColl.forEach(function (mn) {

						var find = chColl.firstOrDefault(p1 => p1.MonthId == mn.id);

						newData.MonthColl.push({
							GroupName: fst.GroupName,
							Name: fst.Name,
							Code: fst.Code,
							CostClassId: fst.CostClassId,
							DateType: fst.DateType,							 
							BudgetType: fst.BudgetType,
							BranchId: fst.BranchId,
							LedgerGroupId: q.key.LedgerGroupId,
							LedgerId: q.key.LedgerId,
							MonthId: mn.id,
							MonthName: mn.text,							 
							Amount: find ? find.Amount : 0,
							CanBlock:fst.CanBlock
						});
					});
					$scope.YearlyTargetColl.push(newData);
				});

				$scope.YearlyQtyChange();
				

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.YearlyQtyChange = function (curRow) {
		 
		$scope.newYearly.TotalAmount = 0;
		$scope.newYearly.Amount = 0;
		$scope.newYearly.MonthColl.forEach(function (mn) {
 
			mn.TotalAmount = 0;
		});

		angular.forEach($scope.YearlyTargetColl, function (yt) {

			var   amt = 0;
			var ind = 0;
			angular.forEach(yt.MonthColl, function (mn) {
			 
				amt += mn.Amount; 
				$scope.newYearly.MonthColl[ind].TotalAmount =ToRound($scope.newYearly.MonthColl[ind].TotalAmount + mn.Amount,2);
				ind++;
			}); 
			yt.TotalAmount =ToRound(amt,2);
			yt.Amount = ToRound(amt,2);
			$scope.newYearly.TotalAmount = ToRound($scope.newYearly.TotalAmount + amt,2);
			$scope.newYearly.Amount = ToRound($scope.newYearly.Amount + amt,2);
		});
		 

	}

	$scope.SaveYearlyTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var dataColl = [];

		angular.forEach($scope.YearlyTargetColl, function (yt) {
			angular.forEach(yt.MonthColl, function (mc) {
				mc.CanBlock = yt.CanBlock;
				if (mc.Amount > 0) {
					mc.Amount = ToRound(mc.Amount, 3);					
					dataColl.push(mc);
                }
			});
		});

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBudget",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: dataColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				/*    $scope.GetAllAssignCustomer();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}
  


	$scope.MulData = null;
	$scope.MulObj = {};
	$scope.ShowMultipleModal = function () {

		if ($scope.MulData == null) {

			$http({
				method: 'GET',
				url: base_url + "Setup/Security/GetEntityProp?EntityId=" + EntityId,
				dataType: "json"
			}).then(function (res1) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				$timeout(function () {
					if (res1.data.IsSuccess && res1.data.PropertiesColl) {
						$scope.MulData = {};
						$scope.MulData.ColColl = [];
						$scope.MulData.DataColl = [];
						$scope.MulObj = res1.data.Obj;
						angular.forEach(res1.data.PropertiesColl, function (pc) {
							$scope.MulData.ColColl.push({
								id: pc.Id,
								label: pc.Name,
								name: pc.PropertyName,
								dataType: pc.DataType,
							});
						});
						var newObj = angular.copy($scope.MulObj);
						$scope.MulData.DataColl.push(newObj);
						$('#frmImportMultipleCopy').modal('show');
					}
					else {
						Swal.fire(res1.data.ResponseMSG);
					}

				});
			
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
		else {
			$scope.MulData.DataColl = [];
			$scope.MulData.Title = 'Create Multiple Route';
			//$scope.MulData.ColColl = [{ id: 1, label: 'Name', name: 'Name' }, { id: 2, label: 'Alias', name: 'Alias' }, { id: 3, label: 'Code', name: 'Code' }, { id: 4, label: 'Salesman Code', name: 'AgentCode' }];
			$scope.MulData.DataColl.push({});
			$('#frmImportMultipleCopy').modal('show');
		}

	}

	$(document).ready(function () {
		$('input.disablecopypaste').bind('paste', function (e) {
			e.preventDefault();
		});
	});

	$scope.PasteData = function (colName, ind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText) {
			var startInd = ind;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {

					if ($scope.MulData.DataColl.length < (startInd + 1)) {
						var newObj = angular.copy($scope.MulObj);
						$scope.MulData.DataColl.push(newObj);
					}

					$scope.MulData.DataColl[startInd][colName] = line.trim();
					startInd++;
				}
			});
		}

	}

	$scope.addRowInMD = function (ind) {
		var newObj = angular.copy($scope.MulObj);
		$scope.MulData.DataColl.splice(ind + 1, 0, newObj);
	};
	$scope.delRowInMD = function (ind) {
		$scope.MulData.DataColl.splice(ind, 1);
	};
	$scope.SaveMultipleData = function () {
		if ($scope.MulData) {
			if ($scope.MulData.DataColl) {

				$scope.loadingstatus = "running";
				showPleaseWait();

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/SaveCopyPaste",
					headers: { 'content-Type': undefined },

					transformRequest: function (data) {
						var formData = new FormData();
						formData.append("entityId", EntityId);
						formData.append("jsonData", angular.toJson(data.jsonData));
						return formData;
					},
					data: { jsonData: $scope.MulData.DataColl }
				}).then(function (res1) {

					$scope.loadingstatus = "stop";
					hidePleaseWait();

					if (res1.data.IsSuccess == true && res1.data.Data) {
						$('#frmImportMultipleCopy').modal('hide');
					}
					else {
						Swal.fire(res1.data.ResponseMSG);
					}

				}, function (errormessage) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
				});


			}
		}
	}

});