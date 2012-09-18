<?php

namespace DGM\Model;

use DGM\Collection\Budgets;

class Budget extends Model implements \JsonSerializable
{

    static public $categoryData;

    // id is controlled by Model
    protected $id;
    public $collection = "budgets";

    private $categories = array();
    private $name;
    private $email;
    private $description;
    private $state;
    private $clientId;

    public function set(array $data)
    {
        foreach ($data as $key => $value) {
            if ($key == "name") {
                $this->setName($value);
            }

            if ($key == "email") {
                $this->setEmail($value);
            }

            if ($key == "state") {
                $this->setState($value);
            }

            if ($key == "description") {
                $this->setDescription($value);
            }

            if (isset(self::$categoryData[$key])) {
                $this->setCategory($key, $value);
            }

            if ($key == "createdAt" && $value instanceof \MongoDate) {
                $this->setCreatedAt($value);
            }
        }

        return $this;
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

    public function getClientId()
    {
        return $this->clientId;
    }

    public function jsonSerialize()
    {
        $data = [
            "name" => $this->getName(),
            "email" => $this->getEmail(),
            "description" => $this->getDescription(),
            "state" => $this->getState(),
            "createdAt" => $this->getCreatedAt()->getTimestamp() * 1000
        ];

        if ($this->getId()) {
            $data["_id"] = (string) $this->getId();
        }

        foreach ($this->getCategories() as $cat => $value) {
            $data[$cat] = $value;
        }

        return $data;
    }

    public function preSave(array $data)
    {
        $uniqueId = false;
        $budgets = new Budgets($this->db, self::$categoryData);
        $loops = 1;

        while (!$uniqueId) {
            $uniqueId = $this->generateRandomString();

            if (!$budgets->isClientIdUnique($uniqueId)) {
                $uniqueId = false;
            }

            $loops += 1;

            if ($loops > 10) {
                throw new \DomainException("Couldn't generate a unique client id");
            }
        }

        $data['clientId'] = $uniqueId;

        return $data;
    }

    public function postSave(array $data)
    {
        $this->clientId = $data['clientId'];
    }

    private function generateRandomString()
    {
        $string = $this->name . $this->email . time() . uniqid('budget_', true);
        return hash('sha256', hash('sha256', $string));
    }

}