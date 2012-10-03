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
            $bp = $app['budgetPersister'];
            $bp->setBudget($budget);
            $bp->setData($request->request->all());
            $bp->validate();

            if ($bp->isValid()) {
                $bp->save();
                $json = $budget->jsonSerialize();
                $json['clientId'] = $budget->getClientId();
                return $app->json($json);
            }

            return $app->json([ "errors" => $bp->getErrors() ], 400);
        });

        $controllers->put('/{id}', function(Request $request, $id) use ($app) {
            $budget = $app['budgets']->findById($id);

            if (!$budget) {
                return $app->abort(404, 'Budget not found.');
            }

            $bp = $app['budgetPersister'];
            $bp->setBudget($budget);
            $bp->setData($request->request->all());
            $bp->validate();

            if ($bp->isValid()) {
                $bp->save();
                $json = $budget->jsonSerialize();
                $json['clientId'] = $budget->getClientId();
                return $app->json($json);
            }

            $statusCode = ($db->isUnauthorized()) ? 403 : 400;

            return $app->json( [ 'errors' => $bp->getErrors() ], $statusCode);
        });

        $controllers->get('/{id}', function(Request $request, $id) use ($app) {
            $budget = $app['budgets']->findById($id);

            if ($budget) {
                $data = $budget->jsonSerialize();

                if ($request->get('clientId') == $budget->getClientId()) {
                    $data['clientId'] = $budget->getClientId();
                }

                return $app->json($data);
            }

            return $app->abort(404, 'Budget not found.');
        })->bind('getBudget');

        return $controllers;
    }

}