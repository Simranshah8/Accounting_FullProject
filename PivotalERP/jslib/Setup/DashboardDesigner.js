app.controller('ReportDesignerController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Report Designer';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2({ allowClear: true, width: '100%' });
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		
		$scope.ChartSubTypeList = [{ id: 1, text: 'Plain' }, { id: 2, text: 'Stacked' }, { id: 3, text: 'Percent Stacked' }];
		$scope.ReportTypeList = [{ id: 1, text: 'Graphical Data' }, { id: 2, text: 'Tabular Data' }, { id: 3, text: 'Both' }]
		$scope.FunctionColl = ['', 'sum', 'min', 'max', 'count', 'avg'];
		$scope.ChartTypeList = [
			{ id: 1, text: 'Bar Chart' },
			{ id: 2, text: 'Line Chart' },
			{ id: 3, text: 'Pie Chart' },
			{ id: 4, text: 'Radar Chart' },
			{ id: 5, text: 'Polar Area' },
			{ id: 6, text: 'Doughnut Chart' },
			{ id: 7, text: 'Horizontal Bars' },
			{ id: 8, text: 'Grouped bars' },
			{ id: 9, text: 'Mixed Charts' },
			{ id: 10, text: 'Bubble Charts' }
		];
		$scope.currentPages = {
			DashboardType: 1,
			CreateDashboard: 1,

		};

		$scope.searchData = {
			DashboardType: '',
			CreateDashboard: '',

		};

		$scope.perPage = {
			DashboardType: GlobalServices.getPerPageRow(),
			CreateDashboard: GlobalServices.getPerPageRow(),

		};

		$scope.newDashboardType = {
			DashboardTypeId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			ModuleId: null,
			UserIdColl:'',
			Mode: 'Save'
		};

		$scope.newCreateDashboard = {
			CreateDashboardId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			ChartTypeId: 1,
			ParaColl: [],
			ChartTypeId:1,
			Mode: 'Save'
		};
		$scope.newCreateDashboard.ParaColl.push({});


		$scope.ModuleList = [];
		$http({
			method: 'POST',
			url: base_url + "Global/GetModules",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ModuleList = res.data.Data;
			}  
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.DataTypeColl = [];
		$http.get(base_url + "Setup/ReportWriter/GetDataTypeList").then(function (res) {
			$scope.DataTypeColl = res.data.Data;
		}, function (reason) { alert('Failed: ' + reason); });

		$scope.GetAllDashboardTypeList();
		$scope.GetAllCreateDashboardList();


	}

	function OnClickDefault() {
		document.getElementById('form-section').style.display = "none";
		document.getElementById('createdashboard-form').style.display = "none";

		document.getElementById('add-dashboardtype').onclick = function () {
			document.getElementById('table-section').style.display = "none";
			document.getElementById('form-section').style.display = "block";
		}
		document.getElementById('backtotable').onclick = function () {
			document.getElementById('form-section').style.display = "none";
			document.getElementById('table-section').style.display = "block";
		}


		document.getElementById('adddashboard').onclick = function () {
			document.getElementById('createdashboard-section').style.display = "none";
			document.getElementById('createdashboard-form').style.display = "block";
		}
		document.getElementById('backbtn').onclick = function () {
			document.getElementById('createdashboard-form').style.display = "none";
			document.getElementById('createdashboard-section').style.display = "block";
		}
	}

	$scope.ClearDashboardType = function () {
		$scope.newDashboardType = {
			DashboardTypeId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			ModuleId: null,
			UserIdColl: '',
			Mode: 'Save'
		};

		$timeout(function () {
			var ethin = [];
			$('#cboUserDT').val(ethin).trigger('change');
		});

		
	}
	$scope.ClearCreateDashboard = function () {

		$scope.DataSetFooterColl = [];
		$scope.DataSetFieldColl = [];
		$scope.ChartCategoryXColl = [];
		$scope.ChartSeriesColl = [];
		$scope.ResultDataColl = [];

		$scope.newCreateDashboard = {
			CreateDashboardId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			ChartTypeId: 1,
			Mode: 'Save',
			ParaColl: [],
			ChartTypeId:1
		};
		$scope.newCreateDashboard.ParaColl.push({});

		$timeout(function () {
			if (oldChart) {
				oldChart.destroy();
				oldChart = null;
			}
		});

		$timeout(function () {
			var ethin = [];
			$('#cboUser').val(ethin).trigger('change');
		});
	}


	//************************* DashboardType *********************************

	$scope.IsValidDashboardType = function () {
		if ($scope.newDashboardType.Name.isEmpty()) {
			Swal.fire('Please ! Enter DashboardType Name');
			return false;
		}



		return true;
	}

	$scope.SaveUpdateDashboardType = function () {
		if ($scope.IsValidDashboardType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDashboardType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateDashboardType();
					}
				});
			} else
				$scope.CallSaveUpdateDashboardType();

		}
	};

	$scope.CallSaveUpdateDashboardType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newDashboardType.UserIdColl_TMP)
			$scope.newDashboardType.UserIdColl = $scope.newDashboardType.UserIdColl_TMP.toString();
		else
			$scope.newDashboardType.UserIdColl = '';

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/SaveDashboardType",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newDashboardType }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearDashboardType();
				$scope.GetAllDashboardTypeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllDashboardTypeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DashboardTypeList = [];

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetAllDashboardType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DashboardTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetDashboardTypeById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			DashboardTypeId: refData.DashboardTypeId
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetDashboardTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDashboardType = res.data.Data;
				$scope.newDashboardType.Mode = 'Modify';

				if ($scope.newDashboardType.UserIdColl) {
					$timeout(function () {
						var ethin = [];
						angular.forEach($scope.newDashboardType.UserIdColl.split(','), function (edet) {
							ethin.push(parseInt(edet));
						});
						$scope.newDashboardType.UserIdColl_TMP = ethin;
						$('#cboUserDT').val(ethin).trigger('change');
					});

				}

				document.getElementById('table-section').style.display = "none";
				document.getElementById('form-section').style.display = "block";
				 

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelDashboardTypeById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					DashboardTypeId: refData.DashboardTypeId
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/ReportWriter/DelDashboardType",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllDashboardTypeList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	//************************* Complain Type *********************************

	$scope.addrow = function (ind) {

		if (ind + 1 == $scope.newCreateDashboard.ParaColl.length) {
			if ($scope.newCreateDashboard.ParaColl[ind].VariableName) {
				$scope.newCreateDashboard.ParaColl.push({
					SNo: 0,				
				});
			}

		}

	};
	$scope.delete = function (val) {

		if ($scope.newCreateDashboard.ParaColl.length > 1)
			$scope.newCreateDashboard.ParaColl.splice(val, 1);
	};

	$scope.getQueryResult = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DataSetFooterColl = [];
		$scope.ResultDataColl = [];
		$scope.DataSetFieldColl = [];
		$scope.ChartCategoryXColl = [];
		$scope.ChartSeriesColl = [];

		var para = {
			query: $scope.newCreateDashboard.Query,
			paraColl:$scope.newCreateDashboard.ParaColl,
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetJSONData",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl= res.data.Data.ResponseMSG;
				if (dtColl) {
					$scope.ResultDataColl = JSON.parse(dtColl);

					if ($scope.ResultDataColl && $scope.ResultDataColl.length > 0) {
						var objEntity = $scope.ResultDataColl[0];
						var ind = 1;
						for (let x in objEntity) {
							//var val = objEntity[x];
							$scope.DataSetFieldColl.push({
								id: ind,
								text: x
							});

							$scope.DataSetFooterColl.push({
								id: ind,
								Field: x,
								FunName: ''
							});

							ind++;
						}
					}
					else if (res.data.Data.DropDownList && res.data.Data.DropDownList.length > 0) {
						var colColl = JSON.parse(res.data.Data.DropDownList);
						for (var ind = 1; ind <= colColl.length; ind++) {
							$scope.DataSetFieldColl.push({
								id: ind,
								text: colColl[ind-1].ColumnName
							});

							$scope.DataSetFooterColl.push({
								id: ind,
								Field: colColl[ind - 1].ColumnName,
								FunName: ''
							});
                        }
                    }
                }
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.AddChartCategoryX = function () {
		if ($scope.newCreateDashboard.SelectedField) {
			var xColl = mx($scope.ChartCategoryXColl).firstOrDefault(p1 => p1.id == $scope.newCreateDashboard.SelectedField.id);
			if (!xColl) {
				$scope.ChartCategoryXColl.push($scope.newCreateDashboard.SelectedField);
            }
        }
	};
	$scope.delChartCategoryX = function () {
		if ($scope.newCreateDashboard.SelectedFieldX>=0)
		{
			$scope.ChartCategoryXColl.splice($scope.newCreateDashboard.SelectedFieldX, 1); 
		}
	};
	$scope.upChartCategoryX = function () {
		if ($scope.newCreateDashboard.SelectedFieldX > 0) {

			// insert stored item into position `to`
			var f = $scope.ChartCategoryXColl.splice($scope.newCreateDashboard.SelectedFieldX, 1)[0];
			var uInd = $scope.newCreateDashboard.SelectedFieldX - 1;
			if (uInd < 0)
				uInd = 0;

			$scope.ChartCategoryXColl.splice(uInd, 0, f);
		}
	};
	$scope.downChartCategoryX = function () {
		if ($scope.newCreateDashboard.SelectedFieldX < ($scope.ChartCategoryXColl.length-1)) {

			// insert stored item into position `to`
			var f = $scope.ChartCategoryXColl.splice($scope.newCreateDashboard.SelectedFieldX, 1)[0];
			var uInd = $scope.newCreateDashboard.SelectedFieldX + 1;
			
			$scope.ChartCategoryXColl.splice(uInd, 0, f);
		}
	};

	$scope.AddChartSeries = function () {
		if ($scope.newCreateDashboard.SelectedField) {
			var xColl = mx($scope.ChartSeriesColl).firstOrDefault(p1 => p1.id == $scope.newCreateDashboard.SelectedField.id);
			if (!xColl) {
				$scope.ChartSeriesColl.push($scope.newCreateDashboard.SelectedField);
			}
		}
	};

	$scope.delChartSeries = function () {
		if ($scope.newCreateDashboard.SelectedSeries >= 0) {
			$scope.ChartSeriesColl.splice($scope.newCreateDashboard.SelectedSeries, 1);
		}
	};
	$scope.upChartSeries = function () {
		if ($scope.newCreateDashboard.SelectedSeries > 0) {

			// insert stored item into position `to`
			var f = $scope.ChartSeriesColl.splice($scope.newCreateDashboard.SelectedSeries, 1)[0];
			var uInd = $scope.newCreateDashboard.SelectedSeries - 1;
			if (uInd < 0)
				uInd = 0;

			$scope.ChartSeriesColl.splice(uInd, 0, f);
		}
	};
	$scope.downChartSeries = function () {
		if ($scope.newCreateDashboard.SelectedSeries < ($scope.ChartSeriesColl.length - 1)) {

			// insert stored item into position `to`
			var f = $scope.ChartSeriesColl.splice($scope.newCreateDashboard.SelectedSeries, 1)[0];
			var uInd = $scope.newCreateDashboard.SelectedSeries + 1;

			$scope.ChartSeriesColl.splice(uInd, 0, f);
		}
	};

	function generateRandomColor() {
		let maxVal = 0xFFFFFF; // 16777215
		let randomNumber = Math.random() * maxVal;
		randomNumber = Math.floor(randomNumber);
		randomNumber = randomNumber.toString(16);
		let randColor = randomNumber.padStart(6, 0);
		return `#${randColor.toUpperCase()}`
	}

	var oldChart = null;
	$scope.PreviewChart = function () {

		if ($scope.ResultDataColl && $scope.ResultDataColl.length > 0) {

			var charType = 'bar';
			var fill = true;
			if ($scope.newCreateDashboard.ChartTypeId == 1) {
				charType = 'bar'
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 2) {
				charType = 'line'
				fill = false;
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 3) {
				charType = 'pie'
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 4) {
				charType = 'radar'
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 5) {
				charType = 'polarArea'
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 6) {
				charType = 'doughnut'
			}
			else if ($scope.newCreateDashboard.ChartTypeId == 7) {
				charType = 'horizontalBar'
			}
			//else if ($scope.newCreateDashboard.ChartTypeId == 8) {
			//	charType = 'pie'
			//}
			//else if ($scope.newCreateDashboard.ChartTypeId == 9) {
			//	charType = 'pie'
			//}
			//else if ($scope.newCreateDashboard.ChartTypeId == 10) {
			//	charType = 'pie'
			//}
				

			var lblColl = [];
			var dtColl = [];

			var seriesColl = [];
		
			var lblProperty = $scope.ChartCategoryXColl[0].text;
			var valProperty = $scope.newCreateDashboard.DataExpression;
			var backColorColl = [];

			//angular.forEach(query, function (rdc) {
			//	var lbl = rdc[lblProperty];
			//	var val = rdc[valProperty];
			//	lblColl.push(lbl);
			//	dtColl.push(val);
			//	backColorColl.push(generateRandomColor());
			//});
			var resultQry = mx($scope.ResultDataColl);

			angular.forEach($scope.ChartCategoryXColl, function (xc) {
				var query = resultQry.groupBy(function (params) {
					return params[xc.text]
				});

				angular.forEach(query, function (rdc) {
					var lbl = rdc.key;
					lblColl.push(lbl);

					if (valProperty) {
						var val = mx(rdc.elements).sum(function (para) {
							return para[valProperty];
						});
						dtColl.push(val);
                    }
					
					backColorColl.push(generateRandomColor());
				});
			});
			

			if ($scope.ChartSeriesColl.length > 0 && ($scope.newCreateDashboard.DataExpression && $scope.newCreateDashboard.DataExpression.length > 0))
			{				
				angular.forEach($scope.ChartSeriesColl, function (ss) {

					var query = resultQry.groupBy(function (params) {
						return params[ss.text]
					});

					angular.forEach(query, function (q) {

						var subQuery = resultQry.where(function (params) {
							return params[ss.text] == q.key
						});

						var newSeries = {
							label: q.key,
							backgroundColor: generateRandomColor(),
							data: [],
							fill: fill
						};
						angular.forEach(subQuery, function (rdc) {
							var val = rdc[valProperty];
							newSeries.data.push(val);
						});
						seriesColl.push(newSeries);
					});
				});
			}
			if ($scope.ChartSeriesColl.length > 0)
			{
				angular.forEach($scope.ChartSeriesColl, function (ss) {

					var newSeries = {
						label: ss.text,
						backgroundColor: generateRandomColor(),
						data: [],
						fill: fill
					};
					angular.forEach(resultQry, function (q)
					{
						var val = q[ss.text];
						newSeries.data.push(val);						 
					});

					seriesColl.push(newSeries);
				});
			}
			else {
				 
				seriesColl.push({
					label: lblProperty,
					backgroundColor: backColorColl,
					data: dtColl,
					fill: fill
				});
            }
			if (oldChart) {
				oldChart.destroy();
				oldChart = null;
			}
			  
			$timeout(function () {

								
					
				var ctx=document.getElementById("chartPreview").getContext('2d');

				oldChart = new Chart(ctx, {
					type: charType,
					data: {
						labels: lblColl,
						datasets: seriesColl
					},
					options: {
						legend: { display: true },
						title: {
							display: true,
							text: $scope.newCreateDashboard.Name
						},
						plugins: {
							datalabels: {
								color: 'white',
								display: function (context) {
									return context.dataset.data[context.dataIndex] ;
								},
								font: {
									weight: 'bold'
								},
								formatter: Math.round
							}
						},
						//scales: {
						//	xAxes: [{
						//		stacked: true
						//	}],
						//	yAxes: [{
						//		stacked: true
						//	}]
						//}
					}
				});

				//if (newChart) {
				//	newChart.render();
				//	newChart.update();
    //            }
				
				
			});

        } 
		
	};

	$scope.IsValidCreateDashboard = function () {
		if ($scope.newCreateDashboard.Name.isEmpty()) {
			Swal.fire('Please ! Enter CreateDashboard Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateCreateDashboard = function () {
		if ($scope.IsValidCreateDashboard() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newCreateDashboard.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCreateDashboard();
					}
				});
			} else
				$scope.CallSaveUpdateCreateDashboard();

		}
	};

	$scope.CallSaveUpdateCreateDashboard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newCreateDashboard.UserIdColl_TMP)
			$scope.newCreateDashboard.UserIdColl = $scope.newCreateDashboard.UserIdColl_TMP.toString();
		else
			$scope.newCreateDashboard.UserIdColl = '';
		  
		if ($scope.DataSetFieldColl)
			$scope.newCreateDashboard.DataSetFields = JSON.stringify($scope.DataSetFieldColl);
		else
			$scope.newCreateDashboard.DataSetFields = '';

		if ($scope.ChartCategoryXColl)
			$scope.newCreateDashboard.ChartCategoryX = JSON.stringify($scope.ChartCategoryXColl);
		else
			$scope.newCreateDashboard.ChartCategoryX = '';

		if ($scope.ChartSeriesColl)
			$scope.newCreateDashboard.ChartSeries = JSON.stringify($scope.ChartSeriesColl);
		else
			$scope.newCreateDashboard.ChartSeries = '';

		$scope.newCreateDashboard.TblFooterColl = angular.copy($scope.DataSetFooterColl);

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/SaveNewDashboard",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newCreateDashboard }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearCreateDashboard();
				$scope.GetAllCreateDashboardList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllCreateDashboardList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.CreateDashboardList = [];

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetAllDashboard",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CreateDashboardList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetCreateDashboardById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetDashboardById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newCreateDashboard = res.data.Data;
				$scope.newCreateDashboard.Mode = 'Modify';

				if (!$scope.newCreateDashboard.ParaColl || $scope.newCreateDashboard.ParaColl.length == 0) {
					$scope.newCreateDashboard.ParaColl = [];
					$scope.newCreateDashboard.ParaColl.push({});
                }

				if ($scope.newCreateDashboard.UserIdColl) {
					$timeout(function () {
						var ethin = [];
						angular.forEach($scope.newCreateDashboard.UserIdColl.split(','), function (edet) {
							ethin.push(parseInt(edet));
						});
						$scope.newCreateDashboard.UserIdColl_TMP = ethin;
						$('#cboUser').val(ethin).trigger('change');
					});

				}

				$scope.DataSetFieldColl = [];
				$scope.ChartCategoryXColl = [];
				$scope.ChartSeriesColl = [];
				$scope.ResultDataColl = [];

				if ($scope.newCreateDashboard.DataSetFields)
					$scope.DataSetFieldColl = JSON.parse($scope.newCreateDashboard.DataSetFields);
				 
				if ($scope.newCreateDashboard.ChartCategoryX)
					$scope.ChartCategoryXColl = JSON.parse($scope.newCreateDashboard.ChartCategoryX);
				 
				if ($scope.newCreateDashboard.ChartSeries)
					$scope.ChartSeriesColl = JSON.parse($scope.newCreateDashboard.ChartSeries);

				$scope.DataSetFooterColl = $scope.newCreateDashboard.TblFooterColl;
				if (!$scope.DataSetFooterColl || $scope.DataSetFooterColl.length == 0) {
					$scope.DataSetFooterColl = [];

					if ($scope.DataSetFieldColl && $scope.DataSetFieldColl.length > 0) {
						var ind = 1;
						$scope.DataSetFieldColl.forEach(function (x) {
							$scope.DataSetFooterColl.push({
								id: x.id,
								Field: x.text,
								FunName: ''
							});
							ind++;
						});
					}
				}

				var para1 = {
					query: $scope.newCreateDashboard.Query,
					paraColl:$scope.newCreateDashboard.ParaColl,
				};
				$http({
					method: 'POST',
					url: base_url + "Setup/ReportWriter/GetJSONData",
					dataType: "json",
					data: JSON.stringify(para1)
				}).then(function (res1) {					 
					if (res1.data.IsSuccess && res1.data.Data) {
						var dtColl = res1.data.Data.ResponseMSG;
						if (dtColl) {
								$scope.ResultDataColl = JSON.parse(dtColl);  
						}
					}  
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});


				document.getElementById('createdashboard-section').style.display = "none";
				document.getElementById('createdashboard-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelCreateDashboardById = function (refData) {

		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					TranId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/ReportWriter/DelDashboard",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllCreateDashboardList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};



	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});


