app.directive('makeTableResizable', function ($timeout, $window) {
    return {
        restrict: 'A',
        // Scope is now empty as it doesn't need input from a controller
        scope: {},
        link: function (scope, element, attrs) {
            const storageKey = 'myDynamicTableColumnWidths';

            // --- STATE MANAGEMENT ---
            let currentWidths = {};
            let originalWidths = {};
            let hasCapturedOriginals = false;

            // --- CONFIGURATION ---
            const defaultWidths = {
                1: 300, // Particulars
                3: 150, // Description
                5: 150, // Sales Ledger
                7: 150, // Godown
            };

            // --- CORE FUNCTIONS (Unchanged) ---
            function captureOriginalWidths() {
                if (hasCapturedOriginals) return;
                const headers = element.find('thead tr:first > th');
                headers.each(function (index) {
                    originalWidths[index] = $(this).outerWidth();
                });
                hasCapturedOriginals = true;
            }

            function applyWidth(oneBasedColumnIndex, newWidth) {
                const widthValue = (typeof newWidth === 'number' && newWidth > 0) ? newWidth + 'px' : '';
                element.find(`tr > th:nth-child(${oneBasedColumnIndex})`).css('width', widthValue);
                element.find(`tbody tr > td:nth-child(${oneBasedColumnIndex})`).css('width', widthValue);
                element.find(`tfoot tr > td:nth-child(${oneBasedColumnIndex})`).css('width', widthValue);
            }

            function resetWidths() {
                const allHeaders = element.find('thead tr:first > th');
                allHeaders.each(function (index) {
                    if (defaultWidths.hasOwnProperty(index)) {
                        applyWidth(index + 1, defaultWidths[index]);
                    } else if (currentWidths.hasOwnProperty(index) && originalWidths.hasOwnProperty(index)) {
                        applyWidth(index + 1, originalWidths[index]);
                    }
                });
                currentWidths = {};
                $window.localStorage.removeItem(storageKey);
                initializeResizer();
                alert('Column layout has been reset.');
            }

            function saveWidths() {
                $window.localStorage.setItem(storageKey, angular.toJson(currentWidths));
                alert('Column layout has been saved!');
            }

            function initializeResizer() {
                $(document).off('.resizer');
                element.find('.resize-handle').remove();
                const headers = element.find('thead tr:first > th');
                for (const index in currentWidths) {
                    if (currentWidths.hasOwnProperty(index)) {
                        applyWidth(parseInt(index, 10) + 1, currentWidths[index]);
                    }
                }
                headers.filter(':visible:not(:last-child)').each(function () {
                    const $header = $(this);
                    /*$header.css('position', 'relative');*/
                    const $handle = $('<div class="resize-handle"></div>').css({
                        position: 'absolute', right: 0, top: 0, height: '100%',
                        width: '5px', cursor: 'col-resize', zIndex: 10
                    });
                    $header.append($handle);
                    $handle.on('mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const $currentColumn = $(this).parent();
                        const columnIndex = headers.index($currentColumn);
                        const startX = e.pageX;
                        const startWidth = $currentColumn.outerWidth();
                        $(document).on('mousemove.resizer', function (e) {
                            const newWidth = startWidth + (e.pageX - startX);
                            if (newWidth > 40) {
                                applyWidth(columnIndex + 1, newWidth);
                            }
                        });
                        $(document).on('mouseup.resizer', function (e) {
                            $(document).off('.resizer');
                            const finalWidth = $currentColumn.outerWidth();
                            currentWidths[columnIndex] = finalWidth;
                        });
                    });
                });
            }

            // --- WATCHERS & INITIALIZATION ---

            function loadAndInitialize() {
                const fromStorage = $window.localStorage.getItem(storageKey);
                currentWidths = fromStorage ? angular.fromJson(fromStorage) : {};
                $timeout(() => {
                    captureOriginalWidths();
                    initializeResizer();
                });
            }

            // Watch for ng-hide/ng-repeat changes
            scope.$watch(() => element.find('thead th:visible').length, (newValue, oldValue) => {
                if (newValue > 0 && newValue !== oldValue) {
                    loadAndInitialize();
                }
            });

            // ** NEW: INTERNAL EVENT HANDLING **
            // Find the action dropdown within the table and handle its change event.
            const $actionDropdown = element.find('#table-action-select');
            $actionDropdown.on('change', function () {
                const selectedAction = $(this).val();

                if (selectedAction === 'save') {
                    saveWidths();
                } else if (selectedAction === 'reset') {
                    resetWidths();
                }

                // Reset the dropdown to the placeholder text
                $(this).val('');
            });

            // Initial run
            loadAndInitialize();
        }
    };
});


angular.element(document).ready(function () {
    const $scrollContainer = $('.table-h-scrollbar-fix');
    const $table = $('.main-table');
    function checkScroll() {
        const scrollLeft = $scrollContainer.scrollLeft();
        const scrollTop = $scrollContainer.scrollTop();

        const isHorizontallyOverflowing = $scrollContainer[0].scrollWidth > $scrollContainer[0].clientWidth;
        const isVerticallyOverflowing = $scrollContainer[0].scrollHeight > $scrollContainer[0].clientHeight;

        const $highlightThs = $table.find('th.highlight-on-scroll');
        const $highlightTds = $table.find('td.highlight-on-scroll');

        if (isHorizontallyOverflowing && scrollLeft > 0) {
            $highlightThs.addClass('scrolled');
            $highlightTds.addClass('scrolled');
            $table.addClass('has-scroll-main');
        } else {
            $highlightThs.removeClass('scrolled');
            $highlightTds.removeClass('scrolled');
            $table.removeClass('has-scroll-main');
        }

        // Handle vertical scroll class
        if (isVerticallyOverflowing && scrollTop > 0) {
            $table.addClass('vertical-scroll');
        } else {
            $table.removeClass('vertical-scroll');
        }
    }

    checkScroll();

    $scrollContainer.on('scroll', function () {
        checkScroll();
    });

    $(window).on('resize', function () {
        checkScroll();
    });
});

