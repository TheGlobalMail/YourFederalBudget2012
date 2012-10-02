<?php

namespace DGM\Provider;

use Silex\Application,
    Silex\ControllerProviderInterface;

class BaseControllerProvider implements ControllerProviderInterface
{

    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get('/', function() use ($app) {
            return $app['twig']->render('index.twig', array(
                'title' => 'Yolo',
                'gitHash' => $app['config']['gitHash']
            ));
        });

        $controllers->post('/git-post-receive', function(Request $request) use ($app) {
            $data = json_decode($request->get('payload'), true);
            $committedBranch = (isset($data['ref'])) ? $data['ref'] : $request->get('ref');
            $request->request->replace(is_array($data) ? $data : array());

            # Only update this deployment if the commit was on the current branch
            $branch = trim($app['config']['branch']);

            if ($committedBranch === "refs/heads/$branch") {
              $dir = realpath(__DIR__ . '/../');
              // @TODO refactor epic one-liner?
              $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer install && ./build.php 2>&1 >> logs/build_log.txt");
              $response = $exec == null ? 500 : 200;
            } else {
              $exec = "Commit was not on $branch";
              $response = 200;
            }

            return new Response($exec, $response);
        });

        $controllers->post('/email-page', function(Request $request) use ($app) {
            $epf = new \DGM\Service\EmailPage($app['sendGrid']);
            $epf->setData($request->request->all());
            $epf->validate();

            if ($epf->isValid()) {
                $epf->send();
                return $app->json(['message' => 'Email(s) sent']);
            }

            return $app->json($epf->getErrors(), 400);
        });

        return $controllers;
    }

}