app.controller('SalesDashboard', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Sales Dashboard';

    $scope.LoadData = function () {

        $scope.GetSalesDashboard();

    }




    $scope.GetSalesDashboard = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.beData = {};
        $scope.WeeklySalesColl = [];
        $scope.TotalWeeklySales = 0;
        $scope.AnnuallySalesColl = [];
        $scope.TotalAnnuallySale = 0; 

        $http({
            method: 'GET',
            url: base_url + "Dashboard/Inventory/GetSalesDashboard",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.WeeklySalesColl = res.data.Data.WeeklySalesColl || [];
                $scope.AnnuallySalesColl = res.data.Data.AnnuallySalesColl || [];

                // Calculate total sum for weekly sales
                $scope.TotalWeeklySales = 0;
                angular.forEach($scope.WeeklySalesColl, function (sale) {
                    if (sale.TotalAmount) {
                        $scope.TotalWeeklySales += sale.TotalAmount;
                    }
                });

                // Calculate total sum for annual sales
                $scope.TotalAnnuallySale = 0;
                angular.forEach($scope.AnnuallySalesColl, function (annualsale) {
                    if (annualsale.TotalAnnualSales) {
                        $scope.TotalAnnuallySale += annualsale.TotalAnnualSales;
                    }
                });

                // Trigger chart update
                $timeout(function () {
                    $scope.WeeklySalesOverview();
                    $scope.WeeklySalesTarget();
                    $scope.MonthlyRevenueChart();
                    $scope.InvoiceStatisticsChart();
                    $scope.AnnualSalesLineChart();
                    $scope.AnnualSalesChart();
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

    $scope.WeeklySalesOverview = function () {
        // Calculate the total sales for the week
        $scope.TotalWeeklySales = 0;
        angular.forEach($scope.beData.WeeklySalesColl, function (sale) {
            if (sale.TotalAmount) {
                $scope.TotalWeeklySales += sale.TotalAmount;
            }
        });

        // Prepare chart data
        $scope.WeeklySales = {
            Days: $scope.beData.WeeklySalesColl.map(x => x.Day),
            TotalAmount: $scope.beData.WeeklySalesColl.map(x => x.TotalAmount)
        };

        // Redraw the chart
        $timeout(function () {
            var canvas = document.getElementById("lineChart");
            var ctx = canvas.getContext('2d');

            // Set canvas width to match parent
            canvas.width = canvas.parentElement.offsetWidth;

            // If a previous chart exists, destroy it to prevent overlap
            if (window.chartInstance) {
                window.chartInstance.destroy();
            }

            // Set up new chart data
            var data = {
                labels: $scope.WeeklySales.Days,
                datasets: [
                    {
                        label: "Total Sales",
                        data: $scope.WeeklySales.TotalAmount,
                        fill: false,
                        borderColor: "#28a745",
                        backgroundColor: "#28a745",
                        borderWidth: 5,
                        pointRadius: 0,
                        tension: 0.4
                    }
                ]
            };

            var options = {
                responsive: true,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                hover: { mode: 'nearest', intersect: true },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: { display: true }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            stepSize: 10,
                            max: Math.max(...$scope.WeeklySales.TotalAmount) + 10
                        }
                    }]
                }
            };

            // Create a new chart instance and store it globally
            window.chartInstance = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options,
            });

        }, 100);
    };

    $scope.WeeklySalesTarget = function () {
        $scope.WeeklySales = {
            Days: $scope.beData.WeeklySalesColl.map(x => x.Day),
            TotalAmount: $scope.beData.WeeklySalesColl.map(x => x.TotalAmount),
            TargetAmount: $scope.beData.WeeklySalesColl.map(x => x.TargetAmount)
        };

        $timeout(function () {
            var canvas = document.getElementById("weeklyChart");
            var ctx = canvas.getContext('2d');

            var data = {
                labels: $scope.WeeklySales.Days,
                datasets: [
                    {
                        label: "Target Sales",
                        data: $scope.WeeklySales.TargetAmount,
                        backgroundColor: "rgba(0, 193, 255, 0.8)",
                        borderRadius: 10,
                    },
                    {
                        label: "Total Sales",
                        data: $scope.WeeklySales.TotalAmount,
                        backgroundColor: "rgba(252, 204, 60, 0.8)",
                        borderRadius: 10,
                    },
                ]
            };

            var options = {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                return value / 1000 + "K"; // Format ticks as K
                            }
                        },
                        title: {
                            display: true,
                            text: "Weekly Collected Amount"
                        }
                    }]
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };

            new Chart(ctx, {
                type: "bar", // Set chart type to bar
                data: data,
                options: options
            });
        }, 100);
    };

    $scope.MonthlyRevenueChart = function () {
        $scope.MonthlyRevenue = {
            Categories: $scope.beData.MonthlyRevenueColl.map(x => x.Category),
            RevenueAmounts: $scope.beData.MonthlyRevenueColl.map(x => x.RevenueAmount)
        };

        $timeout(function () {
            var canvas = document.getElementById("revenueChart");
            var ctx = canvas.getContext('2d');


            // Create gradient backgrounds
            const gradientGreen = ctx.createLinearGradient(0, 0, 0, 300);
            gradientGreen.addColorStop(0, '#4CAF50');
            gradientGreen.addColorStop(1, '#4CAF50');

            const gradientBlue = ctx.createLinearGradient(0, 0, 0, 300);
            gradientBlue.addColorStop(0, '#2196F3');
            gradientBlue.addColorStop(1, '#2196F3');

            const gradientRed = ctx.createLinearGradient(0, 0, 0, 300);
            gradientRed.addColorStop(0, '#ff6666');
            gradientRed.addColorStop(1, '#cc0000');

            // Create an array for background colors
            const backgroundColors = $scope.MonthlyRevenue.RevenueAmounts.map((amount, index) => {
                if (index === 0) return gradientGreen;
                if (index === 1) return gradientBlue;
                return gradientRed;
            });

            const data = {
                labels: $scope.MonthlyRevenue.Categories,
                datasets: [{
                    label: 'Revenue',
                    data: $scope.MonthlyRevenue.RevenueAmounts,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4,
                    borderColor: '#fff',
                    borderWidth: 2,
                }]
            };

            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        bodyColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        cornerRadius: 4
                    }
                },
                layout: {
                    padding: 20
                }
            };

            new Chart(ctx, {
                type: 'pie', // Pie chart
                data: data,
                options: options
            });
        }, 100);
    };

    $scope.InvoiceStatisticsChart = function () {
        $scope.InvoiceStatistics = {
            InvoiceTypes: $scope.beData.InvoiceStatisticsColl.map(x => x.InvoiceType),
            InvoiceCounts: $scope.beData.InvoiceStatisticsColl.map(x => x.InvoiceCount)
        };

        $timeout(function () {
            var canvas = document.getElementById("donutChart");
            var ctx = canvas.getContext('2d');


            const gradientColors = [
                'rgba(36, 196, 102, 0.8)',  // Green
                'rgba(2, 208, 255, 0.8)',   // Blue
                'rgba(134, 89, 255, 0.8)',  // Purple
                'rgba(217, 217, 217, 0.8)'  // Gray
            ];

            const backgroundColors = $scope.InvoiceStatistics.InvoiceCounts.map((_, index) => {
                return gradientColors[index % gradientColors.length];
            });

            const data = {
                labels: $scope.InvoiceStatistics.InvoiceTypes,
                datasets: [{
                    label: 'Invoice Types',
                    data: $scope.InvoiceStatistics.InvoiceCounts,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4,
                    borderColor: '#fff',
                    borderWidth: 2,
                }]
            };

            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            };

            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: options
            });
        }, 100);
    };

    $scope.AnnualSalesLineChart = function () {
        const salesByMonth = {};
        $scope.beData.SalesColl.forEach(sale => {
            if (!salesByMonth[sale.MonthName]) {
                salesByMonth[sale.MonthName] = { CREDIT: 0, CASH: 0 };
            }
            if (sale.PaymentType === 'CREDIT') {
                salesByMonth[sale.MonthName].CREDIT += sale.TotalAmount;
            } else if (sale.PaymentType === 'CASH') {
                salesByMonth[sale.MonthName].CASH += sale.TotalAmount;
            }
        });

        const months = Object.keys(salesByMonth);
        const creditSales = months.map(month => salesByMonth[month].CREDIT);
        const cashSales = months.map(month => salesByMonth[month].CASH);

        $timeout(function () {
            const canvas = document.getElementById("newSalesChart");
            const ctx = canvas.getContext('2d');


            const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
            gradientBlue.addColorStop(0, '#4A90E2');
            gradientBlue.addColorStop(1, 'rgba(74, 144, 226, 0.01)');

            const gradientOrange = ctx.createLinearGradient(0, 0, 0, 400);
            gradientOrange.addColorStop(0, '#FFA800');
            gradientOrange.addColorStop(1, 'rgba(169, 223, 216, 0.01)');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'CREDIT Sales',
                            data: creditSales,
                            borderColor: '#007bff',
                            backgroundColor: gradientBlue,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                            pointBackgroundColor: '#007bff',
                        },
                        {
                            label: 'CASH Sales',
                            data: cashSales,
                            borderColor: '#ffa500',
                            backgroundColor: gradientOrange,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                            pointBackgroundColor: '#ffa500',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Sales Amount',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Months',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }, 100);
    };

    $scope.AnnualSalesChart = function () {
        const labels = $scope.beData.AnnuallySalesColl.map(sale => sale.MonthNameAS);
        const totalSales = $scope.beData.AnnuallySalesColl.map(sale => sale.TotalAnnualSales);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: "Sales",
                    data: totalSales,
                    backgroundColor: "rgba(0, 193, 255, 0.8)",
                    borderRadius: 20,
                    barThickness: 35,
                }
            ],
        };

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value / 1000 + "K"; // Format ticks as 'K'
                        }
                    },
                    title: {
                        display: true,
                        text: "Monthly Collected Amount",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                    position: "bottom",
                },
            },
        };

        $timeout(function () {
            const ctx5 = document.getElementById("annualChart").getContext("2d");
            new Chart(ctx5, {
                type: "bar",
                data: data,
                options: options,
            });
        }, 100);
    };


});