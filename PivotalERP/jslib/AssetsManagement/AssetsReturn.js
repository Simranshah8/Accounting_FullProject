app.controller("AssetReturnController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
	$scope.Title = 'Asset Return';

	$scope.LoadData = function () {
		$('.select2').select2();
		$('.Dplaceholder').select2({
			placeholder: "Select Department", allowClear: true
		});
		$('.HODplaceholder').select2({
			placeholder: "Select Head Of Department", allowClear: true
		});

		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			AssetReturn: 1,
		};

		$scope.searchData = {
			AssetReturn: '',
			AssetIssueDetails: '',
		};

		$scope.perPage = {
			AssetReturn: GlobalServices.getPerPageRow(),
		};

		$scope.ReturnByColl = [
			{ id: 1, text: 'Self' },
			{ id: 2, text: 'Department' },
		]

		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;

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

		$scope.ParticularList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				//$scope.ParticularList = res.data.Data;
				$scope.ParticularList = res.data.Data.filter(function (item) {
					return item.StatusId === 1;
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});

		$scope.StatusColl = [
			{ id: 1, text: "Good Condition" },
			{ id: 2, text: "Minor Scratches" },
			{ id: 3, text: "Damaged" },
			{ id: 4, text: "Defective" },
			{ id: 5, text: "Repair" },
		]

		$scope.CategoryColl = [
			{ id: 1, text: 'Internal Use' },
			{ id: 2, text: 'External Activities' },
			{ id: 3, text: 'Events & Training' },
		];

		$scope.PurposeColl = [
			{ id: 1, text: 'Department Work', categoryId: 1 },
			{ id: 2, text: 'Administrative Tasks', categoryId: 1 },
			{ id: 3, text: 'Personal Use (Authorized)', categoryId: 1 },

			{ id: 4, text: 'Official Tour', categoryId: 2 },
			{ id: 5, text: 'Field Visit', categoryId: 2 },
			{ id: 6, text: 'Guest Use', categoryId: 2 },

			{ id: 7, text: 'Training / Workshop', categoryId: 3 },
			{ id: 8, text: 'Event / Seminar / Conference', categoryId: 3 }
		];

		$scope.newDetails = {
			TranId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			VoucherId: null,
			BranchId: null,
			CostClassId: null,
			IssueNo: null,
			ReturnById: 1,
			DepartmentId: null,
			HODId: null,
			UserId: null,
			VoucherDate: '',
			BarCode: '',
			AssetReturnDetailsColl: [],
			Remarks: '',
			VoucherDate_TMP: new Date(),
			VoucherDateAD_TMP: new Date(),
			DocumentColl: [],
			AttechFiles: [],
			Mode: "Save"
		}

		$scope.GetAllAssetReturn();

		$scope.HideShow = {
			VoucherType: false,
			CostClass: false
		}

		$scope.GenConfig = {};
		GlobalServices.getGenConfig().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GenConfig.DateStyle = res.data.Data.DateStyle;

				// NOW call reloadVoucherDate after GenConfig is loaded
				$scope.reloadVoucherDate();
			}
		}, function (reason) {
			alert('Failed' + reason);
			// Keep the default DateFormat (1) and call reloadVoucherDate
			$scope.reloadVoucherDate();
		});


		$scope.DefaultBranch = null;
		var filterObjs_VoucherId = {};
		filterObjs_VoucherId['BDId'] = 1;

		var vt_Para = {
			voucherType: VoucherType,
			filterPara: filterObjs_VoucherId,
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetVoucherList",
			dataType: "json",
			data: JSON.stringify(vt_Para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherTypeColl = res.data.Data;

				$http({
					method: 'GET',
					url: base_url + "Account/Creation/GetCostClassForEntry",
					dataType: "json"
				}).then(function (res1) {
					if (res1.data.IsSuccess && res1.data.Data) {
						$scope.CostClassColl = res1.data.Data;
						$timeout(function () {
							$scope.$apply(function () {
								if ($scope.VoucherTypeColl.length > 0) {
									$scope.SelectedVoucher = $scope.VoucherTypeColl[0];
									$scope.newDetails.VoucherId = $scope.SelectedVoucher.VoucherId;
									$scope.newDetails.BranchId = $scope.SelectedVoucher.BDId;
								}

								if ($scope.CostClassColl.length > 0) {
									$scope.SelectedCostClass = $scope.CostClassColl[0];
									$scope.newDetails.CostClassId = $scope.SelectedCostClass.CostClassId;
								}

								if ($scope.VoucherTypeColl.length <= 1)
									$scope.HideShow.VoucherType = true;
								else
									$scope.HideShow.VoucherType = false;

								if ($scope.CostClassColl.length <= 1)
									$scope.HideShow.CostClass = true;
								else
									$scope.HideShow.CostClass = false;

								$scope.GetAutoReturnNo();

							});
						});


					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


	}


	$scope.ClearDetails = function () {
		$scope.newDetails = {
			TranId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			VoucherId: $scope.SelectedVoucher.VoucherId,
			BranchId: $scope.SelectedVoucher.BDId,
			CostClassId: $scope.SelectedCostClass.CostClassId,
			IssueNo: null,
			ReturnById: 1,
			DepartmentId: null,
			HODId: null,
			UserId: null,
			VoucherDate: '',
			BarCode: '',
			AssetReturnDetailsColl: [],
			Remarks: '',
			VoucherDate_TMP: new Date(),
			VoucherDateAD_TMP: new Date(),
			DocumentColl: [],
			AttechFiles: [],
			Mode: "Save"
		}
		$scope.GetAutoReturnNo();
	}

	$scope.IsValidAssetReturn = function () {

		if (!$scope.newDetails.ReturnById || $scope.newDetails.ReturnById === 0) {
			Swal.fire("warning","Please Select Return  By.", "warning");
			return false;
		}
		if ($scope.newDetails.ReturnById === 1) {   // User
			if (!$scope.newDetails.UserId || $scope.newDetails.UserId === 0) {
				Swal.fire("warning","Please Select Employee.", "warning");
				return false;
			}
		}

		if ($scope.newDetails.ReturnById === 2) {   // HOD
			if (!$scope.newDetails.HODId || $scope.newDetails.HODId === 0) {
				Swal.fire("warning","Please select Head of Department.", "warning");
				return false;
			}
		}

		// take only rows where Particular is selected
		var filledRows = $scope.newDetails.AssetReturnDetailsColl.filter(function (row) {
			return row.ParticularId && row.ParticularId !== 0;
		});

		// 1️⃣ at least one valid child row required
		if (filledRows.length === 0) {
			Swal.fire("Warning", "Please add at least one asset return detail.", "warning");
			return false;
		}

		// 2️⃣ validate only filled rows
		for (var i = 0; i < filledRows.length; i++) {
			var p = filledRows[i];
			var row = i + 1;

			if (!p.CategoryId || p.CategoryId <= 0) {
				Swal.fire("Warning", "Please enter Category at row " + row, "warning");
				return false;
			}

			if (!p.PurposeId || p.PurposeId <= 0) {
				Swal.fire("Warning", "Please enter Purpose at row " + row, "warning");
				return false;
			}

			if (!p.QTY || p.QTY <= 0) {
				Swal.fire("Warning", "Please Enter QTY at row " + row, "warning");
				return false;
			}

			if (!p.StatusId || p.StatusId === 0) {
				Swal.fire("Warning", "Please select Return Status at row " + row, "warning");
				return false;
			}
		}

		
		return true;
	};

	$scope.RemoveAttachment = function (fId, ind) {
		if (fId == 1) {
			$scope.newDetails.DocumentColl.splice(ind, 1);
		}
		else if (fId == 2) {
			$scope.newDetails.AttechFiles.splice(ind, 1);
		}
	}


	$scope.AddMoreFiles = function (files, des) {
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.newDetails.DocumentColl.push({
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})
				$scope.attachFile = null;
				$scope.docDescription = '';
				$('#flMoreFiles').val('');
			}
		}
	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newDetails.DocumentColl) {
			if ($scope.newDetails.DocumentColl.length > 0) {
				$scope.newDetails.DocumentColl.splice(ind, 1);
			}
		}
	}


	$scope.SaveUpdateAssetReturn = function () {
		if ($scope.IsValidAssetReturn() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAssetReturn();
					}
				});
			} else
				$scope.CallSaveUpdateAssetReturn();
		}
	};

	$scope.CallSaveUpdateAssetReturn = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		if ($scope.newDetails.VoucherDateDet) {
			$scope.newDetails.VoucherDate = $filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newDetails.ReqDate = new Date();

		if ($scope.newDetails.AssetReturnDetailsColl) {
			$scope.newDetails.AssetReturnDetailsColl.forEach((S) => {

				if (S.ReqFromDet)
					S.ReqFrom = $filter('date')(new Date(S.ReqFromDet.dateAD), 'yyyy-MM-dd');

				if (S.ReqTODet)
					S.ReqTO = $filter('date')(new Date(S.ReqTODet.dateAD), 'yyyy-MM-dd');
			});
		}

		$scope.newDetails.AssetReturnDetailsColl =
			$scope.newDetails.AssetReturnDetailsColl.filter(function (row) {
				return row.ParticularId != null;
			});

		var filesColl = $scope.newDetails.AttechFiles;
		$scope.newDetails.AttechFiles = [];

		$http({
			method: 'Post',
			url: base_url + "AssetsManagement/Creation/SaveAssetReturn",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				var find = 0;
				angular.forEach($scope.newDetails.DocumentColl, function (dc) {
					if (dc.File) {
						formData.append("file" + find, dc.File);
					}
					find++;
				});
				return formData;
			},
			data: { jsonData: $scope.newDetails, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
				$scope.GetAllAssetReturn();
				$scope.GetAutoReturnNo();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllAssetReturn = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetReturn",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TableData = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}

	$scope.GetAssetReturnById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAssetReturnById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDetails = res.data.Data;				
				$scope.newDetails.Mode = 'Modify';
				$scope.newDetails.SelectEmployee = $scope.EmployeeSearchOptions[0].value;
				if ($scope.newDetails.VoucherDate) {
					$scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDate);
				}
				if ($scope.newDetails.AssetReturnDetailsColl) {
					$scope.newDetails.AssetReturnDetailsColl.forEach(function (item) {
						$scope.getAssetClosingStock(item).then(function (CS) {
							item.ClosingStock = CS;
						});
					});
				}
				$scope.GetHodListDepartmentWise();


				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.DelAssetReturnById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "AssetsManagement/Creation/DelAssetReturn",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetAllAssetReturn();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});

	}

	$scope.AddPHDDetails = function (index) {
		if (!$scope.newDetails.AssetReturnDetailsColl[index].CategoryId &&
			!$scope.newDetails.AssetReturnDetailsColl[index].PurposeId &&
			!$scope.newDetails.AssetReturnDetailsColl[index].QTY &&
			!$scope.newDetails.AssetReturnDetailsColl[index].StatusId) {
			Swal.fire({
				title: 'Warning!',
				text: 'Please fill the current row details before adding a new row.',
				icon: 'warning',
				confirmButtonText: 'OK',
				allowOutsideClick: false,
			});

			return;
		}

		if ($scope.newDetails.AssetReturnDetailsColl) {
			if ($scope.newDetails.AssetReturnDetailsColl.length > index + 1) {
				$scope.newDetails.AssetReturnDetailsColl.splice(index + 1, 0, {
					ClassName: ''
				})
			}
			else {
				$scope.newDetails.AssetReturnDetailsColl.push({
					ClassName: ''
				})
			}

		}
	}

	$scope.delPHDDetails = function (index) {
		if ($scope.newDetails.AssetReturnDetailsColl) {
			if ($scope.newDetails.AssetReturnDetailsColl.length > 1) {
				$scope.newDetails.AssetReturnDetailsColl.splice(index, 1);
			}
			else {
				$scope.newDetails.DeAssetReturnDetailsColltailColl[0] = {}
			}
		}
	}

	$scope.GetHodListDepartmentWise = function () {
		$scope.HODList = [];
		var para = {
			DepartmentId: $scope.newDetails.DepartmentId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetHodListDepartmentWise",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.HODList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.ClearOtherField = function (RequestById) {
		if (RequestById == 1) {
			$scope.newDetails.DepartmentId = null;
			scope.newDetails.HODId = null;
		}

		if (RequestById == 2) {
			$scope.newDetails.UserId = null;

		}
	}

	$scope.GetAutoReturnNo = function () {
		if ($scope.newDetails.VoucherId && $scope.newDetails.VoucherId > 0) {
			if ($scope.newDetails.CostClassId && $scope.newDetails.CostClassId > 0) {
				var para = {
					voucherId: $scope.newDetails.VoucherId,
					costClassId: $scope.newDetails.CostClassId,
					voucherDate: $scope.newDetails.VoucherDateDet ? ($filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/GetVoucherNo",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					if (res.data.IsSuccess && res.data.Data) {
						var vDet = res.data.Data;
						$scope.newDetails.AutoManualNo = vDet.AutoManualNo;
						$scope.newDetails.AutoVoucherNo = vDet.AutoVoucherNo;

					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		} else {
			$scope.newDetails.AutoManualNo = '';
			$scope.newDetails.AutoVoucherNo = 0;
		}
	}

	$scope.reloadVoucherDate = function () {
		const container = angular.element(document.getElementById('dvDTVoucher'));
		container.empty(); // Clear the container

		const dateFormat = $scope.GenConfig.DateStyle || 2;
		if ($scope.newDetails.VoucherDateDet && $scope.newDetails.VoucherDateDet.dateAD) {

			$scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDateDet.dateAD);
		} else if ($scope.newDetails.VoucherDate) {
			$scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDate);
		} else {
			$scope.newDetails.VoucherDate_TMP = new Date();
		}

		$timeout(function () {
			let dtPicker = '';

			if (dateFormat == 2) { // BS only
				dtPicker =
					'<input type="text" class="form-control form-control-sm" date-picker ' +
					'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
					'confirm-action="getVoucherNoOnly(2)" ' +
					'title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}" ' +
					'date-style="2" id="dtVoucherDateBS">';
			} else if (dateFormat == 1) { // AD only
				dtPicker =
					'<input type="text" class="form-control form-control-sm" date-picker ' +
					'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
					'confirm-action="getVoucherNoOnly(1)" ' +
					'title="{{newDetails.VoucherDateDet.dateBS}}" ' +
					'date-style="1" id="dtVoucherDateAD">';
			} else if (dateFormat == 3) { // BS & AD (BS first)
				dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDate_TMP"
                               date-detail="newDetails.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDateAD_TMP"
                               date-detail="newDetails.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDetails.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                    </div>
                </div>`;
			} else if (dateFormat == 4) { // AD & BS (AD first)
				dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDateAD_TMP"
                               date-detail="newDetails.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDetails.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDate_TMP"
                               date-detail="newDetails.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                    </div>
                </div>`;
			} else {
				// Fallback to AD format if dateFormat has unexpected value
				dtPicker =
					'<input type="text" class="form-control form-control-sm" date-picker ' +
					'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
					'confirm-action="getVoucherNoOnly(1)" ' +
					'title="{{newDetails.VoucherDateDet.dateBS}}" ' +
					'date-style="1" id="dtVoucherDateAD">';
			}

			const newElement = angular.element(dtPicker);
			container.append(newElement);
			$compile(newElement)($scope);
		});
	};

	$scope.getVoucherNoOnly = function (dateStyle) {
		$timeout(function () {
			const dateFormat = $scope.GenConfig && $scope.GenConfig.DateStyle ? $scope.GenConfig.DateStyle : 1;

			if (dateFormat == 3 || dateFormat == 4) {
				if (dateStyle == 1) {
					if ($scope.newDetails.VoucherDateADDet && $scope.newDetails.VoucherDateADDet.dateAD) {
						if (!$scope.newDetails.VoucherDate_TMP ||
							$scope.newDetails.VoucherDateADDet.dateAD != $scope.newDetails.VoucherDate_TMP) {
							$scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDateADDet.dateAD);
						}
					}
				} else if (dateStyle == 2) {
					if ($scope.newDetails.VoucherDateDet && $scope.newDetails.VoucherDateDet.dateAD) {
						if (!$scope.newDetails.VoucherDateAD_TMP ||
							$scope.newDetails.VoucherDateAD_TMP != $scope.newDetails.VoucherDateDet.dateAD) {
							$scope.newDetails.VoucherDateAD_TMP = new Date($scope.newDetails.VoucherDateDet.dateAD);
						}
					}
				}
			}
		});
	};

	$scope.validateQty = function (item) {
		var qty = parseFloat(item.QTY);
		if (isNaN(qty) || qty < 0) {
			qty = 0;
		}
		if (qty < 0) {
			qty = Math.abs(qty);
		}
		//if (item.ClosingStock !== undefined && qty > item.ClosingStock) {
		//	qty = 0;
		//	Swal.fire({
		//		icon: 'warning', title: 'Invalid Quantity', text: 'Quantity cannot be greater than Closing Stock (' + item.ClosingStock + ').'
		//	});
		//}
		item.QTY = Math.floor(qty);
	};

	$scope.isAllChecked = false;
	$scope.toggleAll = function () {
		var lstSelected = null;
		angular.forEach($scope.AssetRetunDetailsList, function (ri) {
			ri.IsSelected = $scope.isAllChecked;

			if (ri.IsSelected) {
				lstSelected = ri;
			}
		});

		// Optional: if you want to do something with first selected row
		// if (lstSelected)
		//     $scope.getRefVoucherPartyDetails(lstSelected);
	};

	$scope.getEmployeeUserId = function (details) {
		//if (!details.EmployeeDetails.UserId) {
		//	Swal.fire("There is no UserId for this employee!");
		//	$scope.newDetails.UserId = null;
		//	return;
		//}
		//$scope.newDetails.UserId = details.EmployeeDetails.UserId;
		$scope.ShowARDetailsModal()
	};

	$scope.ShowARDetailsModal = function (rf) {
		$scope.newDetails.AssetReturnDetailsColl = [];
		$scope.AssetIssueDetailsList = [];
		if (rf === 1) {
			if (!$scope.newDetails.IssueNo || $scope.newDetails.IssueNo <= 0) {
				return;
			}
			var para = {
				IssueNo: $scope.newDetails.IssueNo,
				IssueBy: null,
				BranchId: null,
				DepartmentId: null,
				IssueUserId: null
			};

			$http({
				method: 'POST',
				url: base_url + "AssetsManagement/Reporting/GetPendingAssetsIssue",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.AssetRetunDetailsList = res.data.Data;
					if ($scope.AssetRetunDetailsList.length > 0) {
						$scope.reqBy = 1;
						$('#AssetDetails').modal('show');
					} else {
						Swal.fire({ icon: 'warning', title: 'Issue Not Found', text: 'Asset Return Details does not exist.' });
					}
				}
			}, function (err) {
				Swal.fire('Failed', err.statusText, 'error');
			});

			return;
		}
		var requestUserId = null;

		if ($scope.newDetails.UserId && $scope.newDetails.UserId > 0) {
			requestUserId = $scope.newDetails.UserId;
		}
		else if ($scope.newDetails.HODId && $scope.newDetails.HODId > 0) {
			requestUserId = $scope.newDetails.HODId;
		}
		else {
			return;
		}
		var para = {
			IssueNo: null,
			IssueBy: $scope.newDetails.ReturnById,
			BranchId: $scope.newDetails.BranchId,
			DepartmentId: $scope.newDetails.DepartmentId,
			IssueUserId: requestUserId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Reporting/GetPendingAssetsIssue",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AssetRetunDetailsList = res.data.Data;
				if ($scope.AssetRetunDetailsList.length > 0) {
					$scope.reqBy = 2;
					$('#AssetDetails').modal('show');
				} else {
					Swal.fire({ icon: 'warning', title: 'Issue Not Found', text: 'Asset Request Details does not exist.' });
				}
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.LoadAssetIssueDetails = function (be) {
		if (!$scope.newDetails.AssetReturnDetailsColl) {
			$scope.newDetails.AssetReturnDetailsColl = [];
		}
		var selectedItems = $scope.AssetRetunDetailsList.filter(function (item) {
			return item.IsSelected === true;
		});
		if (selectedItems.length === 0) {
			Swal.fire('No item selected!');
            return;
        }
		if (be == 1) {
			$scope.$apply(function () {
				//$scope.newDetails.IssueNo = selectedItems[0].VoucherNo;
				$scope.newDetails.ReturnById = selectedItems[0].IssueById;
				$scope.newDetails.UserId = selectedItems[0].UserId;
				$scope.newDetails.DepartmentId = selectedItems[0].DepartmentId;
				$scope.newDetails.HODId = selectedItems[0].HODId;
				$scope.GetHodListDepartmentWise();
			});
        }
		angular.forEach(selectedItems, function (item) {
			$scope.getAssetClosingStock(item).then(function (closingStock) {
				$scope.newDetails.AssetReturnDetailsColl.push({
					ParticularId: item.ParticularId,
					Particular: item.Particular,
					CategoryId: item.CategoryId,
					Category: item.Category,
					PurposeId: item.PurposeId,
					Purpose: item.Purpose,
					QTY: item.QTY || 1,
					ClosingStock: closingStock,
					IssueId: item.TranId,
				});
			});
		});

		$('#AssetDetails').modal('hide');
	};

	$scope.getAssetClosingStock = function (R) {
		var TranId = R.ParticularId;
		showPleaseWait();
		var para = {
			TranId: TranId,
			BranchId: $scope.newDetails.BranchId,
			voucherDate: $scope.newDetails.VoucherDateDet ? ($filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
		};
		return $http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/getAssetClosingStock",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				return res.data.Data.ClosingStock; // return value for the caller
			} else {
				Swal.fire(res.data.ResponseMSG);
				return 0; // default
			}
		}, function (reason) {
			hidePleaseWait();
			Swal.fire('Failed ' + reason);
			return 0;
		});
	};

	$scope.GetReturnAttById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAssetReturnById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DocView = res.data.Data;
				$('#Doc-View').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.ShowDocPdf = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#DocView').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#DocView').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#DocView').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg1 = {
			ContentPath: '',
			FileType: null
		};
		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg1.ContentPath = item.DocPath;
			$scope.viewImg1.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer1').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg1.ContentPath = item.PhotoPath;
			$scope.viewImg1.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg1.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg1.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg1.FileType === 'pdf') {
				document.getElementById('pdfViewer1').src = $scope.viewImg1.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};


})