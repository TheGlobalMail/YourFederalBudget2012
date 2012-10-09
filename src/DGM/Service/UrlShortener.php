<?php

namespace DGM\Service;

use Sly\UrlShortenerBundle\Provider\External\Bitly,
    DGM\Model\Budget;

class UrlShortener
{

    private $shortener;
    private $memcaced;
    private $config;

    const CACHE_NS = 'urls:';

    public function __construct(array $config, \Memcached $memcached)
    {
        $this->config = $config;
        $this->shortener = new Bitly();
        $this->shortener->setConfig($config);
        $this->memcached = $memcached;
    }

    protected function _shortenUrl($url)
    {
        $key = self::CACHE_NS . $url;
        $shortUrl = $this->memcached->get($key);

        if (!$shortUrl) {
            $response = $this->shortener->shorten($url);

            if (isset($response['shortUrl'])) {
                $shortUrl = $response['shortUrl'];
                $this->memcached->set($key, $shortUrl);
            } else {
                return false;
            }
        }

        return $shortUrl;
    }

    public function shorten(Budget $budget)
    {
        if (!$budget->getId()) {
            return false;
        }

        $longUrl  = $this->config['appUrl'] . 'budget/' . (string) $budget->getId();
        $shortUrl = $this->_shortenUrl($longUrl);

        $budget->setUrl($shortUrl);

        return $shortUrl;
    }

}