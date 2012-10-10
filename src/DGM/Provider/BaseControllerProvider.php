<?php

namespace DGM\Provider;

use Silex\Application,
    Silex\ControllerProviderInterface,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response;

class BaseControllerProvider implements ControllerProviderInterface
{

    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get('/', function() use ($app) {
            $app['monolog']->addInfo("Loading app at version {$app['config']['gitHash']}");
            $html = $app['twig']->render('index.twig', array(
                'gitHash' => $app['config']['gitHash']
            ));
            return new Response($html, 200, [ 'Cache-Control' => 's-maxage=5,public' ]);
        });

        $controllers->post('/git-post-receive', function(Request $request) use ($app) {
            $data = json_decode($request->get('payload'), true);
            $committedBranch = (isset($data['ref'])) ? $data['ref'] : $request->get('ref');
            $request->request->replace(is_array($data) ? $data : array());

            $branch = trim($app['config']['branch']);
            if ($branch !== "master"){
              $app['monolog']->addInfo("Rejected github hook as not on master branch");
              $exec = "Commit was not on master and will be ignored";
              $response = 200;
            } else{
              $app['monolog']->addInfo("Build app on $branch");
              $dir = realpath(__DIR__ . '/../../../');
              $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer install 2>&1 >> logs/build_log.txt");
              $response = $exec == null ? 500 : 200;
            }

            return new Response($exec, $response);
        });

        $controllers->post('/deploy', function(Request $request) use ($app) {
            $auth = $request->get('auth');

            $branch = trim($app['config']['branch']);
            if ($auth !== 'ac2aa55ec8adecc56501fc32cc22ec38'){
              $app['monolog']->addInfo("Rejected deploy with bad auth: {$auth}");
              $exec = "Auth error";
              $response = 500;
            }else{
              $app['monolog']->addInfo("Build app on $branch");
              $dir = realpath(__DIR__ . '/../../../');
              $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer install 2>&1 >> logs/build_log.txt");
              $response = $exec == null ? 500 : 200;
            }

            return new Response($exec, $response);
        });

        $controllers->get('/more-info/{id}', function($id) use ($app) {
            if (isset($app['config']['categories'][$id])) {
                $category = $app['config']['categories'][$id];
                $html = $app['twig']->render("more-info/{$id}.twig", [ "category" => $category, "id" => $id ]);
                return new Response($html, 200, [ 'Cache-Control' => 's-maxage=5,public' ]);
            }

            return $app->abort("Category not found", 404);
        });

        $controllers->post('/subscribe', function(Request $request) use ($app) {
            $budget = $app['budgets']->findById($request->get('budgetId'));

            if (!$budget) {
                $app['monolog']->addAlert("Tried subscribing to non-existent budget {$request->get('budgetId')}");
                return true;
            }

            $app['monolog']->addInfo("Attempt to subscribe {$budget->getName()} <{$budget->getEmail()}>");

            $ns = $app['newsletterSubscriber'];
            $ns->addSubscriber([ 'EmailAddress' => $budget->getEmail(), 'Name' => $budget->getName() ]);
        });

        return $controllers;
    }

}
