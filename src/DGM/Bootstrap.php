<?php

namespace DGM;

use Silex\ServiceProviderInterface,
    Silex\Application,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\ParameterBag,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException,
    Symfony\Component\HttpKernel\HttpKernelInterface,
    DGM\Model\Budget;

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
            return new \DGM\Database\MongoDB($app['config']['dbname'], $app['config']['db'], $app['config']['dbOptions']);
        });

        $app['budgets'] = $app->share(function(Application $app) {
            return new \DGM\Collection\Budgets($app['db'], $app['config']['categories']);
        });

        $app['budgetPersister'] = function() use ($app) {
            return new \DGM\Service\BudgetPersister($app['config']['frontend']['states'], $app['sendGrid'], $app['config']['appUrl'], $app['twig']);
        };

        $app['sendGrid'] = $app->share(function() {
            return new \SendGrid('theglobamail', 've*P6ZnB0pX');
        });

        $app->register(new \SilexMemcache\MemcacheExtension(), [
            'memcache.library' => 'memcached',
            'servers' => [
                ['localhost', '11211']
            ]
        ]);

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
            return (new \DGM\Service\AverageBudget($app['budgets'], $app['memcache']))->getAverageBudget();
        });
    }

}