app.directive('fileDrop', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var dropArea = element[0];
            var fileList = element.find('.file-list')[0];
            var fileInput = element.find('#flMoreFiles')[0];

            // Add click handler to trigger file input
            dropArea.addEventListener('click', function (e) {
                // Check if click is not on clear button or any of its children
                if (!e.target.classList.contains('clear-files') &&
                    !e.target.closest('.clear-files')) {
                    fileInput.click();
                }
            });

            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // Highlight drop area when item is dragged over it
            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false);
            });

            function highlight(e) {
                dropArea.classList.add('highlight');
            }

            function unhighlight(e) {
                dropArea.classList.remove('highlight');
            }

            // Handle dropped files
            dropArea.addEventListener('drop', handleDrop, false);

            function handleDrop(e) {
                var dt = e.dataTransfer;
                var files = dt.files;
                handleFiles(files);
            }

            // Handle file input change
            fileInput.addEventListener('change', function () {
                handleFiles(fileInput.files);
            });

            function handleFiles(files) {
                fileList.innerHTML = '';
                Array.from(files).forEach(function (file) {
                    var sizeInKB = (file.size / 1024).toFixed(1);
                    var li = document.createElement('li');
                    li.textContent = `${file.name} (${sizeInKB} KB)`;
                    fileList.appendChild(li);
                });

                scope.$apply(function () {
                    var fileList = new DataTransfer();
                    Array.from(files).forEach(function (file) {
                        fileList.items.add(file);
                    });

                    fileInput.files = fileList.files;
                    scope.attachFile = fileList.files;

                    // Show clear button and add file-attached class
                    dropArea.classList.add('file-attached');
                    var clearButton = dropArea.querySelector('.clear-files');
                    clearButton.style.display = 'block';

                    // Add click handler to clear button
                    clearButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        clearFiles();
                    });

                    // Add a click handler to the Add More button
                    var addMoreButton = dropArea.closest('.modal-body').querySelector('.btn-outline-primary');
                    if (addMoreButton) {
                        addMoreButton.addEventListener('click', function () {
                            clearFiles();
                        }, { once: true });
                    }
                });
            }

            function clearFiles() {
                fileList.innerHTML = '';
                scope.$apply(function () {
                    fileInput.value = '';
                    scope.attachFile = null;
                    dropArea.classList.remove('file-attached');
                    var clearButton = dropArea.querySelector('.clear-files');
                    clearButton.style.display = 'none';
                });
            }
        }
    };
});



$(document).ready(function () {
    $('.modal-static-esc').each(function () {
        const $modal = $(this);

        $modal.modal({
            backdrop: 'static',
            keyboard: true,
            show: false
        });
    });

    $('.modal-static-esc').on('show.bs.modal', function () {
        // Nothing required here unless you dynamically change behavior
    });
});




function watchAndRepositionCalendar() {
    const observer = new MutationObserver(function (mutationsList, obs) {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.id === 'ndp-nepali-box') {
                    const $calendar = $(node);
                    const $input = $('input[date-picker]:focus').last();

                    if (!$input.length) return;

                    setTimeout(() => {
                        const calendarEl = $calendar[0];
                        const inputEl = $input[0];

                        const calRect = calendarEl.getBoundingClientRect();
                        const inputRect = inputEl.getBoundingClientRect();

                        const overflowRight = calRect.right - window.innerWidth;
                        const overflowBottom = calRect.bottom - window.innerHeight;

                        if (overflowRight > 0) {
                            const currentLeft = parseFloat($calendar.css('left')) || 0;
                            const newLeft = currentLeft - overflowRight - 25;
                            $calendar.css({ left: newLeft + 'px' });
                            console.log(`Shifted left by ${overflowRight}px`);
                        }

                        if (overflowBottom > 0) {
                            const spaceAbove = inputRect.top;
                            const calHeight = calRect.height;

                            if (spaceAbove > calHeight + 10) {
                                const $wrapper = $input.closest('.section-wrapper');
                                const wrapperRect = $wrapper[0].getBoundingClientRect();

                                const newTop = inputRect.top - wrapperRect.top - calHeight - 4;

                                $calendar.css({
                                    top: newTop + 'px'
                                });

                                console.log('Flipped calendar above input.');
                            } else {
                                const currentTop = parseFloat($calendar.css('top')) || 0;
                                const newTop = currentTop - overflowBottom - 25;
                                $calendar.css({ top: newTop + 'px' });

                                console.log(`Shifted calendar up by ${overflowBottom}px`);
                            }
                        }

                    }, 10);

                    obs.disconnect();
                    setTimeout(watchAndRepositionCalendar, 100);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

$(document).ready(function () {
    watchAndRepositionCalendar();
});
