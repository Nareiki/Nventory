document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sideBarOuterContainer');
    const sidebarItems = document.querySelectorAll('.sidebarItem');
    let enterTimeout = null;
    let leaveTimeout = null;
    const delay = 150; // Verzögerung in Millisekunden

    // Originalinhalt speichern
    sidebarItems.forEach(item => {
        item.dataset.original = item.innerHTML;
    });

    sidebar.addEventListener('mouseenter', () => {
        // Bestehenden Timeout löschen, falls vorhanden
        if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            leaveTimeout = null;
        }

        // Verzögerung für mouseenter
        enterTimeout = setTimeout(() => {
            sidebarItems.forEach(item => {
                const hoverText = item.dataset.hover || '';
                // Die Links beibehalten, nur den Text ändern
                const link = item.querySelector('a');
                if (link) {
                    // Speichere den ursprünglichen Link-Inhalt
                    const originalLinkContent = link.innerHTML;
                    // Setze den Text in den Link statt in das Elternelement
                    link.innerHTML = hoverText;
                }
            });
        }, delay);
    });

    sidebar.addEventListener('mouseleave', () => {
        // Bestehenden Timeout löschen, falls vorhanden
        if (enterTimeout) {
            clearTimeout(enterTimeout);
            enterTimeout = null;
        }

        // Verzögerung für mouseleave
        leaveTimeout = setTimeout(() => {
            sidebarItems.forEach(item => {
                item.innerHTML = item.dataset.original;
            });
        }, delay);
    });
});