app.controller('SalesmanTargetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Target ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		/*$scope.Monthlist = GlobalServices.getMonthList();*/
		$scope.DateTypeList = [{ id: 1, text: 'AD' }, { id: 2, text: 'BS' }];
		$scope.TypeColl = [{ id: 1, text: 'Monthly' }];
		
		$scope.BS_YearColl = [{ id: 2080, text: '2080' }, { id: 2081, text: '2081' }, { id: 2082, text: '2082' }, { id: 2083, text: '2083' }, { id: 2084, text: '2084' }, { id: 2085, text: '2085' }];
		$scope.AD_YearColl = [{ id: 2023, text: '2023' }, { id: 2024, text: '2024' }, { id: 2025, text: '2025' }, { id: 2026, text: '2026' }, { id: 2027, text: '2027' }, { id: 2028, text: '2028' }];

		$scope.BS_MonthColl = [{ id: 4, text: 'सावन' }, { id: 5, text: 'भदौ' }, { id: 6, text: 'असोज' }, { id: 7, text: 'कार्तिक' }, { id: 8, text: 'मंसिर' }, { id: 9, text: 'पौष' }, { id: 10, text: 'माघ' }, { id: 11, text: 'फागुन' }, { id: 12, text: 'चैत' }, { id: 1, text: 'बैशाख' }, { id: 2, text: 'जेठ' }, { id: 3, text: 'असार' }];
		$scope.AD_MonthColl = [{ id: 4, text: 'April' }, { id: 5, text: 'May' }, { id: 6, text: 'June' }, { id: 7, text: 'July' }, { id: 8, text: 'August' }, { id: 9, text: 'September' }, { id: 10, text: 'October' }, { id: 11, text: 'November' }, { id: 12, text: 'December' }, { id: 1, text: 'January' }, { id: 2, text: 'February' }, { id: 3, text: 'March' }];

		$scope.TargetTypeColl = [{ id: 1, text: 'Common' }, { id: 2, text: 'ProductGroup' }];

		$scope.ProductGroupColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllProductGroup",
			dataType: "json" 
		}).then(function (res) {
			 
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductGroupColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.SalesManList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllSalesMan",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = res.data.Data;
				angular.forEach(dtColl, function (dc) {
					if (dc.LevelId == 1) {
						$scope.SalesManList.push(dc);
					}
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newMonthly = {
			DateType: 1,
			TargetType:1,
		};

		$scope.newSalesmanWise = {
			DateType: 1,
			TargetType: 1,
		};


		$scope.newYearly = {
			DateType: 1,
			TargetType: 1,
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
			YearId: $scope.newMonthly.YearId,
			MonthId: $scope.newMonthly.MonthId,
			TargetType: $scope.newMonthly.TargetType,
			ProductGroupId: $scope.newMonthly.ProductGroupId,
			AgentId:null,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetSalesmanTarget",
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
		$scope.newMonthly.TotalQty = 0;
		$scope.newMonthly.TotalAmount = 0;

		var qty = 0, amt = 0;
		angular.forEach($scope.MonthlyTargetColl, function (mt) {
			qty += mt.Qty;
			amt += mt.Amount;
		});

		$scope.newMonthly.TotalQty = qty;
		$scope.newMonthly.TotalAmount = amt;

    }

	$scope.SaveSalesmanTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
 
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveSalesmanTarget",
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
			YearId: $scope.newYearly.YearId,
			MonthId: 0,
			TargetType: $scope.newYearly.TargetType,
			ProductGroupId: $scope.newYearly.ProductGroupId,
			AgentId: 0,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetSalesmanTarget",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = mx(res.data.Data);
				var groupQry = dtColl.groupBy(p1 => p1.AgentId);
				var monthColl = $scope.newYearly.DateType == 1 ? $scope.AD_MonthColl : $scope.BS_MonthColl;
				$scope.newYearly.MonthColl = monthColl;

				angular.forEach(groupQry, function (q) {
					var chColl = mx(q.elements);
					var fst = q.elements[0];

					var newData = {
						AgentId: fst.AgentId,
						Code: fst.Code,
						Name: fst.Name,
						MobileNo: fst.MobileNo,
						DistributorName: fst.DistributorName,
						ParentAgent: fst.ParentAgent,
						MonthColl:[],
					};
					monthColl.forEach(function (mn) {

						var find = chColl.firstOrDefault(p1 => p1.MonthId == mn.id);

						newData.MonthColl.push({
							AgentId: fst.AgentId,
							DateType: $scope.newYearly.DateType,
							YearId: $scope.newYearly.YearId,
							MonthId: mn.id,
							MonthName: mn.text,
							TargetType: $scope.newYearly.TargetType,
							ProductGroupId: $scope.newYearly.ProductGroupId,
							Qty: find ? find.Qty : 0,
							Amount: find ? find.Amount : 0
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
		$scope.newYearly.TotalQty = 0;
		$scope.newYearly.TotalAmount = 0;

		$scope.newYearly.MonthColl.forEach(function (mn) {
			mn.TotalQty = 0;
			mn.TotalAmount = 0;
		});

		angular.forEach($scope.YearlyTargetColl, function (yt) {

			var qty = 0, amt = 0;
			var ind = 0;
			angular.forEach(yt.MonthColl, function (mn) {
				qty += mn.Qty;
				amt += mn.Amount;
				$scope.newYearly.MonthColl[ind].TotalQty = $scope.newYearly.MonthColl[ind].TotalQty + mn.Qty;
				$scope.newYearly.MonthColl[ind].TotalAmount = $scope.newYearly.MonthColl[ind].TotalAmount + mn.Amount;
				ind++;
			});
			yt.TotalQty = qty;
			yt.TotalAmount = amt;

			$scope.newYearly.TotalQty = $scope.newYearly.TotalQty+qty;
			$scope.newYearly.TotalAmount = $scope.newYearly.TotalAmount+amt;
		});
		 

	}

	$scope.SaveYearlyTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var dataColl = [];

		angular.forEach($scope.YearlyTargetColl, function (yt) {
			angular.forEach(yt.MonthColl, function (mc) {
				if (mc.Qty > 0 || mc.Amount > 0) {
					dataColl.push(mc);
                }
			});
		});

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveSalesmanTarget",
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
 


	//************************* Salesman Wise Tab Starts *********************************

	$scope.GetSalesmanTarget = function ()
	{
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AgentTargetColl = [];
		var para = {
			DateType: $scope.newSalesmanWise.DateType,
			YearId: $scope.newSalesmanWise.YearId,
			MonthId:0,
			TargetType: $scope.newSalesmanWise.TargetType,
			ProductGroupId: $scope.newSalesmanWise.ProductGroupId,
			AgentId:$scope.newSalesmanWise.AgentId,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetSalesmanTarget",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl= mx(res.data.Data);

				var monthColl = $scope.newSalesmanWise.DateType == 1 ? $scope.AD_MonthColl : $scope.BS_MonthColl;
				monthColl.forEach(function (mn) {

					var find = dtColl.firstOrDefault(p1 => p1.MonthId == mn.id);

					$scope.AgentTargetColl.push({
						AgentId: $scope.newSalesmanWise.AgentId,
						DateType: $scope.newSalesmanWise.DateType,
						YearId: $scope.newSalesmanWise.YearId,
						MonthId: mn.id,
						MonthName:mn.text,
						TargetType: $scope.newSalesmanWise.TargetType,
						ProductGroupId: $scope.newSalesmanWise.ProductGroupId,
						Qty: find ? find.Qty : 0,
						Amount:find? find.Amount:0
					});
				});
				$scope.AgentQtyChange();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.AgentQtyChange = function (curRow) {
		$scope.newSalesmanWise.TotalQty = 0;
		$scope.newSalesmanWise.TotalAmount = 0;

		var qty = 0, amt = 0;
		angular.forEach($scope.AgentTargetColl, function (mt) {
			qty += mt.Qty;
			amt += mt.Amount;
		});

		$scope.newSalesmanWise.TotalQty = qty;
		$scope.newSalesmanWise.TotalAmount = amt;

	}

	$scope.SaveAgentWiseTarget = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveSalesmanTarget",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.AgentTargetColl }
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

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};


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