<?php

namespace DGM;

use Silex\ServiceProviderInterface,
    Silex\Application,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\ParameterBag,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException,
    Symfony\Component\HttpKernel\HttpKernelInterface,
    DGM\Model\Budget,
    DGM\Provider\UrlShortenerServiceProvider,
    DGM\Database\MongoDB,
    DGM\Collection\Budgets,
    DGM\Service\BudgetPersister,
    DGM\Service\FlagAbuse,
    DGM\Service\NewsletterSubscriber;

class Bootstrap implements ServiceProviderInterface
{

    public $config;

    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function register(Application $app)
    {
        $app['config'] = $this->config;

        $app['db'] = $app->share(function(Application $app) {
            return new MongoDB($app['config']['dbname'], $app['config']['db'], $app['config']['dbOptions']);
        });

        $app['budgets'] = $app->share(function(Application $app) {
            $b = new Budgets($app['db'], $app['config']['categories']);
            $b->setUrlShortener($app['urlShortener']);
            return $b;
        });

        $app['budgetPersister'] = $app->share(function() use ($app) {
            return new BudgetPersister($app['config']['frontend']['states'], $app['sendGrid'], $app['twig'], $app['urlShortener']);
        });

        $app['sendGrid'] = $app->share(function() {
            return new \SendGrid('theglobamail', 've*P6ZnB0pX');
        });

        $app['flagAbuse'] = $app->share(function() use ($app) {
            return new FlagAbuse($app['budgets'], $app['sendGrid'], $app['twig'], $app['config']['admins']);
        });

        $app['newsletterSubscriber'] = $app->share(function() use ($app) {
            return new NewsletterSubscriber($app['config']['createsend']['listIds'], $app['config']['createsend']['apiKey']);
        });

        $app->register(new UrlShortenerServiceProvider());

        $app->register(new \Silex\Provider\HttpCacheServiceProvider(), [
            'http_cache.cache_dir' => __DIR__ . '/../../cache/'
        ]);

        $app->register(new \Silex\Provider\MonologServiceProvider(), [
            'monolog.logfile' => __DIR__ . '/../../logs/application_log',
            'monolog.appname' => 'budget2012'
        ]);

        /*
        $app->register(new \SilexMemcache\MemcacheExtension(), [
            'memcache.library' => 'memcached',
            'servers' => [
                ['localhost', '11211']
            ]
        ]);
         */

        $app->register(new \Silex\Provider\TwigServiceProvider(), [
            'twig.path' => __DIR__.'/../../templates',
        ]);

        // parse JSON requests
        $app->before(function (Request $request) {
            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $data = json_decode($request->getContent(), true);
                $request->request->replace(is_array($data) ? $data : array());
            }
        });

        $app->error(function(NotFoundHttpException $e) use ($app) {
            if (!$app['request']->isXmlHttpRequest()) {
                $app['monolog']->addInfo('Forward back to default route');
                $response = $app->handle(Request::create('/', 'GET'));
                $response->setStatusCode(200);
                $response->headers->set('X-Status-Code', 200);
                return $response;
            }
        });
    }

    public function boot(Application $app)
    {
        $app['averageBudget'] = $app->share(function(Application $app) {
            return (new \DGM\Service\AverageBudget($app['budgets']))->getAverageBudget();
        });
    }

}
