<?php

namespace DGM\Service;

use DGM\Collection\Budgets;

class FlagAbuse
{

    private $budgets;
    private $sendGrid;
    private $twig;
    private $admins;

    public function __construct(Budgets $budgets, \SendGrid $sendGrid, \Twig_Environment $twig, array $admins)
    {
        $this->budgets  = $budgets;
        $this->sendGrid = $sendGrid;
        $this->twig     = $twig;
        $this->admins   = $admins;
    }

    public function flagAsAbusive($id)
    {
        $budget = $this->budgets->findById($id);

        if ($budget) {
            $mail = new \SendGrid\Mail();
            $mail->setFrom('info@theglobalmail.org')
                 ->setFromName('Budget 2012 Data Vis')
                 ->setSubject("{$budget->getName()}'s budget has been flagged as abusive")
                 ->setHtml($this->twig->render('emails/abusive-budget.twig', [ "budget" => $budget ]));

            foreach ($this->admins as $name => $email) {
                $mail->addTo($email, $name);
            }

            $this->sendGrid->smtp->send($mail);
            return true;
        }

        var_dump($budget);
        return false;
    }

}