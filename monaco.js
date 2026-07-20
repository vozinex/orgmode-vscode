require.config({ 
    paths: { 
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' 
    } 
});

require(['vs/editor/editor.main'], function() {
    
    function initEditors() {
        var codeBlocks = document.querySelectorAll('pre.sourceCode');
        console.log("Blocs trouvés :", codeBlocks.length);

        codeBlocks.forEach(function(block) {
            var codeElement = block.querySelector('code');
            var lang = 'text';
            
            if (codeElement && codeElement.className) {
                var classes = codeElement.className.split(' ');
                classes.forEach(function(cls) {
                    if (cls !== 'sourceCode') {
                        lang = cls.toLowerCase();
                    }
                });
            }
            
            if (lang === 'emacs-lisp' || lang === 'lisp') lang = 'clojure';
            if (lang === 'js') lang = 'javascript';
            
            var container = document.createElement('div');
            var lineCount = block.textContent.split('\n').length;
            container.style.height = (lineCount * 19 + 35) + 'px';
            container.style.marginBottom = '20px';
            
            block.parentNode.insertBefore(container, block.nextSibling);
            
            var editor = monaco.editor.create(container, {
                value: block.textContent,
                language: lang,
                theme: 'vs-dark',
                readOnly: true,
                minimap: { enabled: false },
                scrollbar: { 
                    vertical: 'hidden',
                    horizontal: 'visible',
                    handleMouseWheel: false,
                    alwaysConsumeMouseWheel: false 
                },
                overviewRulerLanes: 0
            });

            container.addEventListener('wheel', function(e) {
                var isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
                if (isVerticalScroll) return; 
                else {
                    e.preventDefault();
                    var currentScrollLeft = editor.getScrollLeft();
                    editor.setScrollLeft(currentScrollLeft + e.deltaX);
                }
            }, { passive: false });

            editor.onDidScrollChange(function(e) {
                if (e.scrollTop !== 0) editor.setScrollTop(0);
            });
            
            block.style.display = 'none';
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initEditors();
    } else {
        window.addEventListener('DOMContentLoaded', initEditors);
    }
});