<?php

namespace DGM\Service;

use DGM\Model\Budget,
    DGM\Service\UrlShortener;

class BudgetPersister extends BaseService implements Sanitizable
{

    private $budget;
    private $sendGrid;
    private $states;
    private $twig;

    private $unauthorized = false;
    private $updateMode = false;

    public function __construct(array $states, \SendGrid $sendGrid, \Twig_Environment $twig, UrlShortener $urlShortener)
    {
        $this->states       = $states;
        $this->sendGrid     = $sendGrid;
        $this->twig         = $twig;
        $this->urlShortener = $urlShortener;
    }

    public function setBudget(Budget $budget)
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
                $value = trim($value);
                $value = strip_tags($value);
            }

            if ($key == "name" || $key == "email") {
                $value = substr($value, 0, 50);
            }

            if ($key == "description") {
                $value = substr($value, 0, 500);
            }

            if (isset(Budget::$categoryData[$key])) {
                $value = (float) $value;
            }

            $this->data[$key] = $value;
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
        $this->urlShortener->shorten($this->budget);

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