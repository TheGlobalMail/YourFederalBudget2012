<?php

namespace DGM\Service;

abstract class BaseService
{

    protected $data;
    protected $errors;

    public function setData(array $data)
    {
        $this->data = $data;
        return $this;
    }

    public function getData()
    {
        return $this->data;
    }

    abstract public function validate();

    public function isValid()
    {
        return !$this->getErrors();
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function reset()
    {
        $this->errors = array();
        return $this;
    }

}