<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <link type="text/css" rel="stylesheet" href="/css/base/site.min.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="/js/base/iefix.min.js"></script>
    <![endif]-->
    {% block header %}{% endblock %}
</head>
<body>
{% block content %}{% endblock %}

<!-- start of js-->
<!-- ========================================= -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>!window.jQuery && document.write(unescape('%3Cscript src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"%3E%3C/script%3E'))</script>

<script src="/js/base/site.min.js"></script>
{% block footer %}{% endblock %}
</body>
</html>