<?php

use DGM\Util,
    DGM\Model\Budget;

ini_set('display_errors', 1);
error_reporting(-1);

$filename = $_SERVER['DOCUMENT_ROOT'] . preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

require_once __DIR__.'/../vendor/autoload.php';
$app = new Silex\Application();
$app['debug'] = true;

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => Util::loadJSONFile(__DIR__ . '/categories.json'),
    'appUrl' => 'http://localhost:5001/',
    'dbname' => 'budgets2012-testing'
];

$fileConfig = Util::loadJSONFile('./resources/config.json');
$config = array_merge($fileConfig, $config);
Budget::$categoryData = $config['categories'];

$app->register(new \DGM\Bootstrap($config));

$app->mount("/api/budget", new DGM\Provider\BudgetControllerProvider());
$app->mount("/", new DGM\Provider\BaseControllerProvider());

$app->boot();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Jasmine Spec Runner</title>

    <link rel="shortcut icon" type="image/png" href="/tests/lib/jasmine-1.2.0/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="/tests/lib/jasmine-1.2.0/jasmine.css">

    <script>
    var DATA = {};
    DATA.categories = <?php echo json_encode($app['config']['categories']); ?>;
    DATA.sliderConfig = <?php echo json_encode($app['config']['frontend']['slider']); ?>;
    DATA.barGraph = <?php echo json_encode($app['config']['frontend']['barGraph']); ?>;
    DATA.averageBudget = <?php echo json_encode($app['averageBudget']); ?>;
    DATA.budgetAllowance = 100;
    DATA.messages = <?php echo json_encode($app['config']['messages']); ?>;
    </script>

    <script type="text/javascript" src="/tests/lib/jasmine-1.2.0/jasmine.js"></script>
    <script type="text/javascript" src="/tests/lib/jasmine-1.2.0/jasmine-html.js"></script>
    <script src="/tests/lib/phantom-jasmine/lib/console-runner.js"></script>
    <script src="/tests/lib/jasmine-jquery/lib/jasmine-jquery.js"></script>
    <script src="/tests/lib/jasmine-sinon/lib/jasmine-sinon.js"></script>
    <script src="/tests/lib/sinon/sinon-1.4.2.js"></script>

    <?= $app['twig']->render('js-templates/other-budget.twig'); ?>

    <?php foreach($app['config']['frontend']['scripts'] as $script): ?>
    <?php if (stripos($script, "main.js") === false): ?>
        <script src="/web/<?php echo $script; ?>"></script>
        <?php endif; ?>
    <?php endforeach; ?>

    <script src="/tests/spec/models/BudgetSpec.js"></script>
    <script src="/tests/spec/routers/AppRouterSpec.js"></script>
    <script src="/tests/spec/views/BudgetOverviewSpec.js"></script>
    <script src="/tests/spec/views/BarGraphSpec.js"></script>
    <script src="/tests/spec/views/BudgetAllocatorPaneSpec.js"></script>
    <script src="/tests/spec/views/CategoryAllocationSpec.js"></script>
    <script src="/tests/spec/views/MoreInfoSpec.js"></script>
    <script src="/tests/spec/views/OtherBudgetsPaneSpec.js"></script>
    <script src="/tests/spec/views/ApplicationSpec.js"></script>
    <script src="/tests/spec/views/OtherBudgetSpec.js"></script>
    <script src="/tests/spec/views/BudgetModeTogglerSpec.js"></script>
    <script src="/tests/spec/views/BudgetInfoSpec.js"></script>
    <script src="/tests/spec/views/ShareBudgetPaneSpec.js"></script>

</head>

<body>
  <script type="text/javascript">
  var console_reporter = new jasmine.ConsoleReporter()
  jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
  jasmine.getEnv().addReporter(console_reporter);
  jasmine.getEnv().execute();
  </script>
</body>
</html>
