<?php

namespace DGM\Service;

use DGM\Model\Budget;

class SaveBudget extends BaseService implements Sanitizable
{

    private $budget;

    public function __construct(Budget $budget, array $states)
    {
        $this->budget = $budget;
        $this->states = $states;
    }

    public function sanitize()
    {
        foreach ($this->data as $key => $value) {
            if ($key == "name" || $key == "email" || $key == "description") {
                $this->data[$key] = trim($value);
            }

            if (isset(Budget::$categoryData[$key])) {
                $this->data[$key] = (int) $value;
            }
        }
    }

    public function validate()
    {
        $this->sanitize();
        $this->reset();

        if (!mb_strlen($this->data['name'])) {
            $this->errors['name'] = "Please enter your firstname";
        }

        if (!filter_var($this->data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = "Please enter a valid email address";
        }

        if (!isset($this->states[$this->data['state']])) {
            $this->errors['state'] = "Y U trying to hackz?";
        }
    }

    public function save()
    {
        return $this->budget->set($this->data)->save();
    }

}