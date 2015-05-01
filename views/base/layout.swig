{% extends './base.swig' %}

{% block content %}

    <!-- START of inav-panel -->
    <div class="inav-panel">
        <div class="pan" data-inav="panel">
            <div class="pan-header">
            </div>
            <div class="pan-body" data-inav="iscroll">
                <nav>
                    <a href="/" class="item">
                        <div class="inav-icon fa fa-home fa-2x fa-fw"></div>
                        <span class="inav-text">Home</span>
                    </a>

                    <div class="inav-divider"></div>

                    <h4>Plan JS with npm</h4>

                    <a href="/examples/todolist" class="item">
                        <div class="inav-icon fa fa-check-square-o fa-2x fa-fw"></div>
                        <span class="inav-text">Todos</span>
                    </a>

                    <div class="inav-divider"></div>

                    <h4 class="inav-heading">Ractive.js Examples</h4>

                    <a href="/examples/ractive-comments" class="item">
                        <div class="inav-icon fa fa-university fa-2x fa-fw"></div>
                        <span class="inav-text">Comments</span>
                    </a>

                    <a href="/examples/ractive-todolist" class="item">
                        <div class="inav-icon fa fa-check-square-o fa-2x fa-fw"></div>
                        <span class="inav-text">Todos</span>
                    </a>

                    <div class="inav-divider"></div>

                    <h4>React.js Example</h4>

                    <a href="/examples/react-todolist" class="item">
                        <div class="inav-icon fa fa-check-square-o fa-2x fa-fw"></div>
                        <span class="inav-text">Todos</span>
                    </a>

                </nav>
            </div>
            <div class="pan-footer">

            </div>
        </div>
    </div>
    <!-- END of inav-panel -->


    <!--==============  inav-main -->
    <div class="inav-main inav-offcanvas" data-inav="main" data-pin="root">

        <!-- START of inav-phone -->
        <div class="inav-phone" role="navigation" data-search="phone" data-inav="phone">
            <!--<div class="inav-phone-bar" data-inav="search-bar">-->

            <!-- START of hamburger button -->
            <div class="ham-wrapper">
                <a class="hamburger" data-inav="toggle">
                    <i class="fa fa-navicon"></i>
                </a>
                <span class="logo">appstackr examples <span class="text-success">{{ title }}</span></span>
            </div>
            <!-- END of hamburger button -->

            <!--</div>-->
        </div>
        <!-- END of inav-phone -->

        <!-- START of inav -->
        <div class="inav-desktop" data-pin="target">
            <div class="bag">
                <a href="/" class="brand groom animated RunningInRightBig"></a>
                <a href="/" class="brand bride animated RunningInRightBig"></a>

                <div class="tagline">Strategically stack up your front-end bundles</div>

                <nav role="navigation">
                    <div>
                        <ul class="tabs">
                            <li class="dropping pulse-fadeout inav-get-started" data-dropping="root">
                                <a data-dropping="toggle" tabindex="-1">Examples</a>

                                <div class="dropping-menu" data-dropping="menu">
                                    <div class="dropping-container">
                                        <div class="arrow-front"></div>
                                        <div class="arrow-back"></div>
                                        <ul>
                                            <li><a href="/" tabindex="-1"><i class="fa fa-home fa-fw"></i> Home</a></li>

                                            <li class="dropping-divider"></li>

                                            <li class="dropping-header">Plain JS with NPM</li>

                                            <li><a href="/examples/todolist" tabindex="-1"><i class="fa fa-check-square-o fa-fw"></i> Todos</a></li>

                                            <li class="dropping-divider"></li>

                                            <li class="dropping-header">Ractive.js Examples</li>

                                            <li><a href="/examples/ractive-comments" tabindex="-1"><i class="fa fa-pencil fa-fw"></i> Comments</a></li>

                                            <li><a href="/examples/ractive-todolist" tabindex="-1"><i class="fa fa-check-square-o fa-fw"></i> Todos</a></li>

                                            <li class="dropping-divider"></li>

                                            <li class="dropping-header">React.js Example</li>

                                            <li><a href="/examples/react-todolist" tabindex="-1"><i class="fa fa-check-square-o fa-fw"></i> Todos</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                </nav>
            </div>
        </div>
        <!-- END of inav -->

        {% block layout %}{% endblock %}

    </div>

    <a data-inav="top" class="inav-top"><i class="fa fa-angle-double-up fa-fw fa-2x"></i></a>

    <div class="footer">
        <div class="inner">
            <p>Use browserify and browser-sync to enjoy multiple screens developement simutaneously.</p>
        </div>
    </div>

{% endblock %}