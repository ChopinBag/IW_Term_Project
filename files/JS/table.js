document.addEventListener('DOMContentLoaded', function() {
    const filters = {
        openWorld: document.getElementById('filterOpenWorld'),
        simulation: document.getElementById('filterSimulation'),
        platform: document.getElementById('filterPlatform'),
        indie: document.getElementById('filterIndie'),
        roguelike: document.getElementById('filterRoguelike')
    };

    const violentFilterOn = document.getElementById('filterViolentOn');
    const violentFilterOff = document.getElementById('filterViolentOff');

    function applyFilters() {
        const rows = document.querySelectorAll('tbody tr');
        let anyFilterChecked = false;

        // Check if any checkbox filter is checked
        for (let filter in filters) {
            if (filters[filter].checked) {
                anyFilterChecked = true;
                break;
            }
        }

        rows.forEach(row => {
            let showRow = true;

            // 기본으로 모든 행을 숨기기
            row.style.display = 'none';

            // violent 필터가 Off일 때, violent 클래스를 가진 행을 숨기기
            if (violentFilterOff.checked && row.classList.contains('violent')) {
                showRow = false;
            } else if (violentFilterOn.checked) {
                // violent 필터가 On일 때, violent 클래스를 가진 행을 체크박스 필터에 따라 표시
                showRow = row.classList.contains('violent');
                if (showRow && anyFilterChecked) {
                    showRow = false;
                    for (let filter in filters) {
                        if (filters[filter].checked && row.classList.contains(filter)) {
                            showRow = true;
                            break;
                        }
                    }
                }
            } else {
                // violent 필터가 Off일 때, 다른 필터를 적용하여 표시
                if (anyFilterChecked) {
                    showRow = false;
                    for (let filter in filters) {
                        if (filters[filter].checked && row.classList.contains(filter)) {
                            showRow = true;
                            break;
                        }
                    }
                }
            }

            // 모든 필터가 체크되지 않은 경우, 모든 행을 표시 (violent 필터가 우선 적용)
            if (!anyFilterChecked && violentFilterOff.checked) {
                showRow = !row.classList.contains('violent');
            }

            if (!anyFilterChecked && violentFilterOn.checked) {
                showRow = true;
            }

            // 최종적으로 행을 표시할지 숨길지 결정
            row.style.display = showRow ? '' : 'none';
        });
    }

    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    violentFilterOn.addEventListener('change', applyFilters);
    violentFilterOff.addEventListener('change', applyFilters);

    // 초기 필터 적용
    applyFilters();
});
