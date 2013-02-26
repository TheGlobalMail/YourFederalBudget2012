<?php

namespace DGM\Service;

use DGM\Collection\Budgets;

class AverageBudget
{

    private $budgets;

    const EXPIRES = 600; // 10 minutes
    const CACHE_KEY = 'averageBudget';

    public function __construct(Budgets $budgets)
    {
        $this->budgets = $budgets;
    }

    public function getAverageBudget()
    {
        $averageBudget = $this->budgets->getAverageBudget();
        return $averageBudget;
    }

}
