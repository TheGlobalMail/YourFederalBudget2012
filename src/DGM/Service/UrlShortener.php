<?php

namespace DGM\Service;

use Sly\UrlShortenerBundle\Provider\External\Bitly,
    DGM\Model\Budget;

class UrlShortener
{

    private $shortener;
    private $config;

    const CACHE_NS = 'urls:';

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->shortener = new Bitly();
        $this->shortener->setConfig($config);
    }

    public function shorten(Budget $budget)
    {
        if (!$budget->getId()) {
            return false;
        }

        if ($budget->getShortUrl()) {
            return $budget->getShortUrl();
        }


        $longUrl  = $this->config['appUrl'] . 'budget/' . (string) $budget->getId();
        $response = $this->shortener->shorten($longUrl);

        if (isset($response['shortUrl'])) {
            $shortUrl = $response['shortUrl'];
            $budget->setShortUrl($shortUrl)->save();
        }

        return $shortUrl;
    }

}