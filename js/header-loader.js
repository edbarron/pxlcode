// js/header-loader.js
(function() {
    // ============================================================
    // 1. Detect the current page depth to build the path to
    //    header.html (which lives at the root).
    // ============================================================
    function getBasePath() {
        var path = window.location.pathname;
        // Strip the file name (everything after the last '/')
        var dir = path.substring(0, path.lastIndexOf('/') + 1);
        // Count how many segments the path has (excluding the empty one)
        var segments = dir.split('/').filter(function(s) { return s !== ''; });
        var depth = segments.length;
        // If we're at the root (depth === 0), the base is './'
        if (depth === 0) {
            return '.';
        }
        // Go up one level for each path segment
        // e.g. projects/navigoals/ → '../../'
        return '../'.repeat(depth);
    }

    var base = getBasePath();
    var headerUrl = base + '/header.html';

    // ============================================================
    // 2. Inject the header into the placeholder
    // ============================================================
    fetch(headerUrl)
        .then(function(response) {
            if (!response.ok) throw new Error('Header not found at ' + headerUrl);
            return response.text();
        })
        .then(function(html) {
            var placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.outerHTML = html;
                // Once injected, activate the dropdown logic
                initDropdowns();
            }
        })
        .catch(function(error) {
            console.error('Error loading header:', error);
        });

    // ============================================================
    // 3. Dropdown logic (toggle, close on outside click)
    // ============================================================
    function initDropdowns() {
        // Event delegation: since the header is injected afterward,
        // we listen on the document for clicks.
        document.addEventListener('click', function(e) {
            // Check if the click was on a toggle button
            var toggle = e.target.closest('.nav-toggle');
            if (toggle) {
                e.stopPropagation(); // Prevent it from closing immediately
                var parentLi = toggle.closest('.has-dropdown');
                if (!parentLi) return;
                var isOpen = parentLi.classList.contains('open');

                // Close every open dropdown
                document.querySelectorAll('.has-dropdown.open').forEach(function(openItem) {
                    openItem.classList.remove('open');
                    var btn = openItem.querySelector('.nav-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // If it wasn't open, open it
                if (!isOpen) {
                    parentLi.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                return;
            }

            // Click outside any dropdown: close them all
            var clickedInside = e.target.closest('.has-dropdown');
            if (!clickedInside) {
                document.querySelectorAll('.has-dropdown.open').forEach(function(openItem) {
                    openItem.classList.remove('open');
                    var btn = openItem.querySelector('.nav-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Close dropdowns with the Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.has-dropdown.open').forEach(function(openItem) {
                    openItem.classList.remove('open');
                    var btn = openItem.querySelector('.nav-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }
})();