<?php

namespace DGM\Service;

use DGM\Model\Budget;

class SaveBudget extends BaseService implements Sanitizable
{

    private $budget;
    private $sendGrid;
    private $appUrl;
    private $states;

    public function __construct(Budget $budget, array $states, \SendGrid $sendGrid, $appUrl)
    {
        $this->budget = $budget;
        $this->states = $states;
        $this->sendGrid = $sendGrid;
        $this->appUrl = $appUrl;
    }

    public function sanitize()
    {
        foreach ($this->data as $key => $value) {
            if ($key == "name" || $key == "email" || $key == "description") {
                $this->data[$key] = trim($value);
                $this->data[$key] = strip_tags($value);
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
        $this->budget->set($this->data)->save();

        if ($this->budget->getId()) {
            $this->send();
        }

        return $this->budget;
    }

    public function send()
    {
        $mail = new \SendGrid\Mail();
        $mail->setFrom('info@theglobalmail.org')
             ->setFromName('The Global Mail')
             ->setSubject('Your budget')
             ->setHtml("<p>You made a budget, cool! Go here: {$this->appUrl}budget/{$this->budget->getId()}</p>");

        $mail->addTo($this->budget->getEmail(), $this->budget->getName());

        $this->sendGrid->smtp->send($mail);
    }

}