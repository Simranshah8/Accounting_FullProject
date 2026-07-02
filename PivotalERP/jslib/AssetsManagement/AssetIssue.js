app.controller("AssetIssueController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
	$scope.Title = 'Asset Issue';
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
			AssetIssue: 1,
		};

		$scope.searchData = {
			AssetIssue: '',
			AssetRequestDetails: '',
		};

		$scope.HideShow = {
			VoucherType: false,
			CostClass: false
		}

		$scope.perPage = {
			AssetIssue: GlobalServices.getPerPageRow(),
		};

		$scope.IssueByColl = [
			{ id: 1, text: 'Self' },
			{ id: 2, text: 'Department' },
		]

		$scope.AssetReqList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetRequest",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AssetReqList = res.data.Data;
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





		$scope.CostClassColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CostClassColl = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


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
			AssetReqNo: null,
			IssueById: 1,
			DepartmentId: null,
			VoucherId: null,
			BranchId: null,
			CostClassId: null,
			HODId: null,
			UserId: null,
			BarCode: '',
			AssetsIssueDetailsColl: [],
			DocumentColl: [],
			AttechFiles: [],
			Remarks: '',
			VoucherDate_TMP: new Date(),
			VoucherDateAD_TMP: new Date(),
			IsReturnable: true,
			Mode: "Save"
		}
		$scope.GetAllAssetIssue();

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

								$scope.GetAutoIssueNo();

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
			AssetReqNo: null,
			IssueById: 1,
			DepartmentId: null,
			VoucherId: $scope.SelectedVoucher.VoucherId,
			BranchId: $scope.SelectedVoucher.BDId,
			CostClassId: $scope.SelectedCostClass.CostClassId,
			HODId: null,
			UserId: null,
			BarCode: '',
			AssetsIssueDetailsColl: [],
			DocumentColl: [],
			AttechFiles: [],
			Remarks: '',
			VoucherDate_TMP: new Date(),
			VoucherDateAD_TMP: new Date(),
			IsReturnable: true,
			Mode: "Save"
		}
		$scope.GetAutoIssueNo();
	}

	$scope.AddPHDDetails = function (index) {
		if (!$scope.newDetails.AssetsIssueDetailsColl[index].QTY &&
			!$scope.newDetails.AssetsIssueDetailsColl[index].ReqFrom_TMP &&
			!$scope.newDetails.AssetsIssueDetailsColl[index].ReqTO_TMP) {
			Swal.fire({
				title: 'Warning!',
				text: 'Please fill the current row details before adding a new row.',
				icon: 'warning',
				confirmButtonText: 'OK',
				allowOutsideClick: false,
			});

			return;
		}

		if ($scope.newDetails.AssetsIssueDetailsColl) {
			if ($scope.newDetails.AssetsIssueDetailsColl.length > index + 1) {
				$scope.newDetails.AssetsIssueDetailsColl.splice(index + 1, 0, {
					ClassName: ''
				})
			}
			else {
				$scope.newDetails.AssetsIssueDetailsColl.push({
					ClassName: ''
				})
			}

		}
	}

	$scope.delPHDDetails = function (index) {
		if ($scope.newDetails.AssetsIssueDetailsColl) {
			if ($scope.newDetails.AssetsIssueDetailsColl.length > 1) {
				$scope.newDetails.AssetsIssueDetailsColl.splice(index, 1);
			}
			else {
				$scope.newDetails.DeAssetsIssueDetailsColltailColl[0] = {}
			}
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




	$scope.IsValidAssetIssue = function () {
		if (!$scope.newDetails.IssueById || $scope.newDetails.IssueById === 0) {
			Swal.fire("warning", "Please select Issue By.", "warning");
			return false;
		}
		if ($scope.newDetails.IssueById === 1) {   // User
			if (!$scope.newDetails.UserId || $scope.newDetails.UserId === 0) {
				Swal.fire("warning", "Please select Employee ", "warning");
				return false;
			}
		}

		if ($scope.newDetails.IssueById === 2) {   // HOD
			if (!$scope.newDetails.HODId || $scope.newDetails.HODId === 0) {
				Swal.fire("warning", "Please select Head of Department.", "warning");
				return false;
			}
		}


		var filledRows = $scope.newDetails.AssetsIssueDetailsColl.filter(function (row) {
			return row.ParticularId && row.ParticularId !== 0;
		});

		// 1️⃣ at least one valid child row required
		if (filledRows.length === 0) {
			Swal.fire("Warning", "Please add at least one asset issue detail.", "warning");
			return false;
		}

		// 2️⃣ validate only filled rows
		for (var i = 0; i < filledRows.length; i++) {
			var p = filledRows[i];
			var row = i + 1;
			if (!p.ParticularId || p.ParticularId === 0) {
				Swal.fire("warning", "Please select Particular at row " + row, "warning");
				return false;
			}
			if (!p.CategoryId || p.CategoryId === 0) {
				Swal.fire("warning", "Please select Category at row " + row, "warning");
				return false;
			}
			if (!p.PurposeId || p.PurposeId === 0) {
				Swal.fire("warning", "Please select Purpose at row " + row, "warning");
				return false;
			}
			if (!p.QTY || p.QTY === 0) {
				Swal.fire("warning", "Please select QTY at row " + row, "warning");
				return false;
			}
		}

		return true;
	};

	$scope.SaveUpdateAssetIssue = function () {
		if ($scope.IsValidAssetIssue() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAssetIssue();
					}
				});
			} else
				$scope.CallSaveUpdateAssetIssue();

		}
	};

	$scope.CallSaveUpdateAssetIssue = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		if ($scope.newDetails.VoucherDateDet) {
			$scope.newDetails.VoucherDate = $filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newDetails.ReqDate = new Date();

		if ($scope.newDetails.AssetsIssueDetailsColl) {
			$scope.newDetails.AssetsIssueDetailsColl.forEach((S) => {

				if (S.ReqFromDet)
					S.ReqFrom = $filter('date')(new Date(S.ReqFromDet.dateAD), 'yyyy-MM-dd');

				if (S.ReqTODet)
					S.ReqTO = $filter('date')(new Date(S.ReqTODet.dateAD), 'yyyy-MM-dd');
			});
		}

		var filesColl = $scope.newDetails.AttechFiles;
		$scope.newDetails.AttechFiles = [];

		$scope.newDetails.AssetsIssueDetailsColl =
			$scope.newDetails.AssetsIssueDetailsColl.filter(function (row) {
				return row.ParticularId != null;
			});

		$http({
			method: 'Post',
			url: base_url + "AssetsManagement/Creation/SaveAssetIssue",
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
				$scope.GetAllAssetIssue();
				$scope.GetAutoIssueNo();
			}


		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllAssetIssue = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetIssue",
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

	$scope.GetAssetIssueById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAssetIssueById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDetails = res.data.Data;
				$scope.newDetails.Mode = 'Modify';
				$scope.newDetails.SelectEmployee= $scope.EmployeeSearchOptions[0].value;
				if ($scope.newDetails.VoucherDate) {
					$scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDate);
				}
				if ($scope.newDetails.AssetsIssueDetailsColl) {
					$scope.newDetails.AssetsIssueDetailsColl.forEach((S) => {
						$scope.getAssetClosingStock(S).then(function (CS) {
							S.ClosingStock = CS;
						});
						if (S.ReqFrom)
							S.ReqFrom_TMP = new Date(S.ReqFrom);
						if (S.ReqTO)
							S.ReqTO_TMP = new Date(S.ReqTO);
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

	$scope.DelAssetIssueById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "AssetsManagement/Creation/DelAssetIssue",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetAllAssetIssue();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});

	}

    $scope.GetAutoIssueNo = function () {
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

	$scope.ClearOtherField = function (RequestById) {
		if (RequestById == 1) {
			$scope.newDetails.DepartmentId = null;
			scope.newDetails.HODId = null;
		}
		if (RequestById == 2) {
			$scope.newDetails.UserId = null;
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
					`<input type="text" class="form-control form-control-sm" date-picker 
					ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet"
					confirm-action="getVoucherNoOnly(2)" title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}"
					date-style="2" id="dtVoucherDateBS">`;
			} else if (dateFormat == 1) { // AD only
				dtPicker =`
					<input type="text" class="form-control form-control-sm" date-picker
					ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet"
					confirm-action="getVoucherNoOnly(1)" 
					title="{{newDetails.VoucherDateDet.dateBS}}"
					date-style="1" id="dtVoucherDateAD">`;
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
				dtPicker =`
					<input type="text" class="form-control form-control-sm" date-picker
					ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet"
					confirm-action="getVoucherNoOnly(1)"
					title="{{newDetails.VoucherDateDet.dateBS}}"
					date-style="1" id="dtVoucherDateAD">`;
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
		if (item.ClosingStock !== undefined && qty > item.ClosingStock) {
			qty = 0;
			Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity cannot be greater than Closing Stock(' + item.ClosingStock +')' });
		}

		item.QTY = Math.floor(qty);
	};

	$scope.isAllChecked = false;
	$scope.toggleAll = function () {
		angular.forEach($scope.AssetRequestDetailsList, function (ri) {
			ri.IsSelected = $scope.isAllChecked;

			if (ri.IsSelected) {
				lstSelected = ri;
			}
		});
	};

	$scope.getEmployeeUserId = function (details) {
		//if (!details.EmployeeDetails.UserId) {
		//	Swal.fire("There is no UserId for this employee!");
		//	$scope.newDetails.UserId = null;
		//	return;
		//}
		//$scope.newDetails.UserId = details.EmployeeDetails.UserId;
		$scope.ShowARDetailsModal();
	};

	$scope.ShowARDetailsModal = function (rf) {
		$scope.newDetails.AssetsIssueDetailsColl = [];
		$scope.AssetRequestDetailsList = [];
		if (rf === 1) {
			if (!$scope.newDetails.AssetReqNo || $scope.newDetails.AssetReqNo <= 0) {
				return;
			}
			var para = {
				RequestNo: $scope.newDetails.AssetReqNo,
				RequestBy: null,
				BranchId: null,
				DepartmentId: null,
				RequestUserId: null
			};

			$http({
				method: 'POST',
				url: base_url + "AssetsManagement/Reporting/GetPendingAssetsRequest",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.AssetRequestDetailsList = res.data.Data;
					if ($scope.AssetRequestDetailsList.length > 0) {
						$scope.reqBy = 1;
						$('#AssetDetails').modal('show');
					} else {
						Swal.fire({ icon: 'warning', title: 'Issue Not Found', text: 'Asset Request Details does not exist.' });
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
			RequestNo: null,
			RequestBy: $scope.newDetails.IssueById,
			BranchId: $scope.newDetails.BranchId,
			DepartmentId: $scope.newDetails.DepartmentId,
			RequestUserId: requestUserId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Reporting/GetPendingAssetsRequest",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {

			if (res.data.IsSuccess && res.data.Data) {

				$scope.AssetRequestDetailsList = res.data.Data;

				if ($scope.AssetRequestDetailsList.length > 0) {
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

		$timeout(function () {
			if (!$scope.newDetails.AssetsIssueDetailsColl) {
				$scope.newDetails.AssetsIssueDetailsColl = [];
			}
			var selectedItems = $scope.AssetRequestDetailsList.filter(function (item) {
				return item.IsSelected === true;
			});
			if (selectedItems.length === 0) {
				Swal.fire('No item selected!');
				return;
			}
			if (be === 1) {

				$scope.$apply(function () {
					$scope.newDetails.IssueById = selectedItems[0].RequestById;
					$scope.newDetails.UserId = selectedItems[0].UserId;
					$scope.newDetails.DepartmentId = selectedItems[0].DepartmentId;
					$scope.newDetails.HODId = selectedItems[0].HODId;
					$scope.GetHodListDepartmentWise();
				});
				
			}

			angular.forEach(selectedItems, function (item) {
				$scope.getAssetClosingStock(item).then(function (closingStock) {
					$scope.newDetails.AssetsIssueDetailsColl.push({
						ParticularId: item.ParticularId,
						Particular: item.Particular,
						CategoryId: item.CategoryId,
						Category: item.Category,
						PurposeId: item.PurposeId,
						Purpose: item.Purpose,
						QTY: item.QTY || 1,
						ClosingStock: closingStock,
						ReqDetailsId: item.TranId,
						ReqFromBS: item.ReqFromBS,
						ReqToBS: item.ReqToBS
					});
				});
			});

			$('#AssetDetails').modal('hide');
		});
		
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


	$scope.GetIssueAttById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAssetIssueById",
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