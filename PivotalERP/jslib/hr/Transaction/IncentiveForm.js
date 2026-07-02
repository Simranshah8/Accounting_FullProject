$(document).on('keyup', '.serial', function (e) {
	if (e.which == 13) {
		var $this = $(this);
		var $td = $this.closest('td');
		var $row = $td.closest('tr');
		var $rows = $row.parent();
		var column = $td.index();


		while ($td.length) {
			$row = $row.next('tr');
			if ($row.length == 0) {
				$row = $rows.children().first();
				column++;
			}

			$td = $row.children().eq(column);
			var $input = $td.find('.serial');
			if ($input.length) {
				$input.focus();
				break;
			}
		}

	}
});

app.controller('IncentiveSheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'IncentiveSheet';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();

		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ProductBrandList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllProductBrand",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductBrandList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadingForTran",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadingList = res.data.Data.filter(x => x.IsIncentive);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetBranchListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.currentPages = {
			IncentiveSheet: 1,
			IncentiveList: 1,
		};

		$scope.searchData = {
			IncentiveSheet: '',
			IncentiveList: '',
		};

		$scope.perPage = {
			IncentiveSheet: gSrv.getPerPageRow(),
			IncentiveList: gSrv.getPerPageRow(),
		};

		$scope.newFilter = {
			CompanyRelationshipId: null,
			BranchId: null,
			DepartmentId: null,
			ProductBrandId: null,
			IncentiveDate_TMP: new Date()
		};
		$scope.beData = {}


		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllTaxRule",
			dataType: "json"
		}).then(function (res) {
			$scope.TaxRuleColl = mx(res.data.Data);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		$scope.GetAllIncentiveList();
	}


	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.SaveIncentiveSheet = function () {

		Swal.fire({
			title: 'Do you want to save the current data?',
			showCancelButton: true,
			confirmButtonText: 'Save',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var dtColl = [];
				$scope.EmployeeListForIncentiveSheet.forEach(function (emp) {
					//In case of single data pass cl i.e. cl.PaYheadcoll
					emp.PayHeadColl.forEach(function (ph) {
						if (ph.Amount > 0 || ph.Amount < 0) {
							dtColl.push({
								UserId: emp.UserId,
								PayHeadingId: ph.PayHeadingId,
								Amount: ph.Amount,
								ProductBrandId: $scope.newFilter.ProductBrandId,
								IncentiveDate: new Date(($filter('date')($scope.newFilter.IncentiveDateDet.dateAD, 'yyyy-MM-dd'))),
								Netpayable: isEmptyAmt(emp.Netpayable),
								Remark: $scope.beData.Remark,
							});
						}
					})
				});
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/SaveIncentiveSheet",
					headers: { 'Content-Type': undefined },
					transformRequest: function (data) {
						var formData = new FormData();
						formData.append("jsonData", angular.toJson(data.jsonData));
						return formData;
					},
					data: { jsonData: dtColl }
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
		});


	}

	$scope.GetEmployeeForIncentiveSheet = function () {
		
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForIncentiveSheet = [];
		var incentiveDate = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
		if ($scope.newFilter.IncentiveDateDet)
			incentiveDate = new Date(($filter('date')($scope.newFilter.IncentiveDateDet.dateAD, 'yyyy-MM-dd')));

		var para = {
			CompanyRelationshipId: $scope.newFilter.CompanyRelationshipId,
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			ProductBrandId: $scope.newFilter.ProductBrandId,
			IncentiveDate: incentiveDate
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllIncentiveSheet",
			dataType: "json",
			data: JSON.stringify(para),
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData.Remark = res.data.Data[0].Remark;
				var dataColl = mx(res.data.Data);
				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));
				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);
					var beData = {
						UserId: fst.UserId,
						LevelId: fst.LevelId,
						LevelName: fst.LevelName,
						BranchId: fst.BranchId,
						CategoryId: fst.CategoryId,
						EmployeeId: fst.EmployeeId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						PayHeading: fst.PayHeading,
						IncentiveDate: fst.IncentiveDate,
						TaxRuleAs: fst.TaxRuleAs,
						Resident: fst.Resident,
						GenderId: fst.GenderId,
						MaritalStatus: fst.MaritalStatus,
						Netpayable: isEmptyAmt(fst.Netpayable),
						Remark: fst.Remark,
						PayHeadColl: [],
					};
					$scope.PayHeadingList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.PayHeadingId == pa.PayHeadingId);
						var allowEdit = (pa.CalculationType == 1 || pa.CalculationType == 2 || pa.CalculationType == 3) ? (find ? find.IsAllow : false) : false;
						beData.PayHeadColl.push({
							Name: pa.Name,
							Code: pa.Code,
							PayHeadingId: pa.PayHeadingId,
							Amount: find ? find.Amount : 0,
							IsAllow: find ? find.IsAllow : false,
							IsEditable: allowEdit,
							PayheadType: pa.PayheadType,
							Natures: pa.Natures,
							MonthId: pa.MonthId,
							CalculationType: pa.CalculationType,
							PayHeadGroupId: pa.PayHeadGroupId,
							PayHeadCategoryId: pa.PayHeadCategoryId,
							CalculationOnHeading: pa.CalculationOnHeading,
							SNo: pa.SNo,
							IsTaxable: pa.IsTaxable,
							Formula: pa.Formula,
							TaxRuleAs: pa.TaxRuleAs,
							PayHeadingDetailsColl: pa.PayHeadingDetailsColl,
							PayHeadingTaxExemptionColl: pa.PayHeadingTaxExemptionColl,
						});
					});
					$scope.CalculateTax(beData);
					$scope.EmployeeListForIncentiveSheet.push(beData);
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.ReCalculate = function () {

		if ($scope.EmployeeListForIncentiveSheet) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			$scope.EmployeeListForIncentiveSheet.forEach(function (emp) {
				$scope.CalculateNetPayable(emp);
			});

			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	};
	$scope.ReplaceFormula = function (curEmp) {
		angular.forEach(curEmp.PayHeadColl, function (ph) {

			if (ph.IsAllow == true) {
				if (ph.Formula && ph.Formula.length > 0) {

					var formula = ph.Formula;
					curEmp.PayHeadColl.forEach(function (cph) {
						if (cph.SNo > 0) {
							var sno = 'p' + cph.SNo + '#';
							var amt = isEmptyAmt(cph.Amount);
							formula = formula.replaceAll(sno, amt);
						}
					});

					try {
						var nVal = math.evaluate(formula);
						ph.Amount = isEmptyNum(nVal);
					} catch { }

				}
				else if ((ph.CalculationOnHeading == null || ph.CalculationOnHeading == 0) && ph.PayHeadingDetailsColl && ph.PayHeadingDetailsColl.length > 0) {

				}
			} else {
				ph.Amount = 0;
			}

		});
	}
	$scope.ChangeRate = function (emp, ph) {
		$scope.CalculateNetPayable(emp);
	};
	$scope.CalculateNetPayable = function (emp) {

		emp.Netpayable = emp.PayHeadColl
			.filter(x => x.IsAllow)
			.reduce((sum, x) => sum + (parseFloat(x.Amount) || 0), 0);

	};
	$scope.CalculateTax = function (emp) {

		var totalEarning = 0;
		var totalDeduction = 0;
		var taxExemptionAmt = 0;
		var taxExeptionAmtMax = 0;

		var taxableEarning = 0;
		emp.Earning = 0;
		emp.Deduction = 0;
		emp.NetPayaable = 0;

		var taxPayableAmt = 0;

		var totalSalary = 0;
		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.PayheadType == 1 && ph.IsAllow == true)
				totalSalary += ph.Amount;
		});

		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.IsAllow == true && ph.PayheadType != 1) {
				ph.Amount = isEmptyAmt(parseFloat(parseFloat(ph.Amount).toFixed(2)));

				if (isNaN(ph.Amount))
					ph.Amount = 0;

				//Earning=2
				if (ph.PayheadType == 2) {
					totalEarning += ph.Amount;

					if (ph.IsTaxable == true)
						taxableEarning += ph.Amount;
				}
				//Deduction=3
				else if (ph.PayheadType == 3) {
					totalDeduction += ph.Amount;

					if (ph.IsTaxable == true) {

						var amt = 0, rate = 0;
						var formula = '';
						angular.forEach(ph.PayHeadingTaxExemptionColl, function (rl) {
							if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							}
							else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							}
							else if (rl.Gender == emp.Gender) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							}
							else if (rl.MaritalStatus == emp.MaritalStatus) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							}
							else if (rl.Resident == emp.Resident) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
								amt = rl.Amount;
								rate = rl.Rate;
								formula = rl.Formula;
							}

						});

						var totalTaxDAmt = ph.Amount * 12;
						var amt1 = (totalSalary * 12) * rate / 100;

						var minVal = 0;
						if (rate > 0 && amt > 0) {

							if (amt1 > amt)
								minVal = amt;
							else
								minVal = amt1;
						} else if (amt > 0) {
							minVal = amt;
						}

						if (totalTaxDAmt > minVal)
							taxExemptionAmt += minVal;
						else
							taxExemptionAmt += totalTaxDAmt;

					}
				}
				//ExemptionTax=5
				else if (ph.PayheadType == 5) {

					angular.forEach(ph.PayHeadingTaxExemptionColl, function (rl) {

						if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						}
						else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						}
						else if (rl.Gender == emp.Gender) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						}
						else if (rl.MaritalStatus == emp.MaritalStatus) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						}
						else if (rl.Resident == emp.Resident) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
							if (rl.Amount > 0) {
								taxExeptionAmtMax = rl.Amount;
							} else if (rl.Formula.length > 0) {

							}
						}

					});

					if (ph.Rate > taxExeptionAmtMax)
						taxExemptionAmt += taxExeptionAmtMax;
					else
						taxExemptionAmt += ph.Amount;

				}
			}

		});

		emp.Earning = totalEarning;
		emp.Deduction = totalDeduction;

		var taxRules = {};
		if (emp.TaxRuleAs == 1) {
			//Normal
			if (emp.MaritalStatus == 1) // For Unmarried
			{
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 1 && p1.CalculationFor == 1);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 2 && p1.CalculationFor == 1);
			}
			else {
				if (emp.Resident == true)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 1 && p1.CalculationFor == 2);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 2 && p1.CalculationFor == 2);
			}


		} else {
			//SSF
			if (emp.MaritalStatus == 1) // For Unmarried
			{
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 1 && p1.CalculationFor == 1);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 2 && p1.CalculationFor == 1);
			}
			else {
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 1 && p1.CalculationFor == 2);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 2 && p1.CalculationFor == 2);
			}

		}

		$scope.TaxCal = {
			EmployeeId: 0,
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			Code: '',
			EnrollNumber: 0,
			GenderId: 1,
			ResidentId: 1,
			MaritalStatusId: 1,
			AllowPayHeadingColl: []
		};

		$scope.TaxCal.SlabColl = [];
		var totalTaxableEarning = (taxableEarning * 12) - taxExemptionAmt;
		var taxCalRateColl = [];
		if (taxRules) {

			var maxValue = 0;
			var isFirst = true;

			angular.forEach(taxRules, function (tr) {

				if (isFirst) {
					maxValue = tr.MaxValue;
					isFirst = false;
				}
				else
					maxValue = tr.MaxValue - tr.MinValue;


				if (totalTaxableEarning > 0) {
					if (maxValue >= totalTaxableEarning) {
						taxCalRateColl.push({
							Amount: totalTaxableEarning,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});
						totalTaxableEarning = 0;
					} else if (maxValue < totalTaxableEarning) {
						taxCalRateColl.push({
							Amount: maxValue,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});

						totalTaxableEarning -= maxValue;
					}
				}
			});
		}

		if (totalTaxableEarning > 0 && taxCalRateColl && taxCalRateColl.length > 0) {
			var lastRate = taxCalRateColl[taxCalRateColl.length - 1];
			taxCalRateColl.push({
				Amount: totalTaxableEarning,
				Rate: lastRate.Rate,
				PayHeadingId: lastRate.PayHeadingId,
			});
			totalTaxableEarning = 0;
		}

		var taxAmt = 0;
		angular.forEach(taxCalRateColl, function (cr) {
			var tAmt = ((cr.Amount * cr.Rate) / 100) / 12;
			taxAmt += tAmt;
			taxPayableAmt += tAmt;
			$scope.TaxCal.SlabColl.push({
				Amount: cr.Amount,
				Rate: cr.Rate,
				Tax: tAmt,
				PayHeadingId: cr.PayHeadingId
			});
		});

		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.IsAllow == true && (ph.PayheadType == 4 || ph.PayheadType == 6)) {

				var findTaxColl = mx($scope.TaxCal.SlabColl).where(p1 => p1.PayHeadingId == ph.PayHeadingId);
				ph.TaxSlabColl = findTaxColl;
				if (findTaxColl && ph.CalculationType == 4) {
					ph.Amount = isEmptyAmt(findTaxColl.sum(p1 => p1.Tax));
				}
			}
		});

		emp.Tax = taxPayableAmt;
		emp.Netpayable = totalEarning - totalDeduction - taxPayableAmt;
	};

	$scope.CurTaxDetailsColl = [];
	$scope.ShowTaxDetails = function (emp, ph) {
		$scope.CurTaxDetailsColl = [];
		if (ph.TaxSlabColl) {
			ph.TaxSlabColl.forEach(function (ts) {
				$scope.CurTaxDetailsColl.push(ts);
			});
			$('#detailmodel').modal('show');
		}
	}

	$scope.DeleteIncentiveSheet = function () {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					UserId: null,
					CompanyRelationshipId: $scope.newFilter.CompanyRelationshipId,
					BranchId: $scope.newFilter.BranchId,
					DepartmentId: $scope.newFilter.DepartmentId,
					ProductBrandId: $scope.newFilter.ProductBrandId,
					IncentiveDate: new Date(($filter('date')($scope.newFilter.IncentiveDateDet.dateAD, 'yyyy-MM-dd')))
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteIncentiveSheet",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForIncentiveSheet();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.DelIncentiveSheetlData = function (refData, ind) {
		Swal.fire({
			title: 'Do you want to delete Salary Detail of ' + refData.EmployeeName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					UserId: refData.UserId,
					IncentiveDate: new Date(($filter('date')($scope.newFilter.IncentiveDateDet.dateAD, 'yyyy-MM-dd')))
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteIncentiveSheet",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetEmployeeForIncentiveSheet();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	$scope.SaveIncentiveSheetRow = function (refData, ind) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];
		refData.PayHeadColl.forEach(function (ph) {
			if (ph.Amount > 0 || ph.Amount < 0) {
				dtColl.push({
					UserId: refData.UserId,
					PayHeadingId: ph.PayHeadingId,
					Amount: ph.Amount,
					ProductBrandId: $scope.newFilter.ProductBrandId,
					IncentiveDate: new Date(($filter('date')($scope.newFilter.IncentiveDateDet.dateAD, 'yyyy-MM-dd'))),
					Netpayable: isEmptyAmt(refData.Netpayable),
					Remark: $scope.beData.Remark
				});
			}
		});
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveIncentiveSheet",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: dtColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG); 5
			if (res.data.IsSuccess == true) {
				/*    $scope.GetAllAssignCustomer();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.PastePayData = function (ph, sind) {
		var clipText = event.clipboardData.getData('text/plain');
		if (clipText) {
			$scope.loadingstatus = 'running';
			showPleaseWait();
			var ind = 0;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {
					if (ind < $scope.EmployeeListForIncentiveSheet.length) {
						var emp = $scope.EmployeeListForIncentiveSheet[ind];
						for (var ii = 0; ii < emp.PayHeadColl.length; ii++) {
							var findPH = emp.PayHeadColl[ii];
							if (findPH.PayHeadingId == ph.PayHeadingId) {
								findPH.Amount = isEmptyAmt(line);
								$scope.ChangeRate(emp, findPH);
								break;
							}
						}
					}
					ind++;
				}
			});
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	}


	$scope.GetAllIncentiveList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.IncentiveList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllIncentiveList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.IncentiveList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.DeleteIncentiveSheetById = function (beData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					UserId: null,
					CompanyRelationshipId: beData.CompanyRelationshipId,
					BranchId: beData.BranchId,
					DepartmentId: beData.DepartmentId,
					ProductBrandId: beData.ProductBrandId,
					IncentiveDate: beData.IncentiveDate
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteIncentiveSheet",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetAllIncentiveList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.GetIncentiveSheetById = function (beData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForIncentiveSheet = [];
		$scope.newFilter = beData;
		$scope.newFilter.IncentiveDate_TMP = new Date(beData.IncentiveDate);
		var para = {
			CompanyRelationshipId: beData.CompanyRelationshipId,
			BranchId: beData.BranchId,
			DepartmentId: beData.DepartmentId,
			ProductBrandId: beData.ProductBrandId,
			IncentiveDate: beData.IncentiveDate
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllIncentiveSheet",
			dataType: "json",
			data: JSON.stringify(para),
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData.Remark = res.data.Data[0].Remark;
				var dataColl = mx(res.data.Data);
				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));
				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);
					var beData = {
						UserId: fst.UserId,
						LevelId: fst.LevelId,
						LevelName: fst.LevelName,
						BranchId: fst.BranchId,
						CategoryId: fst.CategoryId,
						EmployeeId: fst.EmployeeId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						PayHeading: fst.PayHeading,
						IncentiveDate: fst.IncentiveDate,
						TaxRuleAs: fst.TaxRuleAs,
						Resident: fst.Resident,
						GenderId: fst.GenderId,
						MaritalStatus: fst.MaritalStatus,
						Netpayable: isEmptyAmt(fst.Netpayable),
						Remark: fst.Remark,
						PayHeadColl: [],
					};
					$scope.PayHeadingList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.PayHeadingId == pa.PayHeadingId);
						var allowEdit = (pa.CalculationType == 1 || pa.CalculationType == 2 || pa.CalculationType == 3) ? (find ? find.IsAllow : false) : false;
						beData.PayHeadColl.push({
							Name: pa.Name,
							Code: pa.Code,
							PayHeadingId: pa.PayHeadingId,
							Amount: find ? find.Amount : 0,
							IsAllow: find ? find.IsAllow : false,
							IsEditable: allowEdit,
							PayheadType: pa.PayheadType,
							Natures: pa.Natures,
							MonthId: pa.MonthId,
							CalculationType: pa.CalculationType,
							PayHeadGroupId: pa.PayHeadGroupId,
							PayHeadCategoryId: pa.PayHeadCategoryId,
							CalculationOnHeading: pa.CalculationOnHeading,
							SNo: pa.SNo,
							IsTaxable: pa.IsTaxable,
							Formula: pa.Formula,
							TaxRuleAs: pa.TaxRuleAs,
							PayHeadingDetailsColl: pa.PayHeadingDetailsColl,
							PayHeadingTaxExemptionColl: pa.PayHeadingTaxExemptionColl,
						});
					});
					$scope.CalculateTax(beData);
					$scope.EmployeeListForIncentiveSheet.push(beData);
				});

				$('#custom-tabs-four-profile-tab').tab('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}
	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});
