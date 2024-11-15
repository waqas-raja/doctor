document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        [].forEach.call(document.querySelectorAll('.alert'), function (el) {
            el.style.display = 'none';
        });
        const err = '{{ result.Error }}';
        const msg = '{{ result.Message }}';
        if (err === 'False' && msg !== '') {
            window.location.href = '{% url "Login" %}';
        }
    }, 3500);
});