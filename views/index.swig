{% extends './base/layout.swig' %}

{% block layout %}
    <div class="container-fluid">
        <div class="row" style="margin: 0 -31px">
            <img src="/img/site/attach-3.jpg" style="max-width: 100%; height: auto;" width="1929" height="1364">
        </div>

    </div>

    <!-- Main component for a primary marketing message or call to action -->
    <div class="jumbotron">
        <div class="container">
            <h1><i class="fa fa-music text-warning"></i> appstackr examples</h1>

            <p>As an example to demostrate how to use appstackr.</p>

            <p>
                The whole site is an example of using appstackr to bundle html, js, styles. and build it into CDN deployment ready.
            </p>

            <h3>Next Step</h3>

            <ol>
                <li>
                    <p class="small">Edit the <span class="text-success">stacks.js</span> file or the files described
                        in <span class="text-success">stacks.js</span>. See appstackr re-stacking and live browser reloading.</p>
                </li>
                <li>
                    <p>Run <code>npm run appbuild</code> to build the views and assets into <code>dist</code> folder.</p>
                    <p><code>npm start</code> to see the server running in production mode.</p>
                </li>
            </ol>


        </div>
    </div>
{% endblock %}