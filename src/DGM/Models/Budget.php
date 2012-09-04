<?php

namespace DGM\Models;

class Budget extends Model implements \JsonSerializable
{

    static public $categoryData;

    // id is controlled by Model
    protected $id;
    protected $collection = "budgets";

    private $categories = array();
    private $name;
    private $email;
    private $description;
    private $state;

    public function set(array $data)
    {
        foreach ($data as $key => $value) {
            if ($key == "name") {
                $this->setName($value);
            }

            if ($key == "email") {
                $this->setEmail($value);
            }

            if ($key == "description") {
                $this->setDescription($value);
            }

            if (isset(self::$categoryData[$key])) {
                $this->setCategory($key, $value);
            }
        }
    }

    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    public function setCategory($name, $value)
    {
        $this->categories[$name] = $value;
    }

    public function setState($state)
    {
        $this->state = $state;
        return $this;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getCategory($name)
    {
        return $this->categories[$name];
    }

    public function getCategories()
    {
        return $this->categories;
    }

    public function getState()
    {
        return $this->state;
    }

    public function jsonSerialize()
    {
        $data = [
            "name" => $this->getName(),
            "email" => $this->getEmail(),
            "description" => $this->getDescription(),
            "state" => $this->getState()
        ];

        if ($this->getId()) {
            $data["_id"] = $this->getId();
        }

        foreach ($this->getCategories() as $cat => $value) {
            $data[$cat] = $value;
        }

        return $data;
    }

}