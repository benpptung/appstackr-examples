{% extends '../base/layout.swig' %}


{% set title = title %}

{% block layout %}

    <div class="jumbotron">
        <div class="container">
            <h1><i class="fa fa-music text-warning"></i> You can always try it yourself !!</h1>
            <img src="/img/try-it-yourself.png" width="168" height="300" class="img-responsive" alt="try it yourselfs"
                 style="float: right">

            <p>Use <a href="/examples/ractive-comments">Ractive comments</a> in this project as example to put <a
                        href="http://examples.ractivejs.org/todos">Ractive Todolist example</a> here.</p>
        </div>
    </div>


{% endblock %}