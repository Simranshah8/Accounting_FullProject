app.controller('SalesMetricesDashboard', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Sales Metrices';

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";

        $timeout(function () {
            $scope.FiscalYearList = [];
            $scope.QuarterList = [];
            $scope.MonthList = [];
            $scope.ProductGroupList = [];
            $scope.ProductTypeList = [];
            $scope.LedgerGroupList = [];
            $scope.DistributorList = [];
            $http({
                method: 'POST',
                url: base_url + "Dashboard/Inventory/GetSelectionParametersforDashBoard",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.FiscalYearList = res.data.Data.filter(item => item.ParameterType === 'FiscalYear');
                    //if ($scope.FiscalYearList.length > 0) {
                    //    $scope.newFilter.FiscalYear = [$scope.FiscalYearList[0].ID.toString()]; // Automatically select the first fiscal year
                    //}
                    $scope.QuarterList = res.data.Data.filter(item => item.ParameterType === 'Quarter');
                    $scope.MonthList = res.data.Data.filter(item => item.ParameterType === 'Month');
                    $scope.ProductGroupList = res.data.Data.filter(item => item.ParameterType === 'ProductGroup');
                    $scope.ProductTypeList = res.data.Data.filter(item => item.ParameterType === 'ProductType');
                    $scope.LedgerGroupList = res.data.Data.filter(item => item.ParameterType === 'LedgerGroup');
                    $scope.DistributorList = res.data.Data.filter(item => item.ParameterType === 'Distributor');

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }, 100);

        $scope.newFilter = {
            FiscalYear: null,
            selectedQuarters: null,
            Month: null,
            ProductType: null,
            ProductGroup: null,
            LedgerGroup: null,
            Distributor: null,
        }
        $scope.bedata = {
            ThisYearTotalAmount: 0,
            PreviousYearTotalAmount: 0,
            OverallYoYGrowthPercentage: 0,
           
        }
        $scope.GetSalesMatricesDashboard();
    };

    $scope.ResetToDefault = function() {
        $scope.newFilter = {
            FiscalYear: null,
            selectedQuarters: null,
            Month: null,
            ProductType: null,
            ProductGroup: null,
            LedgerGroup: null,
            Distributor: null,
        }
    }
    $scope.selectQuarter = function (selectedQuarter) {
        var selectedQuarters = Object.keys($scope.newFilter.selectedQuarters).filter(function (key) {
            return $scope.newFilter.selectedQuarters[key];
        });
        // Sort selected quarters to maintain a proper sequence
        selectedQuarters = selectedQuarters.map(function (quarterId) {
            return parseInt(quarterId);
        }).sort(function (a, b) { return a - b; });
        if (selectedQuarters.length > 1) {
            for (var i = 1; i < selectedQuarters.length; i++) {
                // If the quarters are not consecutive, undo the last selection
                if (selectedQuarters[i] !== selectedQuarters[i - 1] + 1) {
                    // Get the last selected quarter
                    var lastSelectedQuarter = selectedQuarters[selectedQuarters.length - 1];
                    // Show SweetAlert to inform the user
                    Swal.fire({
                        title: 'Invalid Selection!',
                        text: 'Please select consecutive quarters only.',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    }).then(function (result) {
                        // When the user clicks OK, unselect the most recent (last) quarter
                        if (result.isConfirmed) {
                            $scope.newFilter.selectedQuarters[lastSelectedQuarter] = false;
                            // Apply the changes to the scope
                            $timeout(function () {
                                $scope.$apply(); // Ensure the UI is updated after modifying the scope
                            }, 20);
                        }
                    });

                    return; // Exit after showing the alert
                }
            }
        }
    };

    $scope.validateAndUpdateMonthSelection = function () {
        var selectedMonths = $scope.newFilter.Month.filter(function (monthId) {
            return monthId !== null;  
        }).sort(function (a, b) { return a - b; });
        // If more than one month is selected, check if they are consecutive
        if (selectedMonths.length > 1) {
            for (var i = 1; i < selectedMonths.length; i++) {
                // If the months are not consecutive, undo the last selection
                if (selectedMonths[i] !== selectedMonths[i - 1] + 1) {
                    // Get the last selected month
                    var lastSelectedMonth = selectedMonths[selectedMonths.length - 1];
                    // Show SweetAlert to inform the user
                    Swal.fire({
                        title: 'Invalid Selection!',
                        text: 'Please select consecutive months only.',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    }).then(function (result) {
                        // When the user clicks OK, undo the most recent (last) selection
                        if (result.isConfirmed) {
                            // Undo the last selected month
                            const index = $scope.newFilter.Month.indexOf(lastSelectedMonth);
                            if (index > -1) {
                                $scope.newFilter.Month.splice(index, 1); // Remove the last selected month from the array
                            }
                            // Use $timeout to apply the changes and update the view
                            $timeout(function () {
                                $scope.$apply(); // Ensure the UI is updated after modifying the scope
                            });
                        }
                    });

                    return; // Exit after showing the alert
                }
            }
        }

    };

    $scope.GetSalesMatricesDashboard = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.beData = {};
        $scope.DistributorColl = [];
        var para = {
            FiscalYear: ($scope.newFilter.FiscalYear && $scope.newFilter.FiscalYear.length > 0 ? $scope.newFilter.FiscalYear.toString() : null),
            Month: ($scope.newFilter.Month && $scope.newFilter.Month.length > 0 ? $scope.newFilter.Month.toString() : null),
            ProductGroup: ($scope.newFilter.ProductGroup && $scope.newFilter.ProductGroup.length > 0 ? $scope.newFilter.ProductGroup.toString() : null),
            ProductType: ($scope.newFilter.ProductType && $scope.newFilter.ProductType.length > 0 ? $scope.newFilter.ProductType.toString() : null),
            Area: ($scope.newFilter.LedgerGroup && $scope.newFilter.LedgerGroup.length > 0 ? $scope.newFilter.LedgerGroup.toString() : null),
            Distributor: ($scope.newFilter.Distributor && $scope.newFilter.Distributor.length > 0 ? $scope.newFilter.Distributor.toString() : null),
            Quarter: ($scope.newFilter.selectedQuarters && Object.keys($scope.newFilter.selectedQuarters).length > 0 ? Object.keys($scope.newFilter.selectedQuarters).join(',') : null)
        };

        $http({
            method: 'POST',
            url: base_url + "Dashboard/Inventory/GetSalesMetricesDashBoard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.bedata.ThisYearTotalAmount = res.data.Data.ThisYearTotalAmount;
                $scope.bedata.PreviousYearTotalAmount = res.data.Data.PreviousYearTotalAmount;
                $scope.bedata.OverallYoYGrowthPercentage = res.data.Data.OverallYoYGrowthPercentage;
                $timeout(function () {
                    $scope.distributorgrowthchart();
                    $scope.ProductContribution();
                    $scope.SalesMetricsBarChart();
                }, 10);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    };

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $scope.ProductContribution = function () {
        // Dynamically populate labels and data from the backend
        $scope.ProductContributionData = {
            labels: $scope.beData.ProductContributionColl.map(item => item.ProductName),  // ProductName as labels
            currentData: $scope.beData.ProductContributionColl.map(item => item.Quantity)  // Quantity as currentData
        };

        // Generate dynamic background colors (random colors for each segment)
        var backgroundColors = $scope.ProductContributionData.currentData.map(() => getRandomColor());

        $timeout(function () {
            var canvas = document.getElementById("Product-Contribution-chart");
            if (!canvas) {
                console.error("Canvas element not found!");
                return;
            }

            var ctx = canvas.getContext('2d');

            var total = $scope.ProductContributionData.currentData.reduce((a, b) => a + b, 0);

            var data = {
                labels: $scope.ProductContributionData.labels,
                datasets: [{
                    data: $scope.ProductContributionData.currentData,
                    backgroundColor: backgroundColors, // Dynamic background color
                    borderWidth: 2
                }]
            };

            var options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                var index = tooltipItem.dataIndex;
                                var value = $scope.ProductContributionData.currentData[index];
                                var percentage = ((value / total) * 100).toFixed(2) + "%";
                                return `${$scope.ProductContributionData.labels[index]}: ${value} (${percentage})`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#000', // Black text for better visibility
                        anchor: 'end', // Position labels outside the chart
                        align: 'end',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        formatter: function (value, context) {
                            var percentage = ((value / total) * 100).toFixed(2);
                            return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
                        }
                    }
                }
            };

            if ($scope.myChart) {
                $scope.myChart.destroy();
            }

            // Create a new chart
            $scope.myChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: options
            });

        }, 1000);
    };

    $scope.SalesMetricsBarChart = function () {
        $scope.SalesMetricsData = {
            labels: $scope.beData.MonthlySalesColl.map(item => item.MonthName_Sales),
            datasets: []
        };
        if ($scope.beData.MonthlySalesColl && $scope.beData.MonthlySalesColl.length > 0 && $scope.beData.MonthlySalesColl[0].FiscalYear) {
            var fiscalYearCount = $scope.beData.MonthlySalesColl[0].FiscalYear.length;
        } else {
            console.log('Fiscal Year is empty');
        }

        for (var i = 0; i < fiscalYearCount; i++) {
            var fiscalYearId = $scope.newFilter.FiscalYear[i]; // Get the ID
            var fiscalYearObj = $scope.FiscalYearList.find(fy => fy.ID === fiscalYearId); // Find matching name
            var fiscalYearName = fiscalYearObj ? fiscalYearObj.Name : "Unknown Year";
            var dataset = {
                label: fiscalYearName,
                data: $scope.beData.MonthlySalesColl.map(item => item.FiscalYear[i] || 0),
                backgroundColor: getRandomColor(i),
                borderWidth: 1
            };
            $scope.SalesMetricsData.datasets.push(dataset);
        }

        $timeout(function () {
            var canvas = document.getElementById("Sales-Bar-chart");
            var ctx = canvas.getContext('2d');

            // Prepare chart data
            var data = {
                labels: $scope.SalesMetricsData.labels,
                datasets: $scope.SalesMetricsData.datasets
            };

            // Chart options
            var options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: true } },
                    y: {
                        beginAtZero: true,
                        grid: { display: true }
                    }
                },
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true },
                    datalabels: {
                        display: true,
                        color: '#000',
                        anchor: 'end',
                        align: 'top',
                        offset: 5,
                        font: { size: 12, weight: 'bold' },
                        rotation: 270
                    }
                }
            };

            // Destroy the previous chart instance if it exists
            if ($scope.mySalesChart) {
                $scope.mySalesChart.destroy();
            }

            // Create a new chart instance
            $scope.mySalesChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
            });

        }, 500); // Adjust delay as needed
    };

    $scope.distributorgrowthchart = function () {
        $scope.distributorgrowthData = {
            labels: $scope.beData.DistributorColl.map(item => item.DistributorName),
            targetData: $scope.beData.DistributorColl.map(item => item.GrowthPercentage)
        };

        $timeout(function () {
            var canvas = document.getElementById("distributor-growth-chart");
            var ctx = canvas.getContext('2d');

            var data = {
                labels: $scope.distributorgrowthData.labels,
                datasets: [
                    {
                        data: $scope.distributorgrowthData.targetData,
                        backgroundColor: "#00acc1", // Set color for bars
                        borderWidth: 1
                    }
                ]
            };

            var options = {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Make the bar chart horizontal
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false, // Hides the grid lines (including the baseline)
                            drawBorder: false // Removes the axis border line
                        },
                        ticks: { display: false } // Hides tick numbers
                    },
                    y: {
                        grid: { display: false } // Keep Y-axis grid hidden
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                var value = tooltipItem.raw; // Get the raw data value
                                return `Growth: ${value}` + '%'; // Customize tooltip text
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#000',
                        anchor: 'end',
                        align: 'right',
                        offset: 5,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            };

            if ($scope.myDistChart) {
                $scope.myDistChart.destroy();
            }
            $scope.myDistChart = new Chart(ctx, {
                type: 'bar', // Bar chart type
                data: data,
                options: options
            });

        }, 500);
    };

});