app.controller('DashboardViewController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Dashboard Viewer';

  
	$scope.sortData = function (tb,column) {
		if (tb.sortColumn === column.text) {
			tb.reverseSort = !tb.reverseSort;
		} else {
			tb.sortColumn = column.text;
			tb.reverseSort = false;
		}
		tb.getSortValue = function (item) {
			return item[tb.sortColumn];
		};
	};
	 
	$scope.getSortClass = function (tb,column) {
		if (tb.sortColumn === column.text) {
			return tb.reverseSort ? 'fa fa-sort-down' : 'fa fa-sort-up';
		}
		return 'fa fa-sort';
	};

	$scope.LoadData = function ()
	{
		 
		$scope.perPageColl = GlobalServices.getPerPageList();
	 
		 
		$scope.beData = {};
		$scope.TableIdColl = [];
		$scope.TabColl = [];
		var para = {
			tranId:TranId
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/ReportWriter/GetDashboardByType",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TabColl = res.data.Data;

				$scope.currentPages = { };

				$scope.searchData = { 
				};

				$scope.perPage = { 
				};

				var ind = 0;
				var tblInd = 0;
				angular.forEach($scope.TabColl, function (tb) {

					tb.sortColumn = null;
					tb.reverseSort = false;
					 
					tb.TableName = '#tbl' + tblInd.toString();
					tb.DivName = '#div' + tblInd.toString();
					tb.PageName = 'page' + tblInd.toString();

					$scope.TableIdColl.push({
						id: tb.TableName,
						text: tb.Name
					});

					$scope.currentPages[tb.Name] = 1;
					$scope.searchData[tb.Name] = '';
					$scope.perPage[tb.Name] = 10;

					if (tb.DataSetFields)
						tb.DataSetFieldColl = JSON.parse(tb.DataSetFields);

					if (tb.ChartCategoryX)
						tb.ChartCategoryXColl = JSON.parse(tb.ChartCategoryX);

					if (tb.ChartSeries)
						tb.ChartSeriesColl = JSON.parse(tb.ChartSeries);

					if (tb.ParaColl && tb.ParaColl.length > 0) {
						tb.FieldColl = [];
						angular.forEach(tb.ParaColl, function (pc) {
							var newPara = {
								Label: pc.Label,
								Name: pc.VariableName,
								IsMandatory: pc.AllowNull == true ? false : true,
								Source_Qry: pc.Source,
								FieldType: pc.DataType,
								Source:pc.Source,
							};
							tb.FieldColl.push(newPara);
						});
                    }

					tblInd++;

					$timeout(function () {

						$scope.loadingstatus = 'running';
						showPleaseWait();

						var para1 = {
							query: tb.Query,
							paraColl:tb.ParaColl,
						};
						$http({
							method: 'POST',
							url: base_url + "Setup/ReportWriter/GetJSONData",
							dataType: "json",
							data: JSON.stringify(para1)
						}).then(function (res1) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();

							if (res1.data.IsSuccess && res1.data.Data) {
								var dtColl = res1.data.Data.ResponseMSG;
								if (dtColl) {
									tb.ResultDataColl = JSON.parse(dtColl);

									$scope.PreviewChart(tb, ind);
								}

							}
							ind++;
						}, function (reason) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							Swal.fire('Failed' + reason);
						});
					}); 

				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		  
	}

	 
	$scope.ReLoadData = function (tb, ind,udfName)
	{
		$timeout(function () {

			$scope.loadingstatus = 'running';
			showPleaseWait();
			if (tb.ParaColl && tb.ParaColl.length > 0) {
				angular.forEach(tb.ParaColl, function (pc) {					
					var findPV = $scope.beData[pc.VariableName];
					if (findPV) {

						if(pc.DataType==21)
							pc.DefaultValue = findPV.toString();
						else
							pc.DefaultValue = findPV;

                    }
				});
            }
			var para1 = {
				query: tb.Query,
				paraColl: tb.ParaColl,
			};
			$http({
				method: 'POST',
				url: base_url + "Setup/ReportWriter/GetJSONData",
				dataType: "json",
				data: JSON.stringify(para1)
			}).then(function (res1) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				if (res1.data.IsSuccess && res1.data.Data) {
					var dtColl = res1.data.Data.ResponseMSG;
					if (dtColl) {
						tb.ResultDataColl = JSON.parse(dtColl);

						$scope.RePreviewChart(tb, ind);
					}

				} 
			}, function (reason) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();
				Swal.fire('Failed' + reason);
			});
		});

	}

	function generateRandomColor() {
		let maxVal = 0xFFFFFF; // 16777215
		let randomNumber = Math.random() * maxVal;
		randomNumber = Math.floor(randomNumber);
		randomNumber = randomNumber.toString(16);
		let randColor = randomNumber.padStart(6, 0);
		return `#${randColor.toUpperCase()}`
	}

	$scope.RePreviewChart = function (tb, ind) {

		$timeout(function () {
			if (tb.ResultDataColl && tb.ResultDataColl.length > 0 && (tb.ReportType == 1 || tb.ReportType == 3)) {

				//var tmpData = $filter('orderBy')($filter('filter')(tb.ResultDataColl,$scope.searchData[tb.Name]), $scope.sortKey, $scope.reverse);

				var tmpData = $filter('filter')(tb.ResultDataColl, $scope.searchData[tb.Name]);

				$scope.loadingstatus = 'running';
				showPleaseWait();

				var charType = 'bar';
				var fill = true;
				if (tb.ChartTypeId == 1) {
					charType = 'bar'
				}
				else if (tb.ChartTypeId == 2) {
					charType = 'line'
					fill = false;
				}
				else if (tb.ChartTypeId == 3) {
					charType = 'pie'
				}
				else if (tb.ChartTypeId == 4) {
					charType = 'radar'
				}
				else if (tb.ChartTypeId == 5) {
					charType = 'polarArea'
				}
				else if (tb.ChartTypeId == 6) {
					charType = 'doughnut'
				}
				else if (tb.ChartTypeId == 7) {
					charType = 'horizontalBar'
				}
				//else if (tb.ChartTypeId == 8) {
				//	charType = 'pie'
				//}
				//else if (tb.ChartTypeId == 9) {
				//	charType = 'pie'
				//}
				//else if (tb.ChartTypeId == 10) {
				//	charType = 'pie'
				//}


				var lblColl = [];
				var dtColl = [];

				var seriesColl = [];

				var lblProperty = tb.ChartCategoryXColl[0].text;
				var valProperty = tb.DataExpression;
				var backColorColl = [];

				//angular.forEach(query, function (rdc) {
				//	var lbl = rdc[lblProperty];
				//	var val = rdc[valProperty];
				//	lblColl.push(lbl);
				//	dtColl.push(val);
				//	backColorColl.push(generateRandomColor());
				//});
				var resultQry = mx(tmpData);

				angular.forEach(tb.ChartCategoryXColl, function (xc) {
					var query = resultQry.groupBy(function (params) {
						return params[xc.text]
					});

					angular.forEach(query, function (rdc) {
						var lbl = rdc.key;
						lblColl.push(lbl);

						if (valProperty) {
							var val = mx(rdc.elements).sum(function (para) {
								return para[valProperty];
							});
							dtColl.push(val);
						}

						backColorColl.push(generateRandomColor());
					});
				});


				if (tb.ChartSeriesColl.length > 0 && (tb.DataExpression && tb.DataExpression.length > 0)) {
					angular.forEach(tb.ChartSeriesColl, function (ss) {

						var query = resultQry.groupBy(function (params) {
							return params[ss.text]
						});

						angular.forEach(query, function (q) {

							var subQuery = resultQry.where(function (params) {
								return params[ss.text] == q.key
							});

							var newSeries = {
								label: q.key,
								backgroundColor: generateRandomColor(),
								data: [],
								fill: fill
							};
							angular.forEach(subQuery, function (rdc) {
								var val = rdc[valProperty];
								newSeries.data.push(val);
							});
							seriesColl.push(newSeries);
						});
					});
				}
				if (tb.ChartSeriesColl.length > 0) {
					angular.forEach(tb.ChartSeriesColl, function (ss) {

						var newSeries = {
							label: ss.text,
							backgroundColor: generateRandomColor(),
							data: [],
							fill: fill
						};
						angular.forEach(resultQry, function (q) {
							var val = q[ss.text];
							newSeries.data.push(val);
						});

						seriesColl.push(newSeries);
					});
				}
				else {

					seriesColl.push({
						label: lblProperty,
						backgroundColor: backColorColl,
						data: dtColl,
						fill: fill
					});
				}


				$timeout(function () {

					$scope.loadingstatus = 'running';
					showPleaseWait();

					var nameId = "chartPreview" + (tb.ReportType == 3 ? "TG" : "") + tb.TranId;
					var ctx = document.getElementById(nameId).getContext('2d');

					new Chart(ctx, {
						type: charType,
						data: {
							labels: lblColl,
							datasets: seriesColl
						},
						options: {
							legend: { display: true },
							title: {
								display: true,
								text: tb.Name
							}
						}
					});

					$scope.loadingstatus = "stop";
					hidePleaseWait();

				});

				$scope.loadingstatus = "stop";
				hidePleaseWait();

			}
		},200);
		

	};

	$scope.PreviewChart = function (tb,ind) {

		if (tb.ResultDataColl && tb.ResultDataColl.length > 0 && (tb.ReportType == 1 || tb.ReportType == 3)) {

			$scope.loadingstatus = 'running';
			showPleaseWait();

			var charType = 'bar';
			var fill = true;
			if (tb.ChartTypeId == 1) {
				charType = 'bar'
			}
			else if (tb.ChartTypeId == 2) {
				charType = 'line'
				fill = false;
			}
			else if (tb.ChartTypeId == 3) {
				charType = 'pie'
			}
			else if (tb.ChartTypeId == 4) {
				charType = 'radar'
			}
			else if (tb.ChartTypeId == 5) {
				charType = 'polarArea'
			}
			else if (tb.ChartTypeId == 6) {
				charType = 'doughnut'
			}
			else if (tb.ChartTypeId == 7) {
				charType = 'horizontalBar'
			}
			//else if (tb.ChartTypeId == 8) {
			//	charType = 'pie'
			//}
			//else if (tb.ChartTypeId == 9) {
			//	charType = 'pie'
			//}
			//else if (tb.ChartTypeId == 10) {
			//	charType = 'pie'
			//}


			var lblColl = [];
			var dtColl = [];

			var seriesColl = [];

			var lblProperty = tb.ChartCategoryXColl[0].text;
			var valProperty = tb.DataExpression;
			var backColorColl = [];

			//angular.forEach(query, function (rdc) {
			//	var lbl = rdc[lblProperty];
			//	var val = rdc[valProperty];
			//	lblColl.push(lbl);
			//	dtColl.push(val);
			//	backColorColl.push(generateRandomColor());
			//});
			var resultQry = mx(tb.ResultDataColl);

			angular.forEach(tb.ChartCategoryXColl, function (xc) {
				var query = resultQry.groupBy(function (params) {
					return params[xc.text]
				});

				angular.forEach(query, function (rdc) {
					var lbl = rdc.key;
					lblColl.push(lbl);

					if (valProperty) {
						var val = mx(rdc.elements).sum(function (para) {
							return para[valProperty];
						});
						dtColl.push(val);
                    }				

					backColorColl.push(generateRandomColor());
				});
			});


			if (tb.ChartSeriesColl.length > 0 && (tb.DataExpression && tb.DataExpression.length > 0)) {
				angular.forEach(tb.ChartSeriesColl, function (ss) {

					var query = resultQry.groupBy(function (params) {
						return params[ss.text]
					});

					angular.forEach(query, function (q) {

						var subQuery = resultQry.where(function (params) {
							return params[ss.text] == q.key
						});

						var newSeries = {
							label: q.key,
							backgroundColor: generateRandomColor(),
							data: [],
							fill: fill
						};
						angular.forEach(subQuery, function (rdc) {
							var val = rdc[valProperty];
							newSeries.data.push(val);
						});
						seriesColl.push(newSeries);
					});
				});
			}
			if (tb.ChartSeriesColl.length > 0) {
				angular.forEach(tb.ChartSeriesColl, function (ss) {

					var newSeries = {
						label: ss.text,
						backgroundColor: generateRandomColor(),
						data: [],
						fill: fill
					};
					angular.forEach(resultQry, function (q) {
						var val = q[ss.text];
						newSeries.data.push(val);
					});

					seriesColl.push(newSeries);
				});
			}
			else {

				seriesColl.push({
					label: lblProperty,
					backgroundColor: backColorColl,
					data: dtColl,
					fill: fill
				});
			}

		 
			$timeout(function () {

				$scope.loadingstatus = 'running';
				showPleaseWait();

				var nameId = "chartPreview" + (tb.ReportType == 3 ? "TG" : "") + tb.TranId;
				var ctx = document.getElementById(nameId).getContext('2d');

			    new Chart(ctx, {
					type: charType,
					data: {
						labels: lblColl,
						datasets: seriesColl
					},
					options: {
						legend: { display: true },
						title: {
							display: true,
							text: tb.Name
						}
					}
				}); 

				$scope.loadingstatus = "stop";
				hidePleaseWait();

			});

			$scope.loadingstatus = "stop";
			hidePleaseWait();

		}

	};
		  
});