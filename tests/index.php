<?php

$filename = $_SERVER['DOCUMENT_ROOT'] . preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

require_once __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ .'/../src/bootstrap.php';

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>Jasmine Spec Runner</title>

  <link rel="shortcut icon" type="image/png" href="/tests/lib/jasmine-1.2.0/jasmine_favicon.png">
  <link rel="stylesheet" type="text/css" href="/tests/lib/jasmine-1.2.0/jasmine.css">

  <script>
  var DATA = {};
  DATA.categories = <?php echo json_encode($app['config']['categories']); ?>;
  DATA.sliderConfig = <?php echo json_encode($app['config']['frontend']['slider']); ?>;
  DATA.budgetColours = <?php echo json_encode($app['config']['frontend']['budgetColours']); ?>;
  DATA.budgetAllowance = 400;
  DATA.messages = <?php echo json_encode($app['config']['messages']); ?>;
  </script>

  <script type="text/javascript" src="/tests/lib/jasmine-1.2.0/jasmine.js"></script>
  <script type="text/javascript" src="/tests/lib/jasmine-1.2.0/jasmine-html.js"></script>
  <script src="/tests/lib/phantom-jasmine/lib/console-runner.js"></script>
  <script src="/tests/lib/jasmine-jquery/lib/jasmine-jquery.js"></script>
  <script src="/tests/lib/sinon/sinon-1.4.2.js"></script>

  <?php foreach($app['config']['frontend']['scripts'] as $script): ?>
    <?php if (stripos($script, "main.js") === false): ?>
    <script src="/web/<?php echo $script; ?>"></script>
    <?php endif; ?>
  <?php endforeach; ?>

  <script src="/tests/spec/models/BudgetSpec.js"></script>
  <script src="/tests/spec/views/BudgetOverviewViewSpec.js"></script>
  <script src="/tests/spec/views/BarGraphViewSpec.js"></script>
  <script src="/tests/spec/views/BudgetAllocatorViewSpec.js"></script>
  <script src="/tests/spec/views/CategoryAllocationViewSpec.js"></script>
  <script src="/tests/spec/views/MoreInfoViewSpec.js"></script>

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
