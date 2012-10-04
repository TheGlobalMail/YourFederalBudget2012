<?php

namespace DGM\Service;

use DGM\Model\Budget;

class BudgetPersister extends BaseService implements Sanitizable
{

    private $budget;
    private $sendGrid;
    private $appUrl;
    private $states;
    private $twig;

    private $unauthorized = false;
    private $updateMode = false;

    public function __construct(array $states, \SendGrid $sendGrid, $appUrl, \Twig_Environment $twig)
    {
        $this->states   = $states;
        $this->sendGrid = $sendGrid;
        $this->appUrl   = $appUrl;
        $this->twig     = $twig;
    }

    public function setbudget(Budget $budget)
    {
        $this->budget = $budget;

        if ($this->budget->getId()) {
            $this->updateMode = true;
        }
    }

    public function sanitize()
    {
        foreach ($this->data as $key => $value) {
            if ($key == "name" || $key == "email" || $key == "description") {
                $this->data[$key] = trim($value);
                $this->data[$key] = strip_tags($value);
            }

            if (isset(Budget::$categoryData[$key])) {
                $this->data[$key] = (float) $value;
            }
        }
    }

    public function validate()
    {
        $this->sanitize();
        $this->reset();

        if ($this->budget->getId()) {
            if (!isset($this->data['clientId']) || $this->data['clientId'] != $this->budget->getClientId()) {
                $this->unauthorized = true;
                $this->errors['unauthorized'] = "You are not allowed to edit this budget";
            }
        }

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

        if (!$this->updateMode) {
            $this->send();
        }

        return $this->budget;
    }

    public function isUnauthorized()
    {
        return $this->unauthorized;
    }

    public function send()
    {
        $mail = new \SendGrid\Mail();
        $mail->setFrom('info@theglobalmail.org')
             ->setFromName('The Global Mail')
             ->setSubject('Your budget')
             ->setHtml($this->twig->render('emails/budget-saved.twig', [ 'budget' => $this->budget ]));

        $mail->addTo($this->budget->getEmail(), $this->budget->getName());

        $this->sendGrid->smtp->send($mail);
    }

}