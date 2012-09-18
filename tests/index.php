<?php

$filename = $_SERVER['DOCUMENT_ROOT'] . preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

require_once __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ .'/../src/bootstrap.php';
$config = $app['config'];
$config['categories'] = json_decode(file_get_contents(__DIR__ . '/categories.json'), true);
$app['config'] = $config;

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
