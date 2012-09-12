<?php

namespace DGM\Provider;

use Silex\Application,
    Silex\ControllerProviderInterface,
    Silex\ControllerCollection,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\ParameterBag,
    DGM\Model\Budget,
    DGM\Service\SaveBudget,
    DGM\Collection\Budgets;

class BudgetControllerProvider implements ControllerProviderInterface
{

    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get('/list', function(Request $request) use ($app) {
            $start = $request->query->get('start', 0);
            $count = $request->query->get('count', 10);
            $count = min($count, 100); // cap count at one hundred (prevent dirty requests)

            return $app->json($app['budgets']->fetch($start, $count));
        });

        $controllers->post('/', function(Request $request) use ($app) {
            $budget = new Budget($app['db']);
            $sb = new SaveBudget($budget, $app['config']['frontend']['states'], $app['sendGrid'], $app['config']['appUrl']);
            $sb->setData($request->request->all());
            $sb->validate();

            if ($sb->isValid()) {
                $sb->save();
                $json = $budget->jsonSerialize();
                $json['clientId'] = $budget->getClientId();
                $json = $app->json($json);
                return $json;
            }

            return $app->json([ "errors" => $sb->getErrors() ], 400);
        });

        $controllers->get('/{id}', function(Request $request, $id) use ($app) {
            $budget = $app['budgets']->findById($id);

            if ($budget) {
                return $app->json($budget);
            }

            return $app->abort(404, 'Budget not found.');
        })->bind('getBudget');

        return $controllers;
    }

}