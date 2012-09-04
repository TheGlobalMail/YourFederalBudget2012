<?php

namespace DGM\Service;

class EmailPage extends BaseService implements Sanitizable
{

    private $data;
    private $errors = array();
    private $sendGrid;

    public function __construct(\SendGrid $sendGrid)
    {
        $this->sendGrid = $sendGrid;
    }

    public function sanitize()
    {
        $this->data['yourName'] = trim($this->data['yourName']);
        $this->data['yourEmail'] = trim($this->data['yourEmail']);

        foreach ($this->data['toEmails'] as $i => $email) {
            $this->data['toEmails'][$i] = trim($email);
        }
    }

    public function validate()
    {
        $this->sanitize();
        $this->reset();

        if (!mb_strlen($this->data['yourName'])) {
            $this->errors['yourName'] = "Please enter your name";
        }

        if (!filter_var($this->data['yourEmail'], FILTER_VALIDATE_EMAIL)) {
            $this->errors['yourEmail'] = "Please enter a valid email address";
        }

        if (!$this->data['toEmails']) {
            $this->errors['toEmails'] = "Please enter an email address to share to";
        }

        foreach ($this->data['toEmails'] as $i => $email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->errors['toEmails'][$i] = "Please enter a valid email address";
            }
        }
    }

    public function send()
    {
        $mail = new \SendGrid\Mail();
        $mail->setFrom($this->data['yourEmail'])
             ->setFromName($this->data['yourName'])
             ->setSubject('Make your budget 2012')
             ->setHtml('<p>Make your budget <a>here</a>.');

        foreach ($this->data['toEmails'] as $email) {
            $mail->addTo($email);
        }

        $this->sendGrid->smtp->send($mail);
    }

}