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

            # Only update this deployment if the commit was on the current branch
            $branch = trim($app['config']['branch']);
            $app['monolog']->addInfo("Build app on $branch");

            if ($committedBranch === "refs/heads/$branch") {
              $dir = realpath(__DIR__ . '/../../../');
              // @TODO refactor epic one-liner?
              $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer install 2>&1 >> logs/build_log.txt");
              $response = $exec == null ? 500 : 200;
            } else {
              $exec = "Commit was not on $branch";
              $response = 200;
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
