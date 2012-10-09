<?php

namespace DGM\Service;

class NewsletterSubscriber
{

    private $lists;

    public function __construct(array $lists, $apiKey)
    {
        foreach ($lists as $list) {
            $this->lists[] = new \CS_REST_Subscribers($list, $apiKey);
        }
    }

    public function addSubscriber(array $data)
    {
        foreach ($this->lists as $list) {
            $data['Resubscribe'] = true;
            $result = $list->add($data);
        }
    }

}