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

        $controllers->post('/', function(Request $request) use ($app) {
            $budget = new Budget($app['db']);
            $sb = new SaveBudget($budget, $app['config']['frontend']['states'], $app['sendGrid'], $app['config']['appUrl']);
            $sb->setData($request->request->all());
            $sb->validate();

            if ($sb->isValid()) {
                $sb->save();
                return $app->json([ "success" => $budget, "clientId" => $budget->getClientId() ]);
            }

            return $app->json([ "errors" => $sb->getErrors() ], 400);
        });

        $controllers->get('/{id}', function(Request $request, $id) use ($app) {
            $budget = (new Budgets($app['db']))->findById($id);

            if ($budget) {
                return $app->json($budget);
            }

            return $app->abort(404, 'Budget not found.');
        })->bind('getBudget');

        return $controllers;
    }

}