<?php

namespace DGM\Provider;

use Silex\ServiceProviderInterface,
    Silex\Application,
    DGM\Service\UrlShortener;

class UrlShortenerServiceProvider implements ServiceProviderInterface
{

    public function register(Application $app)
    {
        $app['urlShortener'] = $app->share(function($app) {
            $config = [
                'api' => $app['config']['bitly'],
                'appUrl' => $app['config']['appUrl']
            ];
            return new UrlShortener($config);
        });
    }

    public function boot(Application $app) {}

}