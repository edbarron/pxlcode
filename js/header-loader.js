// js/header-loader.js
(function() {
    // ============================================================
    // 1. Detecta la profundidad de la página actual para construir
    //    la ruta al header.html (que está en la raíz).
    // ============================================================
    function getBasePath() {
        var path = window.location.pathname;
        // Elimina el nombre del archivo (todo después del último '/')
        var dir = path.substring(0, path.lastIndexOf('/') + 1);
        // Cuenta cuántos segmentos tiene la ruta (excluyendo el vacío)
        var segments = dir.split('/').filter(function(s) { return s !== ''; });
        var depth = segments.length;
        // Si estamos en la raíz (depth === 0), la base es './'
        if (depth === 0) {
            return '.';
        }
        // Subimos un nivel por cada segmento de la ruta
        // Ej: projects/navigoals/ → '../../'
        return '../'.repeat(depth);
    }

    var base = getBasePath();
    var headerUrl = base + '/header.html';

    // ============================================================
    // 2. Inyecta el header en el placeholder
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
                // Una vez inyectado, activamos la lógica de los dropdowns
                initDropdowns();
            }
        })
        .catch(function(error) {
            console.error('Error loading header:', error);
        });

    // ============================================================
    // 3. Lógica de los dropdowns (toggle, cierre al hacer clic fuera)
    // ============================================================
    function initDropdowns() {
        // Delegación de eventos: como el header se inyecta después,
        // usamos el documento para escuchar los clics.
        document.addEventListener('click', function(e) {
            // Busca si el clic fue en un botón de toggle
            var toggle = e.target.closest('.nav-toggle');
            if (toggle) {
                e.stopPropagation(); // Evita que se cierre inmediatamente
                var parentLi = toggle.closest('.has-dropdown');
                if (!parentLi) return;
                var isOpen = parentLi.classList.contains('open');

                // Cierra todos los dropdowns abiertos
                document.querySelectorAll('.has-dropdown.open').forEach(function(openItem) {
                    openItem.classList.remove('open');
                    var btn = openItem.querySelector('.nav-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Si no estaba abierto, lo abrimos
                if (!isOpen) {
                    parentLi.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                return;
            }

            // Clic fuera de cualquier dropdown: lo cerramos todo
            var clickedInside = e.target.closest('.has-dropdown');
            if (!clickedInside) {
                document.querySelectorAll('.has-dropdown.open').forEach(function(openItem) {
                    openItem.classList.remove('open');
                    var btn = openItem.querySelector('.nav-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Cerrar dropdowns con la tecla Escape
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