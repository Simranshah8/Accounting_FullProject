app.controller('CloseJobCard', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Parts DemandList';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.HideShow = {
			Branch: true,
			CostClass: true
		};


		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: GlobalServices.getPerPageRow(),
			sort: null,
			SearchType: 'text',
			SearchCol: '',
			SearchVal: '',
			SearchColDet: null,
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50]
		};
		$scope.TranSearchOptions = [{ text: 'EngineNo', value: 'VE.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'VE.ChSrlNo', searchType: 'text' }, { text: 'JobCardNo', value: 'JC.AutoNumber', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Invoice No.', value: 'TS.AutoManualNo', searchType: 'number' }, { text: 'RegdNo', value: 'JC.RegdNo', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }, { text: 'EntryDate', value: 'JC.VoucherDate', searchType: 'date' }, { text: 'PartyName', value: 'JC.PartyName', searchType: 'text' }];


		$scope.VehicleSearchOptions = [{ text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Chassis/Serial No.', value: 'V.ChSrlNo' }];


		$scope.beData =
		{
			TransId: 0,
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			JobNo: '',
			Mechanic: '',
			AssignDate: null,
			AssignTime: null,
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			Remarks: '',
			CloseNotes: '',
			DocumentColl: [],
			Mode: 'Save'
		}
		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

				if ($scope.BranchList && $scope.BranchList.length > 1)
					$scope.HideShow.Branch = false;
				else if ($scope.BranchList && $scope.BranchList.length == 1)
					$scope.HideShow.Branch = true;
				else
					$scope.HideShow.Branch = false;

				if ($scope.BranchList.length > 0) {
					$scope.SelectedBranch = $scope.BranchList[0];
					$scope.beData.BranchId = $scope.SelectedBranch.BranchId;
				}

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res1) {
			if (res1.data.IsSuccess && res1.data.Data) {
				$scope.CostClassColl = res1.data.Data;
				if ($scope.CostClassColl.length > 0) {
					$scope.SelectedCostClass = $scope.CostClassColl[0];
					$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
				}

				if ($scope.CostClassColl && $scope.CostClassColl.length > 1)
					$scope.HideShow.CostClass = false;
				else if ($scope.CostClassColl && $scope.CostClassColl.length == 1)
					$scope.HideShow.CostClass = true;
				else
					$scope.HideShow.CostClass = false;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.reloadVoucherDate = function () {

		const container = angular.element(document.getElementById('dvDTVoucher'));
		container.empty(); // Clear the container

		$timeout(function () {
			const newElement = angular.element('<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly()" title ="{{(SelectedVoucher.DateStyle==1 ? beData.VoucherDateDet.dateBS : (beData.VoucherDateDet.dateAD |dateFormat))}}" date-style="SelectedVoucher.DateStyle" id ="dtVoucherDate" voucherid ="SelectedVoucher.VoucherId" >');
			//container.append($compile(newElement)($scope));

			container.append(newElement);
			$compile(newElement)($scope);
		});
	};

	$scope.getVoucherNo = function () {
		if ($scope.beData.BranchId > 0)
			$scope.SelectedBranch = mx($scope.BranchList).firstOrDefault(p1 => p1.BranchId == $scope.beData.BranchId);

		if ($scope.beData.CostClassId > 0)
			$scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

	}

	$scope.getJobCardDetails = function () {

		if ($scope.SelectedBranch && $scope.SelectedCostClass && $scope.beData.JobNo) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				jobNo: $scope.beData.JobNo,
				costClassId: $scope.SelectedCostClass.CostClassId,
				branchId: $scope.SelectedBranch.BranchId,
				ignoreClosed: false
			}

			$http({
				method: 'POST',
				url: base_url + "Service/Transaction/GetJobCardDetailsByJobNo",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (resLD) {

				$scope.loadingstatus = 'stop';
				hidePleaseWait();

				if (resLD.data.Data && resLD.data.IsSuccess == true) {
					var dt = resLD.data.Data;
					$scope.beData.VehicleEntryId = dt.VehicleEntryId;
					$scope.beData.ChassisNo = dt.ChassisNo;
					$scope.beData.EngineNo = dt.EngineNo;
					$scope.beData.RegdNo = dt.RegdNo;
					$scope.beData.Party = dt.Party;
					$scope.beData.Mechanic = dt.Mechanic;
					$scope.beData.ChassisNo = dt.ChassisNo;
					$scope.beData.Tag = dt;
					$scope.beData.CompalinDetailsColl = dt.CompalinDetailsColl;
					$scope.beData.VinNo = dt.VinNo;
					$scope.beData.VehicleTypeName = dt.VehicleTypeName;
					$scope.beData.VehicleModelName = dt.VehicleModelName;

				} else {
					$scope.beData.VehicleEntryId = 0;
					$scope.beData.ChassisNo = '';
					$scope.beData.EngineNo = '';
					$scope.beData.RegdNo = '';
					$scope.beData.Party = '';
					$scope.beData.Mechanic = '';
					$scope.beData.ChassisNo = '';
					$scope.beData.Tag = null;
					$scope.beData.JobCardId = null;
					$scope.beData.CompalinDetailsColl = [];
					$scope.beData.VinNo = '';
					$scope.beData.VehicleTypeName = '';
					$scope.beData.VehicleModelName = '';

					Swal.fire(resLD.data.ResponseMSG);
				}

			}, function (reason) {
				alert('Failed' + reason);
			});

		}
	}

	$scope.AddNewJobCardDet = function (ind) {
		if ($scope.beData.CompalinDetailsColl) {
			if ($scope.beData.CompalinDetailsColl.length > ind + 1) {
				$scope.beData.CompalinDetailsColl.splice(ind + 1, 0, {
					Complain: ''
				})
			} else {
				$scope.beData.CompalinDetailsColl.push({
					Complain: ''
				})
			}
		}
	};

	$scope.delNewJobCardDet = function (ind) {
		if ($scope.beData.CompalinDetailsColl) {
			if ($scope.beData.CompalinDetailsColl.length > 1) {
				$scope.beData.CompalinDetailsColl.splice(ind, 1);
			}
		}
	};
	$scope.ClearCloseJobCard = function () {
		$scope.beData =
		{
			TransId: 0,
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			JobNo: '',
			Mechanic: '',
			AssignDate: '',
			AssignTime: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			Remarks: '',
			CloseNotes: '',
			Mode: 'Save'
		}
	}


	$scope.IsValidCloseJobCard = function () {

		if (!$scope.beData.Tag) {
			Swal.fire("Please ! Enter JobCard No.");
			return false;
		}

		if ($scope.beData.Remarks.isEmpty()) {
			Swal.fire("Please ! Enter Remarks No");
			return false;
		}

		return true;
	}

	$scope.SaveUpdateCloseJobCard = function () {
		if ($scope.IsValidCloseJobCard() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCloseJobCard();
					}
				});
			} else
				$scope.CallSaveUpdateCloseJobCard();
		}
	};

	$scope.CallSaveUpdateCloseJobCard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = $scope.beData.Tag;

		if ($scope.beData.EntryDateTimeDet) {
			para.ClosedDateTime = $filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.EntryTime_TMP) {
			para.EntryDateTime = $filter('date')(new Date($scope.beData.EntryTime_TMP), 'yyyy-MM-dd HH:mm');
		}

		para.Remarks = $scope.beData.Remarks;
		para.CloseRemarks = $scope.beData.Remarks;
		para.CloseNotes = $scope.beData.CloseNotes;
		para.Remarks = $scope.beData.Remarks;
		para.BranchId = $scope.SelectedBranch.BranchId;
		para.CostClassId = $scope.SelectedCostClass.CostClassId;
		para.CompalinDetailsColl = $scope.beData.CompalinDetailsColl;

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveCloseJobCard",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: para }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();

			if (res.data.IsSuccess == true) {
				$scope.lastTranId = res.data.Data.RId;
				$scope.ClearCloseJobCard();
				$scope.Print();
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
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
												document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&tranid=" + TranId;
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
							document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&tranid=" + TranId;
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

	$scope.SearchDataColl = [];
	$scope.SearchData = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;

		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			forClosed: true,
			branchId: ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetJobCardLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;
				$('#searVoucherRightBtn').modal('show');

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});


	};

	$scope.ReSearchData = function (pageInd) {
		if (pageInd && pageInd >= 0)
			$scope.paginationOptions.pageNumber = pageInd;
		else if (pageInd == -1)
			$scope.paginationOptions.pageNumber = 1;

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;
		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			forClosed: true,
			branchId: ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetJobCardLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});

	}
	$scope.PrintVoucher = function (tranId) {
		$scope.lastTranId = tranId;
		$scope.Print();
	}


	$scope.GetTransactionById = function (tran) {
		$timeout(function () {

			if (tran.TranId && tran.TranId > 0) {
				var para = {
					tranId: tran.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/GetJobCardById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					$timeout(function () {
						if (res.data.IsSuccess && res.data.Data) {
							$scope.beData = res.data.Data;

							if ($scope.beData.EntryDate)
								$scope.beData.EntryDateTime_TMP = new Date($scope.beData.EntryDate);

							if ($scope.beData.EntryDateTime)
								$scope.beData.EntryTime_TMP = new Date($scope.beData.EntryDateTime);


							$('#searVoucherRightBtn').modal('hide');
						} else
							Swal.fire(res.data.ResponseMSG);
					});
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

	$scope.DelTransactionById = function (tran) {
		Swal.fire({
			title: 'Are you sure you want to delete selected transaction ' + tran.VoucherNo + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					tranId: tran.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/DelJobCard",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ClearData();
						$scope.ReSearchData(-1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);

				});
			}

		});
	}


	$scope.ShowVehicleHistory = function (vtranid) {

		if (vtranid > 0) {

			$(document).ready(function () {
				$('body').css('cursor', 'wait');
			});

			var para = {
				vtranId: vtranid,
			};
			var frame = document.getElementById("frmChieldForm");
			var frameDoc = frame.contentDocument || frame.contentWindow.document;
			if (frameDoc)
				frameDoc.removeChild(frameDoc.documentElement);

			frame.src = '';
			frame.src = base_url + "Service/Reporting/VehicleHistory?" + param(para);
			document.body.style.cursor = 'default';

			$('#frmChieldForm').on('load', function () {
				$('body').css('cursor', 'default');
			});

			$('#frmChield').modal('show');

		} else {
			Swal.fire('Please ! Select Vehicle');
		}
	}

	$scope.AddMoreFiles = function (files, des) {
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.beData.DocumentColl.push({
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
		if ($scope.beData.DocumentColl) {
			if ($scope.beData.DocumentColl.length > 0) {
				$scope.beData.DocumentColl.splice(ind, 1);
			}
		}
	}

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};

});