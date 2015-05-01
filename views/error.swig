{% extends './base/layout.swig' %}

{% set title = error.status + ' Error: ' + message %}


{% block layout %}
    <div class="error-wrapper">
        <h1>{{ title }}</h1>
        <p>{{ error.status }}</p>
        <pre>{{ error.stack }}</pre>
    </div>
{% endblock %}